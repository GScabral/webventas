import React, { useState } from "react";
import { connect } from "react-redux";
import { addProduct } from "../../redux/action";
import "./panel.css";

const NewProduct = ({ addProduct }) => {
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productDescrip, setProductDescrip] = useState('');
  const [productCategoria, setProductCategoria] = useState('');
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

  const handleAddVariante = () => {
    const newVariante = { talla: '', color: '', cantidad_disponible: '', imagenes: [] };
    setVariantesData([...variantesData, newVariante]);
  };

  const handleVariantesData = (index, key, value) => {
    const updatedVariantes = [...variantesData];
    updatedVariantes[index][key] = value;
    setVariantesData(updatedVariantes);
  };

  const handleFileChange = (event, index) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const updatedVariantes = [...variantesData];
      updatedVariantes[index].imagenes = [...updatedVariantes[index].imagenes, ...files];
      setVariantesData(updatedVariantes);
    }
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

      variantesData.forEach((variante, index) => {
        formData.append(`variantesData[${index}][talla]`, variante.talla);
        formData.append(`variantesData[${index}][color]`, variante.color);
        formData.append(`variantesData[${index}][cantidad_disponible]`, variante.cantidad_disponible);
        variantesData.forEach((variante, index) => {
          formData.append(`variantes.imagenes`, variante.imagenes[0]); // Sin incluir el índice [0]
        });
      });

      console.log("info que se manda", formData)

      await addProduct(formData);

      // Limpiar el estado después de agregar el producto
      setProductName('');
      setProductPrice('');
      setProductDescrip('');
      setProductCategoria('');
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
                name={`variantesData[${index}][talla]`} // Asignar el atributo name correctamente
              />
              <label>Color:</label>
              <input
                type="text"
                value={variante.color}
                onChange={(e) => handleVariantesData(index, 'color', e.target.value)}
                name={`variantesData[${index}][color]`} // Asignar el atributo name correctamente
              />
              <label>Cantidad disponible:</label>
              <input
                type="number"
                value={variante.cantidad_disponible}
                onChange={(e) => handleVariantesData(index, 'cantidad_disponible', e.target.value)}
                name={`variantesData[${index}][cantidad_disponible]`} // Asignar el atributo name correctamente
              />
              <input
                type="file"
                name={`variantes.imagenes`}
                id={`fileInput-${index}`}
                onChange={(e) => handleFileChange(e, index)}
                multiple
                style={{ display: 'none' }} // Este estilo oculta el campo de entrada, lo que puede ser problemático
              />
              <button
                className="button-imagen-adm"
                type="button"
                onClick={() => {
                  const fileInput = document.getElementById(`fileInput-${index}`);
                  if (fileInput) {
                    fileInput.click(); // Esto activa el clic en el campo de entrada de archivos
                  }
                }}
              >
                Agregar imagen
              </button>
              {variante.imagenes.map((imagen, i) => (
                <div key={i}>
                  <img src={URL.createObjectURL(imagen)} alt={`imagen-${i}`} style={{ maxWidth: '100px', maxHeight: '100px', marginRight: '10px' }} />
                </div>
              ))}
            </div>
          ))}
        </div>
        <button className="button-newproduc-adm" type="submit">Agregar Producto</button>
      </form>
    </div>
  );
};

export default connect(null, { addProduct })(NewProduct);
