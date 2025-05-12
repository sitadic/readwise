"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import ReusableBookCard from "@/components/cards/BookCard";
import { Button } from "@/components/ui/button";
import { Clock, ShoppingCart, BookText, BookOpen } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

export interface Book {
  _id: string;
  book_id: number;
  title: string;
  authors_names: string[];
  image_url: string;
  average_rating: number;
  publication_year: number;
  genres: string;
}

const Discover = () => {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [rentals, setRentals] = useState<number[]>([]);
  const [purchases, setPurchases] = useState<number[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(12);
  const [isNext, setIsNext] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<{
    interests: string[];
    read_books: number[];
    preferred_authors: string[];
    liked_books: number[];
  } | null>(null);

  // Fetch preferences and initial recommendations
  useEffect(() => {
    if (!isLoaded || !userId) return;

    const fetchPreferencesAndRecommendations = async () => {
      setLoading(true);
      try {
        // Fetch preferences
        const prefRes = await fetch(`http://127.0.0.1:5000/users/${userId}/preferences`);
        const prefData = await prefRes.json();
        if (!prefRes.ok) throw new Error(prefData.error || "Failed to fetch preferences");
        setPreferences(prefData);

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

        // Fetch recommendations
        await fetchRecommendations(1, prefData);
      } catch (err: any) {
        console.error("Error initializing:", err);
        setError(err.message);
        toast.error("Failed to load recommendations");
        setLoading(false);
      }
    };

    fetchPreferencesAndRecommendations();
  }, [isLoaded, userId]);

  // Fetch recommendations for a specific page
  const fetchRecommendations = async (
    pageNumber: number,
    prefData: {
      interests: string[];
      read_books: number[];
      preferred_authors: string[];
      liked_books: number[];
    }
  ) => {
    if (!userId) return;
    setLoading(true);
    try {
      const recRes = await fetch("http://127.0.0.1:5000/diversify_recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          interests: prefData.interests,
          read_books: prefData.read_books,
          preferred_authors: prefData.preferred_authors,
          liked_books: prefData.liked_books,
          pageNumber,
          pageSize,
        }),
      });
      const recData = await recRes.json();
      if (!recRes.ok) throw new Error(recData.error || "Failed to fetch recommendations");

      // Handle empty recommendations
      if (recData.message === "No recommendations available") {
        setBooks([]);
        setIsNext(false);
        setLoading(false);
        return;
      }

      // Fetch book details
      const booksRes = await fetch("http://127.0.0.1:5000/books/multiple", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookIds: recData }),
      });
      const booksData = await booksRes.json();
      if (!booksRes.ok) throw new Error(booksData.error || "Failed to fetch books");

      // Append or replace books based on page
      setBooks((prev) => (pageNumber === 1 ? booksData : [...prev, ...booksData]));
      setIsNext(recData.length === pageSize); // Approximate isNext
      setPage(pageNumber);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching recommendations:", err);
      setError(err.message);
      toast.error("Failed to load recommendations");
    } finally {
      setLoading(false);
    }
  };

  // Handle Load More
  const handleLoadMore = () => {
    if (preferences && isNext) {
      fetchRecommendations(page + 1, preferences);
    }
  };

  // Handle Rent
  const handleRent = async (bookId: number) => {
    if (!userId) return;
    try {
      const res = await fetch(`http://127.0.0.1:5000/users/${userId}/rent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to rent book");
      setRentals([...rentals, bookId]);
      toast.success("Book rented successfully!");
    } catch (err: any) {
      console.error("Error renting book:", err);
      toast.error(err.message);
    }
  };

  // Handle Purchase
  const handlePurchase = async (bookId: number) => {
    if (!userId) return;
    try {
      const res = await fetch(`http://127.0.0.1:5000/users/${userId}/purchase`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to purchase book");
      setPurchases([...purchases, bookId]);
      toast.success("Book purchased successfully!");
    } catch (err: any) {
      console.error("Error purchasing book:", err);
      toast.error(err.message);
    }
  };

  // Check authentication
  if (!isLoaded) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!userId) {
    router.push("/sign-in");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 container max-w-5xl px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">Discover Books</h1>
        {error && (
          <div className="p-3 rounded bg-red-100 text-red-800 mb-6">
            {error}
          </div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {loading && books.length === 0 ? (
            <div className="col-span-full text-center py-12">Loading...</div>
          ) : books.length > 0 ? (
            books.map((book) => {
              const isRented = rentals.includes(book.book_id);
              const isPurchased = purchases.includes(book.book_id);
              return (
                <div key={book._id} className="relative">
                  <Link href={`/details/${book.book_id}`}>
                    <ReusableBookCard book={book} userId={userId} />
                  </Link>
                  
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No recommendations available</h3>
              <p className="text-muted-foreground mt-1">
                Rent or purchase books to get personalized recommendations.
              </p>
            </div>
          )}
        </div>
        {isNext && books.length > 0 && (
          <div className="mt-6 text-center">
            <Button
              onClick={handleLoadMore}
              disabled={loading}
              className="flex gap-2"
            >
              {loading ? "Loading..." : "Load More"}
            </Button>
          </div>
        )}
      </main>
      <div className="h-16 md:h-0"></div>
    </div>
  );
};

export default Discover;