"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Rating } from "@/components/Rating";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { debounce } from "lodash";

const PostReview = () => {
    const { isLoaded, userId } = useAuth();
    const router = useRouter();

    // State variables
    const [loading, setLoading] = useState(true);
    const [selectedBook, setSelectedBook] = useState<any>(null);
    const [bookSearch, setBookSearch] = useState("");
    const [bookResults, setBookResults] = useState<any[]>([]);
    const [showBookDropdown, setShowBookDropdown] = useState(false);
    const [rating, setRating] = useState(0);
    const [content, setContent] = useState("");
    const [error, setError] = useState<string | null>(null);

    // Fetch books from the API
    const fetchBooks = async (query: string) => {
        try {
            const res = await fetch(`http://127.0.0.1:5000/books/search?q=${encodeURIComponent(query)}&page=1&limit=10`);
            if (res.ok) {
                const data = await res.json();
                setBookResults(data.books);
            } else {
                console.error("Failed to fetch books");
                setError("Failed to fetch books");
            }
        } catch (error) {
            console.error("Error fetching books:", error);
            setError("Error fetching books");
        }
    };

    // Debounced fetch to reduce API calls
    const debouncedFetch = debounce((query: string) => {
        if (query.trim().length >= 3) {
            fetchBooks(query);
        } else {
            setBookResults([]);
        }
    }, 300);

    useEffect(() => {
        if (bookSearch) {
            debouncedFetch(bookSearch);
        }
        return () => {
            debouncedFetch.cancel();
        };
    }, [bookSearch]);

    // Check if user is authenticated
    useEffect(() => {
        const initialize = async () => {
            if (!isLoaded) return;
            if (!userId) {
                router.push("/sign-in");
                setLoading(false);
                return;
            }
            setLoading(false);
        };
        initialize();
    }, [isLoaded, userId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    // Select book from dropdown
    const handleSelectBook = (book: any) => {
        setSelectedBook(book);
        setShowBookDropdown(false);
        setBookSearch(book.title);
    };

    // Submit review
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedBook) {
            setError("Please select a book for your review.");
            return;
        }
        if (rating === 0) {
            setError("Please rate the book.");
            return;
        }
        if (!content.trim()) {
            setError("Please write a review.");
            return;
        }

        const reviewData = {
            book_id: selectedBook.book_id,
            text: content,
            author: userId,
            rating,
        };

        try {
            const res = await fetch("http://127.0.0.1:5000/threads", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(reviewData),
            });

            if (res.ok) {
                const data = await res.json();
                console.log("Review submitted:", data);

                // Reset form
                setSelectedBook(null);
                setBookSearch("");
                setRating(0);
                setContent("");
                setError(null);
            } else {
                console.error("Submission error:", res.statusText);
                setError("There was a problem posting your review. Please try again later.");
            }
        } catch (error) {
            console.error("Submission error:", error);
            setError("There was a problem posting your review. Please try again later.");
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-1 container max-w-2xl px-4 py-6">
                <div className="space-y-6">
                    <h1 className="text-3xl font-bold">Post a Review</h1>

                    {error && (
                        <div className="p-3 rounded bg-red-100 text-red-800">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Book Search */}
                        <div className="space-y-2">
                            <Label htmlFor="book">Select a Book</Label>
                            <div className="relative">
                                <input
                                    id="book"
                                    type="text"
                                    value={bookSearch}
                                    onChange={(e) => {
                                        setBookSearch(e.target.value);
                                        setShowBookDropdown(true);
                                    }}
                                    placeholder="Search books..."
                                    className="w-full border border-input bg-background px-3 py-2 text-sm rounded-md"
                                />
                                {showBookDropdown && bookResults.length > 0 && (
                                    <div className="absolute z-10 w-full mt-1 bg-popover shadow-md rounded-md border overflow-auto max-h-60 bg-white dark:bg-gray-800">
                                        {bookResults.map((book) => (
                                            <button
                                                type="button"
                                                key={book.book_id}
                                                onClick={() => handleSelectBook(book)}
                                                className="w-full text-left p-2 hover:bg-accent flex items-start gap-3"
                                            >
                                                <img
                                                    src={book.image_url} // adjust this if your image URL field is named differently
                                                    alt={book.title}
                                                    className="w-12 h-16 object-cover rounded"
                                                />
                                                <div className="flex flex-col">
                                                    <p className="font-medium">{book.title}</p>
                                                    <p className="text-sm text-muted-foreground">{book.authors_names}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Rating */}
                        <div className="space-y-2">
                            <Label>Your Rating</Label>
                            <Rating
                                value={rating}
                                size="lg"
                                showValue={false}
                                interactive={true}
                                onChange={setRating}
                                className="justify-start"
                            />
                        </div>

                        {/* Review Content */}
                        <div className="space-y-2">
                            <Label htmlFor="review">Your Review</Label>
                            <textarea
                                id="review"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Share your thoughts about this book..."
                                className="w-full min-h-[150px] border border-input bg-transparent px-3 py-2 text-sm rounded-md"
                            />
                        </div>

                        <Button type="submit" className="w-full">
                            Post Review
                        </Button>
                    </form>
                </div>
            </main>

            <div className="h-16 md:h-0"></div>
        </div>
    );
};

export default PostReview;
