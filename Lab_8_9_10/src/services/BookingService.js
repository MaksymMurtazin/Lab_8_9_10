const STORAGE_KEY = "bookings";

const getAllBookings = () => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
};

const saveBooking = (movieId, date, time, seats, userInfo) => {
    const bookings = getAllBookings();

    const sessionKey = `${movieId}_${date}_${time}`;

    if (!bookings[sessionKey]) {
        bookings[sessionKey] = [];
    }

    const alreadyBooked = bookings[sessionKey].flatMap(b => b.seats);
    const newSeats = seats.filter(seat => !alreadyBooked.includes(seat));

    if (newSeats.length === 0) return;

    bookings[sessionKey].push({
        seats: newSeats,
        userInfo,
        timestamp: new Date().toISOString(),
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
};

const getBookedSeats = (movieId, date, time) => {
    const bookings = getAllBookings();
    const sessionKey = `${movieId}_${date}_${time}`;

    if (!bookings[sessionKey]) return [];

    return bookings[sessionKey].flatMap((b) => b.seats);
};

export const BookingService = {
    getBookedSeats,
    saveBooking,
};
