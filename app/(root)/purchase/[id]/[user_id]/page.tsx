"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Clock, BookOpen, CreditCard, Download, BookText, Library } from "lucide-react";
import toast from "react-hot-toast";
import ReusableBookCard from "@/components/cards/BookCard";
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

const Purchase = () => {
  const router = useRouter();
  const params = useParams();
  const { id, user_id } = params as { id: string; user_id: string };

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);

  const purchaseFormats = [
    {
      id: "ebook",
      name: "eBook",
      description: "Digital version for all devices",
      price: 9.99,
      icon: <Download className="h-5 w-5" />,
    },
    {
      id: "audiobook",
      name: "Audiobook",
      description: "Professional narration",
      price: 14.99,
      icon: <BookText className="h-5 w-5" />,
    },
    {
      id: "paperback",
      name: "Paperback",
      description: "Physical book delivered to your door",
      price: 19.99,
      icon: <Library className="h-5 w-5" />,
    },
  ];

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

  const handlePurchase = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:5000/users/${user_id}/purchase`, {
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
        <h1 className="text-3xl font-bold mb-6">Purchase This Book</h1>

        <div className="grid md:grid-cols-[1fr_2fr] gap-6">
          {/* Book Info */}
          <div>
            <ReusableBookCard book={book} />
          </div>

          {/* Purchase Options */}
          <div className="space-y-6">
            <div className="bg-secondary/30 p-4 rounded-lg text-sm">
              <p>
                Choose your preferred format of "{book.title}" and enjoy reading forever.
                All purchases include lifetime access to your content.
              </p>
            </div>

            <div className="space-y-4">
              {purchaseFormats.map((format) => (
                <Card
                  key={format.id}
                  className={`transition-all cursor-pointer ${
                    selectedFormat === format.id ? "border-primary ring-1 ring-primary" : ""
                  }`}
                  onClick={() => setSelectedFormat(format.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {format.icon}
                        <div>
                          <h3 className="font-medium">{format.name}</h3>
                          <p className="text-sm text-muted-foreground">{format.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-lg">${format.price.toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button
              className="w-full mt-4"
              size="lg"
              disabled={!selectedFormat}
              onClick={handlePurchase}
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Complete Purchase
            </Button>

            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
              <p>• Lifetime access to your purchase</p>
              <p>• Read on all your devices</p>
              <p>• 30-day satisfaction guarantee</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Purchase;
