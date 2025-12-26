-- =====================================================
-- Test Script: Verify RPC Functions Work
-- =====================================================

-- Test 1: Check if RPC functions exist
SELECT 
    p.proname as function_name,
    pg_get_function_identity_arguments(p.oid) as arguments
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
    AND p.proname IN ('create_customer_profile', 'update_customer_profile', 'add_to_wishlist', 'remove_from_wishlist', 'clear_wishlist');

-- Test 2: Check if views exist
SELECT 
    table_schema,
    table_name,
    table_type
FROM information_schema.tables
WHERE table_schema = 'public'
    AND table_name IN ('v_customer_profile', 'v_customer_wishlist');

-- Test 3: Check RLS is enabled
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'tirthlok'
    AND tablename IN ('customer_profile', 'customer_wishlist');

-- Test 4: Check current policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies
WHERE schemaname = 'tirthlok'
    AND tablename IN ('customer_profile', 'customer_wishlist')
ORDER BY tablename, policyname;

-- Test 5: Try to call create_customer_profile RPC
-- (This will only work if you're authenticated in Supabase SQL Editor)
-- SELECT * FROM create_customer_profile(
--     'test@example.com',
--     'Test',
--     'User',
--     NULL,
--     'Digambar'
-- );
