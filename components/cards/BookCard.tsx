
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Star, Calendar, Tag } from "lucide-react";
import Link from "next/link";

interface ReusableBookCardProps {
  book: {
    _id: string;
    book_id: number;
    title: string;
    authors_names: string[];
    image_url: string;
    average_rating: number;
    publication_year: number;
    genres: string[];
  };
  show?: boolean;
  userId?: string | null | undefined;
}

export default function ReusableBookCard({ book, show, userId }: ReusableBookCardProps) {
  const genreDisplay = book.genres.length
    ? book.genres
    : "No genres available";

  // Create rating stars
  const ratingStars = () => {
    const rating = book.average_rating;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`h-4 w-4 ${
              i < fullStars 
                ? "text-yellow-400 fill-yellow-400" 
                : i === fullStars && hasHalfStar 
                  ? "text-yellow-400 fill-yellow-400/50" 
                  : "text-gray-300"
            }`} 
          />
        ))}
        <span className="ml-1.5 text-sm font-medium">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <Card className="h-[450px] flex flex-col justify-between overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-transform duration-300 hover:-translate-y-1 border border-gray-100 group bg-white">
      {/* Image Section with overlay */}
      <div className="relative h-64 w-full overflow-hidden">
        <img
          src={book.image_url || "/placeholder.svg"}
          alt={book.title}
          className="h-full w-full object-cover transition-transform duration-700 scale-100 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        
        {/* Rating badge positioned on image */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center shadow-sm">
          <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500 mr-1" />
          <span className="text-xs font-semibold text-gray-800">
            {book.average_rating.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <CardContent className="p-5 flex-1 flex flex-col space-y-2">
        <h3 className="font-bold text-lg line-clamp-2 text-gray-800 group-hover:text-blue-600 transition-colors duration-200">
          {book.title}
        </h3>
        
        <p className="text-sm text-gray-600 font-medium line-clamp-1">
          {book.authors_names.join(", ")}
        </p>
        
        <div className="flex items-center gap-3 text-xs text-gray-500 mt-auto">
          <div className="flex items-center">
            <Calendar className="h-3.5 w-3.5 mr-1 text-gray-400" />
            <span>{book.publication_year}</span>
          </div>
          <div className="flex items-center">
            <Tag className="h-3.5 w-3.5 mr-1 text-gray-400" />
            <span className="line-clamp-1 max-w-[150px]">{genreDisplay}</span>
          </div>
        </div>
      </CardContent>

      {/* Footer Actions with improved styling */}
      <CardFooter className="p-5 pt-0 ">
        {show ? (
          <div className="w-full grid grid-cols-2 gap-2">
            <Link href={`/rentals/${book.book_id}/${userId}`} className="col-span-1" passHref>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full font-medium hover:bg-blue-50 transition-colors"
              >
                Rent
              </Button>
            </Link>
            <Link href={`/purchases/${book.book_id}/${userId}`} className="col-span-1" passHref>
              <Button 
                variant="default" 
                size="sm" 
                className="w-full font-medium bg-blue-600 hover:bg-blue-700"
              >
                Buy
              </Button>
            </Link>
            <Link href={`/details/${book.book_id}`} className="col-span-2 mt-1" passHref>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full text-gray-600 hover:text-blue-600 hover:bg-blue-50/50"
              >
                View Details
              </Button>
            </Link>
          </div>
        ) : (
          <Button 
            asChild 
            variant="outline" 
            className="w-full bg-white hover:bg-blue-50 border-blue-200 text-blue-700 hover:text-blue-800 font-medium transition-all"
          >
            <Link href={`/details/${book.book_id}`} aria-label={`View details of ${book.title}`}>
              <BookOpen className="h-4 w-4 mr-2" />
              View Details
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
