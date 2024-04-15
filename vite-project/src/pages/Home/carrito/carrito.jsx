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
import jsPDF from "jspdf"

const Carrito = () => {
  const carrito = useSelector((state) => state.carrito);
  const allProductos = useSelector((state) => state.allProductos);
  const [mostrarFormularioCorreo, setMostrarFormularioCorreo] = useState(false);
  const [errorStock, setErrorStock] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [numeroPedido, setNumeroPedido] = useState(null);
  const [infoPedidoCorreo, setInfoPedidoCorreo] = useState(null);
  const [correoEnviado, setCorreoEnviado] = useState(false); 
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
      const total = calcularTotal();
      const pedido = carrito.map(producto => ({
        id: producto.id,
        nombre: producto.nombre,
        cantidad: producto.cantidad_elegida,
        color: producto.variantes[0].color,
        talla: producto.variantes[0].talla,
        total:total
      }));

      // Realiza la acción addPedido con los datos del pedido
      const response = await dispatch(addPedido(pedido));

      if (response) {
        const numeroPedido = response.data.id_pedido;
        setNumeroPedido(numeroPedido);
        setInfoPedidoCorreo(pedido); // Almacena la información del pedido
        dispatch(actualizarVariante(pedido)); // Corregir esta línea
        setMostrarFormularioCorreo(true);
        setMostrarModal(true);
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
                    {producto.variantes[0].imagenes.length > 0 && (
                      <img className="producto-imagen" src={`http://localhost:3004/${producto.variantes[0].imagenes[0]}`} alt="" />
                    )}
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
          <button className="boton-carrito boton-volver">Volver a la tienda</button>
        </Link>
        <button className="boton-carrito pedido-carrito" onClick={handleRealizarPedido}>
          comprar
        </button>

 
        {mostrarModal && (
          <div className="modal-compra">
            <div className="modal-content-compra">
              <span className="close-compra" onClick={() => setMostrarModal(false)}>&times;</span>
              <form className="formulario-correo" onSubmit={handleSubmitCorreo}>
                <label htmlFor="correo">Ingresa tu correo electrónico:</label>
                <input type="email" id="correo" name="correo" required />
                <button type="submit" className="boton-carrito">Enviar</button>
            
              </form>
              <h2>Número de pedido: {numeroPedido}</h2>
              <p>
                Por faor guarde este numero para retirar su producto o para coordinar el envio con el proveedor
              </p>
              <p>
                Si deseas recibir el producto en tu casa, comunícate{" "}
                <a href={"https://wa.me/message/CTLCYWOO7XTML1"}>aquí</a>.
              </p>
              en caso de que quiera pagar mediante trasferencia puedo hacerlo aca
              .
              .
              .
              .
              un vez realizado el pago puede enviarlo aca para confirmar
              <a href={"https://wa.me/message/CTLCYWOO7XTML1"}>aquí</a>.
              o muestre el comprobante en el local en caso que lo retire personalmente
            </div>
            
          </div>
        )}
 

      </div>
    </div>
  );
}

export default Carrito;
