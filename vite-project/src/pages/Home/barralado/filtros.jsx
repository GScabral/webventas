import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { filterProduc, orderProducto } from "../../../redux/action";
import { categoria } from "./categorias";
import CerrarSesion from "../../../IS/cerrarSesion";
import './barra.css';

const FiltrosSidebar = () => {
    const [mostrarF, setMostrarF] = useState(false);
    const [mostrarO, setMostrarO] = useState(false);
    const [precio, setPrecio] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedPriceOrder, setSelectedPriceOrder] = useState("");
    const [lastSelectedPriceOrder, setLastSelectedPriceOrder] = useState("");
    const cliente = useSelector((state) => state.cliente);
    const dispatch = useDispatch();

    const toggleFiltros = () => {
        setMostrarF(!mostrarF);
    };

    const toggleOrden = () => {
        setMostrarO(!mostrarO);
    };

    const handleFilter = (category) => {
        setSelectedCategory(category === selectedCategory ? "" : category);
        dispatch(filterProduc({ categoria: category === selectedCategory ? "" : category }));
    };

    const handleOrder = (orderType) => {
        // Si el mismo orden ya está seleccionado, deselecciónalo
        if (orderType === selectedPriceOrder) {
            unselectOrder();
        } else {
            setSelectedPriceOrder(orderType);
            dispatch(orderProducto(orderType));
        }
    };

    const unselectOrder = () => {
        console.log("Deseleccionando orden...");
        setSelectedPriceOrder(""); // Desseleccionar el orden estableciendo el estado en una cadena vacía
        dispatch(orderProducto("")); // Enviar una acción para eliminar el orden actual
    };

    const handleCerrarSesion = () => {
        dispatch(cerrarSesion());
    };

    return (
        <div className="sidebar">
            <h1 className="letra-titulo">Amore mio</h1>
            {cliente && (
                <>
                    <h1 className="sidebar-h1">
                        {cliente && `Hola, ${cliente.nombre}! Bienvenido de nuevo.`}
                    </h1>
                    <CerrarSesion />
                </>
            )}
            <button className="button-filtros" onClick={toggleFiltros}>FILTRAR POR:</button>
            {mostrarF && (
                <div>
                    <ul className="ul-filtros">
                        {Object.keys(categoria).map((categoria) => (
                            <button key={categoria} className={selectedCategory === categoria ? "button-selected" : "button-talles"}
                                onClick={() => handleFilter(categoria)}>
                                {categoria}
                            </button>
                        ))}
                    </ul>
                </div>
            )}
            <hr className="divider" />
            <button className="button-filtros" onClick={toggleOrden}>ORDENAR POR:</button>
            {mostrarO && (
                <div>
                    <ul className="ul-filtros">
                        <button className="button-filtros" onClick={() => setPrecio(!precio)}>Precio</button>
                        {precio && (
                            <div>
                                <button className={selectedPriceOrder === "precioAsc" ? "button-selected" : "button-talles"}
                                    onClick={() => handleOrder("precioAsc")}>Menor a Mayor</button>
                                <button className={selectedPriceOrder === "precioDesc" ? "button-selected" : "button-talles"}
                                    onClick={() => handleOrder("precioDesc")}>Mayor a Menor</button>
                            </div>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default FiltrosSidebar;
