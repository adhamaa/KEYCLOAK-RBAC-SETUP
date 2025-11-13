import { auth } from "@/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Public routes that don't require authentication
const publicRoutes = ["/login", "/auth/error"]

// Routes that require specific roles
const protectedRoutes: Record<string, string[]> = {
  "/admin": ["e-portal-acme:admin"],
  "/claims": ["e-portal-acme:claims:view"],
}

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isAuthenticated = !!req.auth
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

  // Allow public routes
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    const loginUrl = new URL("/login", req.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Check session error (token expired/invalid)
  if (req.auth?.error) {
    if (req.auth.error === "InvalidOrganization") {
      return NextResponse.redirect(new URL("/auth/error?error=WrongOrganization", req.url))
    }
    if (req.auth.error === "NoOrganization") {
      return NextResponse.redirect(new URL("/auth/error?error=NoOrganization", req.url))
    }
    const loginUrl = new URL("/login", req.url)
    loginUrl.searchParams.set("error", "SessionExpired")
    return NextResponse.redirect(loginUrl)
  }

  // Check organization/tenant match - strict validation
  const userTenantId = req.auth?.user?.tenantId
  const expectedTenantId = process.env.NEXT_PUBLIC_TENANT_ID
  
  if (!userTenantId || !expectedTenantId || userTenantId !== expectedTenantId) {
    console.error(`[MIDDLEWARE] Tenant validation failed. User: ${userTenantId}, Expected: ${expectedTenantId}`)
    return NextResponse.redirect(new URL("/auth/error?error=InvalidTenant", req.url))
  }

  // Check role-based access for protected routes
  for (const [route, requiredRoles] of Object.entries(protectedRoutes)) {
    if (pathname.startsWith(route)) {
      const userRoles = req.auth?.user?.roles || []
      const hasAccess = requiredRoles.some((role) => userRoles.includes(role))
      
      if (!hasAccess) {
        return NextResponse.redirect(new URL("/unauthorized", req.url))
      }
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.png$).*)",
  ],
}
