import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
	const response = NextResponse.next()
	const searchParams = request.nextUrl.searchParams

	if (searchParams.has('user')) response.cookies.set('invitedBy', searchParams.get('user') || '')

	return response
}

export const config = {
	matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)'
}
