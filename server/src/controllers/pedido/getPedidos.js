const { Pedido, DetallesPedido } = require('../../db');

const getPedidos = async () => {
    try {
        // Consultar todos los pedidos incluyendo los detalles asociados
        const pedidosConDetalle = await Pedido.findAll({ include: DetallesPedido });

        // Formatear los resultados
        const pedidos = pedidosConDetalle.map((pedido) => {
            return {
                id: pedido.id_pedido,
                fecha: pedido.fecha_pedido,
                detalles: pedido.DetallesPedidos.map((detalle) => ({
                    idDetalle: detalle.id_detalle_pedido,
                    cantidad: detalle.cantidad,
                    precio_u: detalle.precio_unitario,
                    estado: detalle.estado_pedido // Obtener el estado del pedido desde los detalles
                })),
            };
        });

        return pedidos;
    } catch (error) {
        console.error("Error al obtener la información de los pedidos:", error.message);
        throw error;
    }
};

module.exports = getPedidos;
