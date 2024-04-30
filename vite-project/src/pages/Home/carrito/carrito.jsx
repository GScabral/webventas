import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  eliminarProductoCarrito,
  vaciarCarrito,
  actualizarCarrito,
  actualizarVariante,
  addPedido,
  enviarCorreo
} from "../../../redux/action";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import "./carrito.css";


const Carrito = () => {
  const carrito = useSelector((state) => state.carrito);
  const allProductos = useSelector((state) => state.allProductos);
  const [mostrarFormularioCorreo, setMostrarFormularioCorreo] = useState(false);
  const [errorStock, setErrorStock] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [numeroPedido, setNumeroPedido] = useState(null);
  const [infoPedidoCorreo, setInfoPedidoCorreo] = useState(null);
  const [correoEnviado, setCorreoEnviado] = useState(false);
  const [pedidoEnviado, setPedidoEnviado] = useState(false);
  const dispatch = useDispatch();


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


    if (producto.cantidad_elegida < cantidadDisponible) {
      producto.cantidad_elegida++;
      dispatch(actualizarCarrito(nuevoCarrito));
      console.log('Cantidad elegida después de incrementar:', producto.cantidad_elegida);
    } else {
      console.warn('La cantidad máxima disponible ya ha sido alcanzada.');
    }
  };

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



    producto.cantidad_elegida--;
    dispatch(actualizarCarrito(nuevoCarrito));

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
      const total = calcularTotal();
      const pedido = carrito.map(producto => ({
        id: producto.id,
        nombre: producto.nombre,
        cantidad: producto.cantidad_elegida,
        color: producto.variantes[0].color,
        talla: producto.variantes[0].talla,
        total: total
      }));

      console.log('Pedido a enviar al servidor:', pedido);
      console.log(pedido.id)
      console.log(pedido.cantidad)
      const response = await dispatch(addPedido(pedido));

      if (response) {
        const numeroPedido = response.data.id_pedido;
        setNumeroPedido(numeroPedido);
        setInfoPedidoCorreo(pedido);
        pedido.forEach(producto => {
          dispatch(actualizarVariante(producto.id, producto.cantidad));
        });
        setMostrarFormularioCorreo(true);
        setMostrarModal(true);
        setPedidoEnviado(true);
        dispatch(vaciarCarrito());
      } else {
        throw new Error('Error al agregar el pedido');
      }
    } catch (error) {
      console.error("Error al realizar cambios", error);
    }
  };

  const enviarCorreoConPedido = async (correo) => {
    try {
      const infoPedido = infoPedidoCorreo;
      await dispatch(enviarCorreo(numeroPedido, infoPedido, correo));
      console.log("Correo enviado correctamente");
      setCorreoEnviado(true);
      setMostrarFormularioCorreo(false);
    } catch (error) {
      console.error("Error al enviar el correo", error);
    }
  };

  const handleSubmitCorreo = async (event) => {
    event.preventDefault();
    const correo = event.target.correo.value;

    if (numeroPedido) {
      enviarCorreoConPedido(correo);
    } else {
      console.error("Error: El número de pedido no está definido");
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
                    {producto.variantes.length > 0 && producto.variantes[0].imagenes.length > 0 && (
                      <img className="producto-imagen" src={`http://localhost:3004/${producto.variantes[0].imagenes[0]}`} alt="" />
                    )}
                  </td>
                  <td className="carrito-td">{producto.descripcion}</td>
                  <td className="carrito-td">{producto.variantes.length > 0 ? producto.variantes[0].color : ''}</td>
                  <td className="carrito-td">{producto.variantes.length > 0 ? producto.variantes[0].talla : ''}</td>
                  <td className="carrito-td">
                    <div className="cantidad-acciones">

                      <div className="boton-cantidad-div">
                        <button className="boton-cantidad" onClick={() => decrementarCantidad(index)}>-</button>
                      </div>
                      <span className="cantidad-carrito">{producto.cantidad}</span>
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
        <button className="boton-carrito" onClick={() => dispatch(vaciarCarrito())}>
          Vaciar Carrito
        </button>
        <Link to="/" className="enlace-home">
          <button className="boton-carrito">Volver a la tienda</button>
        </Link>
        <button className="boton-carrito" onClick={handleRealizarPedido}>
          Comprar
        </button>
        {pedidoEnviado && (
          <div className="pedido-enviado">
            <p>Tu pedido ha sido enviado correctamente.</p>
            <p>Se te enviará un correo electrónico con los detalles del pedido.</p>
          </div>
        )}
        {mostrarModal && (
          <div className="modal-compra">
            <div className="modal-content-compra">
              <span className="close-compra" onClick={() => setMostrarModal(false)}>&times;</span>
              <form className="formulario-correo" onSubmit={handleSubmitCorreo}>
                <label htmlFor="correo">Ingresa tu correo electrónico:</label>
                <input type="email" id="correo" name="correo" required />
                <button type="submit" className="boton-carrito">Enviar</button>
              </form>
              <h2 className="carrito-nPedido">Número de pedido: {numeroPedido}</h2>
              <p className="carrito-indicaciones">
                Por favor guarde este número para retirar su producto o para coordinar el envío con el proveedor.
              </p>
              <p className="carrito-indicaciones">
                Si deseas recibir el producto en tu casa, comunícate{" "}
                <a href={"https://wa.me/message/CTLCYWOO7XTML1"}>aquí</a>.
              </p>
              <p className="carrito-indicaciones">
                En caso de que quiera pagar mediante transferencia, puede hacerlo a este número de cuenta:
                XXXX-XXXX-XXXX-XXXX. Una vez realizado el pago, puede enviarlo <a href={"https://wa.me/message/CTLCYWOO7XTML1"}>aquí</a> para confirmar.
                También puede mostrar el comprobante en el local en caso de que lo retire personalmente.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Carrito;
