import { Icons } from "./icons/Icons";
import { useState, useEffect } from "react";

export const AboutSection = ({ isLoaded }) => {
    const [animateElements, setAnimateElements] = useState(false);

    useEffect(() => {
        if (isLoaded) {
            // Trigger animations after component loads
            setTimeout(() => {
                setAnimateElements(true);
            }, 300);
        }
    }, [isLoaded]);

    return (
        <div
            className={`max-w-4xl mx-auto transition-all duration-1000 ${
                isLoaded
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
            }`}
        >
            <div className="flex flex-col md:flex-row gap-12 items-center mb-16">
                <div
                    className={`relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden flex-shrink-0 shadow-xl transform hover:scale-105 transition-all duration-500 ${
                        animateElements ? "animate-fade-in" : "opacity-0"
                    }`}
                    style={{ transitionDelay: "200ms" }}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 animate-pulse-slow"></div>
                    <img
                        src="/Profile.jpg"
                        alt="Utkarsh Tayade"
                        className="w-full h-full object-cover z-10 relative"
                    />
                    <div className="absolute inset-0 border-2 border-white/30 rounded-full scale-110 animate-spin-slow"></div>
                </div>
                <div>
                    <h2
                        className={`text-3xl md:text-4xl mb-6 font-serif italic tracking-wider transform transition-all duration-700 ${
                            animateElements
                                ? "translate-y-0 opacity-100"
                                : "translate-y-4 opacity-0"
                        }`}
                        style={{ transitionDelay: "400ms" }}
                    >
                        Hi There!
                    </h2>
                    <p
                        className={`text-gray-700 mb-4 leading-relaxed transform transition-all duration-700 ${
                            animateElements
                                ? "translate-y-0 opacity-100"
                                : "translate-y-4 opacity-0"
                        }`}
                        style={{ transitionDelay: "500ms" }}
                    >
                        I'm Utkarsh Tayade, a freelance photographer with a
                        passion for freezing time through my lens. Whether it's
                        the personality of a portrait or the raw power of an
                        automobile, I love capturing moments that tell a story.
                        Photography, for me, is about more than just images—it's
                        about creating memories that let people look back and
                        relive those special moments with a smile. My approach
                        is simple: blend creativity with technical finesse to
                        craft visuals that resonate. Let's create something
                        unforgettable together!
                    </p>
                </div>
            </div>

            <div
                className={`mb-16 px-6 py-10 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg shadow-sm backdrop-blur-sm transform transition-all duration-1000 ${
                    animateElements
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-95"
                }`}
                style={{ transitionDelay: "700ms" }}
            >
                <div className="relative">
                    <span className="absolute -top-6 left-0 text-6xl text-gray-200 font-serif">
                        "
                    </span>
                    <h3 className="text-2xl mb-4 font-light text-center tracking-wide">
                        Photography Philosophy
                    </h3>
                    <p className="text-gray-700 mb-4 leading-relaxed italic text-center">
                        My goal is to capture authentic moments that reveal the
                        beauty in everyday life. Whether I'm photographing the
                        elegant lines of a vintage car, the vibrant energy of
                        city streets, or the subtle expressions that define a
                        person's character, I strive to find the perfect balance
                        of light, composition, and timing.
                    </p>
                    <span className="absolute -bottom-10 right-0 text-6xl text-gray-200 font-serif">
                        "
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div
                    className={`transform transition-all duration-1000 ${
                        animateElements
                            ? "translate-y-0 opacity-100"
                            : "translate-y-8 opacity-0"
                    }`}
                    style={{ transitionDelay: "800ms" }}
                >
                    <h3 className="text-2xl mb-6 font-light tracking-wide relative overflow-hidden">
                        <span className="relative z-10">Services</span>
                        <span className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent transform -translate-x-full animate-slide-in"></span>
                    </h3>
                    <ul className="text-gray-700 space-y-6">
                        {[
                            "Automobile Photography",
                            "Street Photography",
                            "Portrait Sessions",
                            "Event Coverage",
                            "Commercial Photography",
                        ].map((service, index) => (
                            <li
                                key={service}
                                className="flex items-center group"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <span className="text-gray-400 group-hover:text-gray-900 transition-colors duration-300 transform group-hover:rotate-12">
                                    <Icons.Camera />
                                </span>
                                <span className="ml-3 group-hover:ml-4 transition-all duration-300 border-b border-transparent group-hover:border-gray-300">
                                    {service}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div
                    className={`transform transition-all duration-1000 ${
                        animateElements
                            ? "translate-y-0 opacity-100"
                            : "translate-y-8 opacity-0"
                    }`}
                    style={{ transitionDelay: "900ms" }}
                >
                    <h3 className="text-2xl mb-6 font-light tracking-wide relative overflow-hidden">
                        <span className="relative z-10">Contact</span>
                        <span className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent transform -translate-x-full animate-slide-in"></span>
                    </h3>
                    <ul className="text-gray-700 space-y-6">
                        <li className="flex items-center group">
                            <span className="text-gray-400 group-hover:text-gray-900 transition-colors duration-300 transform group-hover:scale-110">
                                <Icons.Mail />
                            </span>
                            <span className="ml-3 group-hover:ml-4 transition-all duration-300 border-b border-transparent group-hover:border-gray-300">
                                tayadeutkarsh@yahoo.com
                            </span>
                        </li>
                        <li className="flex items-center group">
                            <span className="text-gray-400 group-hover:text-gray-900 transition-colors duration-300 transform group-hover:scale-110">
                                <Icons.Phone />
                            </span>
                            <span className="ml-3 group-hover:ml-4 transition-all duration-300 border-b border-transparent group-hover:border-gray-300">
                                +91 93011 48466
                            </span>
                        </li>
                        <li className="flex items-center group">
                            <span className="text-gray-400 group-hover:text-gray-900 transition-colors duration-300 transform group-hover:scale-110">
                                <Icons.Instagram />
                            </span>
                            <span className="ml-3 group-hover:ml-4 transition-all duration-300 border-b border-transparent group-hover:border-gray-300">
                                _.chayachitrakar
                            </span>
                        </li>
                        {/* <li className="flex items-center group">
                            <span className="text-gray-400 group-hover:text-gray-900 transition-colors duration-300 transform group-hover:scale-110">
                                <Icons.Twitter />
                            </span>
                            <span className="ml-3 group-hover:ml-4 transition-all duration-300 border-b border-transparent group-hover:border-gray-300">
                                @utkarshphotos
                            </span>
                        </li> */}
                    </ul>
                </div>
            </div>

            {/* Add this to your global CSS or create a separate style component */}
            <style jsx global>{`
                @keyframes spin-slow {
                    0% {
                        transform: rotate(0deg) scale(1.1);
                    }
                    100% {
                        transform: rotate(360deg) scale(1.1);
                    }
                }
                @keyframes pulse-slow {
                    0% {
                        opacity: 0.5;
                    }
                    50% {
                        opacity: 0.8;
                    }
                    100% {
                        opacity: 0.5;
                    }
                }
                @keyframes slide-in {
                    0% {
                        transform: translateX(-100%);
                    }
                    100% {
                        transform: translateX(0);
                    }
                }
                @keyframes fade-in {
                    0% {
                        opacity: 0;
                    }
                    100% {
                        opacity: 1;
                    }
                }
                .animate-spin-slow {
                    animation: spin-slow 20s linear infinite;
                }
                .animate-pulse-slow {
                    animation: pulse-slow 3s ease-in-out infinite;
                }
                .animate-slide-in {
                    animation: slide-in 1s forwards 0.5s;
                }
                .animate-fade-in {
                    animation: fade-in 1s forwards;
                }
            `}</style>
        </div>
    );
};
