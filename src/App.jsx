import { useState } from "react";
import { photoCategories } from "./data/photoData";
import { IntroAnimation } from "./components/IntroAnimation";
import { Header } from "./components/Header";
import { PhotoGallery } from "./components/PhotoGallery";
import { SinglePhotoView } from "./components/SinglePhotoView";
import { AboutSection } from "./components/AboutSection";
import { Footer } from "./components/Footer";
import {GlobalStyle} from "./components/GobalStyle"
export default function App() {
    const [activeCategory, setActiveCategory] = useState("portrait");
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [pageInitialized, setPageInitialized] = useState(false);
    const [imagesLoaded, setImagesLoaded] = useState(false);

    const handleCategoryChange = (category) => {
        setImagesLoaded(false);
        setActiveCategory(category);
        setSelectedPhoto(null);

        // Re-trigger image loading animation after category change
        setTimeout(() => {
            setImagesLoaded(true);
        }, 1000);
    };

    return (
        <div className="font-sans min-h-screen bg-white text-gray-900">
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
            />

            {/* Main Content */}
            <main className="container mx-auto px-4 pt-24 md:pt-32 pb-16">
                {activeCategory !== "about" && (
                    <>
                        {/* Gallery View */}
                        {!selectedPhoto && (
                            <PhotoGallery
                                photos={photoCategories[activeCategory]}
                                imagesLoaded={imagesLoaded}
                                onPhotoClick={setSelectedPhoto}
                            />
                        )}

                        {/* Single Photo View */}
                        {selectedPhoto && (
                            <SinglePhotoView
                                photo={selectedPhoto}
                                onBack={() => setSelectedPhoto(null)}
                            />
                        )}
                    </>
                )}

                {/* About Section */}
                {activeCategory === "about" && (
                    <AboutSection isLoaded={isLoaded} />
                )}
            </main>

            {/* Footer Component */}
            <Footer />

            <GlobalStyle />
        </div>
    );
}