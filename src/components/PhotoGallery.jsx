import { Icons } from "./icons/Icons";

export const PhotoGallery = ({ photos, imagesLoaded, onPhotoClick }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {photos.map((photo, index) => (
                <div
                    key={photo.id}
                    className={`cursor-pointer overflow-hidden group relative rounded-md shadow-sm hover:shadow-md transition-all duration-500 transform ${
                        imagesLoaded
                            ? "translate-y-0 opacity-100"
                            : "translate-y-8 opacity-0"
                    }`}
                    style={{
                        transitionDelay: `${index * 100}ms`,
                    }}
                    onClick={() => onPhotoClick(photo)}
                >
                    <div className="aspect-[4/3] relative">
                        <img
                            src={photo.src}
                            alt={photo.alt}
                            className="absolute inset-0 w-full h-full object-contain bg-gray-100"
                            loading="lazy"
                        />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-start p-4">
                        <p className="text-white text-sm font-light tracking-wide transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                            {photo.caption}
                        </p>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-white opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-0 group-hover:scale-100 bg-black/30 rounded-full p-2">
                            <Icons.ArrowRight />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
