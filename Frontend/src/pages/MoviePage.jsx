import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useMovieStore from "../store/useMovieStore";
import { useUserStore } from "../store/useUserStore";
import { Star, ThumbsUp } from "lucide-react";
import ReactPlayer from "react-player";

const MoviePage = () => {
    const { id } = useParams();
    const { movie, loading, error, getMovieById } = useMovieStore();
    const { authUser } = useUserStore();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);

    useEffect(() => {
        const fetch = async () => {
            const data = await getMovieById(id);
            if (data) {
                const stored = localStorage.getItem(`comments-${id}`);
                if (stored) {
                    setComments(JSON.parse(stored));
                } else {
                    const initialComments = (data.comments || []).map((c) => ({
                        ...c,
                        likesCount: c.likesCount || 0,
                        likedByUser: false,
                    }));
                    setComments(initialComments);
                }
                setRating(data.userRating || 0);
            }
        };
        fetch();
    }, [id, getMovieById]);

    useEffect(() => {
        localStorage.setItem(`comments-${id}`, JSON.stringify(comments));
    }, [comments, id]);

    const handleRating = (value) => {
        setRating(value);
        // Buraya API göndermek istersen kod yazabilirsin
    };

    const handleAddComment = () => {
        if (!authUser) {
            alert("Yorum yapmak için giriş yapmalısınız.");
            return;
        }
        if (!comment.trim()) return;

        const newComment = {
            id: Date.now(),
            user: authUser.username || authUser.name || "Anonymous",
            text: comment.trim(),
            date: new Date().toISOString(),
            likesCount: 0,
            likedByUser: false,
        };

        setComments((prev) => [newComment, ...prev]);
        setComment("");
    };

    const toggleLikeComment = (commentId) => {
        setComments((prev) =>
            prev.map((c) =>
                c.id === commentId
                    ? {
                        ...c,
                        likedByUser: !c.likedByUser,
                        likesCount: c.likedByUser ? c.likesCount - 1 : c.likesCount + 1,
                    }
                    : c
            )
        );
    };

    if (loading) return <div className="mt-16 text-white">Loading...</div>;
    if (error) return <div className="mt-16 text-red-500">{error}</div>;
    if (!movie) return <div className="mt-16 text-white">Movie not found.</div>;

    const formattedDate = movie.releaseDate
        ? new Date(movie.releaseDate).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
        : "Unknown";

    return (
        <div className="relative min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white">
            <div
                className="absolute inset-0 -z-10 opacity-20 blur-md bg-cover bg-center"
                style={{ backgroundImage: `url(${movie.photo})` }}
                aria-hidden="true"
            />

            <main className="max-w-7xl mx-auto px-4 pt-20 pb-12 space-y-12">
                {/* Movie Details */}
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
                                ⭐ {typeof movie.averageRating === "number" ? movie.averageRating.toFixed(1) : "?"}
                            </span>
                            <span>{formattedDate}</span>
                            <span>{movie.duration} min</span>
                        </div>
                        <p className="text-gray-200">{movie.description}</p>
                        <h2 className="text-2xl font-semibold">Details</h2>
                        {movie.director && <p><strong>Director:</strong> {movie.director}</p>}
                        {movie.cast && <p><strong>Cast:</strong> {movie.cast.join(", ")}</p>}
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

                {/* Trailer */}
                <section className="bg-zinc-800 p-6 rounded-xl shadow-lg">
                    <h2 className="text-4xl font-semibold mb-4">🎬 Trailer</h2>
                    {movie.trailerLink ? (
                        <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
                            <ReactPlayer url={movie.trailerLink} width="100%" height="100%" controls />
                        </div>
                    ) : (
                        <p className="text-gray-400">No trailer available.</p>
                    )}
                </section>

                {/* Comments */}
                <section className="bg-zinc-800 p-6 rounded-xl shadow-lg max-w-5xl mx-auto">
                    <h2 className="text-2xl font-semibold mb-6">💬 Comments</h2>

                    <div className="flex flex-col gap-4 mb-6">
                        <textarea
                            rows={4}
                            className="w-full p-3 rounded bg-zinc-700 text-white resize-none"
                            placeholder="Write a comment..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <button
                            onClick={handleAddComment}
                            className="self-end bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded text-white font-medium"
                        >
                            Add Comment
                        </button>
                    </div>

                    <div className="space-y-4 max-h-96 overflow-y-auto">
                        {comments.length === 0 ? (
                            <p className="text-gray-400 italic">No comments yet. Be the first!</p>
                        ) : (
                            comments.map((c) => (
                                <article
                                    key={c.id}
                                    className="bg-zinc-700 p-4 rounded shadow flex justify-between items-start"
                                >
                                    <div>
                                        <header className="text-sm text-gray-300 mb-2 font-semibold flex justify-between gap-4">
                                            <span>{c.user}</span>
                                            <time>{new Date(c.date).toLocaleString()}</time>
                                        </header>
                                        <p className="text-white">{c.text}</p>
                                    </div>
                                    <button
                                        onClick={() => toggleLikeComment(c.id)}
                                        className={`flex items-center gap-1 text-sm select-none ${c.likedByUser ? "text-green-400" : "text-gray-400"
                                            } hover:text-green-500 transition`}
                                    >
                                        <ThumbsUp className="w-5 h-5" />
                                        <span>{c.likesCount}</span>
                                    </button>
                                </article>
                            ))
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default MoviePage;
