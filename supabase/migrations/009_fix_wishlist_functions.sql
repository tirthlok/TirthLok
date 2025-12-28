-- =====================================================
-- Migration 009: Fix Wishlist Functions
-- Description: Applies same fixes to wishlist functions (search_path and RETURNS SETOF)
-- =====================================================

-- =====================================================
-- DROP OLD FUNCTIONS (required to change return type)
-- =====================================================

DROP FUNCTION IF EXISTS public.add_to_wishlist(text);
DROP FUNCTION IF EXISTS public.remove_from_wishlist(text);
DROP FUNCTION IF EXISTS public.clear_wishlist();

-- =====================================================
-- FIX 1: add_to_wishlist
-- =====================================================

CREATE OR REPLACE FUNCTION public.add_to_wishlist(
    p_tirth_name TEXT
)
RETURNS SETOF tirthlok.customer_wishlist
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, tirthlok, auth
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
        auth.uid(),
        p_tirth_name
    )
    ON CONFLICT (customer_id, tirth_name) DO NOTHING
    RETURNING *;
END;
$$;

-- =====================================================
-- FIX 2: remove_from_wishlist
-- =====================================================

CREATE OR REPLACE FUNCTION public.remove_from_wishlist(
    p_tirth_name TEXT
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, tirthlok, auth
AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    -- Validate input
    IF p_tirth_name IS NULL OR p_tirth_name = '' THEN
        RAISE EXCEPTION 'tirth_name cannot be empty';
    END IF;

    DELETE FROM tirthlok.customer_wishlist
    WHERE customer_id = auth.uid()
        AND tirth_name = p_tirth_name;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$;

-- =====================================================
-- FIX 3: clear_wishlist
-- =====================================================

CREATE OR REPLACE FUNCTION public.clear_wishlist()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, tirthlok, auth
AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM tirthlok.customer_wishlist
    WHERE customer_id = auth.uid();
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$;

-- =====================================================
-- CREATE VIEW: v_customer_wishlist
-- =====================================================

-- Drop the old view first (required to change column list)
DROP VIEW IF EXISTS public.v_customer_wishlist;

CREATE OR REPLACE VIEW public.v_customer_wishlist AS
SELECT
    customer_id,
    tirth_name,
    created_at
FROM tirthlok.customer_wishlist
WHERE customer_id = auth.uid();

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

-- Grant SELECT on view to anon and authenticated users
GRANT SELECT ON public.v_customer_wishlist TO anon, authenticated;

-- Grant EXECUTE on RPC functions to anon and authenticated users
GRANT EXECUTE ON FUNCTION public.add_to_wishlist TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.remove_from_wishlist TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.clear_wishlist TO anon, authenticated;

-- Revoke direct table access from anon and authenticated roles
REVOKE ALL ON tirthlok.customer_wishlist FROM anon, authenticated;

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Test the fixed functions
SELECT 
    'Wishlist functions updated successfully' as status,
    p.proname as function_name,
    pg_get_function_result(p.oid) as return_type
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
    AND p.proname IN ('add_to_wishlist', 'remove_from_wishlist', 'clear_wishlist')
ORDER BY p.proname;

-- Check if view exists
SELECT 
    'View created successfully' as status,
    table_name
FROM information_schema.tables
WHERE table_schema = 'public'
    AND table_name = 'v_customer_wishlist';

-- Test calling the functions (run while authenticated)
-- SELECT * FROM public.add_to_wishlist('Palitana');
-- SELECT * FROM public.v_customer_wishlist;
-- SELECT * FROM public.remove_from_wishlist('Palitana');
-- SELECT public.clear_wishlist();

