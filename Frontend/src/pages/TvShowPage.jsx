import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useTvShowStore from "../store/useTvShowStore.js"; // Yol doğruysa böyle bırak
import { Star, ThumbsUp } from "lucide-react";
import YouTubePlayer from "../components/youtubePlayer";
import { useTheme } from "../store/useThemeStore";

export default function TvShowPage() {
    const { id } = useParams();
    const { tvShow, getTvShowById, loading: tvLoading, error: tvError } = useTvShowStore();
    const { lightMode } = useTheme();

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);

    useEffect(() => {
        const fetch = async () => {
            const data = await getTvShowById(id);
            if (data) {
                const preparedComments = (data.comments || []).map((c) => ({
                    ...c,
                    likesCount: c.likesCount || 0,
                    likedByUser: false,
                }));
                setComments(preparedComments);
                setRating(data.userRating || 0);
            }
        };
        fetch();
    }, [id, getTvShowById]);

    const handleRating = (value) => {
        setRating(value);
        // TODO: API'ye gönderim
    };

    const handleAddComment = () => {
        if (!comment.trim()) return;
        const newComment = {
            id: Date.now(),
            user: "Guest",
            text: comment.trim(),
            date: new Date().toISOString(),
            likesCount: 0,
            likedByUser: false,
        };
        setComments((prev) => [newComment, ...prev]);
        setComment("");
        // TODO: API'ye gönderim
    };

    const toggleLikeComment = (commentId) => {
        setComments((prev) =>
            prev.map((c) => {
                if (c.id === commentId) {
                    const liked = !c.likedByUser;
                    const newLikesCount = liked ? c.likesCount + 1 : c.likesCount - 1;
                    return { ...c, likedByUser: liked, likesCount: newLikesCount };
                }
                return c;
            })
        );
    };

    if (tvLoading) return <div className="text-center text-xl mt-20 text-white">Loading...</div>;
    if (tvError) return <div className="text-center mt-20 text-red-500">{tvError}</div>;
    if (!tvShow) return <div className="text-center mt-20 text-white">TV Show not found.</div>;

    const formattedDate = tvShow.releaseDate
        ? new Date(tvShow.releaseDate).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
        : "Unknown";

    return (
        <div
            className="relative min-h-screen"
            style={{
                backgroundColor: lightMode ? "#ffffff" : undefined,
                color: "white",
            }}
        >
            <div
                className="absolute inset-0 -z-10 opacity-20 blur-md bg-cover bg-center"
                style={{ backgroundImage: `url(${tvShow.photo})`, display: lightMode ? "none" : "block" }}
                aria-hidden="true"
            />

            <main className="max-w-7xl mx-auto px-4 pt-20 pb-12 space-y-12">
                <section className="grid grid-cols-1 md:grid-cols-6 gap-6">
                    <div className="md:col-span-3">
                        <div className="bg-zinc-800 rounded-xl shadow-lg overflow-hidden">
                            <img
                                src={tvShow.photo}
                                alt={tvShow.title}
                                className="w-full object-cover max-h-[430px]"
                            />
                        </div>
                    </div>

                    <div className="md:col-span-3 space-y-6 bg-zinc-800 rounded-xl shadow-lg p-6">
                        <h1 className="text-4xl font-bold">{tvShow.title}</h1>

                        <div className="flex items-center gap-6 text-sm text-gray-300">
                            <span className="bg-yellow-500 text-black font-semibold px-2 py-1 rounded flex items-center gap-1">
                                ⭐ {typeof tvShow.averageRating === "number" ? tvShow.averageRating.toFixed(1) : "?"}
                            </span>
                            <span>{formattedDate}</span>
                            <span>{tvShow.seasons ? `${tvShow.seasons} seasons` : ""}</span>
                        </div>

                        <p className="text-gray-200 leading-relaxed">{tvShow.description}</p>

                        <h2 className="text-2xl font-semibold mb-4">Details</h2>
                        {tvShow.creator && <p><strong>Creator:</strong> {tvShow.creator}</p>}
                        {tvShow.cast && <p><strong>Cast:</strong> {tvShow.cast.join(", ")}</p>}
                        {tvShow.genre && (
                            <p>
                                <strong>Genres:</strong> {Array.isArray(tvShow.genre) ? tvShow.genre.join(", ") : tvShow.genre}
                            </p>
                        )}

                        <section className="flex items-center gap-2 mt-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <Star
                                    key={i}
                                    onClick={() => handleRating(i)}
                                    className={`w-7 h-7 cursor-pointer transition ${i <= rating ? "text-yellow-400" : "text-gray-600"}`}
                                />
                            ))}
                            <span className="ml-2 text-lg text-gray-300">
                                {rating > 0 ? `You rated: ${rating}/5` : "Rate this TV Show"}
                            </span>
                        </section>
                    </div>

                    <div className="md:col-span-6 space-y-6 bg-zinc-800 rounded-xl shadow-lg p-6">
                        <h2 className="text-2xl font-semibold mb-4 text-white">Trailer</h2>

                        {tvShow?.trailerLink ? (
                            <YouTubePlayer trailerLink={tvShow.trailerLink} />
                        ) : (
                            <p className="text-gray-400">No trailer available.</p>
                        )}
                    </div>
                </section>

                {/* Comments Section */}
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
                            disabled={comment.trim() === ""}
                            className="self-end bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded text-white font-medium disabled:opacity-50"
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
                                        <header className="text-sm text-gray-300 mb-2 font-semibold flex justify-between">
                                            <span>{c.user}</span>
                                            <time>{new Date(c.date).toLocaleString()}</time>
                                        </header>
                                        <p className="text-white">{c.text}</p>
                                    </div>

                                    <button
                                        onClick={() => toggleLikeComment(c.id)}
                                        className={`flex items-center gap-1 text-sm select-none ${c.likedByUser ? "text-green-400" : "text-gray-400"
                                            } hover:text-green-500 transition`}
                                        aria-pressed={c.likedByUser}
                                        aria-label={c.likedByUser ? "Unlike comment" : "Like comment"}
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
}
