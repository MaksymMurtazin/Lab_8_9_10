import React from 'react';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie }) => {
    return (
        <Link to={`/booking/${movie.id}`} className="movie-link">
            <div className="movie-card">
                <img src={import.meta.env.BASE_URL + movie.poster} alt={movie.title} />
                <div className="movie-card-content">
                    <h3>{movie.title}</h3>
                    <p>{movie.description}</p>
                    <p>Жанр: {movie.genre}</p>
                    <p>Сеанс: {movie.sessionTime}</p>
                </div>
            </div>
        </Link>
    );
};

export default MovieCard;