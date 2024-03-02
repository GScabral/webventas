

const { variantesproductos } = require('../../db');

const actualizarCantidadDisponibleVariante = async (idVariante, nuevaCantidad) => {
  try {
    // Buscar la variante por su ID
    console.log('Valor de nuevaCantidad:', nuevaCantidad); 
    const variante = await variantesproductos.findByPk(idVariante);

    if (!variante) {
      console.log('La variante no se encontró');
      return;
    }

    // Actualizar la cantidad disponible de la variante
    variante.cantidad_disponible = nuevaCantidad;

    // Guardar los cambios en la base de datos
    await variante.save();

    console.log('Cantidad disponible de la variante actualizada con éxito');
  } catch (error) {
    console.error('Error al actualizar la cantidad disponible de la variante:', error);
  }
};

module.exports = actualizarCantidadDisponibleVariante;