"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import ReusableBookCard from "@/components/cards/BookCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Search, BookOpen, X, RefreshCw, Clock, ShoppingCart, BookText } from "lucide-react";
import toast from "react-hot-toast";
import { debounce } from "lodash";
import Link from "next/link";
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
}

const SearchPage = () => {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [rentals, setRentals] = useState<number[]>([]);
  const [purchases, setPurchases] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [genres, setGenres] = useState("");
  const [yearMin, setYearMin] = useState("");
  const [yearMax, setYearMax] = useState("");
  const [sort, setSort] = useState("relevance");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const pageSize = 12;

  // Check authentication
  useEffect(() => {
    if (!isLoaded) return;
    if (!userId) {
      router.push("/sign-in");
    }
    setIsAuthLoading(false);
  }, [isLoaded, userId, router]);

  // Fetch rentals and purchases
  useEffect(() => {
    if (!userId) return;
    const fetchUserData = async () => {
      try {
        const rentalsRes = await fetch(`http://127.0.0.1:5000/users/${userId}/rentals`);
        const rentalsData = await rentalsRes.json();
        if (!rentalsRes.ok) throw new Error(rentalsData.error || "Failed to fetch rentals");
        setRentals(rentalsData.map((r: Book) => r.book_id));

        const purchasesRes = await fetch(`http://127.0.0.1:5000/users/${userId}/purchases`);
        const purchasesData = await purchasesRes.json();
        if (!purchasesRes.ok) throw new Error(purchasesData.error || "Failed to fetch purchases");
        setPurchases(purchasesData.map((p: Book) => p.book_id));
      } catch (err: any) {
        console.error("Error fetching user data:", err);
        toast.error("Failed to load user data");
      }
    };
    fetchUserData();
  }, [userId]);

  // Debounced fetch for books
  const fetchBooks = async (pageNum: number, reset: boolean = false) => {
    if (!search.trim() || search.length < 3) {
      if (reset) {
        setBooks([]);
        setTotal(0);
        setError(null);
      }
      return;
    }
    setLoading(true);
    try {
      const params = new URLSearchParams({
        q: search,
        page: pageNum.toString(),
        limit: pageSize.toString(),
        ...(genres && { genres }),
        ...(yearMin && { year_min: yearMin }),
        ...(yearMax && { year_max: yearMax }),
        ...(sort !== "relevance" && { sort }),
      });
      const res = await fetch(`http://127.0.0.1:5000/books/search?${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch books");
      setBooks((prev) => (reset || pageNum === 1 ? data.books || [] : [...prev, ...data.books]));
      setTotal(data.total || 0);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching books:", err);
      setError(err.message);
      toast.error("Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetch = debounce((query: string) => {
    fetchBooks(1, true);
  }, 300);

  useEffect(() => {
    debouncedFetch(search);
    return () => {
      debouncedFetch.cancel();
    };
  }, [search, genres, yearMin, yearMax, sort]);

  const handleLoadMore = () => {
    if (page * pageSize < total) {
      setPage((prev) => prev + 1);
      fetchBooks(page + 1);
    }
  };

  const handleClearSearch = () => {
    setSearch("");
    setGenres("");
    setYearMin("");
    setYearMax("");
    setSort("relevance");
    setBooks([]);
    setTotal(0);
    setPage(1);
    setError(null);
  };

  const handleRetry = () => {
    setError(null);
    fetchBooks(page, true);
  };

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

  if (isAuthLoading) {
    return (<div className="flex flex-col gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>)
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 container max-w-5xl px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">Search Books</h1>
        <div className="mb-6 space-y-4">
          <div className="flex gap-4 items-center">
            <Input
              placeholder="Search by title or author..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-md"
            />
            {search && (
              <Button variant="ghost" size="icon" onClick={handleClearSearch}>
                <X className="h-4 w-4" />
              </Button>
            )}
            <Button variant="outline" size="icon" disabled={loading}>
              <Search className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="genres">Genres</Label>
              <Input
                id="genres"
                placeholder="e.g., history,fantasy"
                value={genres}
                onChange={(e) => setGenres(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="yearMin">Year (Min)</Label>
              <Input
                id="yearMin"
                type="number"
                placeholder="e.g., 1900"
                value={yearMin}
                onChange={(e) => setYearMin(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="yearMax">Year (Max)</Label>
              <Input
                id="yearMax"
                type="number"
                placeholder="e.g., 2023"
                value={yearMax}
                onChange={(e) => setYearMax(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="sort">Sort By</Label>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger id="sort">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="rating_desc">Rating (High to Low)</SelectItem>
                  <SelectItem value="title_asc">Title (A-Z)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        {error && (
          <div className="p-3 rounded bg-red-100 text-red-800 mb-6 flex justify-between items-center">
            <span>{error}. Try adjusting filters or retry.</span>
            <Button variant="ghost" size="sm" onClick={handleRetry}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {loading && books.length === 0 ? (
            <div className="flex flex-col gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : books.length > 0 ? (
            books.map((book) => {
              const isRented = rentals.includes(book.book_id);
              const isPurchased = purchases.includes(book.book_id);
              return (
                <div key={book._id} className="relative">
                  <Link href={`/books/${book.book_id}`}>
                    <ReusableBookCard book={book} show={true} userId={userId} />
                  </Link>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">
                {search ? "No books found" : "Start typing to search"}
              </h3>
              <p className="text-muted-foreground mt-1">
                {search ? "Try adjusting your search or filters." : "Search by title or author."}
              </p>
            </div>
          )}
        </div>
        {books.length > 0 && page * pageSize < total && (
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

export default SearchPage;