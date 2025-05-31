import { useState, useEffect, useRef } from "react";
import { Icons } from "./icons/Icons";

export const PhotoGallery = ({ photos, imagesLoaded, onPhotoClick }) => {
    const [loadedImages, setLoadedImages] = useState(new Set());
    const [visibleImages, setVisibleImages] = useState(new Set());
    const observerRef = useRef(null);

    // Reset loaded images when photos change (category change)
    useEffect(() => {
        setLoadedImages(new Set());
        setVisibleImages(new Set());
    }, [photos]);

    // Progressive image loading with Intersection Observer
    useEffect(() => {
        // Don't set up observer until we have photos to observe
        if (!photos || photos.length === 0) return;

        const imageElements = document.querySelectorAll('[data-photo-id]');
        
        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const photoId = entry.target.getAttribute('data-photo-id');
                        setVisibleImages(prev => new Set([...prev, photoId]));
                    }
                });
            },
            {
                rootMargin: '50px',
                threshold: 0.1
            }
        );

        imageElements.forEach((img) => {
            observerRef.current.observe(img);
        });

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [photos]); // Remove imagesLoaded dependency

    // Handle individual image load completion
    const handleImageLoad = (photoId) => {
        setLoadedImages(prev => new Set([...prev, photoId]));
    };

    // Handle image load error
    const handleImageError = (photoId) => {
        console.warn(`Failed to load image: ${photoId}`);
        // Still mark as "loaded" to prevent infinite loading state
        setLoadedImages(prev => new Set([...prev, photoId]));
    };

    // Simplified image visibility check
    const shouldShowImage = (photoId) => {
        return visibleImages.has(photoId) || !imagesLoaded; // Show immediately if not using progressive loading
    };

    const isImageLoaded = (photoId) => {
        return loadedImages.has(photoId);
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {photos.map((photo, index) => (
                <div
                    key={photo.id}
                    data-photo-id={photo.id}
                    className={`cursor-pointer overflow-hidden group relative rounded-md shadow-sm hover:shadow-md transition-all duration-700 transform ${
                        imagesLoaded && isImageLoaded(photo.id)
                            ? "translate-y-0 opacity-100"
                            : "translate-y-8 opacity-0"
                    }`}
                    style={{
                        transitionDelay: `${index * 150}ms`,
                    }}
                    onClick={() => onPhotoClick(photo)}
                >
                    <div className="aspect-[4/3] relative bg-gray-100">
                        {/* Loading skeleton */}
                        {!isImageLoaded(photo.id) && (
                            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer transform -skew-x-12"></div>
                            </div>
                        )}
                        
                        {/* Actual image - Always render if imagesLoaded is true */}
                        {imagesLoaded && (
                            <img
                                src={photo.src}
                                alt={photo.alt}
                                className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-500 ${
                                    isImageLoaded(photo.id) ? 'opacity-100' : 'opacity-0'
                                }`}
                                loading="lazy"
                                onLoad={() => handleImageLoad(photo.id)}
                                onError={() => handleImageError(photo.id)}
                            />
                        )}
                        
                        {/* Fallback for failed images */}
                        {imagesLoaded && isImageLoaded(photo.id) && (
                            <div className="absolute inset-0 flex items-center justify-center text-gray-400 opacity-0 group-hover:opacity-50 transition-opacity duration-300">
                                <Icons.Image className="w-8 h-8" />
                            </div>
                        )}
                    </div>

                    {/* Hover overlay with caption */}
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-start p-4 ${
                        !isImageLoaded(photo.id) ? 'pointer-events-none' : ''
                    }`}>
                        <p className="text-white text-sm font-light tracking-wide transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                            {photo.caption}
                        </p>
                    </div>

                    {/* Center arrow icon */}
                    <div className={`absolute inset-0 flex items-center justify-center ${
                        !isImageLoaded(photo.id) ? 'pointer-events-none' : ''
                    }`}>
                        <div className="text-white opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-0 group-hover:scale-100 bg-black/30 rounded-full p-2">
                            <Icons.ArrowRight />
                        </div>
                    </div>

                    {/* Loading indicator */}
                    {imagesLoaded && !isImageLoaded(photo.id) && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};