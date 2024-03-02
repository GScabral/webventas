import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { cambios, getProductos, borrar } from '../../redux/action'; // Suponiendo que getProductos es una acción para obtener los productos
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Modal } from 'react-bootstrap'; // Importa los componentes necesarios de React Bootstrap
import EditProductModal from './editar';
import './listado.css';

const ProductList = () => {
  const dispatch = useDispatch();
  const allProductos = useSelector((state) => state.allProductos); // Suponiendo que 'productos' es la parte del estado que contiene la lista de productos

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productIdToEdit, setProductIdToEdit] = useState(null);

  useEffect(() => {
    dispatch(getProductos()); // Aquí se debería llamar a la acción para obtener los productos
  }, [dispatch]);

  const handleEdit = (productId) => {
    const productToEdit = allProductos.find((producto) => producto.id === productId);
    setSelectedProduct(productToEdit);
    setShowEditModal(true);
    setProductIdToEdit(productId); // Actualiza el estado con el ID del producto que se está editando
  };

  const handleDelete = (productId) => {
    if (window.confirm('¿Estás seguro que deseas eliminar este producto?')) {
      dispatch(borrar(productId));
    }
  };

  const handleClose = () => {
    setShowEditModal(false);
  };

  const handleSaveChanges = (editedProduct) => {
    dispatch(cambios(productIdToEdit, editedProduct)); // Usa el ID del producto almacenado en el estado
    setShowEditModal(false);
  };

  const renderVariantes = (variantes) => {
    return variantes.map((variante, index) => (
      <div key={`${variante.id}-${index}-variantes`}>
        {variante.talla} - {variante.color} - {variante.cantidad_disponible}
      </div>
    ));
  };

  return (
    <div className="product-list-container">
      <h2>Listado de Productos</h2>
      <table className="product-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Talles</th>
            <th>Colores</th>
            <th>Cantidad Disponible</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {allProductos.map((producto) => (
            <tr key={producto.id}>
              <td>{producto.id}</td>
              <td>{producto.nombre}</td>
              <td>{producto.categoria}</td>
              <td>{producto.precio}</td>
              <td>
                {producto.variantes.map((variante, index) => (
                  <div key={`${producto.id}-${index}-talla`}>{variante.talla}</div>
                ))}
              </td>
              <td>
                {producto.variantes.map((variante, index) => (
                  <div key={`${producto.id}-${index}-color`}>{variante.color}</div>
                ))}
              </td>
              <td>
                {producto.variantes.map((variante, index) => (
                  <div key={`${producto.id}-${index}-cantidad`}>{variante.cantidad_disponible}</div>
                ))}
              </td>
              <td>{renderVariantes(producto.variantes)}</td>
              <td>
                <button onClick={() => handleEdit(producto.id)}>
                  <FontAwesomeIcon icon={faPencilAlt} />
                </button>
                <button onClick={() => handleDelete(producto.id)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal show={showEditModal} onHide={handleClose}>
        <EditProductModal
          show={showEditModal}
          handleClose={handleClose}
          product={selectedProduct}
          handleSaveChanges={handleSaveChanges}
        />
      </Modal>
    </div>
  );
};

export default ProductList;
