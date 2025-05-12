import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BookingService } from "../services/BookingService";
import "./BookingForm.css";

function BookingForm({ movieId, date, time, selectedSeats, onSuccess }) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        if (!name.trim()) newErrors.name = "Ім'я є обов'язковим";
        if (!phone.trim()) {
            newErrors.phone = "Телефон є обов'язковим";
        } else if (!/^(\+\d{1,3}[- ]?)?\d{10}$/.test(email)) {
            newErrors.email = "Некоректний формат телефону";
        }
        if (!email.trim()) {
            newErrors.email = "Email є обов'язковим";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = "Некоректний формат email";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        BookingService.saveBooking({
            movieId,
            date,
            time,
            seats: selectedSeats,
            name,
            phone,
            email
        });

        toast.success("Бронювання успішно збережено!");
        onSuccess();
    };

    return (
        <form className="booking-form" onSubmit={handleSubmit}>
            <h3>Заповніть форму для бронювання</h3>

            <div className="form-group">
                <label>Ім’я:</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                {errors.name && <span className="error">{errors.name}</span>}
            </div>

            <div className="form-group">
                <label>Телефон:</label>
                <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />
                {errors.phone && <span className="error">{errors.phone}</span>}
            </div>

            <div className="form-group">
                <label>Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <span className="error">{errors.email}</span>}
            </div>

            <button type="submit" className="submit-button">
                Підтвердити бронювання
            </button>
        </form>
    );
}

export default BookingForm;
