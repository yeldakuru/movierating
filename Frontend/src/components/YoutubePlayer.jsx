// src/components/YouTubePlayer.jsx
const YouTubePlayer = ({ trailerLink }) => {
    const getYouTubeEmbedUrl = (url) => {
        try {
            const urlObj = new URL(url);
            const videoId = urlObj.searchParams.get("v");
            return `https://www.youtube.com/embed/${videoId}`;
        } catch {
            return `https://www.youtube.com/embed/${url}`;
        }
    };

    return (
        <div className="aspect-video w-full max-w-4xl mx-auto rounded-xl overflow-hidden shadow-lg my-4">
            <iframe
                src={getYouTubeEmbedUrl(trailerLink)}
                title="YouTube Trailer"
                frameBorder="0"
                allowFullScreen
                className="w-full h-full"
            ></iframe>
        </div>
    );
};

export default YouTubePlayer;
