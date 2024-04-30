import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getById } from "../../../redux/action";
import { useDispatch, useSelector } from "react-redux";
import { agregarAlCarrito } from "../../../redux/action";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";
import './detail.css';

const Detail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const info = useSelector((state) => state.info);
  const [talleSeleccionado, setTalleSeleccionado] = useState("");
  const [colorSeleccionado, setColorSeleccionado] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [cantidadDisponible, setCantidadDisponible] = useState(0);
  const [coloresDisponibles, setColoresDisponibles] = useState([]);
  const [imagenActual, setImagenActual] = useState(0);
  const [showModal, setShowModal] = useState(false);




  const handleTalleChange = (event) => {
    const talleSeleccionado = event.target.value;
    setTalleSeleccionado(talleSeleccionado);
    setColorSeleccionado('');

    // Filtrar las variantes por el talle seleccionado
    const variantesPorTalle = info.variantes.filter((variante) => variante.talla.toLowerCase() === talleSeleccionado.toLowerCase());

    // Obtener los colores disponibles para el talle seleccionado
    const coloresParaTalle = variantesPorTalle.map((variante) => variante.color);
    setColoresDisponibles(coloresParaTalle);

    // Obtener la cantidad disponible para el talle seleccionado
    const cantidadDisponible = variantesPorTalle.reduce((total, variante) => total + variante.cantidad_disponible, 0);
    setCantidadDisponible(cantidadDisponible);

    // Si el color seleccionado no está disponible para el talle seleccionado, reiniciar la cantidad
    if (!coloresParaTalle.includes(colorSeleccionado)) {
      setCantidad(1);
    }
  };

  const handleColorChange = (event) => {
    const colorSeleccionado = event.target.value;
    setColorSeleccionado(colorSeleccionado);

    // Obtener la variante correspondiente al talle y color seleccionados
    const varianteSeleccionada = info.variantes.find((variante) =>
      variante.talla.toLowerCase() === talleSeleccionado.toLowerCase() &&
      variante.color === colorSeleccionado
    );

    // Actualizar la cantidad disponible según la variante seleccionada
    if (varianteSeleccionada) {
      setCantidadDisponible(varianteSeleccionada.cantidad_disponible);

      // Si la cantidad seleccionada excede la cantidad disponible, ajustarla
      if (cantidad > varianteSeleccionada.cantidad_disponible) {
        setCantidad(varianteSeleccionada.cantidad_disponible);
      }
    }
  };

  const handleCantidadChange = (event) => {
    let cantidad = parseInt(event.target.value);
    if (cantidad <= 0) {
      cantidad = 1; // Establecer la cantidad mínima como 1 si la cantidad ingresada es menor o igual a 0
    } else if (cantidad > cantidadDisponible) {
      cantidad = cantidadDisponible; // Establecer la cantidad máxima como la cantidad disponible
    }
    setCantidad(cantidad);
  };

  const handleImageChange = (index) => {
    setImagenActual(index);
  };

  const handleAgregarAlCarrito = () => {
    if (!talleSeleccionado || !colorSeleccionado) {
      alert('Por favor, selecciona un talle y un color antes de agregar al carrito.');
      return;
    }
    if (cantidad <= 0 || cantidad > info.cantidad) {
      alert('La cantidad seleccionada excede el stock disponible para este producto o es inválida.');
      return;
    }
    const producto = {
      id: info.id,
      nombre: info.nombre,
      precio: info.precio,
      imagenes: info.variantes[imagenActual].imagenes, // Acceder a las imágenes de la variante seleccionada
      descripcion: info.descripcion,
      categoria: info.categoria,
      talle: talleSeleccionado,
      color: colorSeleccionado,
      cantidad: cantidad,
    };
    dispatch(agregarAlCarrito(producto));
    setShowModal(false);
  };

  useEffect(() => {
    if (id) {
      dispatch(getById(id));
    }
  }, [id, dispatch]);

  return (
    <div className="detail-background">
      {info && (
        <div className="detail-container">
          <div className="detail-imagen-container">
            {info && info.variantes && info.variantes.length > 0 && (
              <div className="detail-imagen-container">
                <img
                  className="detail-imagen"
                  src={`http://localhost:3004/${info.variantes[imagenActual].imagenes[0]}`}
                  alt=""
                />
                <div className="imagen-buttons">
                  {info.variantes
                    .reduce((acc, variante) => {
                      variante.imagenes.forEach((imagen) => {
                        if (!acc.includes(imagen)) {
                          acc.push(imagen);
                        }
                      });
                      return acc;
                    }, [])
                    .map((imagen, index) => (
                      <button
                        key={index}
                        className={`imagen-button ${index === imagenActual ? 'active' : ''}`}
                        onClick={() => handleImageChange(index)}
                      >
                        {index + 1}
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>
          <div className="detail-content">
            <p className="detail-title">{info.nombre}</p>
            <p className="detail-description">{info.descripcion}</p>
            <p className="detail-details">Precio: ${info.precio}</p>
            <div className="selecion-detail">
              <div className="selecion-content-detail">
                <label htmlFor="talle">Talle:</label>
                <select id="talle" value={talleSeleccionado} onChange={handleTalleChange}>
                  <option value="">Selecciona un talle</option>
                  {info.variantes &&
                    info.variantes.map((variante, index) => (
                      <option key={index} value={variante.talla}>
                        {variante.talla}
                      </option>
                    ))}
                </select>
                <label htmlFor="color">Color:</label>
                <select id="color" value={colorSeleccionado} onChange={handleColorChange}>
                  <option value="">Selecciona un color</option>
                  {coloresDisponibles.map((color, index) => (
                    <option key={index} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
                <label htmlFor="cantidad">Cantidad:</label>
                <input
                  type="number"
                  id="cantidad"
                  value={cantidad}
                  min="1"
                  max={cantidadDisponible}
                  onChange={handleCantidadChange}
                />
                <button onClick={handleAgregarAlCarrito}>Agregar al Carrito</button>
              </div>
            </div>
          </div>
        </div>
      )}
      <Link className="volver" to={"/"}>
        Volver
      </Link>
    </div>
  );
  
};

export default Detail;
