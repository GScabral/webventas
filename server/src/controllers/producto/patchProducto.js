

const { variantesproductos } = require('../../db');

const actualizarCantidadDisponibleVariante = async (idVariante, cantidad) => {
  console.log("esto llega al patch",cantidad)
  console.log("esto llega al patch",idVariante)
  try {
    const variante = await variantesproductos.findByPk(idVariante);

    if (!variante) {
      console.log("Variante no encontrada");
      return;
    }

    console.log("Cantidad disponible antes de la actualización:", variante.cantidad_disponible);

    if (variante.cantidad_disponible < cantidad) {
      console.log("La cantidad disponible es insuficiente");
      return;
    }

    if (variante.cantidad_disponible <= 0) {
      console.log("La cantidad disponible es insuficiente");
      return;
    }

    variante.cantidad_disponible -= cantidad;

    await variante.save();

    console.log("Cantidad disponible de la variante actualizada con éxito");
    console.log("Cantidad disponible después de la actualización:", variante.cantidad_disponible);
  } catch (error) {
    console.error("Error al actualizar la cantidad disponible de la variante:", error);
  }
};


module.exports = actualizarCantidadDisponibleVariante;