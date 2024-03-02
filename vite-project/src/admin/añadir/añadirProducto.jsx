import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { addProduct } from "../../redux/action";
import "./panel.css";

const NewProduct = ({ addProduct }) => {
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productDescrip, setProductDescrip] = useState('');
  const [productCategoria, setProductCategoria] = useState('');
  const [tallasDisponibles, setTallasDisponibles] = useState([]);
  const [coloresDisponibles, setColoresDisponibles] = useState([]);
  const [productCantidad, setProductCantidad] = useState('');
  const [productImages, setProductImages] = useState([]);
  const [variantesData, setVariantesData] = useState([]);

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

  const handleTallasDisponibles = (event) => {
    const tallas = event.target.value.split(',');
    const tallasFormatted = tallas.map(talla => talla.trim());
    setTallasDisponibles(tallasFormatted);
  };

  const handleColoresDisponibles = (event) => {
    const colores = event.target.value.split(',');
    const coloresFormatted = colores.map(color => color.trim());
    setColoresDisponibles(coloresFormatted);
  };

  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setProductImages([...productImages, ...files]);
    }
  };

  const handleAddImagen = () => {
    const fileInput = document.getElementById("fileInput");
    if (fileInput) {
      fileInput.click();
    }
  };

  const handleCantidad = (event) => {
    setProductCantidad(event.target.value);
  };

  const handleAddVariante = () => {
    const newVariante = { talla: '', color: '', cantidad_disponible: '' };
    setVariantesData([...variantesData, newVariante]);
  };

  const handleVariantesData = (index, key, value) => {
    const updatedVariantes = [...variantesData];
    updatedVariantes[index][key] = value;
    setVariantesData(updatedVariantes);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!productName || !productPrice || !productDescrip || !productCategoria) {
      console.error('Todos los campos obligatorios deben ser llenados');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('nombre_producto', productName);
      formData.append('descripcion', productDescrip);
      formData.append('precio', productPrice);
      formData.append('categoria', productCategoria);

      productImages.forEach((image) => {
        formData.append(`imagenes`, image);
      });

      variantesData.forEach((variante, index) => {
        formData.append(`variantesData[${index}][talla]`, variante.talla);
        formData.append(`variantesData[${index}][color]`, variante.color);
        formData.append(`variantesData[${index}][cantidad_disponible]`, variante.cantidad_disponible);
      });

      await addProduct(formData);

      // Limpiar el estado después de cargar la imagen
      setProductName('');
      setProductPrice('');
      setProductDescrip('');
      setProductCategoria('');
      setProductImages([]);
      setVariantesData([]);

    } catch (error) {
      console.error('Error al subir la imagen y los datos del producto', error);
    }
  };

  return (
    <div className="admin-panel">
      <div>
        <h1 className="h1-panel">Ingresar Producto</h1>
      </div>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
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
        <input
          type="file"
          id="fileInput"
          name="imagenes"
          onChange={handleFileChange}
          multiple
          style={{ position: 'absolute', left: '-9999px' }}
        />
        <div>
          <button
            className="button-imagen-adm"
            type="button"
            onClick={handleAddImagen}
          >
            Agregar imagen
          </button>
          {productImages.map((image, index) => (
            <div key={index}>
              <img src={URL.createObjectURL(image)} alt={`imagen-${index}`} style={{ maxWidth: '100px', maxHeight: '100px', marginRight: '10px' }} />
            </div>
          ))}
        </div>
        <div>
          <button
            className="button-newproduc-adm"
            type="button"
            onClick={handleAddVariante}
          >
            Agregar Variante
          </button>
          {variantesData.map((variante, index) => (
            <div key={index}>
              <label>Variante {index + 1}:</label>
              <label>Talla:</label>
              <input
                type="text"
                value={variante.talla}
                onChange={(e) => handleVariantesData(index, 'talla', e.target.value)}
              />
              <label>Color:</label>
              <input
                type="text"
                value={variante.color}
                onChange={(e) => handleVariantesData(index, 'color', e.target.value)}
              />
              <label>Cantidad disponible:</label>
              <input
                type="number"
                value={variante.cantidad_disponible}
                onChange={(e) => handleVariantesData(index, 'cantidad_disponible', e.target.value)}
              />
            </div>
          ))}
        </div>
        <button className="button-newproduc-adm" type="submit">Agregar Producto</button>
      </form>
    </div>
  );
};

export default connect(null, { addProduct })(NewProduct);
