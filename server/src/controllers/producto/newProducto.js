const { Productos } = require('../../db');
const { variantesproductos } = require('../../db');

const createNewProducto = async (bodyData, files) => {
  const { nombre_producto, descripcion, precio, categoria, variantesData } = bodyData;

  if (!Array.isArray(variantesData)) {
    return { error: 'variantesData debe ser un array' };
  }




  try {
    // Verificar si faltan campos obligatorios
    const requiredFields = ['nombre_producto', 'descripcion', 'precio', 'categoria'];
    const missingFields = requiredFields.filter(field => !bodyData[field]);
    if (missingFields.length > 0) {
      return { error: `Faltan campos obligatorios: ${missingFields.join(', ')}` };
    }

    // Crear el nuevo producto
    const newProducto = await Productos.create({
      nombre_producto,
      descripcion,
      precio,
      categoria,
    });
    
   
    
    // Guardar las variantes del producto
    // Guardar las variantes del producto
for (let i = 0; i < variantesData.length; i++) {
  const { tallas, color } = variantesData[i];
  const imagenFilesKey = `variantesData[${i}][imagenFiles][0]`;

  // Obtener los archivos de imagen correspondientes a esta variante
  const imagenFiles = files[imagenFilesKey];

  // Verificar si hay archivos de imagen para esta variante
  if (Array.isArray(imagenFiles) && imagenFiles.length > 0) {
    // Convertir el path de la imagen en un array de strings si solo hay una imagen
    const imagenes = imagenFiles.map(file => file.path);

    // Iterar sobre las tallas y crear una variante para cada una
    for (let j = 0; j < tallas.length; j++) {
      const { talla, cantidad } = tallas[j];
      // Crear una nueva variante con el array de strings para las imágenes
      const nuevaVariante = await variantesproductos.create({
        talla,
        color,
        cantidad_disponible: cantidad,
        ProductoIdProducto: newProducto.id_producto,
        imagenes 
      });
    }
  } else {
    // Si no hay archivos de imagen para esta variante, manejarlo según sea necesario
  }
}

    
    return { newProducto };
  } catch (error) {
    console.error("Error en la creación del producto:", error);
    return { error: 'Error en la creación del producto' };
  }
};

module.exports = createNewProducto;
