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
  const [cantidadMinima, setCantidadMinima] = useState([]);
  const [cantidadMaxima, setCantidadMaxima] = useState([]);
  const [errorStock, setErrorStock] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [numeroPedido, setNumeroPedido] = useState(null);
  const dispatch = useDispatch();


  console.log("carrito",carrito)

  const eliminarDeCarrito = (index) => {
    dispatch(eliminarProductoCarrito(index));
  };

  const incrementarCantidad = (index) => {
    const nuevoCarrito = [...carrito];
    const producto = nuevoCarrito[index];
    
    if (!producto) {
      console.error('Producto no encontrado');
      return;
    }
  
    // Verificar si hay una variante disponible para el producto
    if (producto.variantes.length === 0) {
      console.error('El producto no tiene variantes disponibles.');
      return;
    }
  
    // Obtener la cantidad disponible para la variante
    const cantidadDisponible = producto.variantes[0].cantidad_disponible;
  
    // Verificar si la cantidad elegida es menor que la cantidad disponible
    if (producto.cantidad_elegida < cantidadDisponible) {
      // Incrementar la cantidad elegida en 1
      producto.cantidad_elegida++;
      console.log('Cantidad elegida incrementada:', producto.cantidad_elegida);
  
      // Actualizar el carrito en el estado
      dispatch(actualizarCarrito(nuevoCarrito));
    } else {
      console.warn('La cantidad máxima disponible ya ha sido alcanzada.');
    }
  }
  
  const decrementarCantidad = (index) => {
    const nuevoCarrito = [...carrito];
    const producto = nuevoCarrito[index];
    
    if (!producto) {
      console.error('Producto no encontrado');
      return;
    }
  
    // Buscamos la variante con cantidad elegida mayor que 1
   
    if (!producto.cantidad_elegida > 1) {
      console.error('La cantidad mínima es 1');
      return;
    }
  
    // Decrementamos la cantidad elegida de la variante
    producto.cantidad_elegida--;
    
    // Actualizar el carrito en el estado
    dispatch(actualizarCarrito(nuevoCarrito));
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
        const { id, cantidad, idVariante } = producto;
        const productoEnStock = allProductos.find((p) => p.id === id);

        if (!productoEnStock) {
          console.error(`Producto con ID ${id} no encontrado en allProductos.`);
          return;
        }

        const variante = productoEnStock.variantes.find((v) => v.idVariante === idVariante)

        if (!variante) {
          console.error(`Variante del producto con ID ${id}, color ${color} y talla ${talla} no encontrada.`);
          return;
        }

        const { color, talla } = variante;

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
        await dispatch(addPedido(carrito));
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
                {producto.imagenes && producto.imagenes.length > 0 && (
                  <img className="producto-imagen" src={producto.imagenes[0]} alt={producto.nombre} />
                )}
                <p className="producto-precio">${producto.precio} c/u</p>
                <div className="variantes-info">
                  {producto.variantes.map((variante, vIndex) => (
                    <div key={vIndex} className="variante">
                      <p>Talla: {variante.talla}</p>
                      <p>Color: {variante.color}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="producto-acciones">
                <button className="boton-carrito boton-cantidad" onClick={() => decrementarCantidad(index)}>
                  -
                </button>
                <span className="cantidad-carrito">{producto.cantidad_elegida}</span> {/* Aquí muestra la cantidad */}
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
