-- Migration 003: Automatic Profile Creation via Trigger
-- 
-- This trigger ensures that a entry in tirthlok.customer_profile is created
-- whenever a new user signs up in auth.users. This is more reliable than
-- creating it from the frontend.

-- Function to handle the insertion
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO tirthlok.customer_profile (
    customer_id, 
    customer_email_id, 
    customer_first_name, 
    customer_last_name, 
    customer_mobile, 
    customer_sect
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    NEW.raw_user_meta_data->>'mobile',
    NEW.raw_user_meta_data->>'sect'
  )
  ON CONFLICT (customer_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- The trigger itself
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Comment to document
COMMENT ON FUNCTION public.handle_new_user() IS 'Automatically creates a customer profile record on signup.';
