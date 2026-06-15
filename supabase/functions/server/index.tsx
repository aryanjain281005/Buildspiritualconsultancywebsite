import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js";
import * as kv from "./kv_store.tsx";

const app = new Hono();

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
      user_metadata: { name },
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
    const userId = await getAuthUserId(c.req.header("Authorization") ?? null);
    if (!userId) return c.json({ error: "Unauthorized" }, 401);

    const results = await kv.getByPrefix(`booking:${userId}:`);
    const bookings = results.map((r) => r.value);
    return c.json({ bookings });
  } catch (err) {
    console.log("Get bookings error:", err);
    return c.json({ error: `Error fetching bookings: ${err}` }, 500);
  }
});

// POST /bookings — create a booking
app.post("/make-server-d03e957c/bookings", async (c) => {
  try {
    const userId = await getAuthUserId(c.req.header("Authorization") ?? null);
    if (!userId) return c.json({ error: "Unauthorized" }, 401);

    const { service, date, time, notes } = await c.req.json();
    if (!service || !date) {
      return c.json({ error: "service and date are required." }, 400);
    }

    const bookingId = `bk_${Date.now()}`;
    const booking = {
      id: bookingId,
      userId,
      service,
      date,
      time: time ?? "",
      notes: notes ?? "",
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    await kv.set(`booking:${userId}:${bookingId}`, booking);
    return c.json({ booking });
  } catch (err) {
    console.log("Create booking error:", err);
    return c.json({ error: `Error creating booking: ${err}` }, 500);
  }
});

// DELETE /bookings/:id — cancel a booking
app.delete("/make-server-d03e957c/bookings/:id", async (c) => {
  try {
    const userId = await getAuthUserId(c.req.header("Authorization") ?? null);
    if (!userId) return c.json({ error: "Unauthorized" }, 401);

    const bookingId = c.req.param("id");
    const booking = await kv.get(`booking:${userId}:${bookingId}`);
    if (!booking) return c.json({ error: "Booking not found" }, 404);

    const updated = { ...booking, status: "cancelled" };
    await kv.set(`booking:${userId}:${bookingId}`, updated);
    return c.json({ booking: updated });
  } catch (err) {
    console.log("Cancel booking error:", err);
    return c.json({ error: `Error cancelling booking: ${err}` }, 500);
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

Deno.serve(app.fetch);
