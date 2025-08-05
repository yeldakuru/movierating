import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useTvShowStore from "../store/useTvShowStore";
import { useUserStore } from "../store/useUserStore";
import useCommentStore from "../store/useCommentStore";
import { Star, ThumbsUp, Loader, Pen, Trash2 } from "lucide-react";
import YouTube from "react-youtube";
import toast from "react-hot-toast";

const TvShowPage = () => {
    const { id } = useParams();
    const { tvShow, tvLoading, tverror, getTvShowById, rateTvShow } = useTvShowStore();
    const { authUser } = useUserStore();
    const {
        comments,
        fetchCommentsByTvShow,
        addCommentTv,
        toggleLike,
        updateComment,
        deleteComment,
        loadingComments,
    } = useCommentStore();

    // Burada rating kullanıcı oyunu tutacak
    const [rating, setRating] = useState(0);
    // Ortalama puan
    const [averageRating, setAverageRating] = useState(tvShow?.averageRating || 0);
    const [commentText, setCommentText] = useState("");
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editCommentText, setEditCommentText] = useState("");

    useEffect(() => {
        const fetch = async () => {
            await getTvShowById(id);
            await fetchCommentsByTvShow(id);
        };
        fetch();
    }, [id]);

    // TV show yüklendikçe, kullanıcı oyu varsa rating state’ini güncelle
    useEffect(() => {
        setAverageRating(tvShow?.averageRating || 0);
    }, [tvShow?.averageRating]);

    const handleAddComment = async () => {
        if (!authUser) return toast.error("Login required.");
        if (!commentText.trim()) return toast.error("Comment can't be empty.");
        await addCommentTv(id, commentText);
        setCommentText("");
    };

    const handleToggleLike = async (commentId) => {
        await toggleLike(commentId);
    };

    const extractYouTubeId = (url) => {
        try {
            const parsed = new URL(url);
            return parsed.searchParams.get("v");
        } catch {
            return null;
        }
    };

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
            const response = await rateTvShow(id, value, userId);
            setRating(value);
            if (response.newAverageRating) {
                setAverageRating(response.newAverageRating);
            }
            toast.success("Oyunuz kaydedildi!");
        } catch (err) {
            toast.error("Oy kaydedilirken hata oluştu.");
        }
    };


    const videoId = extractYouTubeId(tvShow?.trailerLink);
    const formattedDate = tvShow?.releaseDate
        ? new Date(tvShow.releaseDate).toLocaleDateString()
        : "Unknown";

    if (tvLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader className="animate-spin w-10 h-10 text-white" />
            </div>
        );
    }

    if (tverror) return <p className="text-red-500 mt-16">{tverror}</p>;
    if (!tvShow) return <p className="text-white mt-16">TV Show not found.</p>;

    return (
        <div className="relative min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white">
            <div
                className="absolute inset-0 -z-10 opacity-20 blur-md bg-cover bg-center"
                style={{ backgroundImage: `url(${tvShow.photo})` }}
                aria-hidden="true"
            />

            <main className="max-w-7xl mx-auto px-4 pt-20 pb-12 space-y-12">
                <section className="grid grid-cols-1 md:grid-cols-6 gap-6">
                    <div className="md:col-span-3">
                        <img
                            src={tvShow.photo}
                            alt={tvShow.title}
                            className="w-full object-cover max-h-[430px] rounded-xl shadow-lg"
                        />
                    </div>
                    <div className="md:col-span-3 bg-zinc-800 rounded-xl shadow-lg p-6 space-y-6">
                        <h1 className="text-4xl font-bold">{tvShow.title}</h1>
                        <div className="flex items-center gap-6 text-sm text-gray-300">
                            {/* Ortalama puanı ayrı gösteriyoruz */}
                            <span className="bg-yellow-500 text-black font-semibold px-2 py-1 rounded flex items-center gap-1">
                                ⭐ {(typeof averageRating === "number" ? averageRating.toFixed(1) : "0.0")}
                            </span>


                            <span>{formattedDate}</span>
                            <span>{tvShow.duration} min</span>
                        </div>
                        <p className="text-gray-200">{tvShow.description}</p>
                        <h2 className="text-2xl font-semibold">Details</h2>
                        {tvShow.director && (
                            <p>
                                <strong>Director:</strong> {tvShow.director}
                            </p>
                        )}
                        {tvShow.cast && (
                            <p>
                                <strong>Cast:</strong> {tvShow.cast.join(", ")}
                            </p>
                        )}
                        {tvShow.genre && (
                            <p>
                                <strong>Genres:</strong>{" "}
                                {Array.isArray(tvShow.genre)
                                    ? tvShow.genre.join(", ")
                                    : tvShow.genre}
                            </p>
                        )}

                        {/* Kullanıcının verdiği oy (rating) ve tıklanabilir yıldızlar */}
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
                                {rating > 0 ? `You rated: ${rating}/5` : "Rate this TV show"}
                            </span>
                        </section>
                    </div>
                </section>

                {/* Trailer ve yorumlar kısmı aynı kaldı */}
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

export default TvShowPage;
