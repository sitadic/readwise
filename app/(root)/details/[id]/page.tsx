"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import ThreadCard from "@/components/cards/ThreadCards";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, ShoppingCart, BookOpen, BookText } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import ReactNiceAvatar from "react-nice-avatar";
import SkeletonCard from "@/components/shared/SkeletonCard";

export interface Book {
  _id: string;
  book_id: number;
  title: string;
  authors_names: string[];
  image_url: string;
  average_rating: number;
  publication_year: number;
  genres: string;
  description: string;
}

export interface Review {
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
  children?: Review[];
  likes?: number;
  currentUserId: string | null | undefined;
}

const BookDetails = ({ params }: { params: { id: string } }) => {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();
  const bookId = params.id;
  const [book, setBook] = useState<Book | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rentals, setRentals] = useState<number[]>([]);
  const [purchases, setPurchases] = useState<number[]>([]);
  const [isBookLoading, setIsBookLoading] = useState(true);
  const [isReviewsLoading, setIsReviewsLoading] = useState(true);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [bookError, setBookError] = useState<string | null>(null);
  const [reviewsError, setReviewsError] = useState<string | null>(null);

  // Check authentication
  useEffect(() => {
    if (!isLoaded) return;
    if (!userId) {
      router.push("/sign-in");
    }
    setIsAuthLoading(false);
  }, [isLoaded, userId, router]);

  // Fetch book details
  useEffect(() => {
    const fetchBook = async () => {
      setIsBookLoading(true);
      try {
        const res = await fetch(`http://127.0.0.1:5000/books/${bookId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch book");
        setBook(data);
      } catch (err: any) {
        console.error("Error fetching book:", err);
        setBookError(err.message);
        toast.error("Failed to load book details");
      } finally {
        setIsBookLoading(false);
      }
    };
    fetchBook();
  }, [bookId]);

  // Fetch reviews and user rentals/purchases
  useEffect(() => {
    if (!userId) return;
    const fetchData = async () => {
      setIsReviewsLoading(true);
      try {
        // Fetch reviews
        const reviewsRes = await fetch(`http://127.0.0.1:5000/threads?book_id=${bookId}`);
        const reviewsData = await reviewsRes.json();
        console.log("Book Reviews Data:", reviewsData); // Debug log
        if (!reviewsRes.ok) throw new Error(reviewsData.error || "Failed to fetch reviews");
        if (!Array.isArray(reviewsData)) throw new Error("Invalid reviews data format");
        setReviews(reviewsData);

        // Fetch rentals
        const rentalsRes = await fetch(`http://127.0.0.1:5000/users/${userId}/rentals`);
        const rentalsData = await rentalsRes.json();
        if (!rentalsRes.ok) throw new Error(rentalsData.error || "Failed to fetch rentals");
        setRentals(rentalsData.map((r: Book) => r.book_id));

        // Fetch purchases
        const purchasesRes = await fetch(`http://127.0.0.1:5000/users/${userId}/purchases`);
        const purchasesData = await purchasesRes.json();
        if (!purchasesRes.ok) throw new Error(purchasesData.error || "Failed to fetch purchases");
        setPurchases(purchasesData.map((p: Book) => p.book_id));
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setReviewsError(err.message);
        toast.error("Failed to load reviews or user data");
      } finally {
        setIsReviewsLoading(false);
      }
    };
    fetchData();
  }, [bookId, userId]);

  const handleRent = async () => {
    if (!book || !userId) return;
    try {
      const res = await fetch(`http://127.0.0.1:5000/users/${userId}/rent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId: book.book_id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to rent book");
      setRentals([...rentals, book.book_id]);
      toast.success("Book rented successfully!");
    } catch (err: any) {
      console.error("Error renting book:", err);
      toast.error(err.message);
    }
  };

  const handlePurchase = async () => {
    if (!book || !userId) return;
    try {
      const res = await fetch(`http://127.0.0.1:5000/users/${userId}/purchase`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId: book.book_id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to purchase book");
      setPurchases([...purchases, book.book_id]);
      toast.success("Book purchased successfully!");
    } catch (err: any) {
      console.error("Error purchasing book:", err);
      toast.error(err.message);
    }
  };

  if (isAuthLoading || isBookLoading) {
    return (<div className="flex flex-col gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>)
  }

  if (bookError || !book) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {bookError || "Book not found"}
      </div>
    );
  }

  const isRented = rentals.includes(book.book_id);
  const isPurchased = purchases.includes(book.book_id);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 container max-w-5xl px-4 py-6">
        <div className="space-y-8">
          {/* Book Header */}
          <div className="flex flex-col md:flex-row gap-6">
            <img
              src={book.image_url}
              alt={book.title}
              className="w-48 h-72 object-cover rounded-md shadow-lg"
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{book.title}</h1>
              <p className="text-muted-foreground mt-1">
                by {book.authors_names.join(", ")}
              </p>
              <p className="mt-2 text-sm">
                <span className="font-medium">Rating:</span> {book.average_rating.toFixed(1)} / 5
              </p>
              <p className="mt-1 text-sm">
                <span className="font-medium">Published:</span> {book.publication_year}
              </p>
              <p className="mt-1 text-sm">
                <span className="font-medium">Genres:</span> {book.genres}
              </p>
              <div className="mt-4 flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleRent}
                  disabled={isRented || isPurchased}
                  className="flex gap-2"
                >
                  <Clock className="h-4 w-4" />
                  {isRented ? "Already Rented" : isPurchased ? "Purchased" : "Rent"}
                </Button>
                <Button
                  variant="default"
                  onClick={handlePurchase}
                  disabled={isPurchased}
                  className="flex gap-2"
                >
                  <ShoppingCart className="h-4 w-4" />
                  {isPurchased ? "Already Purchased" : "Buy"}
                </Button>
              </div>
            </div>
          </div>

          {/* Description */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-muted-foreground">
                {book.description || "No description available."}
              </p>
            </CardContent>
          </Card>

          {/* Reviews */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Reviews</h2>
              {isReviewsLoading ? (
                <div className="text-center py-4">Loading reviews...</div>
              ) : reviewsError ? (
                <div className="text-center py-4 text-red-500">{reviewsError}</div>
              ) : reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <ThreadCard
                      key={review._id}
                      _id={review._id}
                      text={review.text}
                      author={review.author}
                      createdAt={review.createdAt}
                      children={review.children}
                      book_id={review.book_id}
                      rating={review.rating}
                      currentUserId={userId || ""}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <BookOpen className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No reviews yet</h3>
                  <p className="text-muted-foreground mt-1">
                    Be the first to share your thoughts!
                  </p>
                  <Link href="/create-thread">
                    <Button className="mt-4">Write a Review</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <div className="h-16 md:h-0"></div>
    </div>
  );
};

export default BookDetails;