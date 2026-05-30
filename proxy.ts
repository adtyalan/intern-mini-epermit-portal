import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  return protectRoute(req);
}

export default function defaultProxy(req: NextRequest) {
  return protectRoute(req);
}

export function protectRoute(req: NextRequest) {
  const userCookie = req.cookies.get("user_session")?.value;
  const url = req.nextUrl.clone();

  if (!userCookie) {
    if (url.pathname.startsWith("/dashboard") || url.pathname.startsWith("/api/permits")) {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
    return null;
  }

  try {
    const session = JSON.parse(userCookie);
    const userRole = session.role;

    if (url.pathname === "/" || url.pathname === "/login") {
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }

    if (url.pathname.startsWith("/dashboard/admin") && userRole !== "ADMIN") {
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }

    return null;
  } catch {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }
}

export function protectApiRoute(req: NextRequest, allowedRoles?: string[]) {
  const userCookie = req.cookies.get("user_session")?.value;

  if (!userCookie) {
    return {
      authorized: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      user: null,
    };
  }

  try {
    const session = JSON.parse(userCookie);

    if (allowedRoles && !allowedRoles.includes(session.role)) {
      return {
        authorized: false,
        response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
        user: null,
      };
    }

    return {
      authorized: true,
      response: null,
      user: session,
    };
  } catch {
    return {
      authorized: false,
      response: NextResponse.json({ error: "Invalid Session" }, { status: 401 }),
      user: null,
    };
  }
}
export const config = {
  matcher: ["/dashboard/:path*", "/api/permits/:path*"]
};
