import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';

const ListCard = ({ content, route }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/${route}/${content._id}`);
    };

    return (
        <div
            onClick={handleClick}
            className="flex flex-col md:flex-row items-center bg-base-200 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer max-w-4xl mx-auto w-full"
        >
            <img
                src={content.photo}
                alt={content.title}
                className="w-full md:w-64 h-64 object-cover"
            />

            <div className="p-6 flex flex-col justify-between h-full w-full">
                <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold text-base-content truncate flex-shrink">
                        {content.title}
                    </h2>

                    <div
                        className="inline-flex items-center bg-base-300 rounded px-3 py-1 select-none"
                        style={{ gap: '6px' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Star className="w-5 h-5 fill-yellow-400" />
                        <span className="text-base font-semibold text-yellow-600">
                            {content.averageRating?.toFixed(1) || '0.0'}
                        </span>
                    </div>
                </div>

                <p className="text-base text-base-content mt-4 line-clamp-3">
                    {content.description}
                </p>

                <button
                    className="btn btn-primary mt-6 w-max"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleClick();
                    }}
                >
                    View Details
                </button>
            </div>
        </div>
    );
};

export default ListCard;
