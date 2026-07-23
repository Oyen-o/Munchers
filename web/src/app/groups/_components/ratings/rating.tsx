export default function RatingStars({ rating }: { rating: number }) {
  const stars = Array.from({ length: 5 }, (_, index) => {
    const starValue = index + 1;
    return (
      <span  key={index} style={{ color: starValue <= rating ? '#FFD700' : '#C0C0C0', fontSize: '24px' }}>
        ★
      </span>
    );
  });
  return <div>{stars}</div>;
}