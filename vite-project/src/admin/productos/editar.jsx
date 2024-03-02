import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import './editar.css';

const EditProductModal = ({ show, handleClose, product }) => {
  const [editedProduct, setEditedProduct] = useState({
    id: '',
    cantidad: 0,
    precio: 0,
    categoria: '',
    variantes: [], // Añade variantes si es necesario
  });

  useEffect(() => {
    if (product) {
      setEditedProduct({
        id: product.id || '',
        cantidad: product.cantidad || 0,
        precio: product.precio || 0,
        categoria: product.categoria || '',
        variantes: product.variantes || [], // Añade variantes si es necesario
      });
    }
  }, [product]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleSaveChangesLocal = async () => {
    // Obtén los campos actualizados del producto
    const updatedFields = {
      cantidad_disponible: editedProduct.cantidad,
      // Agrega otros campos actualizables según sea necesario
    };

    // Si el producto tiene variantes, inclúyelas en los campos actualizados
    if (editedProduct.variantes && editedProduct.variantes.length > 0) {
      updatedFields.variantes = editedProduct.variantes.map((variante) => ({
        id: variante.id,
        cantidad_disponible: variante.cantidad_disponible,
        // Añade otros campos de variante actualizables según sea necesario
      }));
    }

    try {
      await cambiosProducto(editedProduct.id, updatedFields);
      handleClose(); // Cierra el modal después de guardar los cambios
    } catch (error) {
      console.error('Error al guardar cambios:', error);
      // Manejo de errores, si es necesario
    }
  };

  return (
    <div className='container-Modal-editar'>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="modal-title-editar">Editar Producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
  <form>
    <div className="form-group-editar">
      <label className="form-label-editar">Cantidad</label>
      <input
        type="number"
        className="form-control-editar"
        name="cantidad"
        value={editedProduct.cantidad}
        onChange={handleInputChange}
      />
    </div>
    {/* Itera sobre las variantes */}
    {editedProduct.variantes.map((variante, index) => (
      <div key={index}>
        <div className="form-group-editar">
          <label className="form-label-editar">Talle</label>
          <input
            type="text"
            className="form-control-editar"
            value={variante.talle}
            onChange={(e) => handleVariantInputChange(e, index, 'talle')}
          />
        </div>
        <div className="form-group-editar">
          <label className="form-label-editar">Color</label>
          <input
            type="text"
            className="form-control-editar"
            value={variante.color}
            onChange={(e) => handleVariantInputChange(e, index, 'color')}
          />
        </div>
        <div className="form-group-editar">
          <label className="form-label-editar">Cantidad Disponible</label>
          <input
            type="number"
            className="form-control-editar"
            value={variante.cantidad_disponible}
            onChange={(e) => handleVariantInputChange(e, index, 'cantidad_disponible')}
          />
        </div>
      </div>
    ))}
  </form>
</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} className="btn-secondary-editar">
            Cerrar
          </Button>
          <Button variant="primary" onClick={handleSaveChangesLocal} className="btn-primary-editar">
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
  
};

export default EditProductModal;
