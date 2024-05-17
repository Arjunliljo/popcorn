import { useState } from "react";

const ratingContainerStyle = {
  display: "flex",
  gap: "16px",
  alignItems: "center",
};

const starContainerStyle = { display: "flex", gap: "2px" };

export default function StartRating({
  maxLength = 5,
  color = "#fcc419",
  size = "32",
  pWeight = "900",
  font = "Roboto",
  onSetRating,
  starRating = 0,
}) {
  const [rating, setRating] = useState(starRating);
  const [tempRating, setTempRating] = useState(0);

  const handleTempRating = (val) => {
    setTempRating(val);
  };
  const handleMouseLeave = () => {
    setTempRating(rating);
  };

  const ratingParagraphStyle = {
    margin: "0",
    padding: "0",
    fontSize: `${size / 1.4}px`,
    fontWeight: `${pWeight}px`,
    fontFamily: font,
    color,
  };
  return (
    <div style={ratingContainerStyle}>
      <div style={starContainerStyle} onMouseLeave={() => handleMouseLeave()}>
        {Array.from({ length: maxLength }, (_, i) => (
          <Star
            key={i}
            full={i >= tempRating}
            onClick={() => {
              setRating(i + 1);
              if (onSetRating) onSetRating(i + 1);
            }}
            onMouseEnter={() => handleTempRating(i + 1)}
            size={size}
            color={color}
          />
        ))}
      </div>
      <p style={ratingParagraphStyle}>{tempRating || ""}</p>
    </div>
  );
}

function Star({ onClick, full, onMouseEnter, size, color }) {
  const starStyle = {
    height: `${size}px`,
    width: `${size}px`,
    display: "block",
    cursor: "pointer",
  };
  return (
    <span
      role="button"
      style={starStyle}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
    >
      {full ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke={color}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="{2}"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill={color}
          stroke={color}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      )}
    </span>
  );
}
