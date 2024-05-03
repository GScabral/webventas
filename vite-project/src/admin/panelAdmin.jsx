import React, { useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import BarraAdmin from './barraAdmin/barraAdmin';
import NewProduct from './añadir/añadirProducto';
import Principal from './inicio/principalAdmin';
import ProductList from './productos/listadoProductos';
import PedidoList from './pedidos/listadoPedidos';
import ClienteList from './clientes/listadoClientes';
import { useDispatch, useSelector } from 'react-redux';
import { LoginAdmin } from '../redux/action';
import './panelAdmin.css';

const PanelAdmin = () => {
  const [showModal, setShowModal] = useState(true);
  const isLoggedIn = useSelector((state) => state.isLoggedInAd);
  const dispatch = useDispatch();

  const handleLogin = async (event) => {
    event.preventDefault();
    const password = event.target.elements.password.value;
    try {
      await dispatch(LoginAdmin(password));
      setShowModal(false);
    } catch (error) {
      console.error(error);
    }
  };
  console.log('isLoggedIn:', isLoggedIn);
  return (
    <div className="panel-admin-container">
      <div className="sidebar-container-admin">
        <BarraAdmin />
      </div>
      {showModal && !isLoggedIn && (
        <div className="modal-ini-adm">
          <div className="modal-content-ini-adm">
            <h2>Iniciar sesión</h2>
            <form onSubmit={handleLogin}>
              <input type="password" name="password" placeholder="Contraseña" />
              <button type="submit">Iniciar sesión</button>
            </form>
          </div>
        </div>
      )}
      <div className="pages-container">
        <Routes>
          <Route path="/principal" element={isLoggedIn ? <Principal /> : <Navigate to="/admin/login" />} />
          <Route path="/new" element={isLoggedIn ? <NewProduct /> : <Navigate to="/admin/login" />} />
          <Route path="/lista" element={isLoggedIn ? <ProductList /> : <Navigate to="/admin/login" />} />
          <Route path="/PedidosLista" element={isLoggedIn ? <PedidoList /> : <Navigate to="/admin/login" />} />
          <Route path="/clientes" element={isLoggedIn ? <ClienteList /> : <Navigate to="/admin/login" />} />
        </Routes>
      </div>
    </div>
  )
}
export default PanelAdmin;
