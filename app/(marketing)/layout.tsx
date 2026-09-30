import { auth } from "@/lib/auth";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const user = session?.user
    ? {
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        role: session.user.role,
      }
    : null;

  return (
    <>
      <Navbar user={user} />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
