"use client";

type MediaGalleryProps = {
  title?: string;
  images: string[];
  emptyLabel?: string;
};

export const MediaGallery = ({
  title,
  images,
  emptyLabel = "No images provided",
}: MediaGalleryProps) => {
  const items = images.filter(Boolean);

  return (
    <section className="media-gallery-block">
      {title ? <h3 className="media-gallery-title">{title}</h3> : null}
      {items.length ? (
        <div className="media-gallery-grid">
          {items.map((image, index) => (
            <div className="media-gallery-item" key={`${image}-${index}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt={`${title || "Media"} ${index + 1}`} />
            </div>
          ))}
        </div>
      ) : (
        <div className="media-gallery-empty">{emptyLabel}</div>
      )}
    </section>
  );
};
