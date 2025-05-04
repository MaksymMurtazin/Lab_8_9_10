import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
//import CinemaHall from "../components/CinemaHall";
import "./Booking.css";

function Booking() {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedSession, setSelectedSession] = useState("");
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:3001/movies/${id}`)
            .then((res) => {
                if (!res.ok) throw new Error("Фільм не знайдено");
                return res.json();
            })
            .then((data) => setMovie(data))
            .catch((err) => {
                console.error(err);
                setError(err.message);
            });
    }, [id]);

    const availableDates = ["2025-05-03", "2025-05-04", "2025-05-05"];
    const availableSessions = ["10:00", "14:00", "18:00", "21:00"];

    if (error) return <p>❌ {error}</p>;
    if (!movie) return <p>Завантаження...</p>;

    return (
        <div className="booking-container">
            <div className="movie-details">
                <img src={import.meta.env.BASE_URL + movie.poster} alt={movie.title} className="poster" />

                <div className="details">
                    <h2>{movie.title}</h2>
                    <p><strong>Оригінальна назва:</strong> {movie.originalTitle}</p>
                    <p><strong>Рік:</strong> {movie.year}</p>
                    <p><strong>Режисер:</strong> {movie.director}</p>
                    <p><strong>Жанр:</strong> {movie.genre}</p>
                    <p><strong>Тривалість:</strong> {movie.duration} хв</p>
                    <p><strong>Країна:</strong> {movie.country}</p>

                    <div className="selectors">
                        <label>
                            Дата:
                            <select value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}>
                                <option value="">Оберіть дату</option>
                                {availableDates.map((date) => (
                                    <option key={date} value={date}>{date}</option>
                                ))}
                            </select>
                        </label>

                        <label>
                            Сеанс:
                            <select value={selectedSession} onChange={(e) => setSelectedSession(e.target.value)}>
                                <option value="">Оберіть сеанс</option>
                                {availableSessions.map((time) => (
                                    <option key={time} value={time}>{time}</option>
                                ))}
                            </select>
                        </label>
                    </div>
                </div>
            </div>

            {selectedDate && selectedSession && (
                <CinemaHall date={selectedDate} time={selectedSession} movieId={id} />
            )}
        </div>
    );
}

export default Booking;
