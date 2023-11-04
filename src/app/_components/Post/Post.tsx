import { Avatar } from "../Avatar";
import LinkNoPropagation from "./LinkStopProp";
import ProfileHoverCard from "./ProfileHoverCard";
import { MoreHorizontalIcon } from "lucide-react";
import {
  BookmarkButton,
  CommentsButton,
  LikeButton,
  Reactions,
  ReactionsProvider,
  RepostButton,
  ViewsButton,
} from "./Reactions";
import PostLink from "./PostLink";
import StopPropagation from "../StopPropagation";

type Props = {
  id: string;
  text: string;
  metrics: {
    likes: number;
    comments: number;
    views: number;
    reposts: number;
  };
  author: {
    id: string;
    avatar: string;
    handle: string;
    displayName: string;
  };
  viewer: {
    liked: boolean;
    bookmarked: boolean;
  };
};

export function PostHeader(props: {
  avatar: string;
  displayName: string;
  handle: string;
}) {
  return (
    <header className="flex items-center gap-1">
      <ProfileHoverCard
        avatar={props.avatar}
        displayName={props.displayName}
        handle={props.handle}
      >
        <LinkNoPropagation
          href={`/${props.handle}`}
          className="flex items-center gap-2"
        >
          <div className="max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap font-semibold hover:underline">
            {props.displayName}
          </div>
          <span className="max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap text-sm tracking-wide text-gray-400/70">
            @{props.handle}
          </span>
        </LinkNoPropagation>
      </ProfileHoverCard>
      <span className="text-gray-400">·</span>
      <span className="text-sm text-gray-400">20h</span>
      <button className="ml-auto">
        <MoreHorizontalIcon size={18} className="text-gray-400" />
      </button>
    </header>
  );
}
export default function Post(props: Props) {
  const { metrics, viewer, author, id, text } = props;

  return (
    <PostLink handle={author.handle} id={id}>
      <div className="flex cursor-pointer gap-3">
        <section>
          <LinkNoPropagation href={`/${author.handle}`}>
            <Avatar src={author.avatar} />
          </LinkNoPropagation>
        </section>

        <section className="flex-1">
          <PostHeader {...author} />
          <div className="max-w-full grow-0 break-words py-2 text-gray-200">
            {text}
          </div>
          <ReactionsProvider
            postId={id}
            liked={viewer.liked}
            bookmarked={viewer.bookmarked}
            metrics={metrics}
          >
            <StopPropagation className="flex w-full cursor-default justify-between gap-4 text-gray-500">
              <CommentsButton author={author} text={text} />
              <RepostButton />
              <LikeButton />
              <ViewsButton />
              <BookmarkButton />
            </StopPropagation>
          </ReactionsProvider>
        </section>
      </div>
    </PostLink>
  );
}
