import { auth } from "@/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Public routes that don't require authentication
const publicRoutes = ["/login", "/auth/error"]

// Routes that require specific roles
const protectedRoutes: Record<string, string[]> = {
  "/admin": ["e-claims-beta:admin"],
  "/claims": ["e-claims-beta:claims:view"],
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
    const loginUrl = new URL("/login", req.url)
    loginUrl.searchParams.set("error", "SessionExpired")
    return NextResponse.redirect(loginUrl)
  }

  // Check organization/tenant match
  if (req.auth?.user?.tenantId !== process.env.NEXT_PUBLIC_TENANT_ID) {
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
