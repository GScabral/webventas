const { Productos } = require('../../db');
const { variantesproductos } = require('../../db');

const productoId = async (id) => {
  try {
    let infoProducto;

    infoProducto = await Productos.findByPk(id, { include: variantesproductos });

    let imagenUrls = ''; // Cambiar a un array para contener múltiples URLs de imágenes

    // Manejo de imágenes similar a getProductos
    if (typeof infoProducto.imagenes === 'string') {
      // Si solo hay una imagen, la agregamos al array
      imagenUrls = [`uploads/${infoProducto.imagenes}`];
    } else if (Array.isArray(infoProducto.imagenes) && infoProducto.imagenes.length > 0) {
      // Si hay múltiples imágenes, agregamos todas al array
      imagenUrls = infoProducto.imagenes.map(imagen => `uploads/${imagen}`);
    }

    const variantesProducto = infoProducto.variantesproductos.map((variante) => ({
      idVariante: variante.id_variante,
      talla: variante.talla,
      color: variante.color,
      cantidad_disponible: variante.cantidad_disponible
    }));

    if (infoProducto) {
      return {
        nombre: infoProducto.nombre_producto,
        id: infoProducto.id_producto,
        descripcion: infoProducto.descripcion,
        categoria: infoProducto.categoria,
        precio: infoProducto.precio,
        imagenes: imagenUrls, // Usar el array de URLs de imágenes
        variantes: variantesProducto
      };
    } else {
      throw new Error("Producto no encontrado");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports = productoId;
