import { useState, useEffect } from "react";
import MovieList from "../components/MovieList";

function Home() {
    const [movies, setMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedGenre, setSelectedGenre] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        Promise.all([
            fetch("http://localhost:3001/movies").then((res) => {
                if (!res.ok) throw new Error("Помилка при завантаженні фільмів");
                return res.json();
            }),
            fetch("http://localhost:3001/sessions").then((res) => {
                if (!res.ok) throw new Error("Помилка при завантаженні сеансів");
                return res.json();
            }),
        ])
            .then(([moviesData, sessionsData]) => {
                const now = new Date();

                const moviesWithSessions = moviesData.map((movie) => {
                    const movieSessions = sessionsData.filter(
                        (session) =>
                            String(session.movieId) === String(movie.id) &&
                            new Date(`${session.date}T${session.time}`) >= now
                    );
                    return { ...movie, sessions: movieSessions };
                });

                setMovies(moviesWithSessions);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError(err.message);
                setIsLoading(false);
            });
    }, []);

    const filteredMovies = movies.filter((movie) => {
        const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesGenre = selectedGenre ? movie.genre === selectedGenre : true;
        return matchesSearch && matchesGenre;
    });

    const uniqueGenres = [...new Set(movies.map((movie) => movie.genre))];

    return (
        <>
            <div className="filters">
                <input
                    type="text"
                    placeholder="Пошук фільму..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <select
                    value={selectedGenre}
                    onChange={(e) => setSelectedGenre(e.target.value)}
                >
                    <option value="">Усі жанри</option>
                    {uniqueGenres.map((genre, index) => (
                        <option key={index} value={genre}>
                            {genre}
                        </option>
                    ))}
                </select>
            </div>

            {isLoading ? (
                <p>Завантаження фільмів...</p>
            ) : error ? (
                <p style={{ color: "red" }}>⚠️ {error}</p>
            ) : (
                <MovieList movies={filteredMovies} />
            )}
        </>
    );
}

export default Home;
