-- =====================================================
-- Migration: Customer Wishlist - RLS, RPC, and Views
-- Description: Secure architecture for customer_wishlist table
-- =====================================================

-- =====================================================
-- 1. ENABLE ROW LEVEL SECURITY
-- =====================================================

-- Enable RLS on customer_wishlist table
ALTER TABLE tirthlok.customer_wishlist ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 2. CREATE RLS POLICIES
-- =====================================================

-- Policy: Allow authenticated users to SELECT only their own wishlist items
CREATE POLICY "Users can view own wishlist"
ON tirthlok.customer_wishlist
FOR SELECT
TO authenticated
USING (customer_id = auth.uid());

-- Policy: Block all direct INSERT from frontend (anon/authenticated roles)
-- Only through RPC functions with SECURITY DEFINER
CREATE POLICY "Block direct insert"
ON tirthlok.customer_wishlist
FOR INSERT
TO anon, authenticated
WITH CHECK (false);

-- Policy: Block all direct UPDATE from frontend
CREATE POLICY "Block direct update"
ON tirthlok.customer_wishlist
FOR UPDATE
TO anon, authenticated
USING (false);

-- Policy: Block all direct DELETE from frontend
CREATE POLICY "Block direct delete"
ON tirthlok.customer_wishlist
FOR DELETE
TO anon, authenticated
USING (false);

-- =====================================================
-- 3. CREATE RPC FUNCTIONS (Write Operations)
-- =====================================================

-- Function: Add tirth to wishlist
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
SET search_path = public
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
    RETURNING wishlist_id, customer_id, tirth_name, created_at;
END;
$$;

-- Function: Remove tirth from wishlist
CREATE OR REPLACE FUNCTION public.remove_from_wishlist(
    p_tirth_name TEXT
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- Function: Clear entire wishlist for authenticated user
CREATE OR REPLACE FUNCTION public.clear_wishlist()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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
-- 4. CREATE VIEW (Read Operations)
-- =====================================================

-- View: Customer wishlist (user sees only their own wishlist items)
CREATE OR REPLACE VIEW public.v_customer_wishlist AS
SELECT
    wishlist_id,
    customer_id,
    tirth_name,
    created_at
FROM tirthlok.customer_wishlist
WHERE customer_id = auth.uid();

-- =====================================================
-- 5. GRANT PERMISSIONS
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
-- VERIFICATION QUERIES (for testing)
-- =====================================================

-- Test as authenticated user:
-- SELECT * FROM public.v_customer_wishlist;
--
-- Test RPC:
-- SELECT * FROM public.add_to_wishlist('Dwarka');
-- SELECT * FROM public.add_to_wishlist('Ayodhya');
-- SELECT * FROM public.remove_from_wishlist('Dwarka');
-- SELECT public.clear_wishlist();
--
-- These should FAIL (no direct access):
-- INSERT INTO tirthlok.customer_wishlist (...) VALUES (...);
-- UPDATE tirthlok.customer_wishlist SET ... WHERE ...;
-- DELETE FROM tirthlok.customer_wishlist WHERE ...;
