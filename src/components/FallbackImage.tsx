"use client";

import Image, { ImageProps } from "next/image";
import { useState, useRef } from "react";

type FallbackImageProps = Omit<ImageProps, "onError"> & {
  fallbackSrc?: string;
};

const DEFAULT_FALLBACK = "/images/placeholder.svg";

export function FallbackImage({
  src,
  fallbackSrc = DEFAULT_FALLBACK,
  alt,
  ...props
}: FallbackImageProps) {
  const [error, setError] = useState(false);
  const errorRef = useRef(false);

  const handleError = () => {
    // Use ref to track error without triggering re-renders
    if (!errorRef.current) {
      errorRef.current = true;
      setError(true);
    }
  };

  // Use fallback when there's an error or src is missing
  const displaySrc = error ? fallbackSrc : src;

  return (
    <Image
      {...props}
      src={displaySrc}
      alt={alt}
      onError={handleError}
      unoptimized={error}
    />
  );
}
