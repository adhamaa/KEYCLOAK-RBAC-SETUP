# Keycloak Multi-Tenant Test Apps

This directory contains 2 Next.js 15 applications for testing Keycloak multi-tenancy with Role-Based Access Control (RBAC).

## 📁 Structure

```
apps/
├── acme-portal/          # ACME Corp tenant app (Blue theme, Port 3001)
├── beta-portal/          # Beta Inc tenant app (Purple theme, Port 3002)
├── docker-compose.yml    # Docker orchestration for all services
├── .env.example          # Environment variables template
└── README.md             # This file
```

## 🚀 Quick Start

### Option 1: Development Mode (Recommended for Testing)

1. **Start Keycloak** (from root directory):
   ```bash
   docker-compose up -d
   ```

2. **Configure Keycloak**:
   - Access: http://localhost:8080
   - Login: admin / admin123
   - Create realm: `my-company-realm`
   - Create organizations: `acme-corp`, `beta-inc`
   - Create clients: `e-portal-acme`, `e-claims-beta`
   - Add users to respective organizations

3. **Run ACME Portal**:
   ```bash
   cd acme-portal
   cp .env.local.example .env.local
   # Edit .env.local with your config
   npm install
   npm run dev
   ```
   Access: http://localhost:3001

4. **Run Beta Portal**:
   ```bash
   cd beta-portal
   cp .env.local.example .env.local
   # Edit .env.local with your config
   npm install
   npm run dev
   ```
   Access: http://localhost:3002

### Option 2: Docker Compose (All Services)

1. **Generate secrets**:
   ```bash
   openssl rand -base64 32  # For ACME
   openssl rand -base64 32  # For Beta
   ```

2. **Create .env file**:
   ```bash
   cp .env.example .env
   # Add your generated secrets to .env
   ```

3. **Build and run all services**:
   ```bash
   docker-compose up --build
   ```

   Services will be available at:
   - Keycloak: http://localhost:8080
   - ACME Portal: http://localhost:3001
   - Beta Portal: http://localhost:3002

## 🏢 Applications

### ACME Corp Portal
- **Tenant ID**: `acme-corp`
- **Domain**: `acme.com`
- **Client**: `e-portal-acme`
- **Port**: 3001
- **Theme**: Blue (#0066CC)
- **Features**: Claims, Reports, Administration

### Beta Inc Portal
- **Tenant ID**: `beta-inc`
- **Domain**: `beta.inc`
- **Client**: `e-claims-beta`
- **Port**: 3002
- **Theme**: Purple (#7C3AED)
- **Features**: Claims, Reports

## 🔐 Authentication Flow

1. User accesses portal
2. Redirected to Keycloak login
3. Keycloak validates organization membership
4. User authenticated with JWT tokens
5. Tokens include organization and roles
6. App validates tenant and enforces RBAC

## 🧪 Testing Multi-Tenancy

### Test 1: Tenant Isolation
1. Create user `alice@acme.com` in `acme-corp` organization
2. Create user `carol@beta.inc` in `beta-inc` organization
3. Alice can access ACME portal but not Beta portal
4. Carol can access Beta portal but not ACME portal

### Test 2: Role-Based Access
1. Assign `e-portal-acme:claims:view` to Alice
2. Assign `e-claims-beta:admin` to Carol
3. Verify Alice sees Claims menu in ACME portal
4. Verify Carol has admin access in Beta portal

### Test 3: Token Refresh
1. Login to either portal
2. Wait for token expiration (30 min default)
3. Continue using app - token should auto-refresh
4. On refresh failure, redirected to login

### Test 4: Cross-Tenant Prevention
1. Login to ACME portal as Alice
2. Manually navigate to Beta portal URL
3. Should be rejected with "Invalid Tenant" error
4. Must logout and login with Beta user

## 📊 Keycloak Configuration

### Realm Setup
```
Realm: my-company-realm
├── Organizations
│   ├── acme-corp
│   │   ├── Domain: acme.com
│   │   └── Members: alice@acme.com, bob@acme.com
│   └── beta-inc
│       ├── Domain: beta.inc
│       └── Members: carol@beta.inc
│
├── Clients
│   ├── e-portal-acme
│   │   ├── Type: confidential
│   │   ├── Auth: enabled
│   │   └── Secret: acme-eportal-secret
│   └── e-claims-beta
│       ├── Type: confidential
│       ├── Auth: enabled
│       └── Secret: beta-claims-secret
│
└── Roles (per client)
    ├── {client}:access
    ├── {client}:admin
    ├── {client}:claims:view
    ├── {client}:claims:create
    └── ...
```

### Creating Test Users

**ACME Corp User:**
```
Username: alice@acme.com
Email: alice@acme.com
Organization: acme-corp
Roles: 
  - e-portal-acme:access
  - e-portal-acme:claims:view
```

**Beta Inc User:**
```
Username: carol@beta.inc
Email: carol@beta.inc
Organization: beta-inc
Roles:
  - e-claims-beta:access
  - e-claims-beta:admin
```

## 🛠️ Development

### Project Structure
Both apps follow the same structure:
```
app-name/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   ├── lib/             # Utilities and config
│   ├── auth.ts          # NextAuth configuration
│   └── middleware.ts    # Route protection
├── public/              # Static assets
├── .env.local.example   # Environment template
├── package.json
└── Dockerfile
```

### Key Technologies
- **Next.js 15**: React framework with App Router
- **NextAuth.js v5**: Authentication library
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Keycloak**: Identity provider

### Environment Variables

**Required for both apps:**
- `KEYCLOAK_URL` - Keycloak server URL
- `KEYCLOAK_REALM` - Realm name
- `KEYCLOAK_CLIENT_ID` - Client ID
- `KEYCLOAK_CLIENT_SECRET` - Client secret
- `TENANT_ID` - Organization ID
- `NEXTAUTH_URL` - App URL
- `NEXTAUTH_SECRET` - Session secret
- `NEXT_PUBLIC_TENANT_ID` - Public tenant ID

## 🔒 Security Best Practices

1. **Secrets**: Always use strong random secrets for production
2. **HTTPS**: Enable HTTPS in production
3. **Client Secrets**: Rotate regularly
4. **Token Expiry**: Configure appropriate timeouts
5. **CORS**: Restrict to known origins
6. **Environment**: Never commit .env files

## 📝 Common Issues

### "Cannot connect to Keycloak"
- Check Keycloak is running: `docker ps`
- Verify `KEYCLOAK_URL` in .env
- Check network connectivity

### "Invalid Tenant" error
- User's organization doesn't match app tenant
- Check user organization in Keycloak Admin
- Verify `TENANT_ID` environment variable

### TypeScript errors before install
- Run `npm install` first
- Errors will resolve once dependencies installed

### Port conflicts
- Change ports in package.json scripts
- Update `NEXTAUTH_URL` accordingly
- Update docker-compose.yml port mappings

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Keycloak Documentation](https://www.keycloak.org/documentation)
- [Keycloak Organizations](https://www.keycloak.org/docs/latest/server_admin/#organizations)

## 🤝 Contributing

Feel free to extend these apps with:
- Additional tenant-specific features
- More complex RBAC rules
- API integrations
- Real-world modules (claims processing, etc.)

## 📄 License

MIT
