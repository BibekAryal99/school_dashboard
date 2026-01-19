"use client";

import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

interface RatingProps {
  rate: number;   
  count?: number; 
}

export default function Rating({ rate, count }: RatingProps) {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (rate >= i) {
      stars.push(<FaStar key={i} className="text-yellow-400 w-5 h-5 inline" />);
    } else if (rate >= i - 0.5) {
      stars.push(<FaStarHalfAlt key={i} className="text-yellow-400 w-5 h-5 inline" />);
    } else {
      stars.push(<FaRegStar key={i} className="text-gray-300 w-5 h-5 inline" />);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex">{stars}</div>
      {count !== undefined && (
        <span className="text-gray-500 text-sm">({count})</span>
      )}
    </div>
  );
}
