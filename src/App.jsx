import { useState, useEffect, useCallback } from "react";
import { photoCategories } from "./data/photoData";
import { IntroAnimation } from "./components/IntroAnimation";
import { Header } from "./components/Header";
import { PhotoGallery } from "./components/PhotoGallery";
import { SinglePhotoView } from "./components/SinglePhotoView";
import { AboutSection } from "./components/AboutSection";
import { Footer } from "./components/Footer";
import { GlobalStyle } from "./components/GobalStyle";

export default function App() {
    const [activeCategory, setActiveCategory] = useState("portrait");
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [pageInitialized, setPageInitialized] = useState(false);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    
    // Add transition states to prevent page mixing
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [previousCategory, setPreviousCategory] = useState(null);

    // Debounced category change to prevent rapid switching
    const handleCategoryChange = useCallback((category) => {
        if (category === activeCategory || isTransitioning) return;

        setIsTransitioning(true);
        setPreviousCategory(activeCategory);
        
        // First, hide current content
        setImagesLoaded(false);
        setSelectedPhoto(null);

        // Brief delay to allow fade out
        setTimeout(() => {
            setActiveCategory(category);
            
            // Longer delay for new content to appear
            setTimeout(() => {
                setImagesLoaded(true);
                setIsTransitioning(false);
                setPreviousCategory(null);
            }, category === "about" ? 300 : 800); // Shorter delay for about page
        }, 200);
    }, [activeCategory, isTransitioning]);

    // Handle photo selection with smooth transitions
    const handlePhotoClick = useCallback((photo) => {
        if (isTransitioning) return;
        setSelectedPhoto(photo);
    }, [isTransitioning]);

    // Handle back from single photo view
    const handleBackFromPhoto = useCallback(() => {
        setSelectedPhoto(null);
        // Re-trigger image animations when returning to gallery
        setTimeout(() => {
            setImagesLoaded(true);
        }, 100);
    }, []);

    // Reset states when component mounts
    useEffect(() => {
        // Initial load sequence
        if (pageInitialized && !imagesLoaded) {
            const timer = setTimeout(() => {
                setImagesLoaded(true);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [pageInitialized, imagesLoaded]);

    // Prevent scroll restoration during transitions
    useEffect(() => {
        if (isTransitioning) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isTransitioning]);

    return (
        <div className="font-sans min-h-screen bg-white text-gray-900 relative">
            {/* Intro Animation */}
            <IntroAnimation
                pageInitialized={pageInitialized}
                setPageInitialized={setPageInitialized}
                setIsLoaded={setIsLoaded}
                setImagesLoaded={setImagesLoaded}
            />

            {/* Header Component */}
            <Header
                activeCategory={activeCategory}
                handleCategoryChange={handleCategoryChange}
                isTransitioning={isTransitioning}
            />

            {/* Transition Overlay */}
            {isTransitioning && (
                <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-40 transition-opacity duration-300">
                    <div className="flex items-center justify-center h-full">
                        <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className={`container mx-auto px-4 pt-24 md:pt-32 pb-16 transition-opacity duration-500 ${
                isTransitioning ? 'opacity-0' : 'opacity-100'
            }`}>
                {/* Gallery and Single Photo View */}
                {activeCategory !== "about" && (
                    <div className="relative">
                        {/* Gallery View */}
                        {!selectedPhoto && (
                            <div className={`transition-all duration-500 ${
                                selectedPhoto ? 'opacity-0 pointer-events-none' : 'opacity-100'
                            }`}>
                                <PhotoGallery
                                    photos={photoCategories[activeCategory] || []}
                                    imagesLoaded={imagesLoaded && !isTransitioning}
                                    onPhotoClick={handlePhotoClick}
                                />
                            </div>
                        )}

                        {/* Single Photo View */}
                        {selectedPhoto && (
                            <div className={`transition-all duration-500 ${
                                selectedPhoto ? 'opacity-100' : 'opacity-0 pointer-events-none'
                            }`}>
                                <SinglePhotoView
                                    photo={selectedPhoto}
                                    onBack={handleBackFromPhoto}
                                />
                            </div>
                        )}
                    </div>
                )}

                {/* About Section */}
                {activeCategory === "about" && (
                    <div className={`transition-all duration-500 ${
                        activeCategory === "about" && !isTransitioning ? 'opacity-100' : 'opacity-0'
                    }`}>
                        <AboutSection isLoaded={isLoaded && !isTransitioning} />
                    </div>
                )}

                {/* Loading State for Category Changes */}
                {isTransitioning && previousCategory && (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-gray-500 text-sm">Loading {activeCategory}...</p>
                        </div>
                    </div>
                )}
            </main>

            {/* Footer Component */}
            <Footer />

            {/* Global Styles */}
            {/* Global Styles - Load once on mount */}
            {pageInitialized && <GlobalStyle />}
        </div>
    );
}