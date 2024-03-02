import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import './searchBar.css'

const SearchBar = ({ onSearch, onClearSearch, value }) => {
    const [name, setName] = useState(value || "");

    const handleChange = (event) => {
        setName(event.target.value);
       
        // Verifica si el texto está vacío y llama a onClearSearch
        if (event.target.value.trim() === "") {
            onClearSearch();
        }
    };

    const handleSearch = () => {
        if (name.trim() !== "") {
            onSearch(name);
        }
    };

    return (
        <div className="div-search">
            <input
                type="search"
                onChange={handleChange}
                value={name}
                placeholder="Buscar productos..."
            />
            <button className="lupa" onClick={handleSearch}>
                <FontAwesomeIcon icon={faSearch} />
            </button>
        </div>
    );
}

export default SearchBar;