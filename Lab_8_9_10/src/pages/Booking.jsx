import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
//import CinemaHall from "../components/CinemaHall";
import "./Booking.css";

function Booking() {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [availableDates, setAvailableDates] = useState([]);
    const [availableTimes, setAvailableTimes] = useState([]);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedSession, setSelectedSession] = useState("");
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:3001/movies/${id}`)
            .then((res) => {
                if (!res.ok) throw new Error("Фільм не знайдено");
                return res.json();
            })
            .then(setMovie)
            .catch((err) => {
                console.error(err);
                setError(err.message);
            });
    }, [id]);

    useEffect(() => {
        fetch(`http://localhost:3001/sessions?movieId=${id}`)
            .then((res) => res.json())
            .then((data) => {
                setSessions(data);
                const uniqueDates = [...new Set(data.map(s => s.date))];
                setAvailableDates(uniqueDates);
            })
            .catch((err) => {
                console.error("Помилка при завантаженні сеансів:", err);
            });
    }, [id]);

    useEffect(() => {
        if (selectedDate) {
            const times = sessions
                .filter(s => s.date === selectedDate)
                .map(s => s.time);
            setAvailableTimes(times);
            setSelectedSession("");
        }
    }, [selectedDate, sessions]);

    if (error) return <p>❌ {error}</p>;
    if (!movie) return <p>Завантаження...</p>;

    return (
        <div className="booking-container">
            <div className="movie-details">
                <img src={import.meta.env.BASE_URL + movie.poster} alt={movie.title} className="poster" />

                <div className="details">
                    <h2>Назва: {movie.title}</h2>
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
                            <select value={selectedSession} onChange={(e) => setSelectedSession(e.target.value)} disabled={!selectedDate}>
                                <option value="">Оберіть сеанс</option>
                                {availableTimes.map((time) => (
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