import { signOut } from "@/auth"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  // Clear NextAuth session
  await signOut({ redirect: false })
  
  // Redirect to login page
  return NextResponse.redirect(new URL("/login", process.env.NEXTAUTH_URL))
}
