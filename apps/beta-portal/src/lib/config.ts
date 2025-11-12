export const TENANT_CONFIG = {
  id: process.env.NEXT_PUBLIC_TENANT_ID || "beta-inc",
  name: process.env.NEXT_PUBLIC_APP_NAME || "Beta Inc Portal",
  domain: process.env.TENANT_DOMAIN || "beta.inc",
  primaryColor: "#7C3AED",
  secondaryColor: "#6D28D9",
  accentColor: "#EC4899",
  logo: "/logos/beta-logo.png",
  features: {
    claims: true,
    reports: true,
    administration: false,
  },
}

export const KEYCLOAK_CONFIG = {
  url: process.env.KEYCLOAK_URL || "http://localhost:8080",
  realm: process.env.KEYCLOAK_REALM || "my-company-realm",
  clientId: process.env.KEYCLOAK_CLIENT_ID || "e-claims-beta",
}

export const ROLES = {
  // App-level access
  APP_ACCESS: `${KEYCLOAK_CONFIG.clientId}:access`,
  APP_ADMIN: `${KEYCLOAK_CONFIG.clientId}:admin`,
  
  // Claims module
  CLAIMS_VIEW: `${KEYCLOAK_CONFIG.clientId}:claims:view`,
  CLAIMS_CREATE: `${KEYCLOAK_CONFIG.clientId}:claims:create`,
  CLAIMS_UPDATE: `${KEYCLOAK_CONFIG.clientId}:claims:update`,
  CLAIMS_DELETE: `${KEYCLOAK_CONFIG.clientId}:claims:delete`,
  
  // Reports module
  REPORTS_VIEW: `${KEYCLOAK_CONFIG.clientId}:reports:view`,
  REPORTS_EXPORT: `${KEYCLOAK_CONFIG.clientId}:reports:export`,
} as const

export type RoleKey = keyof typeof ROLES
