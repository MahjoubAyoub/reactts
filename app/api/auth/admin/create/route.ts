import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { cookies } from 'next/headers'
import { isAdmin } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    // Check if user is authenticated and is an admin
    const session = await getServerSession()
    if (!session?.user || !isAdmin(session.user)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 })
    }

    // Get authorization header from the session cookie
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('next-auth.session-token')?.value

    if (!sessionToken) {
      return NextResponse.json({ message: 'No authentication token found' }, { status: 401 })
    }

    const { name, email, password } = await req.json()

    // Forward the request to the backend API
    const response = await fetch(`${process.env.BACKEND_URL}/api/auth/admin/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionToken}`
      },
      body: JSON.stringify({ name, email, password })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create admin account')
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('Admin creation error:', error)
    return NextResponse.json(
      { message: error.message || 'An error occurred while creating admin account' },
      { status: 500 }
    )
  }
}