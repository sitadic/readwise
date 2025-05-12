"use client";

import { formatDateString } from "@/lib/utils";
import {
  Bookmark,
  Heart,
  MessageCircle,
  ShoppingCart,
  BookIcon,
  Star,
} from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import ReactNiceAvatar from "react-nice-avatar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { likePost, unlikePost } from "@/lib/actions/user.actions";
import { useState, useEffect } from "react";

export interface ThreadData {
  _id: string;
  book_id: string;
  rating: number;
  author: {
    userId: string;
    name: string;
    avatar?: React.ComponentProps<typeof ReactNiceAvatar>;
  };
  text: string;
  createdAt: string;
  children?: ThreadData[];
  likes?: number; // Added to track like count from backend
  currentUserId: string | null | undefined; // Added for current user's ID
}

const ThreadCard = ({
  _id,
  book_id,
  author,
  text,
  rating,
  createdAt,
  children,
  likes = 0,
  currentUserId,
}: ThreadData) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);

  // Fetch initial like status (e.g., check if book_id is in user's liked_books)
  useEffect(() => {
    const checkLikeStatus = async () => {
      try {
        // Assuming an endpoint to check if the user liked the thread
        const response = await fetch(
          `http://127.0.0.1:5000/users/likedBook/status?userId=${currentUserId}&bookId=${book_id}`
        );
        const data = await response.json();
        setIsLiked(data.isLiked || false);
      } catch (error) {
        console.error("Failed to fetch like status:", error);
      }
    };
    checkLikeStatus();
  }, [currentUserId, book_id]);

  const handleLike = async () => {
    try {
      if (isLiked) {
        // Unlike the thread
        await unlikePost(currentUserId, _id, "thread", book_id);
        setIsLiked(false);
        setLikeCount((prev) => Math.max(0, prev - 1));
      } else {
        // Like the thread
        await likePost(currentUserId, _id, "thread", book_id);
        setIsLiked(true);
        setLikeCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Failed to update like:", error);
    }
  };

  return (
    <div className="flex justify-center items-center mt-2">
      <Card className="w-full max-w-3xl border-l-4 border-primary rounded-lg hover:shadow-md transition-shadow bg-background dark:bg-background-dark">
        <CardHeader className="p-4 pb-2">
          <div className="flex items-start gap-4">
            {author.avatar ? (
              <ReactNiceAvatar
                style={{ width: 48, height: 48 }}
                {...author.avatar}
              />
            ) : (
              <ReactNiceAvatar style={{ width: 48, height: 48 }} />
            )}

            <div className="flex flex-col">
              <Link
                href={`/user/${author.userId}`}
                className="text-base font-semibold text-foreground hover:underline"
              >
                {author.name}
              </Link>
              <p className="text-sm text-muted-foreground mt-0.5">
                Reviewed On Book {book_id}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-4 pt-2 pb-4 text-foreground">
          <p className="leading-relaxed mb-4">{text}</p>

          <div className="flex items-center gap-1 mb-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                size={18}
                className={cn(
                  i <= rating ? "text-yellow-500 fill-yellow-500" : "text-gray-400"
                )}
              />
            ))}
            <span className="text-sm text-muted-foreground ml-2">
              {rating}/5
            </span>
          </div>

          <div className="flex gap-2 mt-4">
          <Link href={`/purchase/${book_id}/${currentUserId}`}>
            <Button
              variant="default"
              size="sm"
              className="flex-1 flex gap-2"
              disabled
            >
              <ShoppingCart size={16} />
              Buy $100
            </Button>
            </Link>
            <Link href={`/rentals/${book_id}/${currentUserId}`}>
            <Button
              variant="secondary"
              size="sm"
              className="flex-1 flex gap-2"
              disabled
            >
              <BookIcon size={16} />
              Rent $30
            </Button>
            </Link>
            
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 flex gap-2"
              asChild
            >
            </Button>
          </div>
        </CardContent>

        <CardFooter className="px-4 py-3 border-t border-border text-muted-foreground text-sm flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              className="flex items-center gap-1 hover:text-foreground"
              onClick={handleLike}
            >
              <Heart
                className={cn(
                  "w-4 h-4",
                  isLiked ? "text-red-500 fill-red-500" : "text-gray-400"
                )}
              />
              {likeCount}
            </button>

            <Link
              href={`/thread/thread_${_id}`}
              className="flex items-center gap-1 hover:text-foreground"
            >
              <MessageCircle className="w-4 h-4" />
              {children?.length ?? 0}
            </Link>

            {/* <button className="hover:text-foreground">
              <Bookmark className="w-4 h-4" />
            </button> */}
          </div>
          <span className="text-xs">{formatDateString(createdAt)}</span>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ThreadCard;