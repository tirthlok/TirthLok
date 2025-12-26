-- =====================================================
-- Migration: Customer Profile - RLS, RPC, and Views
-- Description: Secure architecture for customer_profile table
-- =====================================================

-- =====================================================
-- 1. ENABLE ROW LEVEL SECURITY
-- =====================================================

-- Enable RLS on customer_profile table
ALTER TABLE tirthlok.customer_profile ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 2. CREATE RLS POLICIES
-- =====================================================

-- Policy: Allow authenticated users to SELECT only their own profile
CREATE POLICY "Users can view own profile"
ON tirthlok.customer_profile
FOR SELECT
TO authenticated
USING (customer_id = auth.uid());

-- Policy: Block all direct INSERT from frontend (anon/authenticated roles)
-- Only through RPC functions with SECURITY DEFINER
CREATE POLICY "Block direct insert"
ON tirthlok.customer_profile
FOR INSERT
TO anon, authenticated
WITH CHECK (false);

-- Policy: Block all direct UPDATE from frontend
CREATE POLICY "Block direct update"
ON tirthlok.customer_profile
FOR UPDATE
TO anon, authenticated
USING (false);

-- Policy: Block all direct DELETE from frontend
CREATE POLICY "Block direct delete"
ON tirthlok.customer_profile
FOR DELETE
TO anon, authenticated
USING (false);

-- =====================================================
-- 3. CREATE RPC FUNCTIONS (Write Operations)
-- =====================================================

-- Function: Create customer profile
CREATE OR REPLACE FUNCTION public.create_customer_profile(
    p_email TEXT,
    p_first_name TEXT DEFAULT NULL,
    p_last_name TEXT DEFAULT NULL,
    p_mobile TEXT DEFAULT NULL,
    p_sect TEXT DEFAULT NULL
)
RETURNS TABLE (
    customer_id UUID,
    customer_email_id TEXT,
    customer_first_name TEXT,
    customer_last_name TEXT,
    customer_mobile TEXT,
    customer_sect TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    INSERT INTO tirthlok.customer_profile (
        customer_id,
        customer_email_id,
        customer_first_name,
        customer_last_name,
        customer_mobile,
        customer_sect
    )
    VALUES (
        auth.uid(),
        p_email,
        p_first_name,
        p_last_name,
        p_mobile,
        p_sect
    )
    ON CONFLICT (customer_id) DO NOTHING
    RETURNING *;
END;
$$;

-- Function: Update customer profile
CREATE OR REPLACE FUNCTION public.update_customer_profile(
    p_first_name TEXT DEFAULT NULL,
    p_last_name TEXT DEFAULT NULL,
    p_mobile TEXT DEFAULT NULL,
    p_sect TEXT DEFAULT NULL
)
RETURNS TABLE (
    customer_id UUID,
    customer_email_id TEXT,
    customer_first_name TEXT,
    customer_last_name TEXT,
    customer_mobile TEXT,
    customer_sect TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    UPDATE tirthlok.customer_profile
    SET
        customer_first_name = COALESCE(p_first_name, customer_first_name),
        customer_last_name = COALESCE(p_last_name, customer_last_name),
        customer_mobile = COALESCE(p_mobile, customer_mobile),
        customer_sect = COALESCE(p_sect, customer_sect),
        updated_at = CURRENT_TIMESTAMP
    WHERE customer_id = auth.uid()
    RETURNING *;
END;
$$;

-- =====================================================
-- 4. CREATE VIEW (Read Operations)
-- =====================================================

-- View: Customer profile (user sees only their own profile)
CREATE OR REPLACE VIEW public.v_customer_profile AS
SELECT
    customer_id,
    customer_email_id,
    customer_first_name,
    customer_last_name,
    customer_mobile,
    customer_sect,
    created_at,
    updated_at
FROM tirthlok.customer_profile
WHERE customer_id = auth.uid();

-- =====================================================
-- 5. GRANT PERMISSIONS
-- =====================================================

-- Grant SELECT on view to anon and authenticated users
GRANT SELECT ON public.v_customer_profile TO anon, authenticated;

-- Grant EXECUTE on RPC functions to anon and authenticated users
GRANT EXECUTE ON FUNCTION public.create_customer_profile TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.update_customer_profile TO anon, authenticated;

-- Revoke direct table access from anon and authenticated roles
REVOKE ALL ON tirthlok.customer_profile FROM anon, authenticated;

-- =====================================================
-- VERIFICATION QUERIES (for testing)
-- =====================================================

-- Test as authenticated user:
-- SELECT * FROM public.v_customer_profile;
--
-- Test RPC:
-- SELECT * FROM public.create_customer_profile('test@example.com', 'John', 'Doe', '1234567890', 'Swaminarayan');
-- SELECT * FROM public.update_customer_profile('Jane', NULL, NULL, NULL);
--
-- These should FAIL (no direct access):
-- INSERT INTO tirthlok.customer_profile (...) VALUES (...);
-- UPDATE tirthlok.customer_profile SET ... WHERE ...;
-- DELETE FROM tirthlok.customer_profile WHERE ...;
