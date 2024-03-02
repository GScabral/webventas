import React from 'react';
import { Route, Routes } from 'react-router-dom';
import BarraAdmin from './barraAdmin/barraAdmin';
import NewProduct from './añadir/añadirProducto';
import Principal from './inicio/principalAdmin';
import ProductList from './productos/listadoProductos';
import PedidoList from './pedidos/listadoPedidos';
import ClienteList from './clientes/listadoClientes';

import "./panelAdmin.css"; // Importa tu archivo CSS


const PanelAdmin = () => {
return (
    <div  className="panel-admin-container">
      <div className="sidebar-container-admin">
        <BarraAdmin />
      </div>
      <div className="pages-container" >
        <Routes>
          <Route path="/principal" element={<Principal/>}/>
          <Route path="/new" element={<NewProduct/>}/>
          <Route path='/lista' element={<ProductList/>}/>
          <Route path='/PedidosLista' element={<PedidoList/>}/>
          <Route path='/clienteList' element={<ClienteList/>}/>
        </Routes>
      </div>
    </div>
  );
};

export default PanelAdmin;
