import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CinemaHall from "../components/CinemaHall";
import BookingForm from "../components/BookingForm";
import "./Booking.css";

function Booking() {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [availableDates, setAvailableDates] = useState([]);
    const [availableTimes, setAvailableTimes] = useState([]);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedSession, setSelectedSession] = useState("");
    const [selectedSeats, setSelectedSeats] = useState([]);
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
                const now = new Date();
                const futureSessions = data.filter(session => {
                    const sessionDateTime = new Date(`${session.date}T${session.time}`);
                    return sessionDateTime >= now;
                });

                setSessions(futureSessions);
                const uniqueDates = [...new Set(futureSessions.map(s => s.date))];
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

    const handleBookingRequest = (seats) => {
        setSelectedSeats(seats);
    };

    if (error) return <p>❌ {error}</p>;
    if (!movie) return <p>Завантаження...</p>;

    return (
        <div className="booking-container">
            <div className="movie-details">
                <img src={import.meta.env.BASE_URL + movie.poster} alt={movie.title} className="poster" />

                <div className="details">
                    <h2 className="movie-title">Назва: {movie.title}</h2>
                    <p><strong>Оригінальна назва:</strong> {movie.originalTitle}</p>
                    <p><strong>Рік:</strong> {movie.year}</p>
                    <p><strong>Режисер:</strong> {movie.director}</p>
                    <p><strong>Жанр:</strong> {movie.genre}</p>
                    <p><strong>Тривалість:</strong> {movie.duration} хв</p>
                    <p><strong>Країна:</strong> {movie.country}</p>

                    <div className="selectors">
                        <label className="select-label">
                            Дата:
                            <select
                                className="select-input"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                            >
                                <option value="">Оберіть дату</option>
                                {availableDates.map((date) => (
                                    <option key={date} value={date}>{date}</option>
                                ))}
                            </select>
                        </label>

                        <label className="select-label">
                            Сеанс:
                            <select
                                className="select-input"
                                value={selectedSession}
                                onChange={(e) => setSelectedSession(e.target.value)}
                                disabled={!selectedDate}
                            >
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
                <CinemaHall
                    date={selectedDate}
                    time={selectedSession}
                    movieId={id}
                    onBookingRequest={handleBookingRequest}
                />
            )}

            {selectedSeats.length > 0 && (
                <BookingForm
                    movieId={id}
                    date={selectedDate}
                    time={selectedSession}
                    selectedSeats={selectedSeats}
                    onClearSeats={() => setSelectedSeats([])}
                />
            )}
            <ToastContainer />
        </div>
    );
}

export default Booking;
