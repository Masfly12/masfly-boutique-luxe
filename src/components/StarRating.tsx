import { useState } from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  value: number;           // note actuelle
  onChange?: (v: number) => void; // si fourni → mode interactif
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
}

const SIZES = {
  sm: "h-3.5 w-3.5",
  md: "h-5 w-5",
  lg: "h-7 w-7",
};

export function StarRating({ value, onChange, size = "md", showValue = false }: StarRatingProps) {
  const [hovered, setHovered] = useState(0);
  const interactive = !!onChange;
  const display = interactive && hovered > 0 ? hovered : value;

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
          className={interactive ? "cursor-pointer transition-transform hover:scale-110" : "cursor-default"}
        >
          <Star
            className={`${SIZES[size]} transition-colors ${
              star <= display
                ? "fill-yellow-400 text-yellow-400"
                : "fill-transparent text-gray-300"
            }`}
          />
        </button>
      ))}
      {showValue && value > 0 && (
        <span className="ml-1.5 text-sm font-body font-semibold text-foreground">
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
}