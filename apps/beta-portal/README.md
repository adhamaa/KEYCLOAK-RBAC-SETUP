# Beta Inc Portal - Next.js 15 with Keycloak Authentication

Modern Next.js 15 application with Keycloak integration for multi-tenant authentication and RBAC.

## Features

- ✅ Next.js 15 with App Router
- ✅ NextAuth.js v5 for Keycloak OIDC integration
- ✅ Multi-tenant support (Organization: beta-inc)
- ✅ Role-Based Access Control (RBAC)
- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ Token refresh handling
- ✅ Protected routes via middleware
- ✅ Tenant-specific branding (Purple theme)

## Prerequisites

- Node.js 18.17+
- Keycloak server running (see main docker setup)
- Keycloak realm configured with:
  - Realm: `my-company-realm`
  - Organization: `beta-inc`
  - Client: `e-claims-beta`

## Setup

### 1. Install Dependencies

```bash
cd apps/beta-portal
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
KEYCLOAK_CLIENT_ID=e-claims-beta
KEYCLOAK_CLIENT_SECRET=beta-claims-secret

# Organization / Tenant
TENANT_ID=beta-inc
TENANT_DOMAIN=beta.inc
TENANT_NAME=Beta Inc

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3002
NEXTAUTH_SECRET=generate-a-secure-random-string-here

# App Configuration
NEXT_PUBLIC_APP_NAME=Beta Inc Portal
NEXT_PUBLIC_TENANT_ID=beta-inc
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 3. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3002`

## Multi-Tenancy

The app is configured for the **beta-inc** tenant:

- **Tenant ID:** `beta-inc`
- **Domain:** `beta.inc`
- **Client:** `e-claims-beta`
- **Theme:** Purple/Pink color scheme

Tenant validation happens in middleware - users must belong to the correct organization.

## Role-Based Access Control

### Available Roles (beta-inc)
- `e-claims-beta:access` - Basic app access
- `e-claims-beta:admin` - Admin access
- `e-claims-beta:claims:view` - View claims
- `e-claims-beta:claims:create` - Create claims
- `e-claims-beta:claims:update` - Update claims
- `e-claims-beta:claims:delete` - Delete claims
- `e-claims-beta:reports:view` - View reports
- `e-claims-beta:reports:export` - Export reports

## Differences from ACME Portal

1. **Port:** Runs on 3002 (vs 3001 for ACME)
2. **Tenant:** beta-inc organization
3. **Client:** e-claims-beta (vs e-portal-acme)
4. **Branding:** Purple/Pink theme (vs Blue theme)
5. **Features:** Administration disabled by default

## Testing Multi-Tenancy

1. Start both ACME and Beta portals
2. Login to ACME portal with acme-corp user → should work
3. Try to access Beta portal → should be rejected (wrong tenant)
4. Login to Beta portal with beta-inc user → should work
5. Verify roles are tenant-specific

## Production Deployment

1. Set `NEXTAUTH_SECRET` to a secure random string
2. Update `NEXTAUTH_URL` to production domain
3. Use HTTPS for all URLs
4. Set `KEYCLOAK_URL` to production Keycloak
5. Build: `npm run build`
6. Start: `npm start`

## License

MIT
