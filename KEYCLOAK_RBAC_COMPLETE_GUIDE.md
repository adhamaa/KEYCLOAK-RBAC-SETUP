# Complete Keycloak RBAC Setup Guide

This guide walks you through setting up roles, groups, permissions, and policies in Keycloak for the ACME Corp and Beta Inc portals.

## Prerequisites

✅ Keycloak running on http://localhost:8080  
✅ Realm `my-company-realm` created  
✅ Organizations `acme-corp` and `beta-inc` created  
✅ Clients `e-portal-acme` and `e-claims-beta` created  
✅ Organization scope enabled in client configuration  

---

## Part 1: Client Roles Setup

Roles define what actions users can perform in each application.

### ACME Portal (e-portal-acme) Roles

1. **Navigate to Client Roles**
   - Go to: **Clients** → **e-portal-acme**
   - Click on **Roles** tab
   - Click **Create role**

2. **Create the following roles:**

   **Role 1: e-portal-acme:access**
   - Name: `e-portal-acme:access`
   - Description: `Basic access to ACME portal`
   - Click **Save**

   **Role 2: e-portal-acme:admin**
   - Name: `e-portal-acme:admin`
   - Description: `Administrator access to ACME portal`
   - Click **Save**

   **Role 3: e-portal-acme:claims:view**
   - Name: `e-portal-acme:claims:view`
   - Description: `View insurance claims in ACME portal`
   - Click **Save**

   **Role 4: e-portal-acme:claims:create**
   - Name: `e-portal-acme:claims:create`
   - Description: `Create new insurance claims`
   - Click **Save**

   **Role 5: e-portal-acme:claims:approve**
   - Name: `e-portal-acme:claims:approve`
   - Description: `Approve insurance claims (admin only)`
   - Click **Save**

### Beta Portal (e-claims-beta) Roles

1. **Navigate to Client Roles**
   - Go to: **Clients** → **e-claims-beta**
   - Click on **Roles** tab
   - Click **Create role**

2. **Create the following roles:**

   **Role 1: e-claims-beta:access**
   - Name: `e-claims-beta:access`
   - Description: `Basic access to Beta portal`
   - Click **Save**

   **Role 2: e-claims-beta:admin**
   - Name: `e-claims-beta:admin`
   - Description: `Administrator access to Beta portal`
   - Click **Save**

   **Role 3: e-claims-beta:claims:view**
   - Name: `e-claims-beta:claims:view`
   - Description: `View insurance claims in Beta portal`
   - Click **Save**

   **Role 4: e-claims-beta:claims:submit**
   - Name: `e-claims-beta:claims:submit`
   - Description: `Submit insurance claims`
   - Click **Save**

---

## Part 2: Groups Setup

Groups help organize users and assign roles in bulk.

### Create ACME Groups

1. **Navigate to Groups**
   - Go to: **Groups** (left sidebar)
   - Click **Create group**

2. **Create ACME Employee Group**
   - Name: `acme-employees`
   - Click **Create**

3. **Assign Roles to acme-employees group**
   - Select `acme-employees` group
   - Click **Role mapping** tab
   - Click **Assign role**
   - Switch to **Filter by clients** dropdown → Select `e-portal-acme`
   - Check these roles:
     - `e-portal-acme:access`
     - `e-portal-acme:claims:view`
     - `e-portal-acme:claims:create`
   - Click **Assign**

4. **Create ACME Admins Group**
   - Go back to **Groups**
   - Click **Create group**
   - Name: `acme-admins`
   - Click **Create**

5. **Assign Roles to acme-admins group**
   - Select `acme-admins` group
   - Click **Role mapping** tab
   - Click **Assign role**
   - Filter by client: `e-portal-acme`
   - Check ALL roles:
     - `e-portal-acme:access`
     - `e-portal-acme:admin`
     - `e-portal-acme:claims:view`
     - `e-portal-acme:claims:create`
     - `e-portal-acme:claims:approve`
   - Click **Assign**

### Create Beta Groups

1. **Create Beta Employee Group**
   - Go to: **Groups**
   - Click **Create group**
   - Name: `beta-employees`
   - Click **Create**

2. **Assign Roles to beta-employees group**
   - Select `beta-employees` group
   - Click **Role mapping** tab
   - Click **Assign role**
   - Filter by client: `e-claims-beta`
   - Check:
     - `e-claims-beta:access`
     - `e-claims-beta:claims:view`
     - `e-claims-beta:claims:submit`
   - Click **Assign**

3. **Create Beta Admins Group**
   - Go to **Groups**
   - Click **Create group**
   - Name: `beta-admins`
   - Click **Create**

4. **Assign Roles to beta-admins group**
   - Select `beta-admins` group
   - Click **Role mapping** tab
   - Click **Assign role**
   - Filter by client: `e-claims-beta`
   - Check ALL roles:
     - `e-claims-beta:access`
     - `e-claims-beta:admin`
     - `e-claims-beta:claims:view`
     - `e-claims-beta:claims:submit`
   - Click **Assign**

---

## Part 3: Create Test Users

### ACME Users

#### User 1: Alice (Regular Employee)

1. **Create User**
   - Go to: **Users** (left sidebar)
   - Click **Create new user**
   - Fill in:
     - **Username**: `alice`
     - **Email**: `alice@acme.com` (or your real email)
     - **First name**: `Alice`
     - **Last name**: `Anderson`
     - **Email verified**: Toggle ON
   - Click **Create**

2. **Set Password**
   - Stay on Alice's user page
   - Click **Credentials** tab
   - Click **Set password**
   - Password: `password123`
   - Temporary: Toggle OFF
   - Click **Save**
   - Confirm by clicking **Save password**

3. **Add to Organization**
   - Click **Organizations** tab
   - Click **Join organization**
   - Select: `acme-corp`
   - Membership type: **Managed**
   - Click **Join**

4. **Add to Group**
   - Click **Groups** tab
   - Click **Join group**
   - Select: `acme-employees`
   - Click **Join**

5. **Verify Roles**
   - Click **Role mapping** tab
   - You should see roles inherited from `acme-employees` group

#### User 2: Bob (ACME Admin)

1. **Create User**
   - Go to: **Users**
   - Click **Create new user**
   - Fill in:
     - **Username**: `bob`
     - **Email**: `bob@acme.com` (or your real email)
     - **First name**: `Bob`
     - **Last name**: `Brown`
     - **Email verified**: Toggle ON
   - Click **Create**

2. **Set Password**
   - Click **Credentials** tab
   - Click **Set password**
   - Password: `password123`
   - Temporary: Toggle OFF
   - Click **Save** → **Save password**

3. **Add to Organization**
   - Click **Organizations** tab
   - Click **Join organization**
   - Select: `acme-corp`
   - Membership type: **Managed**
   - Click **Join**

4. **Add to Groups**
   - Click **Groups** tab
   - Click **Join group**
   - Select: `acme-employees` → Click **Join**
   - Click **Join group** again
   - Select: `acme-admins` → Click **Join**

### Beta Users

#### User 3: Carol (Regular Employee)

1. **Create User**
   - Go to: **Users**
   - Click **Create new user**
   - Fill in:
     - **Username**: `carol`
     - **Email**: `carol@beta.inc` (or your real email)
     - **First name**: `Carol`
     - **Last name**: `Chen`
     - **Email verified**: Toggle ON
   - Click **Create**

2. **Set Password**
   - Click **Credentials** tab
   - Password: `password123`
   - Temporary: OFF
   - Click **Save** → **Save password**

3. **Add to Organization**
   - Click **Organizations** tab
   - Click **Join organization**
   - Select: `beta-inc`
   - Membership type: **Managed**
   - Click **Join**

4. **Add to Group**
   - Click **Groups** tab
   - Click **Join group**
   - Select: `beta-employees`
   - Click **Join**

#### User 4: David (Beta Admin)

1. **Create User**
   - Go to: **Users**
   - Click **Create new user**
   - Fill in:
     - **Username**: `david`
     - **Email**: `david@beta.inc` (or your real email)
     - **First name**: `David`
     - **Last name**: `Davis`
     - **Email verified**: Toggle ON
   - Click **Create**

2. **Set Password**
   - Click **Credentials** tab
   - Password: `password123`
   - Temporary: OFF
   - Click **Save** → **Save password**

3. **Add to Organization**
   - Click **Organizations** tab
   - Click **Join organization**
   - Select: `beta-inc`
   - Membership type: **Managed**
   - Click **Join**

4. **Add to Groups**
   - Click **Groups** tab
   - Click **Join group**
   - Select: `beta-employees` → Join
   - Click **Join group** again
   - Select: `beta-admins` → Join

---

## Part 4: Client Scope Configuration

Ensure the "organization" scope is properly configured.

### For Both Clients (e-portal-acme and e-claims-beta)

1. **Check Client Scopes**
   - Go to: **Clients** → Select client (e.g., `e-portal-acme`)
   - Click **Client scopes** tab
   - Verify these scopes are in "Assigned default client scopes":
     - `openid`
     - `email`
     - `profile`
     - `organization` (this is critical!)

2. **If "organization" is missing:**
   - Click **Add client scope**
   - Select **organization**
   - Choose **Default** (not Optional)
   - Click **Add**

3. **Verify in Evaluate Tab**
   - Go to **Client scopes** tab
   - Click **Evaluate** sub-tab
   - User: Select any user (e.g., `alice`)
   - Scope parameter: Add `organization`
   - Click **Generate access token**
   - Verify you see the `"organization"` claim in the token

---

## Part 5: Valid Redirect URIs (Important!)

### ACME Portal Client

1. Go to: **Clients** → **e-portal-acme** → **Settings**
2. Update these fields:
   - **Valid redirect URIs**:
     ```
     http://localhost:3001/*
     http://localhost:3001/api/auth/callback/keycloak
     ```
   - **Valid post logout redirect URIs**:
     ```
     http://localhost:3001/*
     http://localhost:3001/api/auth/logout-callback
     ```
   - **Web origins**:
     ```
     http://localhost:3001
     ```
3. Click **Save**

### Beta Portal Client

1. Go to: **Clients** → **e-claims-beta** → **Settings**
2. Update these fields:
   - **Valid redirect URIs**:
     ```
     http://localhost:3002/*
     http://localhost:3002/api/auth/callback/keycloak
     ```
   - **Valid post logout redirect URIs**:
     ```
     http://localhost:3002/*
     http://localhost:3002/api/auth/logout-callback
     ```
   - **Web origins**:
     ```
     http://localhost:3002
     ```
3. Click **Save**

---

## Part 6: Authorization Policies (Optional - Advanced)

If you want fine-grained authorization with policies:

### Enable Authorization on Client

1. **For ACME Portal:**
   - Go to: **Clients** → **e-portal-acme** → **Settings**
   - Scroll to **Capability config**
   - Toggle **Authorization** to ON
   - Click **Save**

2. **Configure Authorization**
   - A new **Authorization** tab appears
   - Click **Authorization** → **Policies**

3. **Create Role-Based Policy**
   - Click **Create policy** → **Role**
   - Name: `Admin Only Policy`
   - Description: `Only admins can access`
   - Required roles:
     - Search and add: `e-portal-acme:admin`
   - Logic: Positive
   - Click **Save**

4. **Create Resource**
   - Go to **Authorization** → **Resources**
   - Click **Create resource**
   - Name: `Admin Dashboard`
   - Display name: `Admin Dashboard`
   - Type: `urn:acme-portal:resources:admin-dashboard`
   - URIs: `/admin`, `/admin/*`
   - Click **Save**

5. **Create Permission**
   - Go to **Authorization** → **Permissions**
   - Click **Create permission** → **Resource-based**
   - Name: `Admin Dashboard Access`
   - Resources: Select `Admin Dashboard`
   - Policies: Select `Admin Only Policy`
   - Decision strategy: Unanimous
   - Click **Save**

**Note:** This is advanced - the middleware already handles role checking. Use this only if you need Keycloak-side enforcement.

---

## Part 7: Verification Checklist

Before testing the applications, verify:

- [ ] Realm `my-company-realm` created
- [ ] Organizations `acme-corp` and `beta-inc` created
- [ ] Client `e-portal-acme` created with correct redirects
- [ ] Client `e-claims-beta` created with correct redirects
- [ ] "organization" scope added to both clients
- [ ] All roles created for both clients
- [ ] Groups created with role mappings
- [ ] Test users created with passwords
- [ ] Users added to organizations as **managed members**
- [ ] Users added to appropriate groups
- [ ] Valid redirect URIs configured
- [ ] Client secrets copied to `.env.local` files

---

## Part 8: Testing Plan

### Test 1: ACME Regular Employee (Alice)

1. Open: http://localhost:3001
2. Click "Sign in with Keycloak"
3. Login: `alice` / `password123`
4. **Expected Results:**
   - ✅ Login successful
   - ✅ See ACME blue theme
   - ✅ See roles: `e-portal-acme:access`, `e-portal-acme:claims:view`, `e-portal-acme:claims:create`
   - ✅ Organization: `acme-corp`
   - ❌ Cannot access `/admin` routes (no admin role)

### Test 2: ACME Admin (Bob)

1. Logout Alice
2. Login: `bob` / `password123`
3. **Expected Results:**
   - ✅ Login successful
   - ✅ See ALL ACME roles including `e-portal-acme:admin`
   - ✅ Can access admin features

### Test 3: Cross-Org Rejection (Alice → Beta)

1. Stay logged in as Alice (ACME user)
2. Try to access: http://localhost:3002 (Beta portal)
3. **Expected Results:**
   - ❌ Rejected with "WrongOrganization" error
   - ✅ Clear error message
   - ✅ Button to logout and go back to login

### Test 4: Beta Regular Employee (Carol)

1. Open: http://localhost:3002
2. Login: `carol` / `password123`
3. **Expected Results:**
   - ✅ Login successful to Beta portal
   - ✅ See Beta purple theme
   - ✅ See roles: `e-claims-beta:access`, `e-claims-beta:claims:view`, `e-claims-beta:claims:submit`
   - ✅ Organization: `beta-inc`
   - ❌ Cannot access ACME portal

### Test 5: Beta Admin (David)

1. Logout Carol
2. Login: `david` / `password123`
3. **Expected Results:**
   - ✅ Login successful
   - ✅ See ALL Beta roles including `e-claims-beta:admin`

### Test 6: True Logout

1. Login to any portal
2. Click "Logout"
3. **Expected Results:**
   - ✅ Redirected to Keycloak logout
   - ✅ Session terminated in Keycloak
   - ✅ Redirected back to login page
   - ✅ Cannot access protected pages without re-login

---

## Common Issues & Solutions

### Issue: "No organization found in token"
**Solution:** 
- Verify user is a **managed member** (not unmanaged)
- Check "organization" scope is in client scopes
- Clear browser cookies and login again

### Issue: "Invalid client credentials"
**Solution:**
- Copy client secret from Keycloak
- Update `.env.local` file
- Restart the application

### Issue: "Access denied" / Missing roles
**Solution:**
- Check user's group membership
- Verify group has correct role mappings
- Check client role assignments

### Issue: Can access wrong organization's portal
**Solution:**
- Verify `TENANT_ID` matches organization name in Keycloak
- Check middleware validation is working
- Verify organization claim in JWT token (use Evaluate tool)

### Issue: Token doesn't refresh
**Solution:**
- Check `NEXTAUTH_SECRET` is set
- Verify client secret is correct
- Check Keycloak token lifetime settings

---

## Summary: What You've Built

✅ **Multi-tenant isolation:** Users can only access their organization's portal  
✅ **Role-based access control:** Different permissions per user type  
✅ **Group-based management:** Easy to add/remove users from roles  
✅ **True SSO logout:** Sessions properly terminated  
✅ **Secure authentication:** JWT tokens with refresh mechanism  
✅ **Production-ready:** Follows security best practices  

You now have a complete Keycloak RBAC setup with proper multi-tenancy! 🎉
