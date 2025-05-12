"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ThreadCard from "@/components/cards/ThreadCards";
import ReusableBookCard from "@/components/cards/BookCard";
import { Button } from "@/components/ui/button";
import { BookOpen, Settings, BookText, Clock, ShoppingCart, Heart } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import ReactNiceAvatar from "react-nice-avatar";
import toast from "react-hot-toast";
import BookMetadataCard from "@/components/cards/BookMetadataCard";
import SampleReviewCard from "@/components/cards/SampleReviewCard";
import Link from "next/link";
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
  likes?: number; // Added to track like count from backend
  currentUserId: string | null | undefined; // Added for current user's ID
}

type Post = {
  id: string;
  type: "thread" | "review" | "book";

  // Thread fields (only for type: "thread")
  author?: string;
  text?: string;
  n_votes?: number;
  children?: string[];
  createdAt?: string;
  book_id?: string;

  // Review fields (only for type: "review")
  user_id?: string;
  rating?: number;
  review_text?: string;
  n_comments?: number;

  // Book fields (only for type: "book")
  title?: string;
  authors?: string[];
  description?: string;
};

export interface Book {
  _id: string;
  book_id: number;
  title: string;
  authors_names: string[];
  image_url: string;
  average_rating: number;
  publication_year: number;
  genres: string[];
}

interface ProfileData {
  userId: string;
  name: string;
  avatarConfig: React.ComponentProps<typeof ReactNiceAvatar>;
  followedAuthors: string[];
  interests: string[];
  liked_books: string[];
  liked_posts: string[];
  book_history: string[];
  onboarded: boolean;
}

const Profile = ({ params }: { params: { id: string } }) => {
  const userId = params.id;
  const [activeTab, setActiveTab] = useState("reviews");
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [likedReviews, setLikedReviews] = useState<Post[]>([]);
  const [readingList, setReadingList] = useState<Book[]>([]);
  const [rentals, setRentals] = useState<Book[]>([]);
  const [purchases, setPurchases] = useState<Book[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const profileRes = await fetch(`http://127.0.0.1:5000/users/profile/${userId}`);
        const profileData = await profileRes.json();
        if (!profileRes.ok) throw new Error(profileData.error);
        setProfile(profileData);
        setName(profileData.name);
        setBio(profileData.bio);

        const reviewsRes = await fetch(`http://127.0.0.1:5000/users/${userId}/threads`);
        const reviewsData = await reviewsRes.json();
        // console.log(reviewsData);
        if (!reviewsRes.ok) throw new Error(reviewsData.error);
        setUserReviews(reviewsData);

        const likedReviewsRes = await fetch(`http://127.0.0.1:5000/users/${userId}/liked-posts`);
        const likedReviewsData = await likedReviewsRes.json();
        // console.log(likedReviewsData);
        console.log("Liked Reviews:", likedReviewsData);
        // console.log("User ID:", userId);
        if (!likedReviewsRes.ok) throw new Error(likedReviewsData.error);
        setLikedReviews(likedReviewsData);

        const readingListRes = await fetch(`http://127.0.0.1:5000/users/${userId}/book-history`);
        const readingListData = await readingListRes.json();
        if (!readingListRes.ok) throw new Error(readingListData.error);
        setReadingList(readingListData);

        const rentalsRes = await fetch(`http://127.0.0.1:5000/users/${userId}/rentals`);
        const rentalsData = await rentalsRes.json();
        if (!rentalsRes.ok) throw new Error(rentalsData.error);
        setRentals(rentalsData);

        const purchasesRes = await fetch(`http://127.0.0.1:5000/users/${userId}/purchases`);
        const purchasesData = await purchasesRes.json();
        if (!purchasesRes.ok) throw new Error(purchasesData.error);
        setPurchases(purchasesData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!profile) {
    return <div className="min-h-screen flex items-center justify-center">Profile not found</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 container max-w-5xl px-4 py-6">
        <div className="mb-8">
          <div className="relative p-6 border-b">
            <div className="flex items-start gap-4">
              <ReactNiceAvatar className="w-24 h-24 border-4 border-background shadow-lg" {...profile.avatarConfig} />

              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-2xl font-bold">{profile.name}</h1>
                  </div>
                </div>

                <div className="flex flex-wrap gap-6 mt-4">
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-2 text-primary" />
                    <span className="font-bold">{profile.book_history.length}</span>
                    <span className="text-sm text-muted-foreground ml-1">Books Read</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Card className="mb-6 bg-accent/5 border-accent/10 mt-6">
            <CardContent className="p-4">
              <h3 className="text-lg font-medium flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2 text-primary" />
                <span>Hi there 👋</span>
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Looking for new reads? We have personally curated books just for you.
              </p>
              <div className="mt-3 flex gap-2">
                <Link href={"/"}>
                <Button size="sm" variant="outline" className="bg-background">Explore Recommendations</Button>
                </Link>
                <Link href={"/search"}>
                <Button size="sm" variant="outline" className="bg-background">How About You Search ? 😉</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6 rounded-md">
              <TabsTrigger value="reviews" className="rounded-md">
                <BookText className="h-4 w-4 mr-2" />
                Reviews
              </TabsTrigger>
              <TabsTrigger value="liked-reviews" className="rounded-md">
                <Heart className="h-4 w-4 mr-2" />
                Liked Reviews
              </TabsTrigger>
              <TabsTrigger value="reading-list" className="rounded-md">
                <BookOpen className="h-4 w-4 mr-2" />
                Reading List
              </TabsTrigger>
              <TabsTrigger value="rentals" className="rounded-md">
                <Clock className="h-4 w-4 mr-2" />
                Rentals & Purchases
              </TabsTrigger>
            </TabsList>

            <TabsContent value="reviews" className="mt-0 animate-fade-in">
              <div className="space-y-6">
                {userReviews.length > 0 ? (
                  userReviews.map((review) => (
                    <ThreadCard
                      key={review._id}
                      _id={review._id}
                      text={review.text}
                      author={review.author}
                      createdAt={review.createdAt}
                      children={review.children}
                      book_id={review.book_id}
                      rating={review.rating}
                      currentUserId={userId}

                    />
                  ))
                ) : (
                  <div className="text-center py-12 border rounded-lg bg-background">
                    <BookOpen className="h-12 w-12 mx-auto text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">No reviews yet</h3>
                    <p className="text-muted-foreground mt-1 max-w-md mx-auto">
                      Share your thoughts on books you've read to help others discover great reads.
                    </p>
                    <Link href="/create-thread" className="mt-4">
                      <Button className="mt-4">Write Your First Review</Button>
                    </Link>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="liked-reviews" className="mt-0 animate-fade-in">
              <div className="space-y-6">
                {likedReviews.length > 0 ? (
                  likedReviews.map((post) => {
                    switch (post.type) {
                      case "thread":
                        return (
                          <ThreadCard
                            key={post.id}
                            currentUserId={userId}
                            id={post.id}
                            author={post.author}
                            text={post.text}
                            n_votes={post.n_votes}
                            children={post.children}
                            createdAt={post.createdAt}
                            book_id={post.book_id}
                          />
                        );

                      case "review":
                        return (
                          <SampleReviewCard
                            key={post.id}
                            review_id={post.id}
                            user_id={post.user_id}
                            book_id={post.book_id}
                            rating={post.rating}
                            review_text={post.review_text}
                            n_votes={post.n_votes}
                            n_comments={post.n_comments}
                            currentUserId={userId}
                          />
                        );

                      case "book":
                        return (
                          <BookMetadataCard
                            key={post.id}
                            id={post.id}
                            book_id={post.book_id}
                            title={post.title}
                            authors={post.authors}
                            description={post.description}
                            currentUserId={userId}
                          />
                        );

                      default:
                        return null;
                    }
                  })
                ) : (
                  <div className="text-center py-12 border rounded-lg bg-background">
                    <Heart className="h-12 w-12 mx-auto text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">No liked reviews yet</h3>
                    <p className="text-muted-foreground mt-1 max-w-md mx-auto">
                      Like reviews to save them for later and show appreciation to other readers.
                    </p>
                    <Button className="mt-4">Explore Popular Reviews</Button>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="reading-list" className="mt-0 animate-fade-in">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {readingList.map((history) => (
                  <ReusableBookCard
                    key={history._id}
                    book={{
                      _id: history._id,
                      book_id: history.book_id,
                      title: history.title,
                      authors_names: history.authors_names, // Adjust based on API
                      image_url: history.image_url,
                      average_rating: history.average_rating, // Fetch from books_collection if needed
                      publication_year: history.publication_year, // Fetch from books_collection if needed
                      genres: history.genres // Fetch from books_collection if needed
                    }}
                  />
                ))}
              </div>

              <div className="mt-8 text-center">
                <Link href="/">
                <Button variant="outline" className="gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>Browse More Books</span>
                </Button>
                </Link>
              </div>
            </TabsContent>

            <TabsContent value="rentals" className="mt-0 animate-fade-in">
              <div className="space-y-6">
                <h3 className="text-lg font-medium border-b pb-2">Active Rentals</h3>
                {rentals.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {rentals.map(rental => (
                      <ReusableBookCard
                        key={rental._id}
                        book={{
                          _id: rental._id,
                          book_id: rental.book_id,
                          title: rental.title,
                          authors_names: rental.authors_names, // Adjust based on API
                          image_url: rental.image_url,
                          average_rating: rental.average_rating, // Fetch from books_collection if needed
                          publication_year: rental.publication_year, // Fetch from books_collection if needed
                          genres: rental.genres // Fetch from books_collection if needed
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 border rounded-lg">
                    <ShoppingCart className="h-10 w-10 mx-auto text-muted-foreground" />
                    <h3 className="mt-3 text-lg font-medium">No active rentals</h3>
                    <p className="text-muted-foreground mt-1">
                      Rent books at affordable prices and enjoy reading.
                    </p>
                    <Button className="mt-4" variant="default">
                      Browse Rental Collection
                    </Button>
                  </div>
                )}

                <h3 className="text-lg font-medium border-b pb-2 mt-8">Purchase History</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {purchases.map(purchase => (
                    <ReusableBookCard
                      key={purchase._id}
                      book={{
                        _id: purchase._id,
                        book_id: purchase.book_id,
                        title: purchase.title,
                        authors_names: purchase.authors_names, // Adjust based on API
                        image_url: purchase.image_url,
                        average_rating: purchase.average_rating, // Fetch from books_collection if needed
                        publication_year: purchase.publication_year, // Fetch from books_collection if needed
                        genres: purchase.genres // Fetch from books_collection if needed
                      }}
                    />
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <div className="h-16 md:h-0"></div>
    </div>
  );
};

export default Profile;