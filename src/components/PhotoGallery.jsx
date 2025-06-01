import { useState, useEffect, useRef, useCallback } from "react";
import { Icons } from "./icons/Icons";

export const PhotoGallery = ({ photos, imagesLoaded, onPhotoClick }) => {
    const [imageInfo, setImageInfo] = useState([]);
    const [loadedImages, setLoadedImages] = useState(new Set());
    const [visibleImages, setVisibleImages] = useState(new Set());
    const [columns, setColumns] = useState(3);
    const [isInitialized, setIsInitialized] = useState(false);
    const observerRef = useRef(null);
    const imageRefs = useRef(new Map());
    const photoIdRef = useRef(new Set());

    // Generate unique session ID for this gallery instance
    const sessionId = useRef(`gallery-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);

    // Reset states when photos change (category change)
    useEffect(() => {
        // Clear previous session data
        const prevPhotoIds = photoIdRef.current;
        prevPhotoIds.clear();
        
        // Reset all states
        setImageInfo([]);
        setLoadedImages(new Set());
        setVisibleImages(new Set());
        setIsInitialized(false);
        imageRefs.current.clear();
        
        // Store current photo IDs to prevent cross-category contamination
        if (photos) {
            photos.forEach(photo => prevPhotoIds.add(`${sessionId.current}-${photo.id}`));
        }
    }, [photos]);

    // Preload images to get their natural dimensions
    useEffect(() => {
        if (!photos || photos.length === 0) {
            setIsInitialized(true);
            return;
        }

        const currentSessionId = sessionId.current;
        
        const preloadImages = async () => {
            try {
                const imageDetails = await Promise.all(
                    photos.map((photo, index) => {
                        return new Promise((resolve) => {
                            const img = new Image();
                            
                            const timeout = setTimeout(() => {
                                // Only resolve if this session is still active
                                if (photoIdRef.current.has(`${currentSessionId}-${photo.id}`)) {
                                    resolve({
                                        ...photo,
                                        index,
                                        sessionId: currentSessionId,
                                        aspectRatio: 4 / 3, // Default aspect ratio on timeout
                                    });
                                }
                            }, 3000);

                            img.onload = () => {
                                clearTimeout(timeout);
                                // Only resolve if this session is still active
                                if (photoIdRef.current.has(`${currentSessionId}-${photo.id}`)) {
                                    resolve({
                                        ...photo,
                                        index,
                                        sessionId: currentSessionId,
                                        aspectRatio: img.naturalWidth / img.naturalHeight,
                                    });
                                }
                            };
                            
                            img.onerror = () => {
                                clearTimeout(timeout);
                                // Only resolve if this session is still active
                                if (photoIdRef.current.has(`${currentSessionId}-${photo.id}`)) {
                                    resolve({
                                        ...photo,
                                        index,
                                        sessionId: currentSessionId,
                                        aspectRatio: 4 / 3,
                                    });
                                }
                            };
                            
                            img.src = photo.src;
                        });
                    })
                );
                
                // Filter out any stale results
                const validImageDetails = imageDetails.filter(img => 
                    img && img.sessionId === currentSessionId
                );
                
                if (validImageDetails.length > 0) {
                    setImageInfo(validImageDetails);
                    
                    // Make first few images visible immediately for better UX
                    const firstBatch = validImageDetails.map(img => img.id);
                    setVisibleImages(new Set(firstBatch));
                }
                
                setIsInitialized(true);
            } catch (error) {
                console.warn('Error preloading images:', error);
                setIsInitialized(true);
            }
        };

        preloadImages();
    }, [photos]);

    // Update columns based on screen width
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) {
                setColumns(1);
            } else if (window.innerWidth < 1024) {
                setColumns(2);
            } else {
                setColumns(3);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Setup Intersection Observer for lazy loading
    useEffect(() => {
        if (!isInitialized || !imageInfo || imageInfo.length === 0) return;

        const currentSessionId = sessionId.current;
        
        const observerOptions = {
            rootMargin: '150px',
            threshold: 0.1
        };

        // Disconnect previous observer
        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        observerRef.current = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const photoId = entry.target.getAttribute('data-photo-id');
                    const entrySessionId = entry.target.getAttribute('data-session-id');
                    
                    // Only process if it's from the current session
                    if (photoId && entrySessionId === currentSessionId) {
                        setVisibleImages(prev => {
                            if (prev.has(photoId)) return prev;
                            return new Set([...prev, photoId]);
                        });
                        observerRef.current?.unobserve(entry.target);
                    }
                }
            });
        }, observerOptions);

        // Setup observer with longer delay and retry mechanism
        const setupObserver = () => {
            let observedCount = 0;
            imageRefs.current.forEach((ref, key) => {
                if (ref && observerRef.current && key.startsWith(currentSessionId)) {
                    observerRef.current.observe(ref);
                    observedCount++;
                }
            });
            
            // Debug log
            console.log(`Observer setup: ${observedCount} elements observed`);
            
            // If no elements were observed, retry after a longer delay
            if (observedCount === 0) {
                setTimeout(setupObserver, 500);
            }
        };

        // Multiple setup attempts to ensure DOM is ready
        setTimeout(setupObserver, 200);
        setTimeout(setupObserver, 500);

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [isInitialized, imageInfo, imagesLoaded]);

    // Handle individual image load completion
    const handleImageLoad = useCallback((photoId) => {
        const currentSessionId = sessionId.current;
        // Only update if this image belongs to current session
        if (photoIdRef.current.has(`${currentSessionId}-${photoId}`)) {
            setLoadedImages(prev => new Set([...prev, photoId]));
        }
    }, []);

    // Handle image load error
    const handleImageError = useCallback((photoId) => {
        const currentSessionId = sessionId.current;
        console.warn(`Failed to load image: ${photoId}`);
        // Only update if this image belongs to current session
        if (photoIdRef.current.has(`${currentSessionId}-${photoId}`)) {
            setLoadedImages(prev => new Set([...prev, photoId]));
        }
    }, []);

    // Check if image should be loaded (is visible or will be visible soon)
    const shouldLoadImage = useCallback((photoId) => {
        return visibleImages.has(photoId);
    }, [visibleImages]);

    // Check if image has finished loading
    const isImageLoaded = useCallback((photoId) => {
        return loadedImages.has(photoId);
    }, [loadedImages]);

    // Distribute images into columns using their actual aspect ratios
    const distributeImages = () => {
        if (!isInitialized || imageInfo.length === 0) {
            return Array.from({ length: columns }, () => []);
        }

        const columnArrays = Array.from({ length: columns }, () => []);
        const columnHeights = Array(columns).fill(0);

        imageInfo.forEach((image) => {
            const minHeightColumnIndex = columnHeights.indexOf(
                Math.min(...columnHeights)
            );

            columnArrays[minHeightColumnIndex].push(image);
            columnHeights[minHeightColumnIndex] += 1 / image.aspectRatio;
        });

        return columnArrays;
    };

    const imageColumns = distributeImages();

    // Show loading state if not initialized
    if (!isInitialized) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500 text-sm">Loading gallery...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-wrap -mx-2">
            {imageColumns.map((column, columnIndex) => (
                <div
                    key={`${sessionId.current}-column-${columnIndex}`}
                    className="px-2 w-full sm:w-1/2 lg:w-1/3"
                >
                    <div className="flex flex-col space-y-4 md:space-y-6">
                        {column.map((photo) => {
                            const delay = Math.min(photo.index * 100, 1000);
                            const shouldLoad = shouldLoadImage(photo.id);
                            const hasLoaded = isImageLoaded(photo.id);
                            const uniqueKey = `${sessionId.current}-${photo.id}`;
                            
                            return (
                                <div
                                    key={uniqueKey}
                                    ref={(el) => {
                                        if (el) {
                                            imageRefs.current.set(uniqueKey, el);
                                        } else {
                                            imageRefs.current.delete(uniqueKey);
                                        }
                                    }}
                                    data-photo-id={photo.id}
                                    data-session-id={sessionId.current}
                                    className={`cursor-pointer overflow-hidden group relative rounded-md shadow-sm hover:shadow-lg transition-all duration-700 transform ${
                                        imagesLoaded
                                            ? "translate-y-0 opacity-100"
                                            : "translate-y-8 opacity-0"
                                    }`}
                                    style={{
                                        transitionDelay: imagesLoaded ? `${delay}ms` : '0ms',
                                    }}
                                    onClick={() => onPhotoClick(photo)}
                                >
                                    <div 
                                        className="relative w-full bg-gray-100"
                                        style={{
                                            paddingBottom: `${(1 / photo.aspectRatio) * 100}%`,
                                        }}
                                    >
                                        {/* Always show loading skeleton until image loads */}
                                        <div className={`absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 overflow-hidden transition-opacity duration-300 ${
                                            hasLoaded ? 'opacity-0' : 'opacity-100'
                                        }`}>
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent transform -skew-x-12 animate-shimmer"></div>
                                        </div>
                                        
                                        {/* Actual image - only load when visible */}
                                        {shouldLoad && (
                                            <img
                                                src={photo.src}
                                                alt={photo.alt}
                                                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                                                    hasLoaded ? 'opacity-100' : 'opacity-0'
                                                }`}
                                                loading="lazy"
                                                onLoad={() => handleImageLoad(photo.id)}
                                                onError={() => handleImageError(photo.id)}
                                            />
                                        )}

                                        {/* Hover overlay with caption - only show when image is loaded */}
                                        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-start p-4 ${
                                            !hasLoaded ? 'pointer-events-none' : ''
                                        }`}>
                                            <p className="text-white text-sm font-light tracking-wide transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                                {photo.caption}
                                            </p>
                                        </div>

                                        {/* Center expand icon - only show when image is loaded */}
                                        <div className={`absolute inset-0 flex items-center justify-center ${
                                            !hasLoaded ? 'pointer-events-none' : ''
                                        }`}>
                                            <div className="text-white opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-0 group-hover:scale-100 bg-black/40 rounded-full p-3 backdrop-blur-sm">
                                                <Icons.ArrowRight className="w-5 h-5" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
            
            <style jsx>{`
                @keyframes shimmer {
                    0% { 
                        transform: translateX(-100%) skewX(-12deg); 
                    }
                    100% { 
                        transform: translateX(200%) skewX(-12deg); 
                    }
                }
                
                .animate-shimmer {
                    animation: shimmer 2s infinite;
                }
            `}</style>
        </div>
    );
};