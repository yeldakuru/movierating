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


    const [commentText, setCommentText] = useState("");
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editCommentText, setEditCommentText] = useState("");

    useEffect(() => {
        const fetch = async () => {
            await getTvShowById(id);
            await fetchCommentsByTvShow(id);
        };
        fetch();
    }, [id, getTvShowById, fetchCommentsByTvShow]);


    const handleRate = async (value) => {
        if (!authUser) return toast.error("Login required.");
        setRating(value);
        try {
            await rateTvShow(id, value, authUser._id);
            await getTvShowById(id);
        } catch (error) {
            console.error(error);
        }
    };


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
        <div className="bg-gradient-to-b from-zinc-900 to-black min-h-screen text-white">
            <div
                className="absolute inset-0 -z-10 opacity-20 blur-md bg-cover bg-center"
                style={{ backgroundImage: `url(${tvShow.photo})` }}
            />
            <main className="max-w-6xl mx-auto pt-24 px-4 pb-12 space-y-12">
                <section className="grid grid-cols-1 md:grid-cols-6 gap-6">
                    <img
                        src={tvShow.photo}
                        alt={tvShow.title}
                        className="md:col-span-3 rounded-xl shadow-lg object-cover max-h-[430px] w-full"
                    />
                    <div className="md:col-span-3 space-y-6 bg-zinc-800 p-6 rounded-xl shadow-lg">
                        <h1 className="text-4xl font-bold">{tvShow.title}</h1>
                        <div className="flex gap-4 text-sm text-gray-300">
                            <span className="bg-yellow-500 text-black px-2 py-1 rounded font-semibold">
                                ⭐ {typeof tvShow.averageRating === "number" ? tvShow.averageRating.toFixed(1) : "?"}
                            </span>
                            <span className="text-gray-400 text-sm">
                                ({tvShow.ratingsCount || 0} rating{tvShow.ratingsCount === 1 ? "" : "s"})
                            </span>
                            <span>{formattedDate}</span>
                            <span>{tvShow.seasons || 1} season(s)</span>
                        </div>
                        <p>{tvShow.description}</p>
                        <p><strong>Genres:</strong> {Array.isArray(tvShow.genre) ? tvShow.genre.join(", ") : tvShow.genre}</p>
                        <p><strong>Cast:</strong> {tvShow.cast?.join(", ")}</p>
                        <p><strong>Creator:</strong> {tvShow.director}</p>
                        <div className="flex gap-2 mt-4">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                                <Star
                                    key={i}
                                    onClick={() => handleRate(i)}
                                    className={`w-6 h-6 cursor-pointer transition ${i <= rating ? "text-yellow-400" : "text-gray-500"}`}
                                />
                            ))}
                            <span className="ml-2 text-lg">{rating > 0 ? `You rated: ${rating}/10` : "Rate this show"}</span>
                        </div>
                    </div>
                </section>

                <section className="bg-zinc-800 p-6 rounded-xl shadow-lg">
                    <h2 className="text-3xl font-semibold mb-4">🎬 Trailer</h2>
                    {videoId ? (
                        <div className="aspect-video rounded-lg overflow-hidden">
                            <YouTube
                                videoId={videoId}
                                className="w-full h-full"
                                opts={{ width: "100%", height: "100%", playerVars: { autoplay: 0 } }}
                            />
                        </div>
                    ) : (
                        <p className="text-gray-400">No trailer available.</p>
                    )}
                </section>

                <section className="bg-zinc-800 p-6 rounded-xl shadow-lg max-w-5xl mx-auto">
                    <h2 className="text-2xl font-semibold mb-6">💬 Comments</h2>
                    <div className="flex flex-col gap-4 mb-6">
                        <textarea
                            rows={4}
                            className="w-full p-3 rounded bg-zinc-700 text-white"
                            placeholder="Write your comment..."
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
                            <p className="text-gray-400 italic">No comments yet.</p>
                        ) : (
                            comments.map((c) => {
                                const isOwner = authUser?.username === c.user;
                                return (
                                    <div key={c.id} className="bg-zinc-700 p-4 rounded shadow flex justify-between items-start">
                                        <div className="flex-grow">
                                            <div className="text-sm text-gray-300 font-semibold mb-1">
                                                {c.user} · {new Date(c.date).toLocaleString()}
                                            </div>
                                            {editingCommentId === c.id ? (
                                                <textarea
                                                    rows={3}
                                                    value={editCommentText}
                                                    onChange={(e) => setEditCommentText(e.target.value)}
                                                    className="w-full bg-zinc-600 p-2 rounded text-white"
                                                />
                                            ) : (
                                                <p>{c.text}</p>
                                            )}
                                        </div>
                                        <div className="flex flex-col items-end gap-2 ml-4">
                                            <button
                                                onClick={() => handleToggleLike(c.id)}
                                                className={`flex items-center gap-1 text-sm ${c.likedByUser ? "text-green-400" : "text-gray-400"}`}
                                            >
                                                <ThumbsUp className="w-5 h-5" />
                                                {c.likesCount}
                                            </button>
                                            {isOwner && (
                                                editingCommentId === c.id ? (
                                                    <>
                                                        <button
                                                            onClick={async () => {
                                                                if (!editCommentText.trim()) {
                                                                    return toast.error("Comment can't be empty.");
                                                                }
                                                                await updateComment(c.id, editCommentText);
                                                                setEditingCommentId(null);
                                                            }}
                                                            className="text-green-400 text-sm"
                                                        >
                                                            Save
                                                        </button>
                                                        <button
                                                            onClick={() => setEditingCommentId(null)}
                                                            className="text-red-400 text-sm"
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
                                                            className="text-yellow-400 text-sm"
                                                        >
                                                            <Pen />
                                                        </button>
                                                        <button
                                                            onClick={async () => {
                                                                if (window.confirm("Delete this comment?")) {
                                                                    await deleteComment(c.id);
                                                                }
                                                            }}
                                                            className="text-red-400 text-sm"
                                                        >
                                                            <Trash2 />
                                                        </button>
                                                    </>
                                                )
                                            )}
                                        </div>
                                    </div>
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
