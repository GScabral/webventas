import React, { useState, useEffect } from "react";
import SearchBar from "../SearchBar/SearchBar";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { buscar, getProductos } from "../../../redux/action";
import Carousel from "../carrusel/carrusel";
import { useDispatch, useSelector } from "react-redux";
// import { faSync } from '@fortawesome/free-solid-svg-icons';
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
                {/* <Link to="/newUser">
                    <button className="superior">Crear Cuenta</button>
                </Link>
                 <Link to="/iniciar">
                    <button className="superior">Iniciar sesión</button>
                </Link>  */}
                {/* <Link to="/Favorito">
                    <button className="superior">
                        <FontAwesomeIcon icon={faHeart} />
                    </button>
                </Link> */}
                <SearchBar
                    className="barra-buscar"
                    onSearch={handleSearch}
                    onClearSearch={handleClearSearch}
                    value={searchText}  // Pasa el valor actual del texto del buscador
                />
                <Link to="/carrito">
                    <button className="superior">
                        <FontAwesomeIcon icon={faShoppingCart} />
                    </button>
                </Link>


            </div>

            {/* <div className="Nav-dos">

                <Link>
            <button  className="inferior">QUIENES SOMOS</button>
            </Link>
                 <Link>
            <button  className="inferior">CONTACTO</button>
            </Link>
            </div>
            <Carousel/> */}
        </div>



    )
}

export default Nav;


