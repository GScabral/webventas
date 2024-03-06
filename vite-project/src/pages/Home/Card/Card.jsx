import React, { useState, useEffect } from 'react';
import './card.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { agregarAlCarrito, agregarFav } from '../../../redux/action'; // Asegúrate de importar actualizarVariante
import { all } from 'axios';

const Card = ({ id, nombre, descripcion, categoria, precio, imagenes, variantes }) => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [cantidad, setCantidad] = useState(1);
  const [cantidadMaxima, setCantidadMaxima] = useState(false);
  const [talleSeleccionado, setTalleSeleccionado] = useState('');
  const [colorSeleccionado, setColorSeleccionado] = useState('');
  const [confirmacionCarrito, setConfirmacionCarrito] = useState(false);
  const [confirmacionFav, setConfirmacionFav] = useState(false);
  const [botonHabilitado, setBotonHabilitado] = useState(true);
  const [coloresDisponibles, setColoresDisponibles] = useState([]);


  const carrito = useSelector(state => state.carrito);
  const allProductos = useSelector(state => state.allProductos);
  const variantesDisponibles = variantes || [];




  const handleAgregarAlCarrito = () => {
    setShowModal(true);
  };

  const handleAgregarFav = () => {

    const producto = {
      id,
      nombre,
      precio,
      imagenes,
      descripcion,
    };

    dispatch(agregarFav(producto));
    setConfirmacionFav(true);
    setTimeout(() => setConfirmacionFav(false), 3000);
  };

  const confirmarAgregarAlCarrito = () => {
    if (!talleSeleccionado || !colorSeleccionado) {
      alert('Por favor, selecciona un talle y un color antes de agregar al carrito.');
      return;
    }

    const varianteSeleccionada = variantesDisponibles.find(
      (variante) => variante.talla.toLowerCase() === talleSeleccionado.toLowerCase() && variante.color === colorSeleccionado
    );

    if (!varianteSeleccionada) {
      console.error('No se encontró la variante seleccionada. Por favor, intenta nuevamente.');
      return;
    }

    if (cantidad <= 0 || cantidad > varianteSeleccionada.cantidad_disponible) {
      alert('La cantidad seleccionada excede el stock disponible para este producto o es inválida.');
      return;
    }

    const productoConVariantes = {
      id,
      nombre,
      descripcion,
      categoria,
      precio,
      imagenes,
      variantes: [
        {
          idVariante: variantes[0].idVariante, // Suponiendo que solo hay una variante por producto
          talla: talleSeleccionado,
          color: colorSeleccionado,
          cantidad_disponible: variantes[0].cantidad_disponible
        }
      ],
      cantidad_elegida:cantidad,
    };

    

    dispatch(agregarAlCarrito(productoConVariantes));
    setShowModal(false);
    setConfirmacionCarrito(true);
    setTimeout(() => setConfirmacionCarrito(false), 3000);
  };

  const handleTalleChange = (e) => {
    const talleSeleccionado = e.target.value;
    setTalleSeleccionado(talleSeleccionado); // Actualizar el estado del talle seleccionado
    setColorSeleccionado('');

    const coloresParaTalle = variantesDisponibles
      .filter((variante) => variante.talla.toLowerCase() === talleSeleccionado.toLowerCase())
      .map((variante) => variante.color);

    setColoresDisponibles(coloresParaTalle);

    const varianteSeleccionada = variantesDisponibles.find(
      (variante) => variante.talla.toLowerCase() === talleSeleccionado.toLowerCase() && variante.color === colorSeleccionado
    );

    if (varianteSeleccionada) {
      const cantidadDisponible = varianteSeleccionada.cantidad_disponible;
      setCantidad(cantidadDisponible > 0 ? Math.max(1, Math.min(cantidad, cantidadDisponible)) : 0);
      setBotonHabilitado(cantidadDisponible > 0);
    }
  };

  const handleColorChange = (e) => {
    const colorSeleccionado = e.target.value;
    setColorSeleccionado(colorSeleccionado);

    const varianteSeleccionada = variantesDisponibles.find(
      (variante) => variante.talla.toLowerCase() === talleSeleccionado.toLowerCase() && variante.color === colorSeleccionado
    );

    if (varianteSeleccionada) {
      const cantidadDisponible = varianteSeleccionada.cantidad_disponible;
      setCantidad(cantidadDisponible > 0 ? Math.max(1, Math.min(cantidad, cantidadDisponible)) : 0);
      setBotonHabilitado(cantidadDisponible > 0);
    }
  };
  const incrementarCantidad = () => {
    if (!talleSeleccionado || !colorSeleccionado) {
      console.error('Error: Talle o color no definidos.');
      return;
    }

    const varianteSeleccionada = variantesDisponibles.find(
      (variante) => variante.talla.toLowerCase() === talleSeleccionado.toLowerCase() && variante.color === colorSeleccionado
    );

    if (varianteSeleccionada) {
      const cantidadDisponible = varianteSeleccionada.cantidad_disponible;

      if (cantidad < cantidadDisponible) {
        const nuevaCantidad = cantidad + 1;
        setCantidad(nuevaCantidad);
        setBotonHabilitado(true);
      } else {
        setCantidadMaxima(true);
        setTimeout(() => {
          setCantidadMaxima(false);
          setBotonHabilitado(false);
        }, 3000);
      }
    }
  };

  const decrementarCantidad = () => {
    if (!talleSeleccionado || !colorSeleccionado) {
      console.error('Error: Talle o color no definidos.');
      return;
    }
  
    const varianteSeleccionada = variantesDisponibles.find(
      (variante) => variante.talla.toLowerCase() === talleSeleccionado.toLowerCase() && variante.color === colorSeleccionado
    );
  
    if (varianteSeleccionada && cantidad > 1) {
      const nuevaCantidad = cantidad - 1;
      setCantidad(nuevaCantidad);
      setBotonHabilitado(true);
    } else {
      console.log('La cantidad mínima es 1');
    }
  };

  useEffect(() => {
    setColorSeleccionado('');
  }, [talleSeleccionado]);

  const tallesDisponibles = [...new Set(variantesDisponibles.map((variante) => variante.talla))];


  return (
    <div className="card-container">
      {confirmacionCarrito && <div className="confirmation-message">¡Producto agregado al carrito!</div>}
      {confirmacionFav && <div className="confirmation-message">¡Producto agregado a favoritos!</div>}
      {showModal && (
        <div className="modal-card">
          <div className="modal-content-card">
            <span className="close" onClick={() => setShowModal(false)}>
              &times;
            </span>
            <h2>Agregar al Carrito</h2>
            <label htmlFor="talle">Talle:</label>
            <select
              id="talle"
              value={talleSeleccionado}
              onChange={handleTalleChange}
              className='clases-card'
            >
              <option className='option-card' value="">Selecciona un talle</option>
              {tallesDisponibles.map((talle, idx) => (
                <option className='option-card' key={`talle-${idx}`} value={talle}>
                  {talle}
                </option>
              ))}
            </select>
            <label htmlFor="color">Color:</label>
            <select
              id="color"
              value={colorSeleccionado}
              onChange={handleColorChange}
              className='clases-card'
            >
              <option value="">Selecciona un color</option>
              {coloresDisponibles.map((color, idx) => (
                <option className='option-card' key={`color-${idx}`} value={color}>
                  {color}
                </option>
              ))}
            </select>
            <button onClick={incrementarCantidad} disabled={!botonHabilitado}>
              +
            </button>
            <input
              type="number"
              id="cantidad"
              value={cantidad}
              className='clases-card'
              onChange={(e) => {
                const nuevaCantidad = parseInt(e.target.value, 10) || 1;
                if (nuevaCantidad <= cantidadMaxima) {
                  setCantidad(nuevaCantidad);
                }
              }}
            />
            <button onClick={decrementarCantidad} >
              -
            </button>
            <button onClick={confirmarAgregarAlCarrito} disabled={!botonHabilitado}>
              Agregar al Carrito
            </button>
          </div>
        </div>
      )}
      <Link to={`/detail/${id}`} className="card-link">
        <div className="card-content">
          <img className="card-imagen" src={`http://localhost:3004${imagenes[0]}`} alt="" />
          <span className="card-categoria">{categoria}</span>
          <p className="card-inf">{descripcion}</p>
          <h3 className="card-precio">${precio}</h3>
        </div>
      </Link>
      <div className="card-buttons">
        <button className="card-detail" onClick={handleAgregarAlCarrito}>
          <FontAwesomeIcon icon={faShoppingCart} />
        </button>
        <button className="card-favorite" onClick={handleAgregarFav}>
          <FontAwesomeIcon icon={faHeart} />
        </button>
      </div>
    </div>
  );
};

export default Card;