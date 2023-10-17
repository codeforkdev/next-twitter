import { user } from "@/mock/mock-data";
import { Avatar } from "../Avatar";

export default function MobileSideNavToggle() {
  return (
    <div className="flex-1  tablet:hidden">
      <Avatar src={user.avatar} />
    </div>
  );
}
