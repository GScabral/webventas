import React from "react";
import { Link } from "react-router-dom";
import './principal.css'

const Principal=()=>{
return (
    <div className="panel-container">
      <div className="grid-container">
        <div className="grid-item">
          <div className="inner-item">
            <Link to="/admin/new"> {/* Enlace a NewProduct */}
              <h2>Ir a Nuevo Producto</h2>
            </Link>
          </div>
        </div>
        <div className="grid-item">
          <div className="inner-item">ver clientes</div>
        </div> 
        <div className="grid-item">
          <div className="inner-item">ver pedido</div>
        </div>
        <div className="grid-item">
          <div className="inner-item">Eliminar</div>
        </div>
      </div>
    </div>
  );

}


export default Principal;