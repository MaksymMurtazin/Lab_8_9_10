import moviesData from "./data/movies";
import { useState } from "react";
import MovieList from "./components/MovieList";
import "./index.css";

function App() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedGenre, setSelectedGenre] = useState("");

    const movies = moviesData;

    const filteredMovies = movies.filter((movie) => {
        const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesGenre = selectedGenre ? movie.genre === selectedGenre : true;
        return matchesSearch && matchesGenre;
    });

    const uniqueGenres = [...new Set(movies.map((movie) => movie.genre))];

    return (
        <div className="container">
            <h1>Кінотеатр Movie House</h1>

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

            <MovieList movies={filteredMovies} />
        </div>
    );
}

export default App;