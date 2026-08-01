import { useState } from 'react';
import './rating.scss';

export default function RatingStars({
  rating,
  fontSize,
  onRatingChange,
}: {
  rating: number;
  fontSize?: number;
  onRatingChange?: (rating: number) => void;
}) {
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const size = fontSize ?? 24;

  const displayRating = hoveredStar !== null ? hoveredStar : rating;
  const imageRating = Math.min(5, Math.max(1, displayRating || 1));

  const handleStarClick = (starValue: number) => {
    if (onRatingChange) {
      onRatingChange(starValue);
    }
  };

  const stars = Array.from({ length: 5 }, (_, index) => {
    const starValue = index + 1;
    const isFilled = starValue <= displayRating;
    return (
      <img
        className="rating__star"
        key={index}
        src={isFilled ? '/icons/star-filled.png' : '/icons/star-blank.png'}
        alt={isFilled ? 'filled star' : 'empty star'}
        style={{ width: size, height: size }}
        onMouseEnter={() => setHoveredStar(starValue)}
        onMouseLeave={() => setHoveredStar(null)}
        onClick={(event) => {
          event.stopPropagation();
          handleStarClick(starValue);
        }}
      />
    );
  });
  return (
    <div
      className="rating__container"
      onClick={(event) => event.stopPropagation()}
    >
      <img
        className="rating__image"
        src={`/ratings/rating-${imageRating}.png`}
        alt={`Rating: ${displayRating}`}
      />
      <div className="rating__stars">{stars}</div>
    </div>
  );
}
