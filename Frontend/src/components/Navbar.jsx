import { Link } from "react-router-dom";
import {
    LogOut,
    MessageSquare,
    User,
    LogIn,
    Tv,
    Clapperboard,
    Droplet,
    Sun,
    Moon,
    Search
} from "lucide-react";
import { useUserStore } from "../store/useUserStore.js";
import useMovieStore from "../store/useMovieStore.js";
import useTvShowStore from "../store/useTvShowStore.js";
import { useState } from "react";
import { useTheme } from '../store/useThemeStore.jsx';

const Navbar = () => {
    const { logout, authUser } = useUserStore();
    const { movies } = useMovieStore();
    const { tvShows } = useTvShowStore();
    const { lightMode, toggleLightMode } = useTheme();

    const [searchTerm, setSearchTerm] = useState("");

    const filteredResults = [...movies, ...tvShows].filter((item) => {
        const name = item.title || item.name || "";
        return name.toLowerCase().startsWith(searchTerm.toLowerCase());
    });

    const capitalize = (str) => {
        if (!str) return "";
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    return (
        <header className="border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80">
            <div className="container mx-auto px-4 h-16 relative">
                <div className="flex items-center justify-between h-full">
                    {/* left side */}
                    <div className="flex items-center gap-8">
                        <Link
                            to="/"
                            className="flex items-center gap-2.5 hover:opacity-80 transition-all"
                        >
                            <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                                <MessageSquare className="w-5 h-5 text-primary" />
                            </div>
                            <h1 className="text-lg font-bold">FilmHoynuk</h1>
                        </Link>
                    </div>

                    {/* middle side */}
                    <div className="flex-grow mx-4 max-w-md w-full hidden sm:flex relative">
                        <label className="input input-bordered flex items-center gap-2 w-full shadow-md rounded-full px-4 py-2 bg-white dark:bg-gray-800">
                            <Search className="w-4 h-4 opacity-60 text-gray-500" />
                            <input
                                type="text"
                                className="grow bg-transparent focus:outline-none text-sm"
                                placeholder="Search for movies or shows..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </label>

                        {searchTerm && (
                            <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-900 shadow-xl rounded-xl z-50 max-h-[400px] overflow-y-auto border border-gray-300 dark:border-gray-700">
                                {filteredResults.length > 0 ? (
                                    filteredResults.map((item) => (
                                        <Link
                                            key={item._id}
                                            to={item.title ? `/movies/${item._id}` : `/tvshows/${item._id}`}
                                            className="flex items-center gap-4 p-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                                            onClick={() => setSearchTerm("")}
                                        >
                                            <img
                                                src={item.photo}
                                                alt={item.title || item.name}
                                                className="w-12 h-16 object-cover rounded-md shadow-sm"
                                            />
                                            <div>
                                                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                                    {item.title || item.name}
                                                </h4>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {capitalize(item.genre?.[0]) || "Unknown"} -{" "}
                                                    {item.releaseDate
                                                        ? new Date(item.releaseDate).getFullYear()
                                                        : item.seasonNumber || "Unknown Year"}
                                                </p>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="p-4 text-sm text-gray-500 dark:text-gray-400">
                                        No results found for "<strong>{searchTerm}</strong>"
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* right side */}
                    <div className="flex items-center gap-2">
                        {authUser && authUser.fullName && (
                            <div className="hidden sm:flex items-center px-3 py-1 rounded-lg text-sm font-medium">
                                Welcome {authUser.fullName}
                            </div>
                        )}

                        <Link
                            to={"/movies"}
                            className={`btn btn-sm gap-2 transition-colors hover:opacity-80`}
                        >
                            <Clapperboard className="w-4 h-4" />
                            <span className="hidden sm:inline">Movies</span>
                        </Link>

                        <Link
                            to={"/tvshows"}
                            className={`btn btn-sm gap-2 transition-colors hover:opacity-80`}
                        >
                            <Tv className="w-4 h-4" />
                            <span className="hidden sm:inline">TvShows</span>
                        </Link>

                        <Link
                            to={"/themes"}
                            className={`btn btn-sm gap-2 transition-colors hover:opacity-80`}
                        >
                            <Droplet className="w-4 h-4" />
                            <span className="hidden sm:inline">Themes</span>
                        </Link>

                        {!authUser && (
                            <Link
                                to={"/login"}
                                className={`btn btn-sm gap-2 transition-colors hover:opacity-80`}
                            >
                                <LogIn className="w-4 h-4" />
                                <span className="hidden sm:inline">Login</span>
                            </Link>
                        )}

                        {lightMode ? (
                            <Sun
                                onClick={toggleLightMode}
                                className="cursor-pointer w-5 h-5 text-yellow-500"
                            />
                        ) : (
                            <Moon
                                onClick={toggleLightMode}
                                className="cursor-pointer w-5 h-5 text-gray-700"
                            />
                        )}

                        {authUser && (
                            <>
                                <Link
                                    to={"/profile"}
                                    className={`btn btn-sm gap-2 hover:opacity-80`}
                                >
                                    <User className="size-5" />
                                    <span className="hidden sm:inline">Profile</span>
                                </Link>

                                {authUser.email === "yelda123@hotmail.com" && (
                                    <Link
                                        to={"/admin"}
                                        className={`btn btn-sm gap-2 hover:opacity-80`}
                                    >
                                        <User className="size-5" />
                                        <span className="hidden sm:inline">Admin</span>
                                    </Link>
                                )}

                                <button
                                    className="flex gap-2 items-center hover:opacity-80"
                                    onClick={logout}
                                >
                                    <LogOut className="size-5" />
                                    <span className="hidden sm:inline">Logout</span>
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
