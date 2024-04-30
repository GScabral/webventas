import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { getProductos, paginado } from "../../redux/action";
import './home.css'
import './homeresponsive.css'
import Nav from "./Nav/Nav";
import Cards from "./Cards/Cards";
import FiltrosSidebar from "./barralado/filtros";
import Carrito from "./carrito/carrito";
import Carousel from "./carrusel/carrusel";
import { Link } from "react-router-dom";



const Home = () => {
  const dispatch = useDispatch();
  const allProductos = useSelector((state) => state.allProductos);
  const currentPage = useSelector((state) => state.currentPage);
  const totalPages = useSelector((state) => state.totalPages);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [productosEnCarrito, setProductosEnCarrito] = useState([]); // Estado para almacenar los productos del carrito
  const [productosEnFav, setProductosEnFav] = useState([]);



  useEffect(() => {
    dispatch(getProductos());
  }, [dispatch]);

  const paginate = (event) => {
    dispatch(paginado(event.target.name));
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };


  const agregarAlCarrito = (producto, precio) => {
    // Lógica para agregar producto al carrito
    const nuevoProducto = {
      producto: producto,
      precio: precio
    };
    setProductosEnCarrito([...productosEnCarrito, nuevoProducto]);
  };


  const agregarFav = (producto, precio) => {
    // Lógica para agregar producto al carrito
    const nuevoProducto = {
      producto: producto,
      precio: precio
    };
    setProductosEnFav([...productosEnFav, nuevoProducto]);
  };

  return (
    <div className="home-fondo">
      <div className={`sidebar-container ${sidebarVisible ? 'show' : ''}`}>
        <Link to="/admin/principal">
          <img className="logo-tienda" src="public\logo.jpeg" alt="logo" />
        </Link>
        <FiltrosSidebar />
      </div>
      {/* <Carousel /> */}
      <div className={`main-content ${sidebarVisible ? 'sidebar-open' : ''}`}>
        <div className="Home-container">
          {allProductos.map((producto) => (
            <Cards key={producto.id} producto={producto} agregarAlCarrito={agregarAlCarrito} agregarFav={agregarFav} />
          ))}
        </div>
        <div className="botones-paginado">
          <button
            className="arrow-paginado"
            name="prev"
            onClick={() => currentPage > 1 && dispatch(paginado("prev"))}
            disabled={currentPage === 1}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <div>
            <ul className="paginado"> {/* Asegúrate de que la clase sea "paginado" */}
              {Array.from({ length: totalPages }, (_, index) => (
                <li key={index}><a href="#">{index + 1}</a></li>
              ))}
            </ul>
          </div>
          <button
            className="arrow-paginado"
            name="next"
            onClick={() => currentPage < totalPages && dispatch(paginado("next"))}
            disabled={currentPage === totalPages}
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>

      </div>
      <footer className="contacto-home">
        <p>Encontranos en Ontiveros 1069 entre Gabriela Mistral y Gregorio de la Ferrere
          <a href={"https://maps.app.goo.gl/s6qNmbvebfZF7XLo9"}>
            <img className="logo" src="pngwing.com (9).png" alt="GoogleMaps" />
          </a>
          <a href={"https://www.instagram.com/amore_mio.showroom?igsh=MXBhdjRua3ltem44cQ=="}>
            <img className="logo" src="\instagram.png" alt="Instagram" />
          </a>
        </p>
        <div className="logos-container">
          <a href={"https://wa.me/message/CTLCYWOO7XTML1"}>
            <img className="whatsapp-logo " src="\whatssap.png" alt="WhatsApp" />
          </a>
        </div>
      </footer>
    </div>


  );
};

export default Home;