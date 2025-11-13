# Fixing Organization Multi-Tenancy in Keycloak

## Problem Summary
Users with "unmanaged" membership can login to both organizations because:
1. Unmanaged users don't have the organization claim in their JWT token
2. The validation logic couldn't properly enforce organization boundaries

## Solution Implemented

### 1. Strengthened Auth Validation (`auth.ts`)
- ✅ Extract organization from multiple token claims (`org`, `kc.organization`, `organization`)
- ✅ Reject users without organization claim (unmanaged users)
- ✅ Reject users with wrong organization
- ✅ Add debug logging to see token organization vs expected
- ✅ Return specific errors: `InvalidOrganization` and `NoOrganization`

### 2. Improved Middleware (`middleware.ts`)
- ✅ Strict tenant validation (checks both exist and match)
- ✅ Handle organization-specific errors
- ✅ Better error logging

### 3. Better Error Messages (`error/page.tsx`)
- ✅ "WrongOrganization" - user belongs to different org
- ✅ "NoOrganization" - user has unmanaged membership

## Required Keycloak Configuration

### Convert Unmanaged Users to Managed Members

For each organization, users MUST be **managed members** (not unmanaged):

#### Option A: Add Users Directly to Organization
1. Go to Keycloak Admin Console
2. Navigate to: **Organizations** → Select org (e.g., "acme-corp")
3. Click **Members** tab
4. Click **Add member**
5. Select the user and add them as a **managed member**

#### Option B: Create Users Within Organization
1. Go to: **Organizations** → Select org
2. Click **Members** tab → **Add member** → **Create new user**
3. Fill in user details (ensure email matches organization domain)
4. User will automatically be a managed member

#### Option C: Use Identity Provider Mapping
If using external IdP (Google, Azure AD, etc.):
1. Configure organization identity provider
2. Map users to organizations based on email domain
3. Users will be automatically added as managed members

### Verify Organization Claims in Token

After converting to managed membership:

1. Login to the application
2. Check the server logs - you should see:
   ```
   [AUTH] Token organization: acme-corp
   [AUTH] Expected TENANT_ID: acme-corp
   [AUTH] User email: user@acme.com
   ```

3. If you see `No organization found in token`, the user is still unmanaged

### Testing Multi-Tenant Isolation

#### Test Case 1: ACME User → ACME Portal ✅
1. Login to http://localhost:3001 with alice@acme.com (managed member of acme-corp)
2. Should successfully login and access dashboard

#### Test Case 2: ACME User → Beta Portal ❌
1. Login to http://localhost:3002 with alice@acme.com
2. Should be rejected with "WrongOrganization" error

#### Test Case 3: Beta User → Beta Portal ✅
1. Login to http://localhost:3002 with carol@beta.inc (managed member of beta-inc)
2. Should successfully login and access dashboard

#### Test Case 4: Beta User → ACME Portal ❌
1. Login to http://localhost:3001 with carol@beta.inc
2. Should be rejected with "WrongOrganization" error

#### Test Case 5: Unmanaged User → Any Portal ❌
1. Login to either portal with unmanaged user
2. Should be rejected with "NoOrganization" error
3. Error message instructs to contact admin

## How to Test Now

### 1. Restart the Applications
```bash
# Stop current servers (Ctrl+C)

# Terminal 1 - ACME Portal
cd apps/acme-portal
pnpm start

# Terminal 2 - Beta Portal
cd apps/beta-portal
pnpm start
```

### 2. Check Debug Logs
When you login, you'll see logs like:
```
[AUTH] Token organization: acme-corp
[AUTH] Expected TENANT_ID: acme-corp
[AUTH] User email: alice@acme.com
```

Or if user is unmanaged:
```
[AUTH] Token organization: null
[AUTH] Expected TENANT_ID: acme-corp
[AUTH] User email: user@example.com
[AUTH] No organization found in token for user: user@example.com. This portal requires managed organization membership.
```

### 3. Fix Users in Keycloak
For each user that should have access:
1. Go to Organizations → [org-name] → Members
2. Remove user if they're "unmanaged"
3. Add them back as a managed member
4. Or create new users directly in the organization

## Expected Behavior After Fix

✅ **ACME users** can ONLY login to ACME portal (localhost:3001)
✅ **Beta users** can ONLY login to Beta portal (localhost:3002)
❌ Users trying wrong portal see: "Your account belongs to a different organization"
❌ Unmanaged users see: "Your account is not associated with any organization"

## Troubleshooting

### Still seeing cross-organization access?
- Check: User is truly a managed member (not unmanaged)
- Check: `.env.local` files have correct TENANT_ID values
- Check: NEXT_PUBLIC_TENANT_ID is set correctly
- Check: Clear browser cookies and try again
- Check: Server logs show correct organization in token

### Token has no organization claim?
- User must be **managed member**, not unmanaged
- Keycloak must be configured to include organization in token
- May need to update client mappers in Keycloak

### Need to check token manually?
1. Login to the app
2. Open browser DevTools → Application → Cookies
3. Copy the session token
4. Decode at https://jwt.io
5. Look for `org` or `kc.organization` claim

## Next Steps

1. ✅ Code is now fixed and ready
2. ⚠️ **Convert all test users to managed members in Keycloak**
3. ⚠️ Restart both applications
4. ✅ Test cross-organization access (should be blocked)
5. ✅ Verify error messages are clear

The validation is now **strict** - users MUST be managed members of the correct organization to access each portal.
