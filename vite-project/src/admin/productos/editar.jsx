import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import './editar.css';

const EditProductModal = ({ show, handleClose, product, handleSaveChanges }) => {
  const [editedProduct, setEditedProduct] = useState(product);

  useEffect(() => {
    setEditedProduct(product);
  }, [product]);

  const handleVariantInputChange = (e, index, field) => {
    const { value } = e.target;
    setEditedProduct((prevProduct) => {
      const updatedVariants = [...prevProduct.variantes];
      updatedVariants[index] = {
        ...updatedVariants[index],
        [field]: value,
      };
      return {
        ...prevProduct,
        variantes: updatedVariants,
      };
    });
  };

  const handleSaveChangesLocal = () => {
    // Aquí construyes el objeto con la información actualizada del producto
    const updatedProduct = {
      id: editedProduct.id,
      nombre: editedProduct.nombre,
      categoria: editedProduct.categoria,
      precio: editedProduct.precio,
      variantes: editedProduct.variantes,
    };
    handleSaveChanges(updatedProduct); // Llama a la función handleSaveChanges de ProductList
    handleClose();
  };

  return (
    <div className='container-Modal-editar'>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header className='cerrar-modal' closeButton>
          <Modal.Title className="modal-title-editar">Editar Producto</Modal.Title>
        </Modal.Header>
        <Modal.Body className='editar-admin'>
          <form>
            {editedProduct.variantes.map((variante, index) => (
              <div key={index}>
                <div className="form-group-editar">
                  <label className="form-label-editar">Talle</label>
                  <input
                    type="text"
                    className="form-control-editar"
                    value={variante.talla}
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
        <Modal.Footer className='footer-modal-editar'>
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
