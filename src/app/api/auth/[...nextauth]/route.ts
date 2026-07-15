import { handlers } from "@/lib/auth";

// next-auth v5 exports ready-made GET/POST handlers.
// This one file handles /api/auth/signin, /api/auth/callback,
// /api/auth/session, /api/auth/signout, etc. — because of the
// [...nextauth] catch-all folder name.
export const { GET, POST } = handlers;