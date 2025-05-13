import React from 'react';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie }) => {
    const now = new Date();

    let nearestSession = null;

    if (movie.sessions && movie.sessions.length > 0) {
        nearestSession = movie.sessions
            .map((session) => {
                const sessionDateTime = new Date(`${session.date}T${session.time}`);
                return { ...session, sessionDateTime };
            })
            .filter(({ sessionDateTime }) => sessionDateTime > now)
            .sort((a, b) => a.sessionDateTime - b.sessionDateTime)[0] || null;
    }

    return (
        <Link to={`/booking/${movie.id}`} className="movie-link">
            <div className="movie-card">
                <img src={import.meta.env.BASE_URL + movie.poster} alt={movie.title} />
                <div className="movie-card-content">
                    <h3>{movie.title}</h3>
                    <p>{movie.description}</p>
                    <p>Жанр: {movie.genre}</p>

                    {nearestSession ? (
                        <p className="next-session">
                            🎬 Сеанс: {nearestSession.date}, {nearestSession.time}
                        </p>
                    ) : (
                        <p className="no-session">❌ Сеансів немає</p>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default MovieCard;
