-- =====================================================
-- Migration 007: Fix Return Parameter Name Conflicts
-- Description: Fixes "column reference is ambiguous" error caused by RETURNS TABLE parameter names
-- Issue: RETURNS TABLE (customer_id UUID, ...) creates variables that conflict with column names
-- Solution: Remove explicit RETURNS TABLE and use implicit RETURN QUERY
-- =====================================================

-- =====================================================
-- DROP OLD FUNCTIONS (required to change return type)
-- =====================================================

DROP FUNCTION IF EXISTS public.create_customer_profile(text, text, text, text, text);
DROP FUNCTION IF EXISTS public.update_customer_profile(text, text, text, text);

-- =====================================================
-- FIX 1: create_customer_profile - Remove RETURNS TABLE
-- =====================================================

CREATE OR REPLACE FUNCTION public.create_customer_profile(
    p_email TEXT,
    p_first_name TEXT DEFAULT NULL,
    p_last_name TEXT DEFAULT NULL,
    p_mobile TEXT DEFAULT NULL,
    p_sect TEXT DEFAULT NULL
)
RETURNS SETOF tirthlok.customer_profile
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, tirthlok, auth
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

-- =====================================================
-- FIX 2: update_customer_profile - Remove RETURNS TABLE
-- =====================================================

CREATE OR REPLACE FUNCTION public.update_customer_profile(
    p_first_name TEXT DEFAULT NULL,
    p_last_name TEXT DEFAULT NULL,
    p_mobile TEXT DEFAULT NULL,
    p_sect TEXT DEFAULT NULL
)
RETURNS SETOF tirthlok.customer_profile
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, tirthlok, auth
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
-- VERIFICATION
-- =====================================================

-- Test the fixed functions
SELECT 
    'Functions updated successfully - using SETOF' as status,
    p.proname as function_name,
    pg_get_function_result(p.oid) as return_type
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
    AND p.proname IN ('create_customer_profile', 'update_customer_profile')
ORDER BY p.proname;

-- Test calling the functions (run while authenticated)
-- SELECT * FROM public.create_customer_profile('test@example.com', 'Test', 'User', NULL, 'Digambar');
-- SELECT * FROM public.update_customer_profile('Updated', 'Name', NULL, NULL);
