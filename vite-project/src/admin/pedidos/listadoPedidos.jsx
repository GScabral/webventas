import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPedidos } from '../../redux/action';
import './listadoPedidos.css';

const PedidoList = () => {
  const dispatch = useDispatch();
  const allPedidos = useSelector((state) => state.allPedidos);



  const renderIconoEstado = (estado) => {
    switch (estado) {
      case 'Completado':
        return <i className="fas fa-check-circle"></i>; // Ícono de marca de verificación
      case 'En proceso':
        return <i className="fas fa-exclamation-circle"></i>; // Ícono de advertencia
      default:
        return null;
    }
  };



  useEffect(() => {
    dispatch(getPedidos());
  }, [dispatch]);

  return (
    <div className="pedido-list-container">
      <h2>Listado de Pedidos</h2>
      <table className="pedido-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Detalles</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {allPedidos.map((pedido) => (
            <tr key={pedido.id}>
              <td>{pedido.id}</td>
              <td>{pedido.fecha}</td>
              <td>
                <ul>
                  {pedido.detalles.map((detalle) => (
                    <li key={`${pedido.id}-${detalle.idDetalle}`}>
                      Cantidad: {detalle.cantidad},
                    </li>
                  ))}
                </ul>
              </td>
              <td>
                {renderIconoEstado(pedido.estado)} {/* Renderizar el icono del estado */}
                {pedido.estado}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PedidoList;
