import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Server-side route protection: if there's no session, never even
  // render the dashboard — redirect before any data fetching happens.
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="flex items-center justify-between border-b bg-white px-4 py-3 sm:px-8">
        <span className="text-lg font-semibold text-gray-900">
          Timesheet Management
        </span>
        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-gray-600 sm:inline">
            {session.user?.email}
          </span>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button
              type="submit"
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
            >
              Sign out
            </button>
          </form>
        </div>
      </nav>
      <main className="px-4 py-6 sm:px-8">{children}</main>
    </div>
  );
}