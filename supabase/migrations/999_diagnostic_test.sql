-- =====================================================
-- DIAGNOSTIC TEST: Check if RPC Functions Work
-- =====================================================
-- Run this in Supabase SQL Editor while authenticated
-- This will help identify why profile creation is failing

-- Test 1: Check if you're authenticated
SELECT 
    'Test 1: Authentication Check' as test_name,
    auth.uid() as user_id,
    CASE 
        WHEN auth.uid() IS NULL THEN '❌ NOT AUTHENTICATED - You must be logged in'
        ELSE '✅ AUTHENTICATED'
    END as status;

-- Test 2: Check if functions exist with correct search_path
SELECT 
    'Test 2: Function Definition Check' as test_name,
    p.proname as function_name,
    CASE 
        WHEN pg_get_functiondef(p.oid) LIKE '%SET search_path = public, tirthlok, auth%' 
        THEN '✅ CORRECT search_path'
        ELSE '❌ WRONG search_path - Migration not applied'
    END as status
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
    AND p.proname = 'create_customer_profile';

-- Test 3: Check if tirthlok.customer_profile table exists
SELECT 
    'Test 3: Table Exists Check' as test_name,
    schemaname,
    tablename,
    '✅ TABLE EXISTS' as status
FROM pg_tables
WHERE schemaname = 'tirthlok'
    AND tablename = 'customer_profile';

-- Test 4: Check RLS policies
SELECT 
    'Test 4: RLS Policies Check' as test_name,
    policyname,
    cmd,
    roles::text,
    CASE 
        WHEN cmd = 'INSERT' AND roles::text LIKE '%authenticated%' 
        THEN '⚠️ Policy blocks INSERT for authenticated users'
        ELSE '✅ Policy OK'
    END as status
FROM pg_policies
WHERE schemaname = 'tirthlok'
    AND tablename = 'customer_profile'
ORDER BY cmd;

-- Test 5: Try to call the RPC function directly
-- IMPORTANT: Replace 'your-email@example.com' with your actual email
SELECT 
    'Test 5: RPC Function Call' as test_name,
    * 
FROM public.create_customer_profile(
    'test-' || EXTRACT(EPOCH FROM NOW())::text || '@example.com',
    'Test',
    'User',
    NULL,
    'Digambar'
);

-- Test 6: Check if profile was created
SELECT 
    'Test 6: Profile Created Check' as test_name,
    customer_id,
    customer_email_id,
    customer_first_name,
    customer_last_name,
    '✅ PROFILE EXISTS' as status
FROM tirthlok.customer_profile
WHERE customer_id = auth.uid();

-- =====================================================
-- EXPECTED RESULTS:
-- =====================================================
-- Test 1: Should show your user_id (UUID) and "✅ AUTHENTICATED"
-- Test 2: Should show "✅ CORRECT search_path"
-- Test 3: Should show "✅ TABLE EXISTS"
-- Test 4: Should show policies - INSERT should be blocked for authenticated users (this is correct)
-- Test 5: Should return a row with the created profile
-- Test 6: Should show your profile data

-- =====================================================
-- IF TEST 5 FAILS:
-- =====================================================
-- The error message will tell you exactly what's wrong.
-- Common errors:
-- 1. "permission denied" - RLS policy issue
-- 2. "null value in column" - Missing required field
-- 3. "function does not exist" - Migration not applied
-- 4. "schema does not exist" - tirthlok schema missing
