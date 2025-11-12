# ACME Corp Portal - Next.js 15 with Keycloak Authentication

Modern Next.js 15 application with Keycloak integration for multi-tenant authentication and RBAC.

## Features

- ✅ Next.js 15 with App Router
- ✅ NextAuth.js v5 for Keycloak OIDC integration
- ✅ Multi-tenant support (Organization: acme-corp)
- ✅ Role-Based Access Control (RBAC)
- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ Token refresh handling
- ✅ Protected routes via middleware
- ✅ Tenant-specific branding

## Prerequisites

- Node.js 18.17+ 
- Keycloak server running (see main docker setup)
- Keycloak realm configured with:
  - Realm: `my-company-realm`
  - Organization: `acme-corp`
  - Client: `e-portal-acme`

## Setup

### 1. Install Dependencies

```bash
cd apps/acme-portal
npm install
```

### 2. Configure Environment

Copy the example environment file and update it:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
# Keycloak Configuration
KEYCLOAK_URL=http://localhost:8080
KEYCLOAK_REALM=my-company-realm
KEYCLOAK_CLIENT_ID=e-portal-acme
KEYCLOAK_CLIENT_SECRET=acme-eportal-secret

# Organization / Tenant
TENANT_ID=acme-corp
TENANT_DOMAIN=acme.com
TENANT_NAME=ACME Corp

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=generate-a-secure-random-string-here

# App Configuration
NEXT_PUBLIC_APP_NAME=ACME Corp Portal
NEXT_PUBLIC_TENANT_ID=acme-corp
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 3. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3001`

## Project Structure

```
acme-portal/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/auth/           # NextAuth.js API routes
│   │   ├── dashboard/          # Protected dashboard
│   │   ├── login/              # Login page
│   │   ├── auth/error/         # Auth error page
│   │   ├── unauthorized/       # Access denied page
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Home page (redirects)
│   ├── components/             # React components
│   │   ├── SessionProvider.tsx # Auth session provider
│   │   ├── LoginForm.tsx       # Login UI
│   │   ├── TenantBranding.tsx  # Tenant branding
│   │   ├── DashboardNav.tsx    # Navigation
│   │   ├── UserInfo.tsx        # User profile card
│   │   └── RoleCard.tsx        # Roles display
│   ├── lib/                    # Utilities
│   │   ├── auth-helpers.ts     # Auth helper functions
│   │   └── config.ts           # App configuration
│   ├── auth.ts                 # NextAuth.js configuration
│   └── middleware.ts           # Route protection
├── public/                     # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## Authentication Flow

1. User visits protected route
2. Middleware checks authentication
3. If not authenticated, redirects to `/login`
4. Login page triggers Keycloak OIDC flow
5. User authenticates via Keycloak (organization: acme-corp)
6. Keycloak redirects back with auth code
7. NextAuth exchanges code for tokens
8. User session created with roles and organization
9. User redirected to dashboard

## Role-Based Access Control

The app integrates with Keycloak client roles:

### Available Roles (acme-corp)
- `e-portal-acme:access` - Basic app access
- `e-portal-acme:admin` - Admin access
- `e-portal-acme:claims:view` - View claims
- `e-portal-acme:claims:create` - Create claims
- `e-portal-acme:claims:update` - Update claims
- `e-portal-acme:claims:delete` - Delete claims
- `e-portal-acme:reports:view` - View reports
- `e-portal-acme:reports:export` - Export reports

### Using Roles in Code

```typescript
import { requireRole, hasRole } from "@/lib/auth-helpers"

// Server Component - require specific role
async function AdminPage() {
  await requireRole("e-portal-acme:admin")
  // ... admin content
}

// Check role conditionally
const isAdmin = await hasRole("e-portal-acme:admin")
```

### Protecting Routes

Routes are protected in `src/middleware.ts`:

```typescript
const protectedRoutes: Record<string, string[]> = {
  "/admin": ["e-portal-acme:admin"],
  "/claims": ["e-portal-acme:claims:view"],
}
```

## Multi-Tenancy

The app is configured for the **acme-corp** tenant:

- **Tenant ID:** `acme-corp`
- **Domain:** `acme.com`
- **Client:** `e-portal-acme`

Tenant validation happens in middleware - users must belong to the correct organization.

## Token Management

- Access tokens stored in JWT session
- Automatic token refresh before expiration
- Session expires after 30 minutes of inactivity
- Expired sessions redirect to login

## Customization

### Branding

Update `src/lib/config.ts`:

```typescript
export const TENANT_CONFIG = {
  id: "acme-corp",
  name: "ACME Corp Portal",
  primaryColor: "#0066CC",
  secondaryColor: "#004C99",
  accentColor: "#FF6B35",
  // ... more config
}
```

### Features

Toggle features in `TENANT_CONFIG`:

```typescript
features: {
  claims: true,
  reports: true,
  administration: true,
}
```

## Troubleshooting

### "Cannot connect to Keycloak"
- Ensure Keycloak is running on `http://localhost:8080`
- Check realm name is `my-company-realm`
- Verify client `e-portal-acme` exists

### "Invalid Tenant" error
- User organization doesn't match `acme-corp`
- Check user is member of correct organization in Keycloak

### "Session Expired" 
- Token refresh failed
- Re-authenticate via login

### TypeScript errors before install
- Run `npm install` first to install dependencies
- Errors will resolve after node_modules populated

## Production Deployment

1. Set `NEXTAUTH_SECRET` to a secure random string
2. Update `NEXTAUTH_URL` to production domain
3. Use HTTPS for all URLs
4. Set `KEYCLOAK_URL` to production Keycloak
5. Build: `npm run build`
6. Start: `npm start`

## License

MIT
