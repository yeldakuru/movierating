import React from "react";

const Footer = () => {
    return (
        <footer className="bg-base-200 text-base-content px-6 py-10">
            <div className="max-w-7xl mx-auto grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                {/* Logo & Description */}
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <svg
                            width="40"
                            height="40"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            className="fill-current text-primary"
                        >
                            <path d="M4 4h16v16H4z" fill="none" />
                            <path d="M12 2L15 8H9L12 2zM3 10v8a2 2 0 002 2h14a2 2 0 002-2v-8H3z" />
                        </svg>
                        <span className="text-xl font-bold">MovieVerse</span>
                    </div>
                    <p className="text-base-content/70">
                        Discover and track your favorite movies and TV shows. Rate and review with ease.
                    </p>
                </div>

                {/* Watch Section */}
                <div>
                    <h6 className="text-lg font-semibold mb-3">Watch</h6>
                    <ul className="space-y-2">
                        <li>
                            <a href="/movies" className="link link-hover">All Movies</a>
                        </li>
                        <li>
                            <a href="/tvshows" className="link link-hover">All TV Shows</a>
                        </li>
                    </ul>
                </div>

                {/* Account Section */}
                <div>
                    <h6 className="text-lg font-semibold mb-3">Account</h6>
                    <ul className="space-y-2">
                        <li>
                            <a href="/login" className="link link-hover">Login</a>
                        </li>
                        <li>
                            <a href="/signup" className="link link-hover">Sign Up</a>
                        </li>
                    </ul>
                </div>

                {/* Social Media */}
                <div>
                    <h6 className="text-lg font-semibold mb-3">Follow Us</h6>
                    <div className="flex gap-5">
                        <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
                            <svg className="w-6 h-6 hover:text-primary transition" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M22 12a10 10 0 10-11.5 9.9v-7h-2v-3h2v-2c0-2 1.2-3 3-3 .9 0 1.8.1 2 .1v2h-1c-1 0-1.3.6-1.3 1.2v1.7h2.3l-.3 3h-2v7A10 10 0 0022 12z" />
                            </svg>
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
                            <svg className="w-6 h-6 hover:text-primary transition" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm5 5.5a4.5 4.5 0 110 9 4.5 4.5 0 010-9zm4.5-.5a1 1 0 110 2 1 1 0 010-2z" />
                            </svg>
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter">
                            <svg className="w-6 h-6 hover:text-primary transition" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.3 4.3 0 001.88-2.37 8.6 8.6 0 01-2.72 1.04 4.28 4.28 0 00-7.3 3.9A12.13 12.13 0 013 5.16a4.27 4.27 0 001.32 5.7 4.24 4.24 0 01-1.94-.54v.05a4.28 4.28 0 003.44 4.19 4.3 4.3 0 01-1.93.07 4.28 4.28 0 003.99 2.97A8.58 8.58 0 012 19.54a12.07 12.07 0 006.56 1.92c7.88 0 12.2-6.54 12.2-12.2 0-.19 0-.37-.01-.56A8.7 8.7 0 0022.46 6z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>

            {/* Footer Bottom */}
            <div className="mt-10 text-center text-sm text-base-content/60">
                © {new Date().getFullYear()} MovieVerse. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
