"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Clock, BookOpen } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export interface Book {
  _id: string;
  book_id: number;
  title: string;
  authors_names: string[];
  image_url: string;
  average_rating: number;
  publication_year: number;
  genres: string[] | string;
  userId: string;
}

const Rent = () => {
  const router = useRouter();
  const params = useParams();
  const { id, user_id } = params as { id: string; user_id: string };

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<boolean>(true); // only 1 option for now

  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://127.0.0.1:5000/books/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch book");
        setBook(data);
      } catch (err: any) {
        console.error("Error fetching book:", err);
        setError(err.message);
        toast.error("Failed to load book");
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const handleRent = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:5000/users/${user_id}/rent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId: parseInt(id) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to rent book");
      toast.success("Book rented successfully!");
      router.push("/");
    } catch (err: any) {
      console.error("Error renting book:", err);
      toast.error(err.message);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error || !book) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error || "Book not found"}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 container max-w-4xl px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">Rent This Book</h1>

        <div className="grid md:grid-cols-[1fr_2fr] gap-6">
          {/* Book Info */}
          <Card>
            <CardContent className="p-6">
              <div className="bg-muted rounded-lg flex items-center justify-center h-60 mb-4">
                {book.image_url ? (
                  <img src={book.image_url} alt={book.title} className="h-full object-contain" />
                ) : (
                  <BookOpen className="h-20 w-20 text-muted-foreground/50" />
                )}
              </div>

              <h2 className="text-xl font-bold">{book.title}</h2>
              <p className="text-muted-foreground">{book.authors_names.join(", ")}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {(Array.isArray(book.genres) ? book.genres : [book.genres]).map((genre) => (
                  <span key={genre} className="rounded-full bg-secondary px-3 py-1 text-xs">
                    {genre}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Rent Option */}
          <div className="space-y-6">
            <div className="bg-secondary/30 p-4 rounded-lg text-sm">
              <p>
                Rent "{book.title}" for 30 days. Read anytime, anywhere on your favorite device.
              </p>
            </div>

            <Card
              className={`transition-all cursor-pointer ${
                selectedOption ? "border-primary ring-1 ring-primary" : ""
              }`}
              onClick={() => setSelectedOption(true)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5" />
                    <div>
                      <h3 className="font-medium">30-Day Rental</h3>
                      <p className="text-sm text-muted-foreground">
                        Limited-time access to this book
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-lg">$30.00</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              className="w-full mt-4"
              size="lg"
              disabled={!selectedOption}
              onClick={handleRent}
            >
              <Clock className="mr-2 h-4 w-4" />
              Rent for $30
            </Button>

            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
              <p>• 30-day digital access</p>
              <p>• Read on any device</p>
              <p>• Easy cancellation anytime</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Rent;
