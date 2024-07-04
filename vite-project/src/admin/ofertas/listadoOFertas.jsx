import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getOfertas, borrarOferta } from '../../redux/action';
import './listadoOferta.css'



const OfertasLista = () => {
    const dispatch = useDispatch();
    const allOfertas = useSelector(state => state.ofertasActivas)


    console.log("ofertas:", allOfertas)

  const  handleDeleteOferta = (id_oferta) => {
        if (window.confirm("¿Estas seguro de eliminar esta oferta")) {
            dispatch(borrarOferta(id_oferta))
        }
    }

    useEffect(() => {
        dispatch(getOfertas(),)
    }, [dispatch])

    return (
        <div className='oferta-list-container'>
            <h2>listado de ofertas</h2>
            <table className='oferta-table'>
                <thead>
                    <tr>
                        <th>id</th>
                        <th>id del producto</th>
                        <th>porcentaje</th>
                        <th>inicio</th>
                        <th>fin</th>
                        <th>eliminar</th>
                    </tr>
                </thead>
                <tbody>
                    {allOfertas.map((ofertas) => (
                        <tr key={ofertas.id_oferta}>
                            <td>{ofertas.id_oferta}</td>
                            <td>{ofertas.producto_id}</td>
                            <td>{ofertas.descuento}</td>
                            <td>{ofertas.inicio}</td>
                            <td>{ofertas.fin}</td>
                    
                    <td>
                        <button className="action-button" onClick={() => handleDeleteOferta(ofertas.id_oferta)}>
                            Eliminar
                        </button>
                    </td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )

}

export default OfertasLista;