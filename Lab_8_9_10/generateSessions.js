import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from 'url';
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DB_FILE = join(__dirname, "db.json");

const DAYS_AHEAD = 7;
const HALLS = [1, 2, 3];
const START_HOUR = 10;
const END_HOUR = 22;
const MIN_GAP = 15;
const TIME_STEP = 5;

const getRandomShuffled = (array) => array
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

const addMinutes = (date, minutes) => new Date(date.getTime() + minutes * 60000);

const roundToNext5Minutes = (date) => {
    const ms = 1000 * 60;
    return new Date(Math.ceil(date.getTime() / (TIME_STEP * ms)) * (TIME_STEP * ms));
};

function generateSessions() {
    const raw = readFileSync(DB_FILE);
    const db = JSON.parse(raw);
    const movies = db.movies;

    const sessions = [];
    const today = new Date();

    for (let d = 0; d < DAYS_AHEAD; d++) {
        const day = new Date(today);
        day.setDate(today.getDate() + d);
        const dateString = day.toISOString().split("T")[0];

        const shownToday = new Set();
        const shuffledMovies = getRandomShuffled(movies);
        let filmIndex = 0;

        while (shownToday.size < movies.length) {
            const movie = shuffledMovies[filmIndex % movies.length];
            const hall = HALLS[filmIndex % HALLS.length];
            const dayStart = new Date(`${dateString}T${String(START_HOUR).padStart(2, "0")}:00:00Z`);
            const dayEnd = new Date(`${dateString}T${String(END_HOUR).padStart(2, "0")}:00:00Z`);
            let time = dayStart;

            while (time < dayEnd) {
                const timeRounded = roundToNext5Minutes(time);
                const endTime = addMinutes(timeRounded, movie.duration + MIN_GAP);
                if (endTime > dayEnd) break;

                const hallSessions = sessions.filter(s => s.date === dateString && s.hall === hall);
                const overlaps = hallSessions.some(s => {
                    const existingStart = new Date(`${s.date}T${s.time}:00Z`);
                    const existingEnd = addMinutes(existingStart, movies.find(m => m.id === s.movieId).duration + MIN_GAP);
                    return !(existingEnd <= timeRounded || endTime <= existingStart);
                });

                if (!overlaps) {
                    sessions.push({
                        id: sessions.length + 1,
                        movieId: movie.id,
                        date: dateString,
                        time: timeRounded.toISOString().slice(11, 16),
                        hall
                    });
                    shownToday.add(movie.id);
                    break;
                }

                time = addMinutes(timeRounded, TIME_STEP);
            }

            filmIndex++;
        }

        for (const hall of HALLS) {
            let current = new Date(`${dateString}T${String(START_HOUR).padStart(2, "0")}:00:00Z`);
            const end = new Date(`${dateString}T${String(END_HOUR).padStart(2, "0")}:00:00Z`);

            while (current < end) {
                const currentRounded = roundToNext5Minutes(current);
                const hallSessions = sessions.filter(s => s.date === dateString && s.hall === hall);

                const isTimeOccupied = hallSessions.some(s => {
                    const sStart = new Date(`${s.date}T${s.time}:00Z`);
                    const sEnd = addMinutes(sStart, movies.find(m => m.id === s.movieId).duration + MIN_GAP);
                    return !(sEnd <= currentRounded || addMinutes(currentRounded, 1) <= sStart);
                });

                if (isTimeOccupied) {
                    current = addMinutes(current, TIME_STEP);
                    continue;
                }

                const todayCounts = {};
                for (const m of movies) todayCounts[m.id] = 0;
                for (const s of sessions.filter(s => s.date === dateString)) {
                    todayCounts[s.movieId]++;
                }

                const sortedMovies = [...movies].sort((a, b) => todayCounts[a.id] - todayCounts[b.id]);

                let sessionAdded = false;

                for (const movie of sortedMovies) {
                    const endTime = addMinutes(currentRounded, movie.duration + MIN_GAP);
                    if (endTime > end) continue;

                    const overlaps = hallSessions.some(s => {
                        const existingStart = new Date(`${s.date}T${s.time}:00Z`);
                        const existingEnd = addMinutes(existingStart, movies.find(m => m.id === s.movieId).duration + MIN_GAP);
                        return !(existingEnd <= currentRounded || endTime <= existingStart);
                    });

                    if (!overlaps) {
                        sessions.push({
                            id: sessions.length + 1,
                            movieId: movie.id,
                            date: dateString,
                            time: currentRounded.toISOString().slice(11, 16),
                            hall
                        });
                        current = endTime;
                        sessionAdded = true;
                        break;
                    }
                }

                if (!sessionAdded) {
                    current = addMinutes(current, TIME_STEP);
                }
            }
        }
    }

    db.sessions = sessions;
    writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
    console.log(`Згенеровано ${sessions.length} сеанс(ів) і додано до db.json`);
}

generateSessions();
