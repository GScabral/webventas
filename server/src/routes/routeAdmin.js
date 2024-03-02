const {Router}=require("express")
const createAdmin = require("../controllers/admin/admin")


const router = Router();

router.post("/NewAdmin", async (req, res) => {
    try {
      const nuevoAdmin = await createAdmin(req.body);
      
      if (nuevoAdmin && nuevoAdmin.error) {
        // Manejo de errores específicos de la creación de administradores
        return res.status(400).json({ error: nuevoAdmin.error });
      } else {
        return res.status(200).json(nuevoAdmin);
      }
    } catch (error) {
      // Manejo de errores genéricos del servidor
      console.error("Error en la ruta /NewAdmin:", error);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  });
module.exports = router;