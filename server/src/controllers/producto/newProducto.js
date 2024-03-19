const { Productos } = require('../../db');
const { variantesproductos } = require('../../db');

const createNewProducto = async (bodyData, variantesData, files) => {
  try {
    console.log("en bodyData", bodyData);
    console.log("en variantesData", variantesData);
    console.log("Archivos de imagen:", files);

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

    const newProducto = await Productos.create({
      nombre_producto,
      descripcion,
      precio,
      categoria,
    });

    if (newProducto) {
      // Guardar las variantes del producto
      for (let i = 0; i < variantesData.length; i++) {
        const { talla, color, cantidad_disponible } = variantesData[i];
        const imagenes = files.filter(file => file.fieldname === `variantes.imagenes`);
      
        // Obtener las rutas de las imágenes como una matriz de cadenas
        const parsedRutaArchivos = imagenes.map(imagen => imagen.originalname);

        console.log("esto hay een parse ruta",parsedRutaArchivos)
      
        // Crear la variante del producto y asociarla al nuevo producto creado
        const nuevaVariante = await variantesproductos.create({
          talla,
          color,
          cantidad_disponible,
          imagenes:parsedRutaArchivos, // Utilizar directamente la variable imagenes que ya contiene la ruta de la imagen
          ProductoIdProducto: newProducto.id_producto,
        });
      
        console.log("Variante creada:", nuevaVariante);
      }
    }

    return { newProducto };
  } catch (error) {
    console.error("Error en la creación del producto:", error);
    return { error: 'Error en la creación del producto' };
  }
};
module.exports = createNewProducto;
