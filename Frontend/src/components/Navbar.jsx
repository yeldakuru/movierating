import { Link } from "react-router-dom";
import { LogOut, MessageSquare, User, LogIn, Tv, Clapperboard } from "lucide-react";
import { useUserStore } from '../store/useUserStore.js';

const Navbar = () => {

    const { logout, authUser } = useUserStore();

    return (
        <header className="border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80">
            <div className="container mx-auto px-4 h-16">
                <div className="flex items-center justify-between h-full">

                    {/* left side */}
                    <div className="flex items-center gap-8">
                        <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
                            <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                                <MessageSquare className="w-5 h-5 text-primary" />
                            </div>
                            <h1 className="text-lg font-bold">FilmHoynuk</h1>
                        </Link>
                    </div>

                    {/* right side */}

                    <div className="flex items-center gap-2">

                        {authUser && authUser.fullName && (
                            <div className="hidden sm:flex items-center px-3 py-1 rounded-lg text-sm font-medium"> {/* bg-base-200 to add background */}
                                Welcome {authUser.fullName}
                            </div>
                        )}

                        <Link to={"/movie"} className={`btn btn-sm gap-2 transition-colors hover:opacity-80`}>
                            <Clapperboard className="w-4 h-4" />
                            <span className="hidden sm:inline">Movies</span>
                        </Link>

                        <Link to={"/tvshow"} className={`btn btn-sm gap-2 transition-colors hover:opacity-80`}>
                            <Tv className="w-4 h-4" />
                            <span className="hidden sm:inline">TvShows</span>
                        </Link>

                        {!authUser && (
                            <Link to={"/login"} className={`btn btn-sm gap-2 transition-colors hover:opacity-80`}>
                                <LogIn className="w-4 h-4" />
                                <span className="hidden sm:inline">Login</span>
                            </Link>
                        )}


                        {authUser && (
                            <>
                                <Link to={"/profile"} className={`btn btn-sm gap-2 hover:opacity-80`}>
                                    <User className="size-5" />
                                    <span className="hidden sm:inline">Profile</span>
                                </Link>

                                <button className="flex gap-2 items-center hover:opacity-80" onClick={logout}>
                                    <LogOut className="size-5" />
                                    <span className="hidden sm:inline">Logout</span>
                                </button>

                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>

    )
}

export default Navbar