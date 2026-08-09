import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js";
import * as kv from "./kv_store.ts";

const app = new Hono();
const ADMIN_EMAILS = ["aryanjain281005@gmail.com", "vyanasoul369@vyanasoul.com", "vyanasoul369@gmail.com"];

app.use('*', logger(console.log));

app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check
app.get("/make-server-d03e957c/health", (c) => {
  return c.json({ status: "ok" });
});

// Helper: verify auth and return user id
async function getAuthUserId(authHeader: string | null): Promise<string | null> {
  if (!authHeader) return null;
  const token = authHeader.split(" ")[1];
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;
  return user.id;
}

async function getAuthUser(authHeader: string | null) {
  if (!authHeader) return null;
  const token = authHeader.split(" ")[1];
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;
  return user;
}

function isAdminUser(user: { user_metadata?: Record<string, unknown> } | null) {
  const email = typeof (user as { email?: unknown })?.email === "string"
    ? String((user as { email?: string }).email).toLowerCase()
    : "";
  return user?.user_metadata?.role === "admin" || ADMIN_EMAILS.includes(email);
}

function bookingsClient() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
}

// ─── AUTH: Signup ──────────────────────────────────────────
app.post("/make-server-d03e957c/auth/signup", async (c) => {
  try {
    const { name, email, password } = await c.req.json();
    if (!name || !email || !password) {
      return c.json({ error: "name, email and password are required." }, 400);
    }
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, role: email.toLowerCase() === ADMIN_EMAIL ? "admin" : "student" },
      // Automatically confirm email since no email server configured
      email_confirm: true,
    });
    if (error) {
      console.log("Signup error:", error.message);
      return c.json({ error: error.message }, 400);
    }
    return c.json({ user: data.user });
  } catch (err) {
    console.log("Signup exception:", err);
    return c.json({ error: `Server error during signup: ${err}` }, 500);
  }
});

// ─── BOOKINGS ──────────────────────────────────────────────

// GET /bookings — fetch bookings for the authenticated user
app.get("/make-server-d03e957c/bookings", async (c) => {
  try {
    const user = await getAuthUser(c.req.header("Authorization") ?? null);
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    const supabase = bookingsClient();

    if (isAdminUser(user)) {
      const { data, error } = await supabase
        .from("bookings")
        .select("id, user_id, user_name, user_email, service, booking_date, booking_time, notes, status, created_at, updated_at")
        .order("created_at", { ascending: false });
      if (error) return c.json({ error: error.message }, 500);

      const bookings = (data ?? []).map((booking) => ({
        id: booking.id,
        userId: booking.user_id,
        userName: booking.user_name,
        userEmail: booking.user_email,
        service: booking.service,
        date: booking.booking_date,
        time: booking.booking_time,
        notes: booking.notes,
        status: booking.status,
        createdAt: booking.created_at,
      }));
      return c.json({ bookings });
    }

    const { data, error } = await supabase
      .from("bookings")
      .select("id, user_id, user_name, user_email, service, booking_date, booking_time, notes, status, created_at, updated_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (error) return c.json({ error: error.message }, 500);

    const bookings = (data ?? []).map((booking) => ({
      id: booking.id,
      userId: booking.user_id,
      userName: booking.user_name,
      userEmail: booking.user_email,
      service: booking.service,
      date: booking.booking_date,
      time: booking.booking_time,
      notes: booking.notes,
      status: booking.status,
      createdAt: booking.created_at,
    }));
    return c.json({ bookings });
  } catch (err) {
    console.log("Get bookings error:", err);
    return c.json({ error: `Error fetching bookings: ${err}` }, 500);
  }
});

// POST /bookings — create a booking
app.post("/make-server-d03e957c/bookings", async (c) => {
  try {
    const user = await getAuthUser(c.req.header("Authorization") ?? null);
    if (!user) return c.json({ error: "Unauthorized" }, 401);
    const supabase = bookingsClient();

    const { service, date, time, notes, country, preferredDay } = await c.req.json();
    if (!service || !date) {
      return c.json({ error: "service and date are required." }, 400);
    }

    const bookingId = `bk_${Date.now()}`;
    const booking = {
      id: bookingId,
      userId: user.id,
      userName: user.user_metadata?.name ?? user.user_metadata?.full_name ?? user.email ?? "User",
      userEmail: user.email ?? "",
      service,
      date,
      time: time ?? "",
      notes: notes ?? "",
      country: country ?? "",
      preferredDay: preferredDay ?? "",
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    const { error } = await supabase.from("bookings").insert({
      id: booking.id,
      user_id: booking.userId,
      user_name: booking.userName,
      user_email: booking.userEmail,
      service: booking.service,
      booking_date: booking.date,
      booking_time: booking.time,
      notes: booking.notes,
      country: booking.country,
      preferred_day: booking.preferredDay,
      status: booking.status,
      created_at: booking.createdAt,
      updated_at: booking.createdAt,
    });
    if (error) return c.json({ error: error.message }, 500);

    // Attempt to send Telegram message
    const botToken = "8998508406:AAF2h2xdYJNiAw34ns7KwGOhfcw8t9VODoY";
    const chatId = "-1004474709313";
    if (botToken && chatId) {
      const sanitize = (str: string) => str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      const tgMessage = `🔔 <b>New Booking Request</b>\n\n<b>Name:</b> ${sanitize(booking.userName)}\n<b>Email:</b> ${sanitize(booking.userEmail)}\n<b>Service:</b> ${sanitize(booking.service)}\n<b>Date:</b> ${sanitize(booking.date)}\n<b>Time:</b> ${sanitize(booking.time || "N/A")}\n<b>Country:</b> ${sanitize(booking.country || "N/A")}\n<b>Preferred Day:</b> ${sanitize(booking.preferredDay || "N/A")}\n<b>Notes:</b> ${sanitize(booking.notes || "N/A")}`;
      
      try {
        const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: tgMessage,
            parse_mode: "HTML",
          }),
        });
        if (!tgRes.ok) {
          const text = await tgRes.text();
          console.error("Telegram failed:", tgRes.status, text);
        }
      } catch (tgErr) {
        console.error("Telegram network error:", tgErr);
        // Do not fail the request if Telegram fails
      }
    }

    return c.json({ booking });
  } catch (err) {
    console.log("Create booking error:", err);
    return c.json({ error: `Error creating booking: ${err}` }, 500);
  }
});

// DELETE /bookings/:id — cancel a booking
app.delete("/make-server-d03e957c/bookings/:id", async (c) => {
  try {
    const user = await getAuthUser(c.req.header("Authorization") ?? null);
    if (!user) return c.json({ error: "Unauthorized" }, 401);

    const supabase = bookingsClient();

    const bookingId = c.req.param("id");
    let query = supabase.from("bookings").update({ status: "cancelled", updated_at: new Date().toISOString() }).eq("id", bookingId);
    if (!isAdminUser(user)) {
      query = query.eq("user_id", user.id);
    }
    const { data, error } = await query.select("id, user_id, user_name, user_email, service, booking_date, booking_time, notes, status, created_at, updated_at").maybeSingle();
    if (error) return c.json({ error: error.message }, 500);
    if (!data) return c.json({ error: "Booking not found" }, 404);

    const updated = {
      id: data.id,
      userId: data.user_id,
      userName: data.user_name,
      userEmail: data.user_email,
      service: data.service,
      date: data.booking_date,
      time: data.booking_time,
      notes: data.notes,
      status: data.status,
      createdAt: data.created_at,
    };

    return c.json({ booking: updated });
  } catch (err) {
    console.log("Cancel booking error:", err);
    return c.json({ error: `Error cancelling booking: ${err}` }, 500);
  }
});

// PATCH /bookings/:id/status — update booking status for admin review
app.patch("/make-server-d03e957c/bookings/:id/status", async (c) => {
  try {
    const user = await getAuthUser(c.req.header("Authorization") ?? null);
    if (!user) return c.json({ error: "Unauthorized" }, 401);
    if (!isAdminUser(user)) return c.json({ error: "Forbidden" }, 403);

    const { status } = await c.req.json();
    if (!["pending", "confirmed", "cancelled"].includes(status)) {
      return c.json({ error: "status must be pending, confirmed, or cancelled." }, 400);
    }

    const supabase = bookingsClient();
    const bookingId = c.req.param("id");
    const { data, error } = await supabase
      .from("bookings")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", bookingId)
      .select("id, user_id, user_name, user_email, service, booking_date, booking_time, notes, status, created_at, updated_at")
      .maybeSingle();

    if (error) return c.json({ error: error.message }, 500);
    if (!data) return c.json({ error: "Booking not found" }, 404);

    const updated = {
      id: data.id,
      userId: data.user_id,
      userName: data.user_name,
      userEmail: data.user_email,
      service: data.service,
      date: data.booking_date,
      time: data.booking_time,
      notes: data.notes,
      status: data.status,
      createdAt: data.created_at,
    };

    return c.json({ booking: updated });
  } catch (err) {
    console.log("Update booking status error:", err);
    return c.json({ error: `Error updating booking: ${err}` }, 500);
  }
});

// ─── ENROLLMENTS ──────────────────────────────────────────

// GET /enrollments
app.get("/make-server-d03e957c/enrollments", async (c) => {
  try {
    const userId = await getAuthUserId(c.req.header("Authorization") ?? null);
    if (!userId) return c.json({ error: "Unauthorized" }, 401);

    const results = await kv.getByPrefix(`enrollment:${userId}:`);
    const enrollments = results.map((r) => r.value);
    return c.json({ enrollments });
  } catch (err) {
    console.log("Get enrollments error:", err);
    return c.json({ error: `Error fetching enrollments: ${err}` }, 500);
  }
});

// POST /enrollments — enroll in a course
app.post("/make-server-d03e957c/enrollments", async (c) => {
  try {
    const userId = await getAuthUserId(c.req.header("Authorization") ?? null);
    if (!userId) return c.json({ error: "Unauthorized" }, 401);

    const { courseId, courseName } = await c.req.json();
    if (!courseId) return c.json({ error: "courseId is required." }, 400);

    // Prevent duplicate
    const existing = await kv.get(`enrollment:${userId}:${courseId}`);
    if (existing) return c.json({ enrollment: existing });

    const enrollment = {
      id: `enroll_${Date.now()}`,
      userId,
      courseId,
      courseName: courseName ?? courseId,
      enrolledAt: new Date().toISOString(),
      progress: 0,
      status: "active",
    };

    await kv.set(`enrollment:${userId}:${courseId}`, enrollment);
    return c.json({ enrollment });
  } catch (err) {
    console.log("Enroll error:", err);
    return c.json({ error: `Error enrolling: ${err}` }, 500);
  }
});

// ─── USER PROFILE ──────────────────────────────────────────

// GET /profile
app.get("/make-server-d03e957c/profile", async (c) => {
  try {
    const userId = await getAuthUserId(c.req.header("Authorization") ?? null);
    if (!userId) return c.json({ error: "Unauthorized" }, 401);

    const profile = await kv.get(`profile:${userId}`);
    return c.json({ profile: profile ?? null });
  } catch (err) {
    console.log("Get profile error:", err);
    return c.json({ error: `Error fetching profile: ${err}` }, 500);
  }
});

// PUT /profile
app.put("/make-server-d03e957c/profile", async (c) => {
  try {
    const userId = await getAuthUserId(c.req.header("Authorization") ?? null);
    if (!userId) return c.json({ error: "Unauthorized" }, 401);

    const body = await c.req.json();
    const existing = (await kv.get(`profile:${userId}`)) ?? {};
    const updated = { ...existing, ...body, userId, updatedAt: new Date().toISOString() };
    await kv.set(`profile:${userId}`, updated);
    return c.json({ profile: updated });
  } catch (err) {
    console.log("Update profile error:", err);
    return c.json({ error: `Error updating profile: ${err}` }, 500);
  }
});

// ─── CONSULTANCY REQUESTS ───────────────────────────────────

// GET /consultancy
app.get("/make-server-d03e957c/consultancy", async (c) => {
  try {
    const user = await getAuthUser(c.req.header("Authorization") ?? null);
    if (!user) return c.json({ error: "Unauthorized" }, 401);
    if (!isAdminUser(user)) return c.json({ error: "Forbidden" }, 403);

    const supabase = bookingsClient();
    const { data, error } = await supabase
      .from("consultancy_requests")
      .select("id, full_name, email, phone, service, preferred_time, message, status, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.log("DB Error fetching requests:", error);
      return c.json({ error: error.message }, 500);
    }

    console.log("Auth user email:", user?.email);
    console.log("isAdminUser check:", isAdminUser(user));
    console.log("Requests fetched from DB length:", data?.length);

    const requests = (data ?? []).map((cr: any) => ({
      id: cr.id,
      fullName: cr.full_name,
      email: cr.email,
      phone: cr.phone,
      service: cr.service,
      preferredTime: cr.preferred_time,
      message: cr.message,
      status: cr.status ?? "pending",
      createdAt: cr.created_at,
    }));
    return c.json({ requests });
  } catch (err) {
    console.log("Get consultancy error:", err);
    return c.json({ error: `Error fetching consultancy requests: ${err}` }, 500);
  }
});

// POST /consultancy
app.post("/make-server-d03e957c/consultancy", async (c) => {
  try {
    const { fullName, email, phone, service, preferredTime, message, country } = await c.req.json();
    if (!fullName || !email) {
      return c.json({ error: "fullName and email are required." }, 400);
    }

    const supabase = bookingsClient(); // Uses service_role to bypass RLS
    const { data, error } = await supabase.from("consultancy_requests").insert({
      full_name: fullName,
      email: email,
      phone: phone || "",
      service: service || "",
      preferred_time: preferredTime || "",
      message: message || "",
      country: country || "",
      status: "new",
    }).select().single();

    if (error) {
      console.error("DB Insert Error:", error);
      return c.json({ error: error.message }, 500);
    }

    // Attempt to send Telegram message
    const botToken = "8998508406:AAF2h2xdYJNiAw34ns7KwGOhfcw8t9VODoY";
    const chatId = "-1004474709313";
    if (botToken && chatId) {
      const sanitize = (str: string) => str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      const tgMessage = `🔔 <b>New Consultancy Request</b>\n\n<b>Name:</b> ${sanitize(fullName)}\n<b>Email:</b> ${sanitize(email)}\n<b>Phone:</b> ${sanitize(phone || "N/A")}\n<b>Service:</b> ${sanitize(service || "N/A")}\n<b>Time:</b> ${sanitize(preferredTime || "N/A")}\n<b>Country:</b> ${sanitize(country || "N/A")}\n<b>Message:</b> ${sanitize(message || "N/A")}`;
      
      try {
        const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: tgMessage,
            parse_mode: "HTML",
          }),
        });
        if (!tgRes.ok) {
          const text = await tgRes.text();
          console.error("Telegram failed:", tgRes.status, text);
        }
      } catch (tgErr) {
        console.error("Telegram network error:", tgErr);
        // Do not fail the request if Telegram fails
      }
    }

    return c.json({ request: data });
  } catch (err) {
    console.log("Create consultancy error:", err);
    return c.json({ error: `Error creating consultancy request: ${err}` }, 500);
  }
});

// GET /resend-telegram
app.get("/make-server-d03e957c/resend-telegram", async (c) => {
  try {
    const supabase = bookingsClient();
    const { data, error } = await supabase
      .from("consultancy_requests")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) return c.json({ error: error.message }, 500);

    const botToken = "8998508406:AAF2h2xdYJNiAw34ns7KwGOhfcw8t9VODoY";
    const chatId = "-1004474709313";
    const sanitize = (str: string) => (str || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    
    let sent = 0;
    const reversed = [...(data || [])].reverse();
    for (const req of reversed) {
      const tgMessage = `🔔 <b>Missed Consultancy Request</b>\n\n<b>Name:</b> ${sanitize(req.full_name)}\n<b>Email:</b> ${sanitize(req.email)}\n<b>Phone:</b> ${sanitize(req.phone)}\n<b>Service:</b> ${sanitize(req.service)}\n<b>Time:</b> ${sanitize(req.preferred_time)}\n<b>Message:</b> ${sanitize(req.message)}`;
      const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: tgMessage, parse_mode: "HTML" }),
      });
      if (tgRes.ok) sent++;
      else console.error("TG Resend failed:", await tgRes.text());
      await new Promise(r => setTimeout(r, 200));
    }
    
    return c.json({ message: `Successfully resent ${sent} notifications.` });
  } catch (err) {
    return c.json({ error: `Error resending: ${err}` }, 500);
  }
});

// ─── CONSULTANCY STATUS UPDATE ─────────────────────────────

// PUT /consultancy/:id/status
app.put("/make-server-d03e957c/consultancy/:id/status", async (c) => {
  try {
    const user = await getAuthUser(c.req.header("Authorization") ?? null);
    if (!user || !isAdminUser(user)) return c.json({ error: "Forbidden" }, 403);

    const id = c.req.param("id");
    const { status } = await c.req.json();
    if (!status || !["new", "in-progress", "completed", "cancelled"].includes(status)) {
      return c.json({ error: "Invalid status. Must be: new, in-progress, completed, cancelled" }, 400);
    }

    const supabase = bookingsClient();
    const { data, error } = await supabase
      .from("consultancy_requests")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) return c.json({ error: error.message }, 500);
    return c.json({ request: data });
  } catch (err) {
    return c.json({ error: `Error updating status: ${err}` }, 500);
  }
});

// ─── GALLERY ───────────────────────────────────────────────

// GET /gallery (public)
app.get("/make-server-d03e957c/gallery", async (c) => {
  try {
    const supabase = bookingsClient();
    const { data, error } = await supabase
      .from("gallery_images")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) return c.json({ error: error.message }, 500);
    return c.json({ images: data ?? [] });
  } catch (err) {
    return c.json({ error: `Error fetching gallery: ${err}` }, 500);
  }
});

// POST /gallery (admin only)
app.post("/make-server-d03e957c/gallery", async (c) => {
  try {
    const user = await getAuthUser(c.req.header("Authorization") ?? null);
    if (!user || !isAdminUser(user)) return c.json({ error: "Forbidden" }, 403);

    const { title, category, imageUrl } = await c.req.json();
    if (!imageUrl) return c.json({ error: "imageUrl is required" }, 400);

    const supabase = bookingsClient();
    const { data, error } = await supabase
      .from("gallery_images")
      .insert({ title: title || "", category: category || "Practice", image_url: imageUrl, sort_order: 0 })
      .select()
      .single();

    if (error) return c.json({ error: error.message }, 500);
    return c.json({ image: data });
  } catch (err) {
    return c.json({ error: `Error adding gallery image: ${err}` }, 500);
  }
});

// DELETE /gallery/:id (admin only)
app.delete("/make-server-d03e957c/gallery/:id", async (c) => {
  try {
    const user = await getAuthUser(c.req.header("Authorization") ?? null);
    if (!user || !isAdminUser(user)) return c.json({ error: "Forbidden" }, 403);

    const id = c.req.param("id");
    const supabase = bookingsClient();
    const { error } = await supabase.from("gallery_images").delete().eq("id", id);

    if (error) return c.json({ error: error.message }, 500);
    return c.json({ success: true });
  } catch (err) {
    return c.json({ error: `Error deleting gallery image: ${err}` }, 500);
  }
});

// ─── BLOG ──────────────────────────────────────────────────

// GET /blog (public — published only)
app.get("/make-server-d03e957c/blog", async (c) => {
  try {
    const supabase = bookingsClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });

    if (error) return c.json({ error: error.message }, 500);
    return c.json({ posts: data ?? [] });
  } catch (err) {
    return c.json({ error: `Error fetching blog: ${err}` }, 500);
  }
});

// GET /blog/all (admin — all posts)
app.get("/make-server-d03e957c/blog/all", async (c) => {
  try {
    const user = await getAuthUser(c.req.header("Authorization") ?? null);
    if (!user || !isAdminUser(user)) return c.json({ error: "Forbidden" }, 403);

    const supabase = bookingsClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return c.json({ error: error.message }, 500);
    return c.json({ posts: data ?? [] });
  } catch (err) {
    return c.json({ error: `Error fetching all blog posts: ${err}` }, 500);
  }
});

// POST /blog (admin only)
app.post("/make-server-d03e957c/blog", async (c) => {
  try {
    const user = await getAuthUser(c.req.header("Authorization") ?? null);
    if (!user || !isAdminUser(user)) return c.json({ error: "Forbidden" }, 403);

    const { title, excerpt, content, author, category, imageUrl, tags, readTime, published } = await c.req.json();
    if (!title) return c.json({ error: "title is required" }, 400);

    const supabase = bookingsClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .insert({
        title,
        excerpt: excerpt || "",
        content: content || "",
        author: author || "Rekha Bala",
        category: category || "Akashic Reading",
        image_url: imageUrl || "",
        tags: tags || [],
        read_time: readTime || "5 min read",
        published: published ?? false,
      })
      .select()
      .single();

    if (error) return c.json({ error: error.message }, 500);
    return c.json({ post: data });
  } catch (err) {
    return c.json({ error: `Error creating blog post: ${err}` }, 500);
  }
});

// PUT /blog/:id (admin only)
app.put("/make-server-d03e957c/blog/:id", async (c) => {
  try {
    const user = await getAuthUser(c.req.header("Authorization") ?? null);
    if (!user || !isAdminUser(user)) return c.json({ error: "Forbidden" }, 403);

    const id = c.req.param("id");
    const body = await c.req.json();
    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (body.title !== undefined) updates.title = body.title;
    if (body.excerpt !== undefined) updates.excerpt = body.excerpt;
    if (body.content !== undefined) updates.content = body.content;
    if (body.author !== undefined) updates.author = body.author;
    if (body.category !== undefined) updates.category = body.category;
    if (body.imageUrl !== undefined) updates.image_url = body.imageUrl;
    if (body.tags !== undefined) updates.tags = body.tags;
    if (body.readTime !== undefined) updates.read_time = body.readTime;
    if (body.published !== undefined) updates.published = body.published;

    const supabase = bookingsClient();
    const { data, error } = await supabase.from("blog_posts").update(updates).eq("id", id).select().single();

    if (error) return c.json({ error: error.message }, 500);
    return c.json({ post: data });
  } catch (err) {
    return c.json({ error: `Error updating blog post: ${err}` }, 500);
  }
});

// DELETE /blog/:id (admin only)
app.delete("/make-server-d03e957c/blog/:id", async (c) => {
  try {
    const user = await getAuthUser(c.req.header("Authorization") ?? null);
    if (!user || !isAdminUser(user)) return c.json({ error: "Forbidden" }, 403);

    const id = c.req.param("id");
    const supabase = bookingsClient();
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);

    if (error) return c.json({ error: error.message }, 500);
    return c.json({ success: true });
  } catch (err) {
    return c.json({ error: `Error deleting blog post: ${err}` }, 500);
  }
});

// ─── REVIEWS ───────────────────────────────────────────────

// GET /reviews (public)
app.get("/make-server-d03e957c/reviews", async (c) => {
  try {
    const supabase = bookingsClient();
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return c.json({ error: error.message }, 500);
    return c.json({ reviews: data ?? [] });
  } catch (err) {
    return c.json({ error: `Error fetching reviews: ${err}` }, 500);
  }
});

// POST /reviews (admin only)
app.post("/make-server-d03e957c/reviews", async (c) => {
  try {
    const user = await getAuthUser(c.req.header("Authorization") ?? null);
    if (!user || !isAdminUser(user)) return c.json({ error: "Forbidden" }, 403);

    const { name, role, location, rating, review, fullReview, service, color, createdAt } = await c.req.json();
    if (!name || !review) return c.json({ error: "name and review are required" }, 400);

    const supabase = bookingsClient();
    const insertData: Record<string, unknown> = {
      name,
      role: role || "Client",
      location: location || "",
      rating: rating || 5,
      review,
      full_review: fullReview || review,
      service: service || "",
      color: color || "from-purple-400 to-violet-600",
    };
    if (createdAt) {
      insertData.created_at = new Date(createdAt).toISOString();
    }
    const { data, error } = await supabase
      .from("reviews")
      .insert(insertData)
      .select()
      .single();

    if (error) return c.json({ error: error.message }, 500);
    return c.json({ review: data });
  } catch (err) {
    return c.json({ error: `Error creating review: ${err}` }, 500);
  }
});

// PUT /reviews/:id (admin only)
app.put("/make-server-d03e957c/reviews/:id", async (c) => {
  try {
    const user = await getAuthUser(c.req.header("Authorization") ?? null);
    if (!user || !isAdminUser(user)) return c.json({ error: "Forbidden" }, 403);

    const id = c.req.param("id");
    const body = await c.req.json();
    const updates: Record<string, unknown> = {};
    if (body.name !== undefined) updates.name = body.name;
    if (body.role !== undefined) updates.role = body.role;
    if (body.location !== undefined) updates.location = body.location;
    if (body.rating !== undefined) updates.rating = body.rating;
    if (body.review !== undefined) updates.review = body.review;
    if (body.fullReview !== undefined) updates.full_review = body.fullReview;
    if (body.service !== undefined) updates.service = body.service;
    if (body.color !== undefined) updates.color = body.color;
    if (body.createdAt !== undefined) updates.created_at = new Date(body.createdAt).toISOString();

    const supabase = bookingsClient();
    const { data, error } = await supabase.from("reviews").update(updates).eq("id", id).select().single();

    if (error) return c.json({ error: error.message }, 500);
    return c.json({ review: data });
  } catch (err) {
    return c.json({ error: `Error updating review: ${err}` }, 500);
  }
});

// DELETE /reviews/:id (admin only)
app.delete("/make-server-d03e957c/reviews/:id", async (c) => {
  try {
    const user = await getAuthUser(c.req.header("Authorization") ?? null);
    if (!user || !isAdminUser(user)) return c.json({ error: "Forbidden" }, 403);

    const id = c.req.param("id");
    const supabase = bookingsClient();
    const { error } = await supabase.from("reviews").delete().eq("id", id);

    if (error) return c.json({ error: error.message }, 500);
    return c.json({ success: true });
  } catch (err) {
    return c.json({ error: `Error deleting review: ${err}` }, 500);
  }
});

// ─── COURSES (ADMIN MANAGED) ───────────────────────────────

// GET /courses/all (admin — all courses)
app.get("/make-server-d03e957c/courses/all", async (c) => {
  try {
    const user = await getAuthUser(c.req.header("Authorization") ?? null);
    if (!user || !isAdminUser(user)) return c.json({ error: "Forbidden" }, 403);

    const supabase = bookingsClient();
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return c.json({ error: error.message }, 500);
    return c.json({ courses: data ?? [] });
  } catch (err) {
    return c.json({ error: `Error fetching all courses: ${err}` }, 500);
  }
});

// GET /courses/published (public)
app.get("/make-server-d03e957c/courses/published", async (c) => {
  try {
    const supabase = bookingsClient();
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });

    if (error) return c.json({ error: error.message }, 500);
    return c.json({ courses: data ?? [] });
  } catch (err) {
    return c.json({ error: `Error fetching published courses: ${err}` }, 500);
  }
});

// POST /courses (admin only)
app.post("/make-server-d03e957c/courses", async (c) => {
  try {
    const user = await getAuthUser(c.req.header("Authorization") ?? null);
    if (!user || !isAdminUser(user)) return c.json({ error: "Forbidden" }, 403);

    const { title, description, duration, level, price, originalPrice, emoji, category, features, popular, color, published } = await c.req.json();
    if (!title) return c.json({ error: "title is required" }, 400);

    const supabase = bookingsClient();
    const { data, error } = await supabase
      .from("courses")
      .insert({
        title,
        description: description || "",
        duration: duration || "",
        level: level || "All Levels",
        price: price || "",
        original_price: originalPrice || "",
        emoji: emoji || "✨",
        category: category || "",
        features: features || [],
        popular: popular ?? false,
        color: color || "from-violet-500 to-purple-600",
        published: published ?? false,
      })
      .select()
      .single();

    if (error) return c.json({ error: error.message }, 500);
    return c.json({ course: data });
  } catch (err) {
    return c.json({ error: `Error creating course: ${err}` }, 500);
  }
});

// PUT /courses/:id (admin only)
app.put("/make-server-d03e957c/courses/:id", async (c) => {
  try {
    const user = await getAuthUser(c.req.header("Authorization") ?? null);
    if (!user || !isAdminUser(user)) return c.json({ error: "Forbidden" }, 403);

    const id = c.req.param("id");
    const body = await c.req.json();
    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (body.title !== undefined) updates.title = body.title;
    if (body.description !== undefined) updates.description = body.description;
    if (body.duration !== undefined) updates.duration = body.duration;
    if (body.level !== undefined) updates.level = body.level;
    if (body.price !== undefined) updates.price = body.price;
    if (body.originalPrice !== undefined) updates.original_price = body.originalPrice;
    if (body.emoji !== undefined) updates.emoji = body.emoji;
    if (body.category !== undefined) updates.category = body.category;
    if (body.features !== undefined) updates.features = body.features;
    if (body.popular !== undefined) updates.popular = body.popular;
    if (body.color !== undefined) updates.color = body.color;
    if (body.published !== undefined) updates.published = body.published;

    const supabase = bookingsClient();
    const { data, error } = await supabase.from("courses").update(updates).eq("id", id).select().single();

    if (error) return c.json({ error: error.message }, 500);
    return c.json({ course: data });
  } catch (err) {
    return c.json({ error: `Error updating course: ${err}` }, 500);
  }
});

// DELETE /courses/:id (admin only)
app.delete("/make-server-d03e957c/courses/:id", async (c) => {
  try {
    const user = await getAuthUser(c.req.header("Authorization") ?? null);
    if (!user || !isAdminUser(user)) return c.json({ error: "Forbidden" }, 403);

    const id = c.req.param("id");
    const supabase = bookingsClient();
    const { error } = await supabase.from("courses").delete().eq("id", id);

    if (error) return c.json({ error: error.message }, 500);
    return c.json({ success: true });
  } catch (err) {
    return c.json({ error: `Error deleting course: ${err}` }, 500);
  }
});

Deno.serve(app.fetch);

