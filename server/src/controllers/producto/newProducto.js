const { Productos } = require('../../db');
const { variantesproductos } = require('../../db');

// Controlador createNewProducto
const createNewProducto = async (bodyData, variantesData, files) => {
  try {
    // Verificar si faltan campos obligatorios
    const requiredFields = ['nombre_producto', 'descripcion', 'precio', 'categoria'];
    const missingFields = requiredFields.filter(field => !bodyData[field]);
    if (missingFields.length > 0) {
      return { error: `Faltan campos obligatorios: ${missingFields.join(', ')}` };
    }

    // Crear el nuevo producto
    const { nombre_producto, descripcion, precio, categoria } = bodyData;
    const newProducto = await Productos.create({
      nombre_producto,
      descripcion,
      precio,
      categoria,
    });

    // Guardar las variantes del producto
    for (let i = 0; i < variantesData.length; i++) {
      const { tallas, color, cantidad_disponible } = variantesData[i];

      // Convertir la cadena de tallas a un objeto
      const tallaObj = JSON.parse(tallas);

      // Obtener las imágenes correspondientes a esta variante
      const imagenes = files.filter(file => file.fieldname === 'imagenes');
      const parsedRutaArchivos = imagenes.map(imagen => imagen.originalname);
      
      console.log(`Imágenes de la variante ${i}:`, parsedRutaArchivos);
      // Iterar sobre las tallas y crear una variante para cada una
      for (let talla in tallaObj) {
        const cantidad = tallaObj[talla];
        const nuevaVariante = await variantesproductos.create({
          talla,
          color,
          cantidad_disponible: cantidad,
          imagenes: parsedRutaArchivos,
          ProductoIdProducto: newProducto.id_producto,
        });
      }
    }

    return { newProducto };
  } catch (error) {
    console.error("Error en la creación del producto:", error);
    return { error: 'Error en la creación del producto' };
  }
};

module.exports = createNewProducto;