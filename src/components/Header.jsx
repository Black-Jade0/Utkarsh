import { useState } from "react";
import { Icons } from "./icons/Icons";
import { photoCategories } from "../data/photoData";

export const Header = ({ activeCategory, handleCategoryChange }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleNavClick = (category) => {
        handleCategoryChange(category);
        setMobileMenuOpen(false);
    };

    return (
        <header className="fixed top-0 left-0 right-0 bg-white bg-opacity-95 backdrop-blur-md shadow-sm z-40 transition-all duration-500">
            <div className="container mx-auto px-6 py-5 md:py-6 flex justify-between items-center">
                <h1 className="text-2xl md:text-3xl font-serif tracking-wide hover:tracking-wider transition-all duration-500">
                    Utkarsh Tayade
                </h1>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex space-x-12">
                    {Object.keys(photoCategories).map((category) => (
                        <button
                            key={category}
                            onClick={() => handleNavClick(category)}
                            className={`uppercase text-sm tracking-widest font-medium transition-all duration-300 relative ${
                                activeCategory === category
                                    ? "text-black"
                                    : "text-gray-400 hover:text-black"
                            }`}
                        >
                            {category}
                            {activeCategory === category && (
                                <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1/2 h-px bg-black transition-all duration-500"></span>
                            )}
                        </button>
                    ))}
                    <button
                        onClick={() => handleNavClick("about")}
                        className={`uppercase text-sm tracking-widest font-medium transition-all duration-300 relative ${
                            activeCategory === "about"
                                ? "text-black"
                                : "text-gray-400 hover:text-black"
                        }`}
                    >
                        About
                        {activeCategory === "about" && (
                            <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1/2 h-px bg-black transition-all duration-500"></span>
                        )}
                    </button>
                </nav>

                {/* Mobile menu button */}
                <button
                    className="md:hidden text-gray-900 transition-transform duration-300 hover:rotate-90 focus:outline-none"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? (
                        <Icons.X size={20} />
                    ) : (
                        <Icons.Menu size={20} />
                    )}
                </button>
            </div>

            {/* Mobile Navigation */}
            <div
                className={`md:hidden bg-white shadow-md transition-all duration-500 ease-in-out overflow-hidden ${
                    mobileMenuOpen ? "max-h-64" : "max-h-0"
                }`}
            >
                <div className="flex flex-col space-y-5 py-6 px-8">
                    {Object.keys(photoCategories).map((category) => (
                        <button
                            key={category}
                            onClick={() => handleNavClick(category)}
                            className={`uppercase text-sm tracking-widest font-medium transition-all duration-300 ${
                                activeCategory === category
                                    ? "text-black"
                                    : "text-gray-400 hover:text-black"
                            }`}
                        >
                            {category}
                            {activeCategory === category && (
                                <span className="inline-block ml-2 w-3 h-px bg-black"></span>
                            )}
                        </button>
                    ))}
                    <button
                        onClick={() => handleNavClick("about")}
                        className={`uppercase text-sm tracking-widest font-medium transition-all duration-300 ${
                            activeCategory === "about"
                                ? "text-black"
                                : "text-gray-400 hover:text-black"
                        }`}
                    >
                        About
                        {activeCategory === "about" && (
                            <span className="inline-block ml-2 w-3 h-px bg-black"></span>
                        )}
                    </button>
                </div>
            </div>
        </header>
    );
};
