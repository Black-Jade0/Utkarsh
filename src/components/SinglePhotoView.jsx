import { Icons } from "./icons/Icons";

export const SinglePhotoView = ({ photo, onBack }) => {
    return (
        <div
            className="flex flex-col opacity-0 animate-fade-in"
            style={{
                animation: "fadeIn 0.5s forwards",
            }}
        >
            <button
                className="self-start mb-6 flex items-center text-gray-600 hover:text-black transition-colors duration-300 group"
                onClick={onBack}
            >
                <span className="transform group-hover:-translate-x-1 transition-transform duration-300 mr-2">
                    <Icons.ChevronLeft />
                </span>
                <span className="text-sm uppercase tracking-wider">
                    Back to gallery
                </span>
            </button>
            <div className="w-full max-w-6xl mx-auto">
                <div className="relative overflow-hidden rounded-lg shadow-lg">
                    <img
                        src={photo.src}
                        alt={photo.alt}
                        className="w-full max-h-screen object-contain mx-auto"
                    />
                </div>
                <p className="text-center mt-6 text-gray-700 font-light tracking-wide">
                    {photo.caption}
                </p>
            </div>
        </div>
    );
};
