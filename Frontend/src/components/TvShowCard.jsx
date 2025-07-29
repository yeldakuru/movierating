import { useNavigate } from 'react-router-dom';

const TvShowCard = (props) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/tvshow/${props.a._id}`);
    };

    return (
        <div className="card bg-base-100 w-96 shadow-sm cursor-pointer">
            <figure>
                <img
                    src={props.a.photo}
                    alt={props.a.title}
                    className="h-60 w-full object-cover"
                />
            </figure>
            <div className="card-body">
                <h2 className="card-title">{props.a.title}</h2>
                <p>{props.a.description.slice(0, 100)}...</p>
                <div className="card-actions justify-end">
                    <button onClick={handleClick} className="btn btn-primary">
                        View Details
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TvShowCard;