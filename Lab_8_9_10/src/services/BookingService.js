const STORAGE_KEY = "bookings";

const getAllBookings = () => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
};

// Функція форматування дати в "YYYY-MM-DD HH:mm"
const formatLocalDateTime = (date = new Date()) => {
    const pad = (n) => n.toString().padStart(2, '0');
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    return `${year}-${month}-${day} ${hours}:${minutes}`;
};

const saveBooking = (sessionId, seats, userInfo, sessionDate, sessionTime) => {
    const bookings = getAllBookings();

    if (!bookings[sessionId]) bookings[sessionId] = [];

    const alreadyBooked = bookings[sessionId].flatMap((b) => b.seats);
    const newSeats = seats.filter(seat => !alreadyBooked.includes(seat));
    if (newSeats.length === 0) return;

    bookings[sessionId].push({
        seats: newSeats,
        userInfo,
        bookedAt: formatLocalDateTime(new Date()),
        sessionDateTime: `${sessionDate} ${sessionTime}`,
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
};

const getBookedSeats = (sessionId) => {
    const bookings = getAllBookings();
    return bookings[sessionId]
        ? bookings[sessionId].flatMap((b) => b.seats)
        : [];
};

export const BookingService = {
    getBookedSeats,
    saveBooking,
};
