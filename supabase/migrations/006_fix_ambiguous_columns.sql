-- =====================================================
-- Migration 006: Fix Ambiguous Column References
-- Description: Fixes "column reference is ambiguous" error in RPC functions
-- Issue: Column references in RETURNING clause are ambiguous without table aliases
-- Solution: Use explicit table aliases in INSERT and UPDATE statements
-- =====================================================

-- =====================================================
-- FIX 1: create_customer_profile with explicit aliases
-- =====================================================

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
SET search_path = public, tirthlok, auth
AS $$
BEGIN
    RETURN QUERY
    INSERT INTO tirthlok.customer_profile AS cp (
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
    RETURNING 
        cp.customer_id,
        cp.customer_email_id,
        cp.customer_first_name,
        cp.customer_last_name,
        cp.customer_mobile,
        cp.customer_sect,
        cp.created_at,
        cp.updated_at;
END;
$$;

-- =====================================================
-- FIX 2: update_customer_profile with explicit aliases
-- =====================================================

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
SET search_path = public, tirthlok, auth
AS $$
BEGIN
    RETURN QUERY
    UPDATE tirthlok.customer_profile AS cp
    SET
        customer_first_name = COALESCE(p_first_name, cp.customer_first_name),
        customer_last_name = COALESCE(p_last_name, cp.customer_last_name),
        customer_mobile = COALESCE(p_mobile, cp.customer_mobile),
        customer_sect = COALESCE(p_sect, cp.customer_sect),
        updated_at = CURRENT_TIMESTAMP
    WHERE cp.customer_id = auth.uid()
    RETURNING 
        cp.customer_id,
        cp.customer_email_id,
        cp.customer_first_name,
        cp.customer_last_name,
        cp.customer_mobile,
        cp.customer_sect,
        cp.created_at,
        cp.updated_at;
END;
$$;

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Test the fixed functions
SELECT 
    'Functions updated successfully' as status,
    p.proname as function_name
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
    AND p.proname IN ('create_customer_profile', 'update_customer_profile')
ORDER BY p.proname;

-- Test calling the functions (run while authenticated)
-- SELECT * FROM public.create_customer_profile('test@example.com', 'Test', 'User', NULL, 'Digambar');
-- SELECT * FROM public.update_customer_profile('Updated', 'Name', NULL, NULL);

