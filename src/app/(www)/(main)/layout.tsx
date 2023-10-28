import { MobileNavbar } from "@/app/_components/Navigation/MobileNavigation";
import { cn } from "@/lib/utils";
import { verifyJWT } from "@/lib/auth";
import { DesktopNavbar } from "@/app/_components/Navigation/DesktopNavigation";
import { UserProvider } from "./UserProvider";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    payload: { user },
  } = await verifyJWT();

  return (
    <UserProvider user={user}>
      <Container>
        <DesktopNavbar />
        {children}
        <MobileNavbar />
      </Container>
    </UserProvider>
  );
}

function Container({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "mx-auto h-full w-full",
        "tablet:flex tablet:max-w-[700px] tablet:flex-row tablet:border-green-500",
        "laptop:max-w-[1000px] laptop:border-red-500",
        "desktop:max-w-[1258px] desktop:border-blue-500",
      )}
    >
      {children}
    </div>
  );
}
