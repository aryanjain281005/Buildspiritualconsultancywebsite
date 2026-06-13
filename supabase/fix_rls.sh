#!/bin/bash
DB_URL="postgresql://postgres:Arya%4086303429@db.xvdoutqezjsuogankqna.supabase.co:5432/postgres"

run_sql() {
  npx -y supabase db query --db-url "$DB_URL" "$1" --output-format text
}

echo "Fixing RLS policies..."

run_sql "CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS \$\$
DECLARE
  _role text;
BEGIN
  SELECT role INTO _role FROM public.profiles WHERE id = auth.uid() LIMIT 1;
  RETURN _role = 'admin';
END;
\$\$ LANGUAGE plpgsql SECURITY DEFINER;"

run_sql "DROP POLICY IF EXISTS \"Admin can view all profiles\" ON public.profiles;"
run_sql "DROP POLICY IF EXISTS \"Admin can view all consultancy requests\" ON public.consultancy_requests;"
run_sql "DROP POLICY IF EXISTS \"Admin can update consultancy requests\" ON public.consultancy_requests;"
run_sql "DROP POLICY IF EXISTS \"Admin can view all contact messages\" ON public.contact_messages;"
run_sql "DROP POLICY IF EXISTS \"Admin can update contact messages\" ON public.contact_messages;"
run_sql "DROP POLICY IF EXISTS \"Admin can view all bookings\" ON public.bookings;"
run_sql "DROP POLICY IF EXISTS \"Admin can update all bookings\" ON public.bookings;"
run_sql "DROP POLICY IF EXISTS \"Admin can view all enrollments\" ON public.enrollments;"
run_sql "DROP POLICY IF EXISTS \"Admin can update all enrollments\" ON public.enrollments;"

run_sql "CREATE POLICY \"Admin can view all profiles\" ON public.profiles FOR SELECT USING (public.is_admin());"
run_sql "CREATE POLICY \"Admin can view all consultancy requests\" ON public.consultancy_requests FOR SELECT USING (public.is_admin());"
run_sql "CREATE POLICY \"Admin can update consultancy requests\" ON public.consultancy_requests FOR UPDATE USING (public.is_admin());"
run_sql "CREATE POLICY \"Admin can view all contact messages\" ON public.contact_messages FOR SELECT USING (public.is_admin());"
run_sql "CREATE POLICY \"Admin can update contact messages\" ON public.contact_messages FOR UPDATE USING (public.is_admin());"
run_sql "CREATE POLICY \"Admin can view all bookings\" ON public.bookings FOR SELECT USING (public.is_admin());"
run_sql "CREATE POLICY \"Admin can update all bookings\" ON public.bookings FOR UPDATE USING (public.is_admin());"
run_sql "CREATE POLICY \"Admin can view all enrollments\" ON public.enrollments FOR SELECT USING (public.is_admin());"
run_sql "CREATE POLICY \"Admin can update all enrollments\" ON public.enrollments FOR UPDATE USING (public.is_admin());"

echo "Done!"
