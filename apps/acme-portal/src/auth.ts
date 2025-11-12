import NextAuth, { type DefaultSession } from "next-auth"
import Keycloak from "next-auth/providers/keycloak"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      roles: string[]
      organization?: string
      tenantId?: string
    } & DefaultSession["user"]
    accessToken?: string
    idToken?: string
    error?: string
  }

  interface JWT {
    accessToken?: string
    idToken?: string
    refreshToken?: string
    expiresAt?: number
    roles?: string[]
    organization?: string
    error?: string
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Keycloak({
      clientId: process.env.KEYCLOAK_CLIENT_ID!,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
      issuer: `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}`,
      authorization: {
        params: {
          scope: "openid email profile",
          // Force organization login for multi-tenancy
          kc_idp_hint: process.env.TENANT_ID,
        },
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 60, // 30 minutes
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        // Initial sign in
        token.accessToken = account.access_token
        token.idToken = account.id_token
        token.refreshToken = account.refresh_token
        token.expiresAt = account.expires_at
      }

      // Extract roles and organization from token
      if (token.accessToken) {
        try {
          const payload = JSON.parse(
            Buffer.from((token.accessToken as string).split(".")[1], "base64").toString()
          )
          
          token.roles = payload.realm_access?.roles || []
          token.organization = payload.org || payload["kc.organization"] || process.env.TENANT_ID
          
          // Extract client-specific roles
          const clientRoles = payload.resource_access?.[process.env.KEYCLOAK_CLIENT_ID!]?.roles || []
          token.roles = Array.from(new Set([...(token.roles as string[]), ...clientRoles]))
        } catch (error) {
          console.error("Error parsing access token:", error)
        }
      }

      // Check if token needs refresh
      if (token.expiresAt && Date.now() < (token.expiresAt as number) * 1000) {
        return token
      }

      // Token has expired, try to refresh
      return await refreshAccessToken(token)
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.roles = (token.roles as string[]) || []
        session.user.organization = token.organization as string
        session.user.tenantId = process.env.TENANT_ID
        session.accessToken = token.accessToken as string
        session.idToken = token.idToken as string
        session.error = token.error as string | undefined
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  debug: process.env.NODE_ENV === "development",
})

async function refreshAccessToken(token: any) {
  try {
    const response = await fetch(
      `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: process.env.KEYCLOAK_CLIENT_ID!,
          client_secret: process.env.KEYCLOAK_CLIENT_SECRET!,
          grant_type: "refresh_token",
          refresh_token: token.refreshToken,
        }),
      }
    )

    const refreshedTokens = await response.json()

    if (!response.ok) {
      throw refreshedTokens
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      idToken: refreshedTokens.id_token,
      expiresAt: Math.floor(Date.now() / 1000 + refreshedTokens.expires_in),
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    }
  } catch (error) {
    console.error("Error refreshing access token:", error)
    return {
      ...token,
      error: "RefreshAccessTokenError",
    }
  }
}
