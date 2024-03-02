import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  eliminarProductoCarrito,
  vaciarCarrito,
  actualizarCarrito,
  actualizarVariante,
  addPedido
} from "../../../redux/action";
import "./carrito.css";

const Carrito = () => {
  const carrito = useSelector((state) => state.carrito);
  const allProductos = useSelector((state) => state.allProductos);
  const [cantidadMinima, setCantidadMinima] = useState({});
  const [cantidadMaxima, setCantidadMaxima] = useState({});
  const [errorStock, setErrorStock] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [numeroPedido, setNumeroPedido] = useState(null);
  const dispatch = useDispatch();

  const eliminarDeCarrito = (index) => {
    dispatch(eliminarProductoCarrito(index));
  };

console.log(carrito)

  const incrementarCantidad = (index) => {
    const productoEnCarrito = carrito[index];

    if (productoEnCarrito && productoEnCarrito.totalDisponible > 0) {
      const nuevoCarrito = [...carrito];

      if (productoEnCarrito.cantidad < productoEnCarrito.totalDisponible) {
        nuevoCarrito[index] = {
          ...productoEnCarrito,
          cantidad: productoEnCarrito.cantidad + 1,
        };
        dispatch(actualizarCarrito(nuevoCarrito));
      } else {
        setCantidadMaxima((prev) => ({ ...prev, [index]: true }));
        setTimeout(() => {
          setCantidadMaxima((prev) => ({ ...prev, [index]: false }));
        }, 3000);
      }
    } else {
      console.error('Producto en carrito o cantidad total no definidos o inválidos.');
    }
  };

  const decrementarCantidad = (index) => {
    const productoEnCarrito = carrito[index];
    const nuevoCarrito = [...carrito];

    if (productoEnCarrito.cantidad > 1) {
      nuevoCarrito[index] = {
        ...productoEnCarrito,
        cantidad: productoEnCarrito.cantidad - 1,
      };
      dispatch(actualizarCarrito(nuevoCarrito));
    } else {
      setCantidadMinima((prev) => ({ ...prev, [index]: true }));
      setTimeout(() => {
        setCantidadMinima((prev) => ({ ...prev, [index]: false }));
      }, 3000);
    }
  };

  const calcularTotal = () => {
    let total = 0;
    let totalPrendas = 0;

    carrito.forEach((item) => {
      const precioNumerico = parseFloat(item.precio);
      const cantidad = item.cantidad || 1;

      total += precioNumerico * cantidad || 0;
      totalPrendas += cantidad;
    });

    if (totalPrendas >= 3) {
      const descuento = 500 * (totalPrendas - 2); // Descuento de 500 por prenda a partir de la tercera
      total -= descuento;
    }

    if (total >= 50000 && total < 100000) {
      const descuento = total * 0.1;
      total -= descuento;
    } else if (total >= 100000 && total < 150000) {
      const descuento = total * 0.2;
      total -= descuento;
    }

    return total.toFixed(2);
  };

  const handleRealizarPedido = async () => {
    try {
      for (const producto of carrito) {
        const { id, cantidad, idVariante, color, talle } = producto;
        const productoEnStock = allProductos.find((p) => p.id === id);
  
        if (!productoEnStock) {
          console.error(`Producto con ID ${id} no encontrado en allProductos.`);
          return;
        }
  
        const variante = productoEnStock.variantes.find(
          (v) => v.idVariante === idVariante && v.color === color && v.talle === talle
        );
  
        if (!variante) {
          console.error(`Variante del producto con ID ${id}, color ${color} y talla ${talle} no encontrada.`);
          return;
        }
  
        const nuevaCantidadDisponible = variante.cantidad_disponible - cantidad;
  
        if (nuevaCantidadDisponible < 0) {
          console.error(`No hay suficiente cantidad en stock para el producto con ID ${id}`);
          const nombreProducto = productoEnStock.nombre;
          alert(`Lo sentimos, no hay suficiente cantidad en stock para el producto "${nombreProducto}". Por favor, ajusta la cantidad en tu carrito.`);
          setErrorStock(true);
          return;
        }
  
        // Actualiza la cantidad disponible de la variante
        variante.cantidad_disponible = nuevaCantidadDisponible;
  
        // Llama a actualizarVariante para actualizar la base de datos
        await dispatch(actualizarVariante(id, variante));
      }
  
      // Si no hay errores de stock, procede con el pedido
      if (!errorStock) {
        // Generar un número de pedido simulado
        const numeroPedidoSimulado = Math.floor(Math.random() * 1000000);
        setNumeroPedido(numeroPedidoSimulado);
  
        // Mostrar el modal
        setMostrarModal(true);
  
        // Finalmente, vacía el carrito después de realizar el pedido
        dispatch(vaciarCarrito());
      }
    } catch (error) {
      console.error("Error al realizar cambios", error);
    }
  };

  useEffect(() => {
    if (errorStock) {
      setMostrarModal(false); // Ocultar el modal si hay un error de stock
    }
  }, [errorStock]);

  return (
    <div className="carrito">
      <h2 className="carrito-titulo">Carrito de Compras</h2>
      {carrito && carrito.length > 0 ? (
        <ul className="lista-productos">
          {carrito.map((producto, index) => (
            <li key={index} className="producto">
              <div className="producto-info">
                <p className="producto-detalle">Talle: {producto.talle}</p>
                <p className="producto-detalle">Color: {producto.color}</p>
                {producto.imagenes && producto.imagenes.length > 0 && (
                  <img className="producto-imagen" src={producto.imagenes[0]} alt={producto.nombre} />
                )}
                <p className="producto-nombre">{producto.nombre}</p>
                <p className="producto-precio">${producto.precio} c/u</p>
              </div>
              <div className="producto-acciones">
                <button className="boton-carrito boton-cantidad" onClick={() => decrementarCantidad(index)}>
                  -
                </button>
                <span className="cantidad-carrito">{producto.cantidad}</span>
                <button className="boton-carrito boton-cantidad" onClick={() => incrementarCantidad(index)}>
                  +
                </button>
                <button className="boton-carrito boton-eliminar" onClick={() => eliminarDeCarrito(index)}>
                  Eliminar
                </button>
                {cantidadMinima[index] && <div className="mensaje-error">La cantidad mínima es 1</div>}
                {cantidadMaxima[index] && <div className="mensaje-error">La cantidad máxima depende del stock disponible</div>}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mensaje-vacio">No hay productos en el carrito</p>
      )}
      <p className="total">Total: <span id="total">{calcularTotal()}</span></p>
      <div className="formas-pago">
        <p>Formas de pago:</p>
        <div className="logos-pago">
          <a href="#URL_MercadoPago">
            <img className="logo-pago" src="icons8-mercado-pago-48.png" alt="Mercado Pago" />
          </a>
          {/* <a href="#URL_Visa">
            <img className="logo-pago" src="icons8-visa-48.png" alt="Visa" />
          </a>
          <a href="#URL_Mastercard">
            <img className="logo-pago" src="icons8-mastercard-48.png" alt="Mastercard" />
          </a> */}
        </div>
      </div>
      <button className="boton-carrito boton-vaciar" onClick={() => dispatch(vaciarCarrito())}>
        Vaciar Carrito
      </button>
      <Link to="/" className="enlace-home">
        <button className="boton-carrito boton-volver">Volver a la Home</button>
      </Link>
      <button className="pedido-compra" onClick={handleRealizarPedido}>
        Realizar Pedido
      </button>
      {mostrarModal && (
        <div className="modal-compra">
          <div className="modal-content-compra">
            <span className="close-compra" onClick={() => setMostrarModal(false)}>
              &times;
            </span>
            <h2>Número de pedido: {numeroPedido}</h2>
            <p>
              Utiliza este número de pedido para retirar tu producto en la tienda física.
            </p>
            <p>
              Si deseas recibir el producto en tu casa, comunícate{" "}
              <a href={"https://wa.me/message/CTLCYWOO7XTML1"}>aquí</a>.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Carrito;
