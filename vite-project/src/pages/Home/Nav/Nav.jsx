import React, { useState, useEffect } from "react";
import SearchBar from "../SearchBar/SearchBar";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { buscar, getProductos } from "../../../redux/action";
import Carousel from "../carrusel/carrusel";
import { useDispatch, useSelector } from "react-redux";
// import './Navresponsive.css'
import './Nav.css';



const Nav = ({ onSearch }) => {
    const dispatch = useDispatch();
    const currentPage = useSelector((state) => state.currentPage);
    const [searchText, setSearchText] = useState("");

    const handleSearch = (nombre) => {
        console.log("esto se busca", nombre);
        dispatch(buscar(nombre));
    };


    const handleClearSearch = () => {
        // Limpiar el texto del buscador y cargar todos los productos nuevamente
        setSearchText("");
        dispatch(getProductos());
    };


    return (
        <div>
            <div className="back-nav">
                <Link to="/">
                    <button className="superior">Inicio</button>
                </Link>
                <Link to="/DevolucionCambio">
                    <button className="superior">Cambio/Devolucion</button>
                </Link>
                <Link to="/comoPagar">
                    <button className="superior">Venta por mayor</button>
                </Link>
                <Link to="/carrito">
                    <button className="carrito-nav">
                        <FontAwesomeIcon icon={faShoppingCart} />
                    </button>
                </Link>
                <h2 className="titulo-respon">AMORE MIO</h2>
                {window.location.pathname !== '/carrito' && (
                    <SearchBar
                        className="barra-buscar"
                        onSearch={handleSearch}
                        onClearSearch={handleClearSearch}
                        value={searchText}
                    />
                )}


            </div>

        </div>



    )
}

export default Nav;


