import { auth } from "@/auth"

export async function getSession() {
  return await auth()
}

export async function getCurrentUser() {
  const session = await getSession()
  return session?.user
}

export async function requireAuth() {
  const session = await getSession()
  
  if (!session?.user) {
    throw new Error("Unauthorized")
  }
  
  return session
}

export async function requireRole(role: string) {
  const session = await requireAuth()
  
  if (!session.user.roles.includes(role)) {
    throw new Error(`Missing required role: ${role}`)
  }
  
  return session
}

export async function hasRole(role: string): Promise<boolean> {
  const session = await getSession()
  return session?.user.roles.includes(role) || false
}

export async function hasAnyRole(roles: string[]): Promise<boolean> {
  const session = await getSession()
  return roles.some(role => session?.user.roles.includes(role)) || false
}

export async function hasAllRoles(roles: string[]): Promise<boolean> {
  const session = await getSession()
  return roles.every(role => session?.user.roles.includes(role)) || false
}
