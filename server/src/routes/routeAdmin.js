const {Router}=require("express")
const createAdmin = require("../controllers/admin/admin")
const actualizarStock=require("../controllers/admin/patchAdminProduc");
const enviarCorreo = require("../controllers/correo/correo");


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



  router.patch("/cambioAdmin/:id", async (req, res) => {
    try {
        await actualizarStock(req.params.id, req.body); // Pasar todos los datos del producto
        res.status(200).json();
    } catch (error) {
        console.error("Error al cambiar:", error);
        res.status(500).json({ error: "Error al cambiar el producto" });
    }
});

router.post('/confirmacionPedido',async (req,res)=>{
  try{
    const { numeroPedido, infoPedido, correo } = req.body;
    await enviarCorreo (numeroPedido,infoPedido,correo)
    res.status(200).send('Correo electrónico enviado con éxito');
  }catch (error) {
    // Manejar errores
    console.error('Error al enviar el correo electrónico:', error); // Agregar este console.error para obtener más información sobre el error
    res.status(500).send('Error al enviar el correo electrónico');
  }

})


module.exports = router;