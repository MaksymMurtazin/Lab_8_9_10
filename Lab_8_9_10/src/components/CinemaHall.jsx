import { useState } from "react";
import "./CinemaHall.css";

function CinemaHall({ date, time, movieId }) {
    const rows = 5;
    const seatsPerRow = 10;

    const [selectedSeats, setSelectedSeats] = useState([]);

    const toggleSeat = (row, seat) => {
        const seatId = `${row}-${seat}`;
        setSelectedSeats((prev) =>
            prev.includes(seatId)
                ? prev.filter((id) => id !== seatId)
                : [...prev, seatId]
        );
    };

    return (
        <div className="cinema-hall-container">
            <h3>Оберіть місця</h3>
            <div className="screen">Екран</div>

            <div className="hall-grid">
                {[...Array(rows)].map((_, rowIndex) => (
                    <div className="row" key={rowIndex}>
                        {[...Array(seatsPerRow)].map((_, seatIndex) => {
                            const seatId = `${rowIndex + 1}-${seatIndex + 1}`;
                            const isSelected = selectedSeats.includes(seatId);

                            return (
                                <button
                                    key={seatId}
                                    className={`seat ${isSelected ? "selected" : ""}`}
                                    onClick={() =>
                                        toggleSeat(rowIndex + 1, seatIndex + 1)
                                    }
                                >
                                    {seatIndex + 1}
                                </button>
                            );
                        })}
                    </div>
                ))}
            </div>

            {selectedSeats.length > 0 && (
                <div className="selected-info">
                    <h4>Вибрані місця:</h4>
                    <ul>
                        {selectedSeats.map((seat) => {
                            const [row, seatNumber] = seat.split("-");
                            return (
                                <li key={seat}>
                                    Ряд {row}, Місце {seatNumber}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default CinemaHall;
