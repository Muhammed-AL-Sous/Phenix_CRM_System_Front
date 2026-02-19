const StarIcon = ({ type = "full" }) => {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
        
      {type === "full" && (
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.963a1 1 0 00.95.69h4.173c.969 0 1.371 1.24.588 1.81l-3.376 2.453a1 1 0 00-.364 1.118l1.287 3.964c.3.92-.755 1.688-1.54 1.118l-3.376-2.453a1 1 0 00-1.176 0l-3.376 2.453c-.784.57-1.838-.197-1.539-1.118l1.287-3.964a1 1 0 00-.364-1.118L2.074 9.39c-.783-.57-.38-1.81.588-1.81h4.173a1 1 0 00.95-.69l1.286-3.963z" />
      )}

      {type === "empty" && (
        <path
          fillRule="evenodd"
          d="M10 15.27l5.18 3.03-1.64-5.81L18 8.24l-5.9-.51L10 2 7.9 7.73 2 8.24l4.46 4.25L4.82 18.3 10 15.27z"
          clipRule="evenodd"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      )}
    </svg>
  );
};

const HalfStarIcon = () => {
  return (
    <svg viewBox="0 0 20 20" className="w-5 h-5">
      <defs>
        <linearGradient id="halfGradient">
          <stop offset="50%" stopColor="currentColor" />
          <stop offset="50%" stopColor="transparent" />
        </linearGradient>
      </defs>

      <path
        fill="url(#halfGradient)"
        stroke="currentColor"
        strokeWidth="1"
        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.963a1 1 0 00.95.69h4.173c.969 0 1.371 1.24.588 1.81l-3.376 2.453a1 1 0 00-.364 1.118l1.287 3.964c.3.92-.755 1.688-1.54 1.118l-3.376-2.453a1 1 0 00-1.176 0l-3.376 2.453c-.784.57-1.838-.197-1.539-1.118l1.287-3.964a1 1 0 00-.364-1.118L2.074 9.39c-.783-.57-.38-1.81.588-1.81h4.173a1 1 0 00.95-.69l1.286-3.963z"
      />
    </svg>
  );
};

const RatingStars = ({ rating }) => {
  const totalStars = 5;

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = totalStars - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-1 text-yellow-400">
      {Array.from({ length: fullStars }).map((_, i) => (
        <StarIcon key={`full-${i}`} type="full" />
      ))}

      {hasHalfStar && <HalfStarIcon />}

      {Array.from({ length: emptyStars }).map((_, i) => (
        <StarIcon key={`empty-${i}`} type="empty" />
      ))}
    </div>
  );
};

export default RatingStars;
