import { getSession } from "next-auth/react"

export async function withAuth(
  req: Request,
  options?: RequestInit
): Promise<Request> {
  const session = await getSession()
  
  if (session?.accessToken) {
    const headers = new Headers(options?.headers || {})
    headers.set('Authorization', `Bearer ${session.accessToken}`)
    
    return new Request(req, {
      ...options,
      headers
    })
  }
  
  return req
}

export async function fetchWithAuth(
  url: string,
  options?: RequestInit
): Promise<Response> {
  const req = await withAuth(new Request(url, options))
  return fetch(req)
}