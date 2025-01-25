import React, { useState } from "react";
import { connect } from "react-redux";
import { addProduct } from "../../redux/action";
import "./panel.css";

const NewProduct = ({ addProduct }) => {
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productDescrip, setProductDescrip] = useState('');
  const [productCategoria, setProductCategoria] = useState('');
  const [productSubCategoria, setProductSubCategoria] = useState('');
  const [variantesData, setVariantesData] = useState([]);
  const [showAddTallaForm, setShowAddTallaForm] = useState(false);
  const [newTalla, setNewTalla] = useState('');
  const [newCantidad, setNewCantidad] = useState(0);

  const handleProductNameChange = (event) => {
    setProductName(event.target.value);
  };

  const handleProductPriceChange = (event) => {
    setProductPrice(event.target.value);
  };

  const handleProductDescrip = (event) => {
    setProductDescrip(event.target.value);
  };

  const handleProductCategoria = (event) => {
    setProductCategoria(event.target.value);
  };

  const handleProductSubCategoria = (event) => {
    setProductSubCategoria(event.target.value);
  }

  const handleAddVariante = () => {
    setVariantesData([...variantesData, { color: '', imagenFiles: [], tallas: [] }]);
  };

  const handleAddTalla = (index) => {
    setShowAddTallaForm(true);
    // No necesitas inicializar la talla aquí
  };

  const handleSaveTalla = (index) => {
    if (!newTalla || newCantidad <= 0) {
      console.error('Tanto la talla como la cantidad deben ser llenadas y la cantidad debe ser mayor que cero');
      return;
    }

    const cantidad = parseInt(newCantidad, 10);
    const updatedVariantes = [...variantesData];
    const existingTalla = updatedVariantes[index].tallas.find(talla => talla.talla === newTalla);
    if (existingTalla) {
      console.error('Ya existe una talla con ese nombre');
      return;
    }

    updatedVariantes[index].tallas.push({ talla: newTalla, cantidad });
    setVariantesData(updatedVariantes);
    setShowAddTallaForm(false);
    setNewTalla('');
    setNewCantidad(0);
  };

  const handleTallaChange = (event) => {
    setNewTalla(event.target.value);
  };

  const handleCantidadChange = (event) => {
    setNewCantidad(event.target.value);
  };

  const handleColorChange = (event, index) => {
    const { value } = event.target;
    const updatedVariantes = [...variantesData];
    updatedVariantes[index].color = value;
    setVariantesData(updatedVariantes);
  };

  const handleFileChange = (event, index) => {
    const files = Array.from(event.target.files);
    if (files && files.length > 0) {
      const updatedVariantes = [...variantesData];
      updatedVariantes[index].imagenFiles = files;
      setVariantesData(updatedVariantes);

      // Agrega un console.log para ver las URLs de las imágenes
    }
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!productName || !productPrice || !productDescrip || !productCategoria || !productSubCategoria || variantesData.length === 0) {
      console.error('Todos los campos obligatorios deben ser llenados, y al menos una variante debe ser agregada');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('nombre_producto', productName);
      formData.append('descripcion', productDescrip);
      formData.append('precio', productPrice);
      formData.append('categoria', productCategoria);
      formData.append('subcategoria', productSubCategoria)

      variantesData.forEach((variante, index) => {
        formData.append(`variantesData[${index}][color]`, variante.color);
        variante.imagenFiles.forEach((file, fileIndex) => {
          formData.append(`variantesData[${index}][imagenFiles][${fileIndex}]`, file);
        });
        variante.tallas.forEach((talla, tallaIndex) => {
          formData.append(`variantesData[${index}][tallas][${tallaIndex}][talla]`, talla.talla);
          formData.append(`variantesData[${index}][tallas][${tallaIndex}][cantidad]`, talla.cantidad);
        });
      });

      await addProduct(formData);

      // Limpiar campos después de enviar el formulario
      setProductName('');
      setProductPrice('');
      setProductDescrip('');
      setProductCategoria('');
      setProductSubCategoria('');
      setVariantesData([]);

    } catch (error) {
      console.error('Error al agregar el producto', error);
    }
  };

  return (
    <div className="admin-panel">
      <div>
        <h1 className="h1-panel">Ingresar Producto</h1>
      </div>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <fieldset>
          <legend>Detalles del Producto</legend>
          <label className="label-admin" htmlFor="productName">Nombre del Producto:</label>
          <input
            type="text"
            id="productName"
            value={productName}
            onChange={handleProductNameChange}
            required
          /><br /><br />

          <label className="label-admin" htmlFor="productPrice">Precio del Producto:</label>
          <input
            type="number"
            id="productPrice"
            value={productPrice}
            onChange={handleProductPriceChange}
            required
          /><br /><br />

          <label className="label-admin" htmlFor="productDescrip">Descripción del Producto:</label>
          <input
            type="text"
            id="productDescrip"
            value={productDescrip}
            onChange={handleProductDescrip}
            required
          /><br /><br />

          <label className="label-admin" htmlFor="productCategoria">Categoría:</label>
          <input
            type="text"
            id="productCategoria"
            value={productCategoria}
            onChange={handleProductCategoria}
            required
          /><br /><br />

          <label className="label-admin" htmlFor=" productSubCategoria">Subcategoria:</label>
          <input
            type="text"
            id=" productSubCategoria"
            value={ productSubCategoria}
            onChange={handleProductSubCategoria}
            required
          /><br /><br />
        </fieldset>

        <div>
          <button
            className="button-newproduc-adm"
            type="button"
            onClick={handleAddVariante}
          >
            Agregar Variante
          </button>

          {variantesData.map((variante, index) => (
            <div className="variantes-añadir" key={index}>
              <label >Variante {index + 1}:</label>
              <label >Color:</label>
              <input
                type="text"

                value={variante.color}
                onChange={(e) => handleColorChange(e, index)}
              />
              {variantesData[index].imagenFiles && variantesData[index].imagenFiles.length > 0 && (
                <img src={URL.createObjectURL(variantesData[index].imagenFiles[0])} alt={`Imagen ${index}`} className="img-preview" />
              )}

              <input type="file" onChange={(e) => handleFileChange(e, index)} multiple name="variantesData[index][imagenFiles][]" />

              <button
                className="button-imagen-adm"
                type="button"
                onClick={() => handleAddTalla(index)}
              >
                Agregar Talla
              </button>
              {showAddTallaForm && (
                <div className="newT-addProduc">
                  <label>Nueva Talla:</label>
                  <input
                    type="text"
                    value={newTalla}
                    onChange={handleTallaChange}
                  />
                  <label>Nueva Cantidad:</label>
                  <input
                    type="number"
                    value={newCantidad}
                    onChange={handleCantidadChange}
                  />
                  <button
                    className="button-imagen-adm"
                    type="button"
                    onClick={() => handleSaveTalla(index)}
                  >
                    Guardar Talla
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
        <button className="button-newproduc-adm" type="submit">Agregar Producto</button>
      </form>
    </div>
  );
};

export default connect(null, { addProduct })(NewProduct);
