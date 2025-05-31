import { useEffect } from 'react';

export const GlobalStyle = () => {
    useEffect(() => {
        // Create and inject global styles
        const styleId = 'global-photo-gallery-styles';
        
        // Remove existing styles if they exist
        const existingStyle = document.getElementById(styleId);
        if (existingStyle) {
            existingStyle.remove();
        }

        // Create new style element
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @keyframes shimmer {
                0% {
                    transform: translateX(-100%);
                }
                100% {
                    transform: translateX(100%);
                }
            }

            .animate-shimmer {
                animation: shimmer 2s infinite;
            }

            .animate-fade-in {
                opacity: 0;
                animation: fadeIn 0.8s forwards;
            }

            @keyframes pulse {
                0% {
                    transform: scale(1);
                }
                50% {
                    transform: scale(1.05);
                }
                100% {
                    transform: scale(1);
                }
            }

            @keyframes slideFromBottom {
                from {
                    transform: translateY(100%);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }

            @keyframes fadeInStaggered {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            /* For smoother animations */
            * {
                transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
            }

            /* Smooth scrolling */
            html {
                scroll-behavior: smooth;
            }

            /* Custom scrollbar for webkit browsers */
            ::-webkit-scrollbar {
                width: 8px;
            }

            ::-webkit-scrollbar-track {
                background: #f1f1f1;
            }

            ::-webkit-scrollbar-thumb {
                background: #c1c1c1;
                border-radius: 4px;
            }

            ::-webkit-scrollbar-thumb:hover {
                background: #a8a8a8;
            }

            /* Prevent content shift during loading */
            .loading-container {
                min-height: 200px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            /* Enhanced focus styles for accessibility */
            button:focus-visible,
            a:focus-visible {
                outline: 2px solid #3b82f6;
                outline-offset: 2px;
            }
        `;

        // Append to head
        document.head.appendChild(style);

        // Cleanup function
        return () => {
            const styleToRemove = document.getElementById(styleId);
            if (styleToRemove) {
                styleToRemove.remove();
            }
        };
    }, []);

    return null; // This component doesn't render anything
};