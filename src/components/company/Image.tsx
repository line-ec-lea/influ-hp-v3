import type { ImgHTMLAttributes } from "react";

type Props = ImgHTMLAttributes<HTMLImageElement> & {
  fill?: boolean;
  priority?: boolean;
  unoptimized?: boolean;
  quality?: number;
};

// Preserve the original next/image layout using the existing public assets.
export default function Image({
  fill,
  priority,
  unoptimized: _unoptimized,
  quality: _quality,
  className = "",
  loading,
  ...props
}: Props) {
  return (
    <img
      {...props}
      className={`${fill ? "absolute inset-0 h-full w-full" : ""} ${className}`}
      loading={priority ? "eager" : loading ?? "lazy"}
      fetchPriority={priority ? "high" : props.fetchPriority}
      decoding="async"
    />
  );
}
