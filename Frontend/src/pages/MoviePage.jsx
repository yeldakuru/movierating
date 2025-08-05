import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useMovieStore from "../store/useMovieStore";
import { useUserStore } from "../store/useUserStore";
import useCommentStore from "../store/useCommentStore";
import { Star, ThumbsUp, Loader, Pen, Trash2 } from "lucide-react";
import YouTube from "react-youtube";
import toast from "react-hot-toast";

const MoviePage = () => {
    const { id } = useParams();
    const { movie, loading, error, getMovieById, rateMovie } = useMovieStore();
    const { authUser } = useUserStore();
    const {
        comments,
        fetchCommentsByMovie,
        addComment,
        toggleLike,
        updateComment,
        deleteComment,
        loadingComments,
    } = useCommentStore();

    const [rating, setRating] = useState(0);
    const [averageRating, setAverageRating] = useState(0);
    const [commentText, setCommentText] = useState("");
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editCommentText, setEditCommentText] = useState("");

    useEffect(() => {
        const fetch = async () => {
            await getMovieById(id);
            await fetchCommentsByMovie(id);
        };
        fetch();
    }, [id, getMovieById, fetchCommentsByMovie]);

    // movie güncellendiğinde rating ve averageRating set edelim
    useEffect(() => {
        if (movie) {
            setRating(movie.userRating || 0);
            setAverageRating(movie.averageRating || 0);
            console.log("Movie updated:", movie);
            console.log("Average rating:", movie.averageRating);
        }
    }, [movie]);

    const handleRating = async (value) => {
        if (!authUser) {
            toast.error("Please login to rate.");
            return;
        }

        const userId = authUser?._id || authUser?.id || authUser?.userId;
        if (!userId) {
            toast.error("User ID not found, please login again.");
            return;
        }

        try {
            const response = await rateMovie(id, value, userId);
            setRating(value);
            if (response.newAverageRating) {
                setAverageRating(response.newAverageRating);
            }
            toast.success("Oyunuz kaydedildi!");
        } catch (err) {
            toast.error("Oy kaydedilirken hata oluştu.");
            console.error("Rating error:", err);
        }
    };

    const handleAddComment = async () => {
        if (!authUser) {
            toast.error("Login required to comment.");
            return;
        }
        if (!commentText.trim()) {
            toast.error("Comment can't be empty.");
            return;
        }
        await addComment(id, commentText);
        setCommentText("");
    };

    const handleToggleLike = async (commentId) => {
        await toggleLike(commentId);
    };

    const formattedDate = movie?.releaseDate
        ? new Date(movie.releaseDate).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
        : "Unknown";

    const extractYouTubeId = (url) => {
        try {
            const parsedUrl = new URL(url);
            return parsedUrl.searchParams.get("v") || null;
        } catch {
            return null;
        }
    };

    const videoId = extractYouTubeId(movie?.trailerLink);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader className="size-15 animate-spin" />
            </div>
        );
    }

    if (error) return <div className="mt-16 text-red-500">{error}</div>;
    if (!movie) return <div className="mt-16 text-white">Movie not found.</div>;

    return (
        <div className="relative min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white">
            <div
                className="absolute inset-0 -z-10 opacity-20 blur-md bg-cover bg-center"
                style={{ backgroundImage: `url(${movie.photo})` }}
                aria-hidden="true"
            />

            <main className="max-w-7xl mx-auto px-4 pt-20 pb-12 space-y-12">
                <section className="grid grid-cols-1 md:grid-cols-6 gap-6">
                    <div className="md:col-span-3">
                        <img
                            src={movie.photo}
                            alt={movie.title}
                            className="w-full object-cover max-h-[430px] rounded-xl shadow-lg"
                        />
                    </div>
                    <div className="md:col-span-3 bg-zinc-800 rounded-xl shadow-lg p-6 space-y-6">
                        <h1 className="text-4xl font-bold">{movie.title}</h1>
                        <div className="flex items-center gap-6 text-sm text-gray-300">
                            <span className="bg-yellow-500 text-black font-semibold px-2 py-1 rounded flex items-center gap-1">
                                ⭐ {typeof averageRating === "number" ? averageRating.toFixed(1) : "0.0"}
                            </span>
                            <span>{formattedDate}</span>
                            <span>{movie.duration} min</span>
                        </div>
                        <p className="text-gray-200">{movie.description}</p>
                        <h2 className="text-2xl font-semibold">Details</h2>
                        {movie.director && (
                            <p>
                                <strong>Director:</strong> {movie.director}
                            </p>
                        )}
                        {movie.cast && (
                            <p>
                                <strong>Cast:</strong> {movie.cast.join(", ")}
                            </p>
                        )}
                        {movie.genre && (
                            <p>
                                <strong>Genres:</strong>{" "}
                                {Array.isArray(movie.genre) ? movie.genre.join(", ") : movie.genre}
                            </p>
                        )}

                        <section className="flex items-center gap-2 mt-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <Star
                                    key={i}
                                    onClick={() => handleRating(i)}
                                    className={`w-7 h-7 cursor-pointer transition ${i <= rating ? "text-yellow-400" : "text-gray-600"
                                        }`}
                                />
                            ))}
                            <span className="ml-2 text-lg text-gray-300">
                                {rating > 0 ? `You rated: ${rating}/5` : "Rate this movie"}
                            </span>
                        </section>
                    </div>
                </section>

                {/* Trailer ve yorumlar kısmı burada değişmedi */}
                <section className="bg-zinc-800 p-6 rounded-xl shadow-lg">
                    <h2 className="text-4xl font-semibold mb-4">🎬 Trailer</h2>
                    {videoId ? (
                        <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
                            <YouTube
                                videoId={videoId}
                                className="w-full h-full"
                                opts={{
                                    width: "100%",
                                    height: "100%",
                                    playerVars: { autoplay: 0 },
                                }}
                            />
                        </div>
                    ) : (
                        <p className="text-gray-400">No valid YouTube trailer available.</p>
                    )}
                </section>

                <section className="bg-zinc-800 p-6 rounded-xl shadow-lg max-w-5xl mx-auto">
                    <h2 className="text-2xl font-semibold mb-6">💬 Comments</h2>
                    <div className="flex flex-col gap-4 mb-6">
                        <textarea
                            rows={4}
                            className="w-full p-3 rounded bg-zinc-700 text-white resize-none"
                            placeholder="Write a comment..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                        />
                        <button
                            onClick={handleAddComment}
                            className="self-end bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded text-white font-medium"
                        >
                            Add Comment
                        </button>
                    </div>

                    <div className="space-y-4 max-h-96 overflow-y-auto">
                        {loadingComments ? (
                            <p className="text-gray-400 italic">Loading comments...</p>
                        ) : comments.length === 0 ? (
                            <p className="text-gray-400 italic">No comments yet. Be the first!</p>
                        ) : (
                            comments.map((c) => {
                                const isOwner = authUser?.username === c.user;
                                return (
                                    <article
                                        key={c.id}
                                        className="bg-zinc-700 p-4 rounded shadow flex justify-between items-start"
                                    >
                                        <div className="flex-grow">
                                            <header className="text-sm text-gray-300 mb-2 font-semibold flex  gap-4">
                                                <span>{c.user}</span>
                                                <time>
                                                    {c.date
                                                        ? new Date(c.date).toLocaleString()
                                                        : "Unknown date"}
                                                </time>
                                            </header>

                                            {editingCommentId === c.id ? (
                                                <textarea
                                                    rows={3}
                                                    className="w-full p-2 rounded bg-zinc-600 text-white resize-none"
                                                    value={editCommentText}
                                                    onChange={(e) => setEditCommentText(e.target.value)}
                                                />
                                            ) : (
                                                <p className="text-white">{c.text}</p>
                                            )}
                                        </div>

                                        <div className="flex flex-col items-end gap-2 ml-4">
                                            <button
                                                onClick={() => handleToggleLike(c.id)}
                                                className={`flex items-center gap-1 text-sm select-none ${c.likedByUser ? "text-green-400" : "text-gray-400"
                                                    } hover:text-green-500 transition`}
                                                title="Like"
                                            >
                                                <ThumbsUp className="w-5 h-5" />
                                                <span>{c.likesCount}</span>
                                            </button>

                                            {isOwner && (
                                                <>
                                                    {editingCommentId === c.id ? (
                                                        <>
                                                            <button
                                                                onClick={async () => {
                                                                    if (!editCommentText.trim()) {
                                                                        toast.error("Comment cannot be empty.");
                                                                        return;
                                                                    }
                                                                    await updateComment(c.id, editCommentText);
                                                                    setEditingCommentId(null);
                                                                }}
                                                                className="text-green-400 hover:text-green-600 text-sm"
                                                            >
                                                                Save
                                                            </button>
                                                            <button
                                                                onClick={() => setEditingCommentId(null)}
                                                                className="text-red-400 hover:text-red-600 text-sm"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <button
                                                                onClick={() => {
                                                                    setEditingCommentId(c.id);
                                                                    setEditCommentText(c.text);
                                                                }}
                                                                className="text-yellow-400 hover:text-yellow-600 text-sm"
                                                            >
                                                                <Pen />
                                                            </button>
                                                            <button
                                                                onClick={async () => {
                                                                    if (
                                                                        window.confirm(
                                                                            "Are you sure you want to delete this comment?"
                                                                        )
                                                                    ) {
                                                                        await deleteComment(c.id);
                                                                    }
                                                                }}
                                                                className="text-red-400 hover:text-red-600 text-sm"
                                                            >
                                                                <Trash2 />
                                                            </button>
                                                        </>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </article>
                                );
                            })
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default MoviePage;
