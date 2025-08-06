import { useEffect, useState } from "react";
import useAdminStore from "../store/useAdminStore";
import { Loader, Trash2, Pen } from "lucide-react";

const formatDateForInput = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return isNaN(date) ? "" : date.toISOString().split("T")[0];
};

const AdminPage = () => {
    const {
        items,
        fetchItems,
        createMovie,
        createTvShow,
        deleteItem,
        updateItem,
        creating,
        selectedItem,
        isEditing,
        setEditingItem,
    } = useAdminStore();

    const [type, setType] = useState("movie");
    const [formData, setFormData] = useState({});
    const [file, setFile] = useState(null);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    useEffect(() => {
        if (selectedItem) {
            const isTv = selectedItem.seasonNumber;
            setType(isTv ? "tv" : "movie");

            const prepared = {
                ...selectedItem,
                releaseDate: selectedItem.releaseDate?.split("T")[0] || "", // format yyyy-MM-dd
                endDate: selectedItem.endDate?.split("T")[0] || "",         // optional
            };

            setFormData(prepared);
        }
    }, [selectedItem]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();

        // Append all fields except 'photo'
        Object.entries(formData).forEach(([key, val]) => {
            if (key !== "photo") data.append(key, val);
        });

        // Append file as 'photo' if selected
        if (file) data.append("photo", file);

        if (isEditing) {
            await updateItem(data, selectedItem._id, type === "movie" ? "movies" : "tvshows");
        } else {
            type === "movie" ? await createMovie(data) : await createTvShow(data);
        }

        setFormData({});
        setFile(null);
        fetchItems();
    };

    return (
        <div className="pt-20 p-4 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">🎬 Admin Panel</h1>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-3 mb-8 border p-4 rounded">
                <select
                    className="border px-2 py-1"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    disabled={isEditing}
                >
                    <option value="movie">Movie</option>
                    <option value="tv">TV Show</option>
                </select>

                <input
                    name="title"
                    value={formData.title || ""}
                    onChange={handleChange}
                    placeholder="Title"
                    className="input"
                />
                <input
                    name="description"
                    value={formData.description || ""}
                    onChange={handleChange}
                    placeholder="Description"
                    className="input"
                />
                <input
                    name="genre"
                    value={formData.genre || ""}
                    onChange={handleChange}
                    placeholder="Genre"
                    className="input"
                />
                <input
                    type="date"
                    name="releaseDate"
                    value={formatDateForInput(formData.releaseDate)}
                    onChange={(e) =>
                        setFormData({ ...formData, releaseDate: e.target.value })
                    }
                    className="input"
                />
                <input
                    name="trailerLink"
                    value={formData.trailerLink || ""}
                    onChange={handleChange}
                    placeholder="Trailer Link"
                    className="input"
                />
                <input
                    name="director"
                    value={formData.director || ""}
                    onChange={handleChange}
                    placeholder="Director"
                    className="input"
                />
                <input
                    name="cast"
                    value={formData.cast || ""}
                    onChange={handleChange}
                    placeholder="Cast"
                    className="input"
                />

                {type === "movie" ? (
                    <input
                        name="duration"
                        value={formData.duration || ""}
                        onChange={handleChange}
                        placeholder="Duration (mins)"
                        className="input"
                    />
                ) : (
                    <>
                        <input
                            name="seasonNumber"
                            value={formData.seasonNumber || ""}
                            onChange={handleChange}
                            placeholder="Season #"
                            className="input"
                        />
                        <input
                            name="episodeNumber"
                            value={formData.episodeNumber || ""}
                            onChange={handleChange}
                            placeholder="Episode #"
                            className="input"
                        />
                        <input
                            name="endDate"
                            type="date"
                            value={formatDateForInput(formData.endDate)}
                            onChange={handleChange}
                            className="input"
                        />
                    </>
                )}

                <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="file-input"
                />

                {/* Show current image preview when editing */}
                {isEditing && formData.photo && (
                    <img
                        src={formData.photo}
                        alt="Current"
                        className="w-32 h-auto rounded mb-2"
                    />
                )}

                <button
                    type="submit"
                    disabled={creating}
                    className="btn bg-blue-600 text-white w-full"
                >
                    {creating ? <Loader className="animate-spin mx-auto" /> : isEditing ? "Update" : "Create"}
                </button>
            </form>

            {/* ITEM LIST */}
            <div className="grid gap-3">
                {items.map((item) => (
                    <div
                        key={item._id}
                        className="border rounded p-3 flex justify-between items-center"
                    >
                        <div>
                            <p className="font-semibold">{item.title}</p>
                            <p className="text-sm text-gray-600">
                                {item.seasonNumber
                                    ? `TV Show - S${item.seasonNumber}`
                                    : "Movie"}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                className="text-green-600 hover:underline"
                                onClick={() => setEditingItem(item)}
                            >
                                <Pen size={18} />
                            </button>
                            <button
                                className="text-red-600 hover:underline"
                                onClick={() => deleteItem(item)}
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminPage;