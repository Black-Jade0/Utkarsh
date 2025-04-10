import { useEffect } from 'react';

export const IntroAnimation = ({ pageInitialized, setPageInitialized, setIsLoaded, setImagesLoaded }) => {
    useEffect(() => {
        // Initial page load animation sequence
        setTimeout(() => {
            setPageInitialized(true);
        }, 100);

        setTimeout(() => {
            setIsLoaded(true);
        }, 600);

        setTimeout(() => {
            setImagesLoaded(true);
        }, 1200);
    }, [setPageInitialized, setIsLoaded, setImagesLoaded]);

    return (
        <div
            className={`fixed inset-0 bg-black z-50 flex items-center justify-center transition-opacity duration-1000 ${
                pageInitialized ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
        >
            <h1 className="text-white text-4xl md:text-6xl font-extralight tracking-widest">
                UTKARSH TAYADE
            </h1>
        </div>
    );
};