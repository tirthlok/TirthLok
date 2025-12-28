-- =====================================================
-- Migration 005: Fix search_path for RPC Functions
-- Description: Updates all RPC functions to include tirthlok and auth schemas in search_path
-- Issue: Functions were failing because auth.uid() couldn't be resolved with search_path = public only
-- =====================================================

-- =====================================================
-- 1. FIX CUSTOMER PROFILE FUNCTIONS
-- =====================================================

-- Function: Create customer profile (FIXED)
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
SET search_path = public, tirthlok, auth  -- FIXED: Added tirthlok and auth to search_path
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
        auth.uid(),  -- Now this will work correctly
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

-- Function: Update customer profile (FIXED)
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
SET search_path = public, tirthlok, auth  -- FIXED: Added tirthlok and auth to search_path
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
    WHERE customer_id = auth.uid()  -- Now this will work correctly
    RETURNING *;
END;
$$;

-- =====================================================
-- 2. FIX WISHLIST FUNCTIONS
-- =====================================================

-- Function: Add tirth to wishlist (FIXED)
CREATE OR REPLACE FUNCTION public.add_to_wishlist(
    p_tirth_name TEXT
)
RETURNS TABLE (
    wishlist_id UUID,
    customer_id UUID,
    tirth_name TEXT,
    created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, tirthlok, auth  -- FIXED: Added tirthlok and auth to search_path
AS $$
BEGIN
    -- Validate input
    IF p_tirth_name IS NULL OR p_tirth_name = '' THEN
        RAISE EXCEPTION 'tirth_name cannot be empty';
    END IF;

    RETURN QUERY
    INSERT INTO tirthlok.customer_wishlist (
        customer_id,
        tirth_name
    )
    VALUES (
        auth.uid(),  -- Now this will work correctly
        p_tirth_name
    )
    ON CONFLICT (customer_id, tirth_name) DO NOTHING
    RETURNING wishlist_id, customer_id, tirth_name, created_at;
END;
$$;

-- Function: Remove tirth from wishlist (FIXED)
CREATE OR REPLACE FUNCTION public.remove_from_wishlist(
    p_tirth_name TEXT
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, tirthlok, auth  -- FIXED: Added tirthlok and auth to search_path
AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    -- Validate input
    IF p_tirth_name IS NULL OR p_tirth_name = '' THEN
        RAISE EXCEPTION 'tirth_name cannot be empty';
    END IF;

    DELETE FROM tirthlok.customer_wishlist
    WHERE customer_id = auth.uid()  -- Now this will work correctly
        AND tirth_name = p_tirth_name;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$;

-- Function: Clear entire wishlist for authenticated user (FIXED)
CREATE OR REPLACE FUNCTION public.clear_wishlist()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, tirthlok, auth  -- FIXED: Added tirthlok and auth to search_path
AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM tirthlok.customer_wishlist
    WHERE customer_id = auth.uid();  -- Now this will work correctly
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$;

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Test 1: Check if functions were updated correctly
SELECT 
    p.proname as function_name,
    pg_get_function_identity_arguments(p.oid) as arguments,
    pg_get_functiondef(p.oid) as definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
    AND p.proname IN ('create_customer_profile', 'update_customer_profile', 'add_to_wishlist', 'remove_from_wishlist', 'clear_wishlist')
ORDER BY p.proname;

-- Test 2: Verify auth.uid() works (run this while authenticated)
-- SELECT auth.uid();

-- Test 3: Try creating/updating a profile (run this while authenticated)
-- SELECT * FROM public.create_customer_profile('test@example.com', 'Test', 'User', NULL, 'Digambar');
-- SELECT * FROM public.update_customer_profile('Updated', NULL, NULL, NULL);
