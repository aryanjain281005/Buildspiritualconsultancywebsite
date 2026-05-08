// ============================================================
// Mock In-Memory Database for Vyana Soul
// Replace with real Supabase/API calls when ready.
// ============================================================

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string; // In production use a real hashing strategy
  role: 'admin' | 'student' | 'guest';
  createdAt: string;
  avatar?: string;
}

export interface Booking {
  id: string;
  userId: string;
  service: string;
  date: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  notes?: string;
}

export interface CourseEnrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: string;
  progress: number; // 0–100
}

// ---- Seed data ----
const SEED_USERS: User[] = [
  {
    id: 'user_1',
    name: 'Admin',
    email: 'admin@vyanasoul.com',
    passwordHash: 'admin123', // plaintext for demo only
    role: 'admin',
    createdAt: '2024-01-01',
  },
];

// ---- Persistence helpers (localStorage) ----
const STORAGE_KEY = 'vyana_soul_db';

function loadDB(): { users: User[]; bookings: Booking[]; enrollments: CourseEnrollment[] } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { users: [...SEED_USERS], bookings: [], enrollments: [] };
}

function saveDB(db: ReturnType<typeof loadDB>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

// ---- Public API ----

export const db = {
  // --- Users ---
  getUsers: (): User[] => loadDB().users,

  findUserByEmail: (email: string): User | undefined =>
    loadDB().users.find(u => u.email.toLowerCase() === email.toLowerCase()),

  createUser: (name: string, email: string, password: string): User => {
    const data = loadDB();
    if (data.users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('An account with this email already exists.');
    }
    const user: User = {
      id: `user_${Date.now()}`,
      name,
      email,
      passwordHash: password, // plaintext for demo
      role: 'student',
      createdAt: new Date().toISOString(),
    };
    data.users.push(user);
    saveDB(data);
    return user;
  },

  verifyPassword: (user: User, password: string): boolean =>
    user.passwordHash === password,

  // --- Bookings ---
  getBookingsByUser: (userId: string): Booking[] =>
    loadDB().bookings.filter(b => b.userId === userId),

  createBooking: (userId: string, service: string, date: string, notes?: string): Booking => {
    const data = loadDB();
    const booking: Booking = {
      id: `booking_${Date.now()}`,
      userId,
      service,
      date,
      status: 'pending',
      notes,
    };
    data.bookings.push(booking);
    saveDB(data);
    return booking;
  },

  // --- Enrollments ---
  getEnrollmentsByUser: (userId: string): CourseEnrollment[] =>
    loadDB().enrollments.filter(e => e.userId === userId),

  enroll: (userId: string, courseId: string): CourseEnrollment => {
    const data = loadDB();
    const existing = data.enrollments.find(e => e.userId === userId && e.courseId === courseId);
    if (existing) return existing;
    const enrollment: CourseEnrollment = {
      id: `enroll_${Date.now()}`,
      userId,
      courseId,
      enrolledAt: new Date().toISOString(),
      progress: 0,
    };
    data.enrollments.push(enrollment);
    saveDB(data);
    return enrollment;
  },
};
