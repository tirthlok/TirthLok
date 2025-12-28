-- =====================================================
-- Migration 008: Create Missing Views and Permissions
-- Description: Creates v_customer_profile view and grants necessary permissions
-- =====================================================

-- =====================================================
-- CREATE VIEW: v_customer_profile
-- =====================================================

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
-- GRANT PERMISSIONS
-- =====================================================

-- Grant SELECT on view to anon and authenticated users
GRANT SELECT ON public.v_customer_profile TO anon, authenticated;

-- Grant EXECUTE on RPC functions to anon and authenticated users
GRANT EXECUTE ON FUNCTION public.create_customer_profile TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.update_customer_profile TO anon, authenticated;

-- Revoke direct table access from anon and authenticated roles
REVOKE ALL ON tirthlok.customer_profile FROM anon, authenticated;

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Check if view exists
SELECT 
    'View created successfully' as status,
    table_schema,
    table_name,
    table_type
FROM information_schema.tables
WHERE table_schema = 'public'
    AND table_name = 'v_customer_profile';

-- Test view (run while authenticated)
-- SELECT * FROM public.v_customer_profile;
