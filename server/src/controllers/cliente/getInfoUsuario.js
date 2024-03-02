const { Cliente } = require('../../db');

const obtenerInfUsuario = async (correo, contraseña) => {
  try {
    const user = await Cliente.findOne({ where: { correo, contraseña } });

    if (!user) {
      return { error: 'Credenciales inválidas', user: null };
    }

    return { error: null, user };
  } catch (error) {
    console.error("Error al obtener información del usuario:", error);
    return { error: 'Error al obtener la información del usuario', user: null };
  }
};

module.exports = obtenerInfUsuario;