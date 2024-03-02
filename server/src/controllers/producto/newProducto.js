const { Productos } = require('../../db');
const { variantesproductos } = require('../../db');

const createNewProducto = async (bodyData, files, variantesData) => {
  try {
    const requiredFields = ['nombre_producto', 'descripcion', 'precio', 'categoria'];
    const missingFields = requiredFields.filter(field => !bodyData[field]);

    if (missingFields.length > 0) {
      return { error: `Faltan campos obligatorios: ${missingFields.join(', ')}` };
    }

    const {
      nombre_producto,
      descripcion,
      precio,
      categoria,
    } = bodyData;

    // Obtener las rutas de los archivos como una matriz de cadenas
    const parsedRutaArchivos = files ? files.map(file => `${file.filename}`) : [];

    const newProducto = await Productos.create({
      nombre_producto,
      descripcion,
      precio,
      categoria,
      imagenes: parsedRutaArchivos, // Almacenar las rutas de los archivos como una matriz de cadenas
    });

    if (newProducto) {
      // Guardar las variantes del producto
      for (const variante of variantesData) {
        await variantesproductos.create({
          talla: variante.talla,
          color: variante.color,
          cantidad_disponible: variante.cantidad_disponible,
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