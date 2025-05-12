import { ThreadProps } from "@/lib/types";
import Link from "next/link";
import ReactNiceAvatar from "react-nice-avatar";

const CommentCard = ({ id, currentUserId, content, author, createdAt }: ThreadProps) => {
  const avatarSize = 50;

  return (
    <div key={id} className="flex gap-4 p-4 rounded-2xl shadow-md mt-5 border border-border bg-card text-card-foreground hover:shadow-lg transition-shadow">
      {author.avatar ? (
        <ReactNiceAvatar
          style={{ width: avatarSize, height: avatarSize }}
          {...author.avatar}
        />
      ) : (
        <div
          className="w-[50px] h-[50px] rounded-full flex items-center justify-center font-semibold text-sm"
        >
          {author.name ? author.name.charAt(0).toUpperCase() : "?"}
        </div>
      )}
      
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <Link href={`/profile/${author.id}`} className="hover:underline">
            <span className="font-semibold">{author.name || "Unknown"}</span>
          </Link>
          <span className="text-xs">
            {createdAt ? new Date(createdAt).toLocaleDateString() : ""}
          </span>
        </div>
        <p className="text-sm">{content}</p>
      </div>
    </div>
  );
};

export default CommentCard;
