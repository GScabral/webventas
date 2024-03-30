import React from "react";
import { Link } from "react-router-dom";
import "./vm.css"



const MetodoPago = () => {
    return (
        <div className="container-vm">
            <h1 className="vm-h1">Para realizar compra por mayor el sistema que ocupamos ,indemediatamente al
                pasar los 3 productos de cual quier tipo se realiza un descuento
            </h1>
            <p className="vm-p">Por cualquier consulta sobre esto comunicarce al whatsapp o escribinos por instragram
                <a href={"https://www.instagram.com/amore_mio.showroom?igsh=MXBhdjRua3ltem44cQ=="}>
                    <img className="logo-vm" src="pngwing.com.png" alt="Instagram" />

                    <a href={"https://wa.me/message/CTLCYWOO7XTML1"}>
                        <img className="logo-vm" src="pngwing.com (8).png" alt="WhatsApp" />
                    </a>
                </a>
            </p>

            <Link to="/">
                <button className="bonton-vm">volver</button>
            </Link>
            <footer className="contacto-vm">
                <p>Encontranos en Ontiveros 1069 entre Gabriela Mistral y Gregorio de la Ferrere 
                <a href={"https://maps.app.goo.gl/s6qNmbvebfZF7XLo9"}>
                        <img className="logo-vm" src="pngwing.com (9).png" alt="GoogleMaps" />
                    </a>
                </p>
           
            </footer>
        </div>
    )
}


export default MetodoPago;