-- =====================================================
-- Quick Wishlist Diagnostic Test
-- Run this in Supabase SQL Editor while authenticated
-- =====================================================

-- Test 1: Check if you're authenticated
SELECT 
    'Test 1: Auth Check' as test,
    auth.uid() as user_id,
    CASE WHEN auth.uid() IS NULL THEN '❌ NOT LOGGED IN' ELSE '✅ LOGGED IN' END as status;

-- Test 2: Check if wishlist table exists
SELECT 
    'Test 2: Table Check' as test,
    schemaname,
    tablename,
    '✅ TABLE EXISTS' as status
FROM pg_tables
WHERE schemaname = 'tirthlok' AND tablename = 'customer_wishlist';

-- Test 3: Check table structure
SELECT 
    'Test 3: Table Columns' as test,
    column_name,
    data_type
FROM information_schema.columns
WHERE table_schema = 'tirthlok' 
    AND table_name = 'customer_wishlist'
ORDER BY ordinal_position;

-- Test 4: Check if function exists
SELECT 
    'Test 4: Function Check' as test,
    p.proname as function_name,
    pg_get_function_result(p.oid) as return_type,
    '✅ FUNCTION EXISTS' as status
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public' AND p.proname = 'add_to_wishlist';

-- Test 5: Try to add to wishlist
SELECT 
    'Test 5: Add to Wishlist' as test,
    * 
FROM public.add_to_wishlist('Palitana');

-- Test 6: Check if it was added
SELECT 
    'Test 6: Check Wishlist' as test,
    *
FROM tirthlok.customer_wishlist
WHERE customer_id = auth.uid();

-- Test 7: Check view
SELECT 
    'Test 7: View Check' as test,
    *
FROM public.v_customer_wishlist;
