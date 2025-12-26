-- =====================================================
-- Backfill Script: Create Profiles for Existing Users
-- =====================================================
-- This script creates customer_profile entries for all
-- auth users who don't have profiles yet

INSERT INTO tirthlok.customer_profile (
    customer_id,
    customer_email_id,
    customer_first_name,
    customer_last_name
)
SELECT 
    au.id as customer_id,
    au.email as customer_email_id,
    au.raw_user_meta_data->>'first_name' as customer_first_name,
    au.raw_user_meta_data->>'last_name' as customer_last_name
FROM auth.users au
LEFT JOIN tirthlok.customer_profile cp ON au.id = cp.customer_id
WHERE cp.customer_id IS NULL;

-- Verify the profiles were created
SELECT 
    cp.customer_id,
    cp.customer_email_id,
    cp.customer_first_name,
    cp.customer_last_name,
    cp.created_at
FROM tirthlok.customer_profile cp
ORDER BY cp.created_at DESC;
