"use client";

import { useState } from "react";
import Image from "next/image";
import { Package } from "lucide-react";

interface ProductImageThumbnailProps {
  imageUrl?: string | null;
  alt: string;
  sizeClassName?: string;
}

export function ProductImageThumbnail({
  imageUrl,
  alt,
  sizeClassName = "w-10 h-10",
}: ProductImageThumbnailProps) {
  const [hasError, setHasError] = useState(false);

  if (!imageUrl || hasError) {
    return (
      <div
        className={`${sizeClassName} rounded-xl bg-slate-100 border border-slate-200/60 flex items-center justify-center text-slate-400 flex-shrink-0 relative overflow-hidden`}
      >
        <Package className="w-5 h-5" />
      </div>
    );
  }

  return (
    <div
      className={`${sizeClassName} rounded-xl bg-slate-100 border border-slate-200/60 flex items-center justify-center flex-shrink-0 relative overflow-hidden`}
    >
      <Image
        src={imageUrl}
        alt={alt}
        fill
        sizes="(max-width: 768px) 40px, 40px"
        className="object-cover"
        onError={() => setHasError(true)}
      />
    </div>
  );
}
