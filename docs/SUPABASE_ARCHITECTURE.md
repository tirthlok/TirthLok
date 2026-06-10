# Secure Supabase Architecture Documentation

## Overview

This project implements a **production-grade, secure Supabase architecture** that strictly separates database access layers and enforces security through PostgreSQL Row Level Security (RLS) and stored procedures (RPC functions).

## Architecture Principles

### 🔒 **Security First**
- All tables live in the `tirthlok` schema and are **private**
- Frontend **never** accesses tables directly
- RLS enabled on ALL tables with strict policies
- No direct INSERT/UPDATE/DELETE from frontend

### 📖 **Read Operations**
- Public **views** in the `public` schema
- Views automatically filter by `auth.uid()`
- Frontend uses `.from('v_table_name').select()`

### ✍️ **Write Operations**
- Public **RPC functions** in the `public` schema
- Functions use `SECURITY DEFINER` to bypass RLS
- Functions validate `auth.uid()` for authorization
- Frontend uses `.rpc('function_name')`

## Database Structure

### Tables (tirthlok schema)

#### `tirthlok.customer_profile`
```sql
customer_id UUID PRIMARY KEY
customer_email_id TEXT NOT NULL UNIQUE
customer_first_name TEXT
customer_last_name TEXT
customer_mobile TEXT
customer_sect TEXT
created_at TIMESTAMP
updated_at TIMESTAMP
```

#### `tirthlok.customer_wishlist`
```sql
customer_id UUID REFERENCES auth.users(id)
tirth_name TEXT NOT NULL
created_at TIMESTAMP
UNIQUE(customer_id, tirth_name)
```

### Views (public schema)

#### `public.v_customer_profile`
- Shows only authenticated user's profile
- Filters: `WHERE customer_id = auth.uid()`

#### `public.v_customer_wishlist`
- Shows only authenticated user's wishlist items
- Filters: `WHERE customer_id = auth.uid()`

### RPC Functions (public schema)

#### Customer Profile

**`create_customer_profile(p_email, p_first_name, p_last_name, p_mobile, p_sect)`**
- Creates profile for authenticated user
- Uses `auth.uid()` for customer_id
- Prevents duplicates with `ON CONFLICT DO NOTHING`

**`update_customer_profile(p_first_name, p_last_name, p_mobile, p_sect)`**
- Updates only authenticated user's profile
- Auto-updates `updated_at` timestamp
- Uses COALESCE to update only provided fields

#### Customer Wishlist

**`add_to_wishlist(p_tirth_name)`**
- Adds tirth to authenticated user's wishlist
- Prevents duplicates with `ON CONFLICT DO NOTHING`

**`remove_from_wishlist(p_tirth_name)`**
- Removes tirth from authenticated user's wishlist
- Returns count of deleted rows

**`clear_wishlist()`**
- Removes all items from authenticated user's wishlist
- Returns count of deleted rows

## Frontend Integration

### Composables

#### `useCustomerProfile`
```typescript
import { useCustomerProfile } from '~/features/auth/composables/useCustomerProfile'

const { getProfile, createProfile, updateProfile, loading, error } = useCustomerProfile()

// Get profile
const { data, success } = await getProfile()

// Create profile
await createProfile({
  email: 'user@example.com',
  firstName: 'John',
  lastName: 'Doe',
  sect: 'Swaminarayan'
})

// Update profile
await updateProfile({
  firstName: 'Jane',
  mobile: '1234567890'
})
```

#### `useWishlist`
```typescript
import { useWishlist } from '~/features/wishlist/composables/useWishlist'

const { 
  getWishlist, 
  addToWishlist, 
  removeFromWishlist, 
  clearWishlist,
  wishlistItems,
  isFavorite,
  loading, 
  error 
} = useWishlist()

// Get wishlist
const items = await getWishlist()

// Add to wishlist
await addToWishlist('Dwarka')

// Remove from wishlist
await removeFromWishlist('Dwarka')

// Check if favorite
if (isFavorite.value('Dwarka')) {
  // ...
}

// Clear wishlist
await clearWishlist()
```

### Direct Supabase Usage (if needed)

```typescript
const { supabase } = useSupabase()

// ✅ CORRECT: Read from view
const { data } = await supabase
  .from('v_customer_profile')
  .select('*')

// ✅ CORRECT: Write via RPC
const { data } = await supabase
  .rpc('add_to_wishlist', { p_tirth_name: 'Dwarka' })

// ❌ WRONG: Direct table access (will fail)
const { data } = await supabase
  .from('customer_wishlist')
  .insert({ tirth_name: 'Dwarka' })  // RLS will block this
```

## Installation & Setup

### 1. Run SQL Migrations

Navigate to your Supabase project's SQL Editor and run these migration files in order:

1. **`supabase/migrations/001_customer_profile_rls_and_rpc.sql`**
   - Enables RLS on customer_profile
   - Creates RPC functions for profile operations
   - Creates v_customer_profile view

2. **`supabase/migrations/002_customer_wishlist_rls_and_rpc.sql`**
   - Enables RLS on customer_wishlist
   - Creates RPC functions for wishlist operations
   - Creates v_customer_wishlist view

### 2. Update Environment Variables

Create or update `.env.local`:

```env
NUXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NUXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

⚠️ **Never commit `.env.local` to version control!**

### 3. Generate TypeScript Types (Optional but Recommended)

```bash
npx supabase gen types typescript --project-id your-project-id > types/supabase.ts
```

## Security Features

### Row Level Security (RLS)

All tables have RLS enabled with the following policies:

1. **SELECT**: Users can only see their own rows (`WHERE customer_id = auth.uid()`)
2. **INSERT/UPDATE/DELETE**: Blocked for `anon` and `authenticated` roles

### RPC Security

- All RPC functions use `SECURITY DEFINER`
- Functions validate `auth.uid()` is present
- Functions only operate on authenticated user's data
- Input validation prevents SQL injection

### View Security

- Views automatically filter by `auth.uid()`
- No GRANT on underlying tables to frontend roles
- Only SELECT permission on views

## Testing

### SQL Testing (via Supabase SQL Editor)

```sql
-- Test view (should return only your profile)
SELECT * FROM public.v_customer_profile;

-- Test RPC
SELECT * FROM public.add_to_wishlist('Dwarka');

-- Test RLS (should fail)
INSERT INTO tirthlok.customer_wishlist (customer_id, tirth_name) 
VALUES (auth.uid(), 'test');  -- ❌ Will be blocked by RLS
```

### Frontend Testing

1. Sign up a new user
2. Verify profile is created automatically
3. Add items to wishlist
4. Remove items from wishlist
5. Check browser network tab - should see only view/RPC calls, no direct table access

## Common Patterns

### Error Handling

```typescript
const { data, success, error } = await createProfile({ ... })

if (!success) {
  console.error('Profile creation failed:', error)
  // Show error to user
  return
}

// Success!
console.log('Profile created:', data)
```

### Loading States

```typescript
const { loading, addToWishlist } = useWishlist()

// In template
<button :disabled="loading" @click="addToWishlist('Dwarka')">
  {{ loading ? 'Adding...' : 'Add to Wishlist' }}
</button>
```

## Migration Guide

If you have existing code using direct table access:

### Before:
```typescript
// ❌ Old way - direct table access
const { data } = await supabase
  .from('customer_wishlist')
  .select('*')
  .eq('customer_id', userId)
```

### After:
```typescript
// ✅ New way - use view
const { data } = await supabase
  .from('v_customer_wishlist')
  .select('*')
// No need for .eq() - view filters automatically
```

### Before:
```typescript
// ❌ Old way - direct INSERT
const { data } = await supabase
  .from('customer_wishlist')
  .insert({ customer_id: userId, tirth_name: 'Dwarka' })
```

### After:
```typescript
// ✅ New way - use RPC
const { data } = await supabase
  .rpc('add_to_wishlist', { p_tirth_name: 'Dwarka' })
```

## Troubleshooting

### "permission denied for table customer_profile"
✅ You're trying to access the table directly. Use the view instead: `v_customer_profile`

### "new row violates row-level security policy"
✅ You're trying to INSERT/UPDATE/DELETE directly. Use RPC functions instead.

### "function does not exist"
✅ You haven't run the SQL migrations yet. Run them in your Supabase SQL Editor.

### TypeScript errors on RPC calls
✅ Regenerate types after running migrations, or add type assertions:
```typescript
const { data } = await supabase.rpc('add_to_wishlist', { 
  p_tirth_name: 'Dwarka' 
}) as { data: any, error: any }
```

## Best Practices

1. ✅ **Always use composables** when possible
2. ✅ **Never bypass RLS** in production
3. ✅ **Validate input** on both frontend and RPC functions
4. ✅ **Handle errors gracefully** with user-friendly messages
5. ✅ **Use environment variables** for credentials
6. ✅ **Test security** regularly (try to access other users' data)
7. ✅ **Keep SQL migrations** in version control

## Resources

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL SECURITY DEFINER](https://www.postgresql.org/docs/current/sql-createfunction.html)
- [Supabase RPC Functions](https://supabase.com/docs/guides/database/functions)

---

**Questions?** Check the implementation plan or contact the development team.
