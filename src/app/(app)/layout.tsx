import { DesktopNavbar } from "@/components/Navigation/DesktopNavigation";
import { MobileNavbar } from "@/components/Navigation/MobileNavigation";
import Modal from "./@modal/(.)compose/post/page";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Container>
        <DesktopNavbar />
        {children}
        <LinkTree />
        <MobileNavbar />
      </Container>
    </div>
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

function LinkTree() {
  return (
    <div className="fixed right-0 top-20 z-[999] text-white">
      <Link href="https://github.com/codeforkdev/next-twitter" target="_blank">
        <div className="flex h-8 w-10 items-center rounded-l-full bg-indigo-500 pl-3">
          <Sparkles size={18} />
        </div>
      </Link>
    </div>
  );
}
