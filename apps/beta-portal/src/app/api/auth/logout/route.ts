import { auth } from "@/auth"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const session = await auth()
  
  if (!session?.idToken) {
    // No session, just redirect to login
    return NextResponse.redirect(new URL("/login", process.env.NEXTAUTH_URL))
  }

  // Construct Keycloak logout URL with post_logout_redirect_uri
  const keycloakLogoutUrl = new URL(
    `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/logout`
  )
  
  keycloakLogoutUrl.searchParams.set("id_token_hint", session.idToken)
  keycloakLogoutUrl.searchParams.set(
    "post_logout_redirect_uri",
    `${process.env.NEXTAUTH_URL}/api/auth/logout-callback`
  )

  // Redirect to Keycloak logout first
  // Keycloak will then redirect to our logout-callback page which clears NextAuth session
  return NextResponse.redirect(keycloakLogoutUrl.toString())
}
