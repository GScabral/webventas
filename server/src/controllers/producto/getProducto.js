const { Productos } = require('../../db');
const { variantesproductos } = require('../../db');

const getProductos = async () => {
  try {
    // Obtiene todos los productos con sus variantes asociadas
    const productosConVariantes = await Productos.findAll({ include: variantesproductos });

    const productos = productosConVariantes.map((producto) => {
      let imagenUrls = [];

      // Manejo de imágenes
      if (producto.imagenes) {
        // Si hay una sola imagen, la agregamos al array de URLs
        if (typeof producto.imagenes === 'string') {
          imagenUrls.push(`/uploads/${producto.imagenes}`);
        } 
        // Si hay varias imágenes, las añadimos al array de URLs
        else if (Array.isArray(producto.imagenes) && producto.imagenes.length > 0) {
          imagenUrls = producto.imagenes.map(imagen => `/uploads/${imagen}`);
        } 
        // Si el formato de imágenes no es reconocido, mostramos un error
        else {
          console.error('Formato de imagen no reconocido:', producto.imagenes);
        }
      }

      // Mapea las variantes de cada producto
      const variantesProducto = producto.variantesproductos.map((variante) => ({
        idVariante: variante.id_variante,
        talla: variante.talla,
        color: variante.color,
        cantidad_disponible: variante.cantidad_disponible
      }));

      return {
        nombre: producto.nombre_producto,
        id: producto.id_producto,
        descripcion: producto.descripcion,
        categoria: producto.categoria,
        precio: producto.precio,
        imagenes: imagenUrls,
        variantes: variantesProducto
      };
    });

   
    return productos;
  } catch (error) {
    console.error("Error al obtener la información de los productos:", error.message);

    if (error.original) {
      console.error("Error interno de Sequelize:", error.original);
    }
    throw error;
  }
};

module.exports = getProductos;
