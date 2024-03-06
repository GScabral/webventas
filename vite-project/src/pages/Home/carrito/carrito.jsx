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
  const allProductos = useSelector((state) => state.allProductos)

  const [cantidadMinima, setCantidadMinima] = useState([]);
  const [cantidadMaxima, setCantidadMaxima] = useState([]);
  const [errorStock, setErrorStock] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [numeroPedido, setNumeroPedido] = useState(null);
  const dispatch = useDispatch();

  console.log("carrito", carrito)



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

    if (producto.cantidad_elegida === 1) {
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

    carrito.forEach((item) => {
      const precioNumerico = parseFloat(item.precio);
      const cantidad = item.cantidad_elegida || 1; // Utiliza la cantidad elegida en lugar de la cantidad original

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
      carrito.forEach(async (producto) => {
        const { id, cantidad, idVariante } = producto;
        const productoEnStock = carrito.find((p) => p.id === id);

        if (!productoEnStock) {
          console.error(`Producto con ID ${id} no encontrado en allProductos.`);
          return;
        }


        console.log("producto ensyokc", productoEnStock)

        const variante = productoEnStock.variantes.find((v) => v.idVariante === v.idVariante);

        console.log("variantes:", variante)

        if (!variante) {
          console.error(`Variante del producto con ID ${id} y ID de variante ${idVariante} no encontrada.`);
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
        const idVarianteEntero = variante.idVariante;

        // Llama a actualizarVariante para actualizar la base de datos
        await dispatch(actualizarVariante(id, idVarianteEntero, nuevaCantidadDisponible));
      });

      // Si no hay errores de stock, procede con el pedido
      if (!errorStock) {
        // Generar un número de pedido simulado
        await dispatch(addPedido({
          producto: carrito.map(producto => ({
            id: producto.id,
            cantidad: producto.cantidad_elegida,
            color: producto.variante[0].color,
            talla: producto.variante[0].talla
          }))
        }));
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
    <div className="carrito-fondo">
      <h2 className="carrito-titulo">Carrito </h2>
      <div className="carrito">
        {carrito && carrito.length > 0 ? (
          <table className="carrito-table">
            <thead>
              <tr>
                <th className="carrito-th">Producto</th>
                <th className="carrito-th">Descripcion</th>
                <th className="carrito-th">Color</th>
                <th className="carrito-th">Talle</th>
                <th className="carrito-th">Cantidad</th>
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
                        <button className="boton-cantidad" onClick={() => decrementarCantidad(index)}>
                          -
                        </button>
                      </div>
                      <div className="boton-cantidad-div">
                        <button className="boton-cantidad" onClick={() => incrementarCantidad(index)}>
                          +
                        </button>
                      </div>
                    </div>
                  </td>
                  <td>
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
