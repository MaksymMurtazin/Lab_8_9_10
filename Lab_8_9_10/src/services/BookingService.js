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

    bookings[sessionKey].push({
        seats,
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
