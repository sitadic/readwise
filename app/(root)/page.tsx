"use client";

import BookMetadataCard from "@/components/cards/BookMetadataCard";
import SampleReviewCard from "@/components/cards/SampleReviewCard";
import ThreadCard from "@/components/cards/ThreadCards";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import ReactNiceAvatar from "react-nice-avatar";
import InfiniteScroll from "react-infinite-scroll-component";
import SkeletonCard from "@/components/shared/SkeletonCard";

interface Thread {
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
  children?: Thread[];
}

interface Review {
  _id: string;
  user_id: string;
  rating: number;
  review_text: string;
  n_votes: number;
  n_comments: number;
}

interface Recommendation {
  type: "review" | "sampled" | "fallback";
  book_id: string;
  threads?: Thread[];
  sampled_reviews?: Review[];
  _id?: string;
  title?: string;
  description?: string;
  authors?: string[];
  image_url?: string;
  genres?: string[];
}

interface ApiResponse {
  recommended: Recommendation[];
  isNext: boolean;
  totalRecommendations: number;
  page: number;
  pageSize: number;
}

interface Post {
  type: "review" | "sampled" | "fallback";
  _id: string;
  book_id: string;
  user_id?: string;
  rating?: number;
  review_text?: string;
  n_votes?: number;
  n_comments?: number;
  title?: string;
  authors?: string[];
  description?: string;
  image_url?: string;
  genres?: string[];
  thread?: Thread;
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isLoaded, userId } = useAuth();
  // const [interests, setInterests] = useState<string[]>();
  // const [prefrences, setPrefrences] = useState<number[]>();
  // const [likedBooks, setLikedBooks] = useState<number[]>();
  // const [readingList, setReadingList] = useState<number[]>();


  const router = useRouter();

  const pageSize = 15; // Temporary for testing; revert to 30 after fixing

  const fetchRecommendations = useCallback(
    async (pageNum: number, append = false) => {
      if (!userId) return;
      setLoading(true);
      setError(null);
      try {
        // Fetch directly here and use variables
        const intData = await (await fetch(`http://127.0.0.1:5000/users/${userId}/interests`)).json();
        const prefData = await (await fetch(`http://127.0.0.1:5000/users/${userId}/preferences`)).json();
        const readData = await (await fetch(`http://127.0.0.1:5000/users/${userId}/read-list`)).json();
        const likeData = await (await fetch(`http://127.0.0.1:5000/users/${userId}/book-likes`)).json();
  
        // Then use them immediately
        const response = await fetch(
          `http://127.0.0.1:5000/recommend_with_reviews`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user_id: userId,
              interests: intData,
              read_books: readData,
              preferred_authors: prefData,
              liked_books: likeData,
              pageNumber: pageNum,
              pageSize,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
        }

        const threadsData: ApiResponse = await response.json();
        console.log(
          "Fetched data for page",
          pageNum,
          ":",
          threadsData,
          "\nisNext:",
          threadsData.isNext,
          "\ntotalRecommendations:",
          threadsData.totalRecommendations,
          "\nrecommended count:",
          threadsData.recommended.length,
          "\nrecommended items:",
          threadsData.recommended
        );

        if (!threadsData.recommended.length) {
          console.warn("No recommendations returned for page:", pageNum);
          setHasMore(false); // Stop if no data
          setLoading(false);
          return;
        }

        const flatPosts: Post[] = threadsData.recommended.flatMap((item) => {
          if (item.type === "review") {
            return (
              item.threads?.map((thread): Post => ({
                type: "review",
                _id: thread._id,
                book_id: item.book_id,
                thread,
              })) || []
            );
          } else if (item.type === "sampled") {
            return (
              item.sampled_reviews?.map((review): Post => ({
                type: "sampled",
                _id: review._id,
                book_id: item.book_id,
                user_id: review.user_id,
                rating: review.rating,
                review_text: review.review_text,
                n_votes: review.n_votes,
                n_comments: review.n_comments,
              })) || []
            );
          } else {
            return [
              {
                type: "fallback",
                _id: item._id!,
                book_id: item.book_id,
                title: item.title,
                authors: item.authors,
                description: item.description,
                image_url: item.image_url,
                genres: item.genres,
              } as Post,
            ];
          }
        });

        console.log("Flat posts for page", pageNum, ":", flatPosts, "Count:", flatPosts.length);

        setPosts((prev) => {
          const newPosts = append ? [...prev, ...flatPosts] : flatPosts;
          console.log("All posts:", newPosts, "Total count:", newPosts.length);
          const ids = newPosts.map(post => post._id);
          const uniqueIds = new Set(ids);
          if (ids.length !== uniqueIds.size) {
            console.warn("Duplicate _id detected:", ids);
          }
          return newPosts;
        });
        setHasMore(threadsData.isNext);
      } catch (err) {
        setError("Failed to load recommendations. Please try again.");
        console.error("Fetch error for page", pageNum, ":", err);
      } finally {
        setLoading(false);
      }
    },
    [userId]
  );

  useEffect(() => {
    const initialize = async () => {
      if (!isLoaded) {
        return;
      }

      if (!userId) {
        router.push("/sign-in");
        setLoading(false);
        return;
      }

      try {
        console.log("Checking onboard status for userId:", userId);
        const onboardResponse = await fetch(
          "http://127.0.0.1:5000/users/onboardStatus",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId }),
          }
        );

        if (!onboardResponse.ok) {
          throw new Error(
            `Onboard status check failed: ${onboardResponse.status}`
          );
        }

        const onboardData = await onboardResponse.json();
        if (!onboardData.onboarded) {
          console.log("User not onboarded, redirecting to onboarding");
          router.push("/onboarding");
          setLoading(false);
          return;
        }

        console.log("User onboarded, fetching recommended books...");


        await fetchRecommendations(1);
      } catch (error) {
        console.error("ERROR CHECKING ONBOARD STATUS:", error);
        if (
          error instanceof Error &&
          (error.message.includes("401") || error.message.includes("403"))
        ) {
          router.push("/sign-in");
        } else {
          router.push("/onboarding");
        }
        setLoading(false);
      }
    };

    initialize();
  }, [isLoaded, fetchRecommendations]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    console.log("Triggering loadMore for page:", nextPage, "hasMore:", hasMore);
    fetchRecommendations(nextPage, true);
  };

  if (loading && page === 1) {
    return (
      <div className="flex flex-col gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  return (
    <section
      id="recommendations-section"
      className="mt-9 flex flex-col gap-2"
    >
      {error && (
        <div className="text-center">
          <p className="text-red-500">{error}</p>
          <Button onClick={() => fetchRecommendations(1)} className="mt-2">
            Retry
          </Button>
        </div>
      )}

      {posts.length === 0 && !error ? (
        <p className="no-result text-center">No recommendations found</p>
      ) : (
        <InfiniteScroll
          scrollableTarget="main-scroll-container"
          dataLength={posts.length}
          next={loadMore}
          hasMore={hasMore}
          loader={
            <div className="flex flex-col gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          }
          endMessage={
            <p className="text-center mt-4 text-muted-foreground">
              No more recommendations to show
            </p>
          }
        >
          {posts.map((post) => {
            switch (post.type) {
              case "review":
                return (
                  post.thread && (
                    <motion.div
                      key={post._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <ThreadCard
                        key={post._id}
                        currentUserId={userId}
                        {...post.thread}
                        book_id={post.book_id}
                      />
                    </motion.div>
                  )
                );
              case "sampled":
                return (
                  <SampleReviewCard
                    key={post._id}
                    review_id={post._id}
                    user_id={post.user_id!}
                    book_id={post.book_id}
                    rating={post.rating!}
                    review_text={post.review_text!}
                    n_votes={post.n_votes!}
                    n_comments={post.n_comments!}
                    currentUserId={userId}
                  />
                );
              case "fallback":
                return (
                  <BookMetadataCard
                    key={post._id}
                    id={post._id}
                    book_id={post.book_id}
                    title={post.title!}
                    authors={post.authors!}
                    description={post.description!

                    }
                    currentUserId={userId}
                  />
                );
              default:
                return null;
            }
          })}
        </InfiniteScroll>
      )}
    </section>

  );
}
