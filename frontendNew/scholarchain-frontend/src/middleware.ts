// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import envConfig from "./config/config";
import { AuthService } from "./services/auth.service";
export function middleware(req: NextRequest) {
  // THIS is where the console.log MUST be:
  console.log("Middleware triggered! Path:", req.nextUrl.pathname);

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-url", req.nextUrl.pathname);
  // const token = req.cookies.get(envConfig.jwtSecret)?.value;
  // console.log(token);
  // if (token) {
  //   console.log(AuthService.getUserInfo(token));
  // } else {
  //   console.log("No token found");
  // }
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Any file with extension (e.g. .png, .jpg)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)",
  ],
};
