export const Footer = () => {
    return (
        <footer className="bg-gray-50 py-8 mt-12">
            <div className="container mx-auto px-4 text-center text-gray-600 text-sm tracking-wider">
                <p className="transform hover:translate-y-1 transition-transform duration-500 inline-block">
                    © {new Date().getFullYear()} Utkarsh Tayade Photography. All
                    rights reserved.
                </p>
            </div>
        </footer>
    );
};
