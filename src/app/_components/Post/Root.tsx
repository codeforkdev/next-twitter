import Link from "next/link";
import { Avatar } from "../Avatar";

type Props = {
  id: string;
  author: {
    id: string;
    avatar: string;
    handle: string;
    displayName: string;
  };
};
export default function Post(props: Props) {
  const { id, author } = props;
  return (
    <Link
      href={`/${author.handle}/${props.id}`}
      className=" flex cursor-pointer gap-3"
    >
      <Link
        href={"/" + author.handle}
        className="relative h-10 w-10 shrink-0 overflow-clip rounded-full"
        // onClick={(e) => e.stopPropagation()}
      >
        <Avatar
          src={
            author.avatar ??
            "https://avatars.githubusercontent.com/u/142317935?v=4"
          }
        />
      </Link>

      <div></div>
    </Link>
  );
}
