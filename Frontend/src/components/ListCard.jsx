import { useNavigate } from 'react-router-dom';
import { useTheme } from '../store/useThemeStore';  // useTheme import

const ListCard = ({ movie, route }) => {
    const navigate = useNavigate();
    const { lightMode } = useTheme();  // tema bilgisini alıyoruz
    const rating = movie.averageRating ?? 0;

    const getRatingColor = (value) => {
        if (value >= 7) return 'text-green-500';
        if (value >= 5) return 'text-yellow-500';
        return 'text-red-500';
    };

    const handleClick = () => {
        navigate(`/${route}/${movie._id}`);
    };

    return (
        <div
            onClick={handleClick}
            className={`
                cursor-pointer w-full max-w-4xl flex items-center rounded-xl shadow hover:shadow-lg transition-shadow duration-200 p-4
                ${lightMode
                    ? "bg-gray-800 text-white border border-gray-700"  // Light mode’da koyu arka plan, beyaz yazı
                    : "bg-base-100 text-black border border-gray-200"    // Dark modda açık arka plan, koyu yazı (örnek)
                }
            `}
        >
            {/* Photo */}
            <div className="flex-shrink-0 mr-6">
                <img
                    src={movie.photo}
                    alt={movie.title}
                    className="w-20 h-20 rounded-full object-cover border-2 border-base-200"
                />
            </div>

            {/* Title and Description */}
            <div className="flex-1 text-center">
                <h2 className="text-xl font-semibold mb-1">{movie.title}</h2>
                <p className="text-sm text-gray-300 line-clamp-3">{movie.description}</p> {/* Açık yazı için gri ton */}
            </div>

            {/* Rating */}
            <div className={`ml-6 text-lg font-bold ${getRatingColor(rating)}`}>
                ⭐ {rating.toFixed(1)}
            </div>
        </div>
    );
};

export default ListCard;
