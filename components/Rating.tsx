
import { Star } from "lucide-react";

interface RatingProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  className?: string;
  interactive?: boolean;
  onChange?: (value: number) => void;
}

export function Rating({ 
  value, 
  max = 5, 
  size = "md", 
  showValue = true, 
  className = "",
  interactive = false,
  onChange
}: RatingProps) {
  const sizeClass = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const handleStarClick = (index: number) => {
    if (interactive && onChange) {
      onChange(index + 1);
    }
  };

  return (
    <div className={`flex items-center ${className}`}>
      {[...Array(max)].map((_, i) => (
        <Star
          key={i}
          className={`${sizeClass[size]} ${
            i < Math.floor(value) 
              ? "fill-yellow-400 text-yellow-400" 
              : i < value 
                ? "fill-yellow-400/50 text-yellow-400" 
                : "text-gray-300"
          } transition-colors ${interactive ? "cursor-pointer hover:scale-110" : ""}`}
          onClick={() => interactive && handleStarClick(i)}
        />
      ))}
      {showValue && (
        <span className="ml-1 text-sm font-medium">{value.toFixed(1)}</span>
      )}
    </div>
  );
}
