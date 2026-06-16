import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js";
import * as kv from "./kv_store.ts";

const app = new Hono();
const ADMIN_EMAILS = ["aryanjain281005@gmail.com", "vyanasoul369@vyanasoul.com"];

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

    const { service, date, time, notes } = await c.req.json();
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
      status: booking.status,
      created_at: booking.createdAt,
      updated_at: booking.createdAt,
    });
    if (error) return c.json({ error: error.message }, 500);

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

    if (error) return c.json({ error: error.message }, 500);

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
    const { fullName, email, phone, service, preferredTime, message } = await c.req.json();
    if (!fullName || !email) {
      return c.json({ error: "fullName and email are required." }, 400);
    }

    const supabase = bookingsClient(); // Uses service_role to bypass RLS
    const { data, error } = await supabase.from("consultancy_requests").insert({
      full_name: fullName,
      email: email,
      phone: phone || null,
      service: service || null,
      preferred_time: preferredTime || null,
      message: message || null,
      status: "pending",
    }).select().single();

    if (error) {
      console.error("DB Insert Error:", error);
      return c.json({ error: error.message }, 500);
    }

    // Attempt to send Telegram message
    const botToken = Deno.env.get("TELEGRAM_BOT_TOKEN");
    const chatId = Deno.env.get("TELEGRAM_CHAT_ID");
    if (botToken && chatId) {
      const tgMessage = `🔔 *New Consultancy Request*\n\n*Name:* ${fullName}\n*Email:* ${email}\n*Phone:* ${phone || "N/A"}\n*Service:* ${service || "N/A"}\n*Time:* ${preferredTime || "N/A"}\n*Message:* ${message || "N/A"}`;
      
      try {
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: tgMessage,
            parse_mode: "Markdown",
          }),
        });
      } catch (tgErr) {
        console.error("Telegram error:", tgErr);
        // Do not fail the request if Telegram fails
      }
    }

    return c.json({ request: data });
  } catch (err) {
    console.log("Create consultancy error:", err);
    return c.json({ error: `Error creating consultancy request: ${err}` }, 500);
  }
});

Deno.serve(app.fetch);
