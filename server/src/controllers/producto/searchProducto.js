const { Op } = require('sequelize');
const { Productos } = require('../../db');
const { variantesproductos } = require('../../db');

const buscar = async (nombre) => {
  try {
    console.log('Nombre recibido en la búsqueda:', nombre);
    if (!nombre) {
      throw new Error("Ingrese un nombre válido");
    }

    const findProductos = await Productos.findAll({
      where: {
        nombre_producto: {
          [Op.iLike]: `%${nombre}%`
        }
      },
      include: variantesproductos
    });

    const productos = findProductos.map((producto) => {
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

    console.log("Productos encontrados:", productos);
    return productos;
  } catch (error) {
    console.error("Error al buscar productos:", error.message);

    if (error.original) {
      console.error("Error interno de Sequelize:", error.original);
    }
    throw error;
  }
};

module.exports = buscar;
