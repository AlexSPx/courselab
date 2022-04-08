import Image from "next/image";
import { useState } from "react";

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function LazyImage({
  src,
  alt,
  classes,
}: {
  src: string;
  alt: string;
  classes?: string;
}) {
  const [isLoading, setLoading] = useState(true);

  return (
    <Image
      src={src}
      objectFit="cover"
      layout="fill"
      alt={alt}
      className={cn(
        `duration-700 ease-in-out group-hover:opacity-75 ${classes}`,
        isLoading
          ? "scale-110 blur-2xl grayscale"
          : "scale-100 blur-0 grayscale-0"
      )}
      onLoadingComplete={() => setLoading(false)}
    />
  );
}
