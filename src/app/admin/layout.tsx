import { getSessionUser } from "@/lib/auth/session";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  return (
    <div className="min-h-screen bg-[#070708] text-[#ededed] font-sans antialiased">
      {user ? (
        <AdminShell user={user}>
          {children}
        </AdminShell>
      ) : (
        <>{children}</>
      )}
    </div>
  );
}
