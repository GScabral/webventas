const { Pedido, DetallesPedido } = require('../../db');

const crearPedido = async (pedidoData) => {
  console.log('Datos del pedido recibidos:', pedidoData);
  let transaction;
  try {
    // Iniciar una transacción
    transaction = await Pedido.sequelize.transaction();

    // Crear un nuevo pedido con el estado proporcionado
    const nuevoPedido = await Pedido.create({ estado_pedido: 'PENDIENTE' }, { transaction });
    const { id_pedido } = nuevoPedido;

    // Crear los detalles del pedido
    for (const producto of pedidoData.productos) {
      const detallePedido = {
        PedidoIdPedido: id_pedido,
        ProductoIdProducto: producto.id,
        cantidad: producto.cantidad_elegida,
        variante: producto.variantes.idVariante, // Suponiendo que la variante es un objeto con un idVariante
        color: producto.variantes.color, // Suponiendo que la variante es un objeto con un color
        talle: producto.variantes.talla, // Suponiendo que la variante es un objeto con un talla
      };

      // Agregar un console.log para ver los detalles del pedido antes de crearlos
      console.log("Detalle del pedido a crear:", detallePedido);

      await DetallesPedido.create(detallePedido, { transaction });
    }

    // Commit de la transacción
    await transaction.commit();

    return { success: true, message: 'Pedido creado y productos asociados con éxito', id_pedido };
  } catch (error) {
    // Rollback de la transacción en caso de error
    if (transaction) await transaction.rollback();
    console.error('Error al crear pedido:', error);
    return { success: false, error: error.message };
  }
};

module.exports = crearPedido;