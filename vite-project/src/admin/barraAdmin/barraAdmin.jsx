import React from "react";
import './barraAmin.css';
import { Link } from "react-router-dom";

const BarraAdmin=()=>{


return (
    <div className="sidebar-admin">
      <h1 className="Mi-Tienda">Mi Tienda</h1>
        <div>
          <Link to="/admin/new">
          <button className="barra-admin-button">Añadir producto</button>
          </Link>
          <Link to={"/admin/lista"}>
          <button className="barra-admin-button">inventario</button>
          </Link>
          <Link to={"/admin/PedidosLista"}>
          <button className="barra-admin-button">pedidos</button>
          </Link>
          <Link to={"/admin/ofertas"}>
          <button className="barra-admin-button">ofertas</button>
          </Link>
        </div>
    </div>
);

}

export default BarraAdmin;