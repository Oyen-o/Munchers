export default function RatingStars({ rating,fontSize }: { rating: number, fontSize?: number }) {
  const stars = Array.from({ length: 5 }, (_, index) => {
    const starValue = index + 1;
    return (
      <span  key={index} style={{ color: starValue <= rating ? '#FFD700' : '#C0C0C0', fontSize: fontSize ?? 24 }}>
        ★
      </span>
    );
  });
  return <div>{stars}</div>;
}