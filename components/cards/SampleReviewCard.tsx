"use client";

import React, { useState, useEffect } from "react";
import ReactNiceAvatar from "react-nice-avatar";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { Heart, MessageCircle, ShoppingCart, BookIcon, Info, Star } from "lucide-react";
import Link from "next/link";
import { likePost, unlikePost } from "@/lib/actions/user.actions";
import { cn } from "@/lib/utils";

interface ReviewCardProps {
  review_id: string;
  user_id: string;
  book_id: string;
  rating: number;
  review_text: string;
  n_votes: number;
  showFullText?: boolean;
  currentUserId: string | null | undefined;
}

export default function ReviewCard({
  review_id,
  user_id,
  book_id,
  rating,
  review_text,
  n_votes,
  showFullText = false,
  currentUserId,
}: ReviewCardProps) {
  const maxLength = 200;
  const isLong = review_text.length > maxLength;
  const truncatedText = isLong ? review_text.slice(0, maxLength) + "..." : review_text;

  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(n_votes);
  const [commentCount, setCommentCount] = useState(0);

  // Fetch initial like status
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
          `http://127.0.0.1:5000/getCommentCount?id=review_${review_id}`
        );
        const data = await response.json();
        setCommentCount(data.count || 0);
      } catch (error) {
        console.error("Failed to fetch comment count:", error);
        setCommentCount(0); // Fallback to 0 on error
      }
    };
    fetchCommentCount();
  }, [review_id]);

  const handleLike = async () => {
    if (!currentUserId) {
      console.error("User not logged in");
      return;
    }
    try {
      if (isLiked) {
        // Unlike the review
        await unlikePost(currentUserId, review_id, "review", book_id);
        setIsLiked(false);
        setLikeCount((prev) => Math.max(0, prev - 1));
      } else {
        // Like the review
        await likePost(currentUserId, review_id, "review", book_id);
        setIsLiked(true);
        setLikeCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Failed to update like:", error);
    }
  };

  return (
    <div className="flex justify-center items-center mt-2">
      <Card className="w-full max-w-3xl border border-border bg-card text-card-foreground hover:shadow-md transition-shadow rounded-xl">
        <CardHeader className="p-4 pb-2">
          <div className="flex gap-4 items-start">
            <ReactNiceAvatar style={{ width: 48, height: 48 }} />
            <div className="flex flex-col">
              <p className="text-base font-semibold text-foreground">
                User {user_id.slice(0, 6)}
              </p>
              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                <Star size={16} className="text-yellow-400" />
                {rating}/5 • {likeCount} votes • {commentCount} comments
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-4 pt-2 pb-4 text-foreground">
          <p className="leading-relaxed mb-3 whitespace-pre-line">
            {showFullText ? review_text : truncatedText}
          </p>
          {isLong && !showFullText && (
            <Link
            href={`/thread/review_${review_id}`}
            className="flex items-center gap-1 hover:text-foreground"
          >
              Read full review →
            </Link>
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
              href={`/thread/review_${review_id}`}
              className="flex items-center gap-1 hover:text-foreground"
            >
              <button className="flex items-center gap-2 hover:text-foreground">
                <MessageCircle size={16} />
                <span>{commentCount}</span>
              </button>
            </Link>
          </div>
          <span className="text-xs">Book ID: {book_id}</span>
        </CardFooter>
      </Card>
    </div>
  );
}