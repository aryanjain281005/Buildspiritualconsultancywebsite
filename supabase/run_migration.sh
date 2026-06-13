#!/bin/bash
# Run VyanaSoul migration statements against Supabase
DB_URL="postgresql://postgres:Arya%4086303429@db.xvdoutqezjsuogankqna.supabase.co:5432/postgres"

run_sql() {
  echo "Running: $(echo "$1" | head -1 | cut -c1-60)..."
  result=$(npx -y supabase db query --db-url "$DB_URL" "$1" --output-format text 2>&1)
  if echo "$result" | grep -q "failed\|ERROR"; then
    echo "  ⚠️  $(echo "$result" | grep -oP '(ERROR|failed).*' | head -1)"
  else
    echo "  ✅ Success"
  fi
}

echo "🚀 Running VyanaSoul Database Migration..."
echo ""

run_sql 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp"'

run_sql "CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  phone TEXT DEFAULT '',
  avatar_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
)"

run_sql "ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY"

run_sql "CREATE POLICY \"Users can view own profile\" ON public.profiles FOR SELECT USING (auth.uid() = id)"
run_sql "CREATE POLICY \"Admin can view all profiles\" ON public.profiles FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))"
run_sql "CREATE POLICY \"Users can update own profile\" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id)"
run_sql "CREATE POLICY \"Users can insert own profile\" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id)"

run_sql "CREATE TABLE IF NOT EXISTS public.consultancy_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT DEFAULT '',
  service TEXT NOT NULL,
  preferred_time TEXT DEFAULT '',
  message TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'completed', 'rejected')),
  admin_notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
)"

run_sql "ALTER TABLE public.consultancy_requests ENABLE ROW LEVEL SECURITY"

run_sql "CREATE POLICY \"Anyone can submit consultancy request\" ON public.consultancy_requests FOR INSERT WITH CHECK (true)"
run_sql "CREATE POLICY \"Users can view own consultancy requests\" ON public.consultancy_requests FOR SELECT USING (auth.uid() = user_id)"
run_sql "CREATE POLICY \"Admin can view all consultancy requests\" ON public.consultancy_requests FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))"
run_sql "CREATE POLICY \"Admin can update consultancy requests\" ON public.consultancy_requests FOR UPDATE USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))"

run_sql "CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied')),
  admin_notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
)"

run_sql "ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY"

run_sql "CREATE POLICY \"Anyone can submit contact message\" ON public.contact_messages FOR INSERT WITH CHECK (true)"
run_sql "CREATE POLICY \"Admin can view all contact messages\" ON public.contact_messages FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))"
run_sql "CREATE POLICY \"Admin can update contact messages\" ON public.contact_messages FOR UPDATE USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))"

run_sql "CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  service TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
)"

run_sql "ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY"

run_sql "CREATE POLICY \"Users can view own bookings\" ON public.bookings FOR SELECT USING (auth.uid() = user_id)"
run_sql "CREATE POLICY \"Users can insert own bookings\" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id)"
run_sql "CREATE POLICY \"Users can update own bookings\" ON public.bookings FOR UPDATE USING (auth.uid() = user_id)"
run_sql "CREATE POLICY \"Admin can view all bookings\" ON public.bookings FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))"
run_sql "CREATE POLICY \"Admin can update all bookings\" ON public.bookings FOR UPDATE USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))"

run_sql "CREATE TABLE IF NOT EXISTS public.enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL,
  course_name TEXT NOT NULL DEFAULT '',
  progress INT NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, course_id)
)"

run_sql "ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY"

run_sql "CREATE POLICY \"Users can view own enrollments\" ON public.enrollments FOR SELECT USING (auth.uid() = user_id)"
run_sql "CREATE POLICY \"Users can insert own enrollments\" ON public.enrollments FOR INSERT WITH CHECK (auth.uid() = user_id)"
run_sql "CREATE POLICY \"Admin can view all enrollments\" ON public.enrollments FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))"
run_sql "CREATE POLICY \"Admin can update all enrollments\" ON public.enrollments FOR UPDATE USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))"

run_sql "CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS \$\$
BEGIN
  INSERT INTO public.profiles (id, name, email, role, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email,
    CASE WHEN NEW.email = 'aryanjain281005@gmail.com' THEN 'admin' ELSE 'user' END,
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
\$\$ LANGUAGE plpgsql SECURITY DEFINER"

run_sql "DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users"

run_sql "CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user()"

run_sql "GRANT INSERT ON public.consultancy_requests TO anon"
run_sql "GRANT INSERT ON public.contact_messages TO anon"
run_sql "GRANT ALL ON public.consultancy_requests TO authenticated"
run_sql "GRANT ALL ON public.contact_messages TO authenticated"
run_sql "GRANT ALL ON public.profiles TO authenticated"
run_sql "GRANT ALL ON public.bookings TO authenticated"
run_sql "GRANT ALL ON public.enrollments TO authenticated"

# Insert admin profile for existing admin user
run_sql "INSERT INTO public.profiles (id, name, email, role, avatar_url)
   SELECT id, 'Aryan Jain', email, 'admin', ''
   FROM auth.users
   WHERE email = 'aryanjain281005@gmail.com'
   ON CONFLICT (id) DO NOTHING"

echo ""
echo "✅ Migration complete!"
