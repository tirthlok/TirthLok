-- =====================================================
-- Migration 010: Improve Profile Synchronization
-- Description: Enhances triggers and RPC for robust profile management
-- =====================================================

-- 1. DROP OLD FUNCTIONS (to redefine them)
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.create_customer_profile(text, text, text, text, text);

-- 2. IMPROVED TRIGGER FUNCTION: handle_new_user
-- Now handles more metadata fields and is more robust
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, tirthlok, auth
AS $$
DECLARE
    v_first_name TEXT;
    v_last_name TEXT;
BEGIN
    -- Extract names from various possible metadata keys
    v_first_name := COALESCE(
        NEW.raw_user_meta_data->>'first_name',
        NEW.raw_user_meta_data->>'given_name',
        split_part(NEW.raw_user_meta_data->>'full_name', ' ', 1)
    );
    
    v_last_name := COALESCE(
        NEW.raw_user_meta_data->>'last_name',
        NEW.raw_user_meta_data->>'family_name',
        substring(NEW.raw_user_meta_data->>'full_name' from position(' ' in NEW.raw_user_meta_data->>'full_name') + 1)
    );

    INSERT INTO tirthlok.customer_profile (
        customer_id,
        customer_email_id,
        customer_first_name,
        customer_last_name
    )
    VALUES (
        NEW.id,
        NEW.email,
        v_first_name,
        v_last_name
    )
    ON CONFLICT (customer_id) DO UPDATE
    SET
        customer_email_id = EXCLUDED.customer_email_id,
        customer_first_name = COALESCE(EXCLUDED.customer_first_name, customer_profile.customer_first_name),
        customer_last_name = COALESCE(EXCLUDED.customer_last_name, customer_profile.customer_last_name),
        updated_at = CURRENT_TIMESTAMP;
    
    RETURN NEW;
END;
$$;

-- 3. NEW TRIGGER FUNCTION: handle_user_update
-- Syncs email and metadata changes from auth.users to customer_profile
CREATE OR REPLACE FUNCTION public.handle_user_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, tirthlok, auth
AS $$
DECLARE
    v_first_name TEXT;
    v_last_name TEXT;
BEGIN
    -- Only proceed if email or metadata changed
    IF (OLD.email IS DISTINCT FROM NEW.email) OR (OLD.raw_user_meta_data IS DISTINCT FROM NEW.raw_user_meta_data) THEN
        
        v_first_name := COALESCE(
            NEW.raw_user_meta_data->>'first_name',
            NEW.raw_user_meta_data->>'given_name',
            split_part(NEW.raw_user_meta_data->>'full_name', ' ', 1)
        );
        
        v_last_name := COALESCE(
            NEW.raw_user_meta_data->>'last_name',
            NEW.raw_user_meta_data->>'family_name',
            substring(NEW.raw_user_meta_data->>'full_name' from position(' ' in NEW.raw_user_meta_data->>'full_name') + 1)
        );

        UPDATE tirthlok.customer_profile
        SET
            customer_email_id = NEW.email,
            customer_first_name = COALESCE(v_first_name, customer_first_name),
            customer_last_name = COALESCE(v_last_name, customer_last_name),
            updated_at = CURRENT_TIMESTAMP
        WHERE customer_id = NEW.id;
    END IF;
    
    RETURN NEW;
END;
$$;

-- 4. RE-CREATE TRIGGERS
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
    AFTER UPDATE ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_user_update();

-- 5. IMPROVED RPC: create_customer_profile
-- Now uses ON CONFLICT DO UPDATE for better idempotency
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
    ON CONFLICT (customer_id) DO UPDATE
    SET
        customer_email_id = EXCLUDED.customer_email_id,
        customer_first_name = COALESCE(p_first_name, cp.customer_first_name),
        customer_last_name = COALESCE(p_last_name, cp.customer_last_name),
        customer_mobile = COALESCE(p_mobile, cp.customer_mobile),
        customer_sect = COALESCE(p_sect, cp.customer_sect),
        updated_at = CURRENT_TIMESTAMP
    RETURNING cp.*;
END;
$$;

-- 6. VERIFICATION
SELECT 
    'Triggers and RPC updated' as status,
    event_object_table,
    trigger_name
FROM information_schema.triggers
WHERE event_object_table = 'users' AND trigger_schema = 'auth'
ORDER BY trigger_name;
