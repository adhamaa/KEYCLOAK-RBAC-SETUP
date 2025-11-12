# Keycloak Logout Configuration

## Configure Valid Post Logout Redirect URIs

To enable proper logout, you need to add the logout callback URLs to your Keycloak clients:

### For e-portal-acme (ACME Corp Portal)

1. Go to Keycloak Admin Console: http://localhost:8080
2. Navigate to: **Clients** → **e-portal-acme** → **Settings** tab
3. Scroll down to **Valid post logout redirect URIs**
4. Add: `http://localhost:3001/auth/logout-callback`
5. Click **Save**

### For e-claims-beta (Beta Inc Portal)

1. Go to Keycloak Admin Console: http://localhost:8080
2. Navigate to: **Clients** → **e-claims-beta** → **Settings** tab
3. Scroll down to **Valid post logout redirect URIs**
4. Add: `http://localhost:3002/auth/logout-callback`
5. Click **Save**

## How the Logout Flow Works

1. User clicks "Sign Out" → redirects to `/api/auth/logout`
2. API route gets session (with idToken) → redirects to Keycloak logout endpoint
3. Keycloak terminates the SSO session
4. Keycloak redirects to `/auth/logout-callback` (our app)
5. Logout callback page calls `signOut()` to clear NextAuth session
6. User is redirected to `/login`

## Testing

After configuring the redirect URIs:
1. Log in to either portal
2. Check Keycloak → Sessions tab to see active session
3. Click "Sign Out" in the portal
4. Verify session is removed from Keycloak
5. Try accessing the portal - should redirect to login
6. Login should require entering credentials again (not auto-login from SSO)
