import Image from "next/image";
import type { CoverImageSource } from "@/lib/types";

export function CoverImage({
  url,
  alt,
  source,
  priority = false,
  sizes,
  className,
}: {
  url: string;
  alt: string | null;
  source: CoverImageSource | null;
  priority?: boolean;
  sizes: string;
  className: string;
}) {
  return (
    <div className={className}>
      <Image
        src={url}
        alt={alt ?? ""}
        fill
        priority={priority}
        sizes={sizes}
        className="cover-img"
      />
      {source === "sample" ? <span className="example-label">Example</span> : null}
    </div>
  );
}
