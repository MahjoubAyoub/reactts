import "next-auth"
import { CustomUser } from "@/lib/auth"

export type UserRole = "user" | "admin"

interface GoogleProfile {
  aud: string
  azp: string
  email: string
  email_verified: boolean
  exp: number
  family_name: string
  given_name: string
  iat: number
  iss: string
  jti: string
  name: string
  nbf: number
  picture: string
  sub: string
}

declare module "next-auth" {
  interface User extends CustomUser {}
  interface Session {
    user: CustomUser
  }
  interface Profile extends Partial<GoogleProfile> {}
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: UserRole
  }
}