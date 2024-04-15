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
  const [showAddTallaForm, setShowAddTallaForm] = useState(false);
  const [newTalla, setNewTalla] = useState('');
  const [newCantidad, setNewCantidad] = useState('');
  const [cantidad_disponible, setCantidad_disponible] = useState({});

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
    const newVariante = { talla: {}, color: '', imagenes: [], imagenURLs: [], cantidad_disponible: {} };
    setVariantesData([...variantesData, newVariante]);
  };

  const handleAddTalla = (index) => {
    setNewTalla('');
    setNewCantidad('');
    setShowAddTallaForm(true);

    const updatedVariantes = [...variantesData];
    updatedVariantes[index].cantidad_disponible[newTalla] = newCantidad;
    setVariantesData(updatedVariantes);
  };

  const handleSaveTalla = (index) => {
    const cantidad = parseInt(newCantidad, 10);
    if (!isNaN(cantidad)) {
      const updatedVariantes = [...variantesData];
      if (updatedVariantes[index].talla.hasOwnProperty(newTalla)) {
        console.error('Ya existe una talla con ese nombre');
        return;
      }
      updatedVariantes[index].talla[newTalla] = cantidad;
      setVariantesData(updatedVariantes);
      setShowAddTallaForm(false);
      setNewTalla('');
      setNewCantidad('');
    } else {
      console.error('La cantidad no es un número válido');
    }
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
    const files = event.target.files;
    console.log('Archivos cargados:', files);
    if (files && files.length > 0) {
      const updatedVariantes = [...variantesData];
      updatedVariantes[index].imagenes = Array.from(files); // Convertir files a una matriz
      const urls = [];
      for (let i = 0; i < files.length; i++) {
        urls.push(URL.createObjectURL(files[i]));
      }
      updatedVariantes[index].imagenURLs = urls; // Actualizar imagenURLs con las URLs de las imágenes cargadas
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

      console.log('Variantes de datos:', variantesData);

      variantesData.forEach((variante, index) => {
        const serializedTallas = JSON.stringify(variante.talla);
        formData.append(`variantesData[${index}][tallas]`, serializedTallas);
        formData.append(`variantesData[${index}][color]`, variante.color);
        formData.append(`variantesData[${index}][cantidad_disponible]`, JSON.stringify(variante.cantidad_disponible));
      
        // Adjuntar archivos de imagen al FormData
        const { imagenes } = variante;
        // Iterar sobre todas las imágenes de la variante
        for (let i = 0; i < imagenes.length; i++) {
          const imagen = imagenes[i];
          formData.append(`imagenes`, imagen);
        }
      });

      console.log('Datos del formulario antes de enviar:', formData);

      await addProduct(formData);

      setProductName('');
      setProductPrice('');
      setProductDescrip('');
      setProductCategoria('');
      setVariantesData([]);
      setCantidad_disponible({});

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
              {Object.entries(variante.talla).map(([talla, cantidad], i) => (
                <div key={i}>
                  <span>{talla}:</span> <span>{cantidad_disponible[talla]}</span>
                </div>
              ))}
              <label>Color:</label>
              <input
                type="text"
                value={variante.color}
                onChange={(e) => handleColorChange(e, index)}
              />
              {variante.imagenURLs.map((url, imgIndex) => (
                <img key={imgIndex} src={url} alt={`Imagen ${imgIndex}`} className="img-preview" />
              ))}
              <input
                type="file"
                onChange={(e) => handleFileChange(e, index)}
                name={`variantesData[${index}][imagenes]`}
                multiple
              />
              <button
                className="button-imagen-adm"
                type="button"
                onClick={() => handleAddTalla(index)}
              >
                Agregar Talla
              </button>
              {showAddTallaForm && (
                <div>
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
                    onBlur={handleCantidadChange}
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
