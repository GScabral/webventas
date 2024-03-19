const { Productos } = require('../../db');
const { variantesproductos } = require('../../db');

const getProductos = async () => {
  try {
    // Obtiene todos los productos con sus variantes asociadas, incluyendo las imágenes de las variantes
    const productosConVariantes = await Productos.findAll({ include: variantesproductos });
    const productos = productosConVariantes.map((producto) => {
      let variantesProducto = [];
    
      // Mapea las variantes de cada producto
      if (producto.variantesproductos) {
        variantesProducto = producto.variantesproductos.map((variante) => {
          if (variante && variante.imagenes) {
            const imagenUrls = variante.imagenes.map(imagen => `uploads/${imagen}`);
            
            return {
              idVariante: variante.id_variante,
              talla: variante.talla,
              color: variante.color,
              cantidad_disponible: variante.cantidad_disponible,
              imagenes: imagenUrls
            };
          } else {
            // Si no hay imágenes, retornar un objeto vacío o manejarlo según tu lógica
            return {};
          }
        });
      }
    
      return {
        nombre: producto.nombre_producto,
        id: producto.id_producto,
        descripcion: producto.descripcion,
        categoria: producto.categoria,
        precio: producto.precio,
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
