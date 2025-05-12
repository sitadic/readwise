"use client";

import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { BookIcon, ShoppingCart, Info, Heart, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import ReactNiceAvatar from "react-nice-avatar";
import { useEffect, useState } from "react";
import Link from "next/link";
import { likePost, unlikePost } from "@/lib/actions/user.actions";
import { cn } from "@/lib/utils";

interface BookMetadataCardProps {
  id: string;
  book_id: string;
  title: string;
  authors?: string[] | string;
  authors_names?: string;
  description: string;
  currentUserId?: string | null | undefined;
}

export default function BookMetadataCard({
  id,
  book_id,
  title,
  authors,
  authors_names,
  description,
  currentUserId,
}: BookMetadataCardProps) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 150;

  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);

  useEffect(() => {
    const checkLikeStatus = async () => {
      if (!currentUserId) return;
      try {
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

  // Fetch comment count
  useEffect(() => {
    const fetchCommentCount = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/getCommentCount?id=book_${id}`
        );
        const data = await response.json();
        setCommentCount(data.count || 0);
      } catch (error) {
        console.error("Failed to fetch comment count:", error);
        setCommentCount(0); // Fallback to 0 on error
      }
    };
    fetchCommentCount();
  }, [id]);

  const handleLike = async () => {
    if (!currentUserId) {
      console.error("User not logged in");
      return;
    }
    try {
      if (isLiked) {
        // Unlike the review
        await unlikePost(currentUserId, id, "book", book_id);
        setIsLiked(false);
        setLikeCount((prev) => Math.max(0, prev - 1));
      } else {
        // Like the review
        await likePost(currentUserId, id, "book", book_id);
        setIsLiked(true);
        setLikeCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Failed to update like:", error);
    }
  };
  let parsedAuthors: string[] = [];
  try {
    if (authors_names) {
      parsedAuthors = JSON.parse(authors_names.replace(/'/g, '"'));
    } else if (typeof authors === "string") {
      parsedAuthors = JSON.parse(authors.replace(/'/g, '"'));
    } else if (Array.isArray(authors)) {
      parsedAuthors = authors;
    }
  } catch (e) {
    parsedAuthors = [];
  }

  const isDescriptionLong = description.length > maxLength;
  const truncatedDescription = isDescriptionLong
    ? `${description.slice(0, maxLength)}...`
    : description;

  return (
    <div className="flex justify-center items-center mt-2">
      <Card className="w-full max-w-3xl border border-border bg-card text-card-foreground hover:shadow-md transition-shadow rounded-xl">
        <CardHeader className="p-4 pb-2">
          <div className="flex gap-4 items-start">
            {/* <ReactNiceAvatar style={{ width: 48, height: 48 }} /> */}
            <div className="flex flex-col">
              <h2 className="text-lg font-semibold text-foreground line-clamp-2">
                Book Name : {title}
              </h2>
              {parsedAuthors.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-1 text-sm text-muted-foreground">
                  {parsedAuthors.slice(0, 3).map((author, index) => (
                    <span
                      key={`${book_id}-${author}-${index}`}
                      className="bg-accent rounded-full"
                    >
                      {author}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-4 pt-2 pb-4 text-foreground">
          <p className="leading-relaxed mb-3">
            {isExpanded || !isDescriptionLong ? description : truncatedDescription}
          </p>
          {isDescriptionLong && (
            <Button
              variant="link"
              size="sm"
              className="text-primary p-0 hover:underline"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "Read Less" : "Read More"}
            </Button>
          )}

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

        <CardFooter className="flex items-center justify-between px-4 py-3 text-muted-foreground text-sm border-t border-border">
          <div className="flex items-center gap-4">
            <button
              className="flex items-center gap-2 hover:text-foreground"
              onClick={handleLike}
              disabled={!currentUserId}
            >
              <Heart
                size={16}
                className={cn(
                  isLiked ? "text-red-500 fill-red-500" : "text-gray-400"
                )}
              />
              <span>{likeCount}</span>
            </button>
            <Link
              href={`/thread/book_${id}`}
              className="flex items-center gap-1 hover:text-foreground"
            >
              <button className="flex items-center gap-2 hover:text-foreground">
                <MessageCircle size={16} />
                <span>{commentCount}</span>
              </button>
            </Link>
          </div>
          <span className="text-xs">Suggested Book</span>
        </CardFooter>
      </Card>
    </div>
  );
}