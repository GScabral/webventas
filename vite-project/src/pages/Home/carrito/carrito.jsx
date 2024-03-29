import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  eliminarProductoCarrito,
  vaciarCarrito,
  actualizarCarrito,
  actualizarVariante,
  addPedido,
} from "../../../redux/action";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
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


  console.log(carrito)

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
  
    if (producto.variantes.length === 0) {
      console.error('El producto no tiene variantes disponibles.');
      return;
    }
  
    const cantidadDisponible = producto.variantes[0].cantidad_disponible;
  
    console.log('Cantidad elegida antes de incrementar:', producto.cantidad_elegida); // Agregar este log
  
    if (producto.cantidad_elegida < cantidadDisponible) {
      producto.cantidad_elegida++;
      dispatch(actualizarCarrito(nuevoCarrito));
      console.log('Cantidad elegida después de incrementar:', producto.cantidad_elegida); // Agregar este log
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
  
    if (producto.cantidad_elegida === 1) {
      console.error('La cantidad mínima es 1');
      return;
    }
  
    console.log('Cantidad elegida antes de decrementar:', producto.cantidad_elegida); // Agregar este log
  
    producto.cantidad_elegida--;
    dispatch(actualizarCarrito(nuevoCarrito));
    console.log('Cantidad elegida después de decrementar:', producto.cantidad_elegida); // Agregar este log
  };

  const calcularTotal = () => {
    let total = 0;

    carrito.forEach((item) => {
      const precioNumerico = parseFloat(item.precio);
      const cantidad = item.cantidad_elegida || 1;

      total += precioNumerico * cantidad || 0;
    });

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
    const pedido = carrito.map(producto => ({
      id: producto.id,
      nombre:producto.nombre,
      cantidad: producto.cantidad_elegida,
      color: producto.variantes[0].color,
      talla: producto.variantes[0].talla
    }));

    await dispatch(addPedido(pedido));

    // Llamar a actualizarVariante después de que se agregue correctamente el pedido
    carrito.forEach(producto => {
       console.log()
  
      dispatch(actualizarVariante(producto.variantes[0].idVariante, producto.cantidad_elegida));
    });

    const numeroPedidoSimulado = Math.floor(Math.random() * 1000000);
    setNumeroPedido(numeroPedidoSimulado);
    setMostrarModal(true);
    dispatch(vaciarCarrito());
  } catch (error) {
    console.error("Error al realizar cambios", error);
  }
};

  useEffect(() => {
    if (errorStock) {
      setMostrarModal(false);
    }
  }, [errorStock]);

  return (
    <div className="carrito-fondo">
      <div className="carrito">
        {carrito && carrito.length > 0 ? (
          <table className="carrito-table">
            <thead>
              <tr>
                <th className="carrito-th">Producto</th>
                <th className="carrito-th">Descripción</th>
                <th className="carrito-th">Color</th>
                <th className="carrito-th">Talle</th>
                <th className="carrito-th">Cantidad</th>
                <th className="carrito-th">Eliminar</th>
              </tr>
            </thead>
            <tbody>
              {carrito.map((producto, index) => (
                <tr key={index}>
                  <td className="carrito-td">
                    <img className="producto-imagen" src={`http://localhost:3004${producto.imagenes[0]}`} alt="" />
                  </td>
                  <td className="carrito-td">{producto.descripcion}</td>
                  <td className="carrito-td">{producto.variantes[0].color}</td>
                  <td className="carrito-td">{producto.variantes[0].talla}</td>
                  <td className="carrito-td">
                    <div className="cantidad-acciones">
                      <span className="cantidad-carrito">{producto.cantidad_elegida}</span>
                      <div className="boton-cantidad-div">
                        <button className="boton-cantidad" onClick={() => decrementarCantidad(index)}>-</button>
                      </div>
                      <div className="boton-cantidad-div">
                        <button className="boton-cantidad" onClick={() => incrementarCantidad(index)}>+</button>
                      </div>
                    </div>
                  </td>
                  <td className="carrito-td">
                    <button className="boton-eliminar" onClick={() => eliminarDeCarrito(index)}>
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="mensaje-vacio">No hay productos en el carrito</p>
        )}
        <p className="total">Total: <span id="total">{calcularTotal()}</span></p>
        <button className="boton-carrito boton-vaciar" onClick={() => dispatch(vaciarCarrito())}>
          Vaciar Carrito
        </button>
        <Link to="/" className="enlace-home">
          <button className="boton-carrito boton-volver">Volver a la Home</button>
        </Link>
        <button className="boton-carrito pedido-carrito" onClick={handleRealizarPedido}>
          Realizar Pedido
        </button>
        {mostrarModal && (
          <div className="modal-compra">
            <div className="modal-content-compra">
              <span className="close-compra" onClick={() => setMostrarModal(false)}>&times;</span>
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
        <div className="formas-pago">
          <p>Formas de pago:</p>
          <div className="logos-pago">
            <a href="#URL_MercadoPago">
              <img className="logo-pago" src="icons8-mercado-pago-48.png" alt="Mercado Pago" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Carrito;
