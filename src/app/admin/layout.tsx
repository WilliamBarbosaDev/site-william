import { getSessionUser } from "@/lib/auth/session";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerList = await headers();
  // Check if current request path is login
  // In Next.js, we can inspect x-url or check referer / path
  const user = await getSessionUser();

  // If user is not logged in, allow login page but protect other /admin pages
  // We can also allow the page itself to render if it's the login route
  // Better yet, we can wrap protected pages or check here:
  return (
    <div className="min-h-screen bg-[#070708] text-[#ededed] font-sans antialiased">
      {user ? (
        <div className="flex min-h-screen">
          <AdminSidebar user={user} />
          <div className="flex-1 flex flex-col min-w-0">
            <AdminHeader />
            <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
              {children}
            </main>
          </div>
        </div>
      ) : (
        <>{children}</>
      )}
    </div>
  );
}
