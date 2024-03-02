const {Router}=require("express");
const getProductos=require("../controllers/producto/getProducto");
const createNewProducto=require("../controllers/producto/newProducto");
const upload= require('../../multerConfig');
const productoId =require("../controllers/producto/getById")
const getCat = require("../controllers/producto/getCategoria")
const actualizarCantidadDisponibleVariante=require("../controllers/producto/patchProducto")
const deleteProduct=require("../controllers/producto/deleteProduct")
const buscar=require("../controllers/producto/searchProducto")

const router=Router();

router.get("/producto",async(req,res)=>{
    try{
        const producto=await getProductos();
        res.status(200).json(producto);
    }catch(error){
        res.status(500).json({error:"erro al obtener el producto"})
    }
})

router.post("/nuevoProducto", upload, async (req, res) => {
    try {
      const { body, files } = req; // Cambiado de "file" a "files"
      const { variantesData } = body; // Asegúrate de que las variantes se envíen en req.body
  
      // Agrega console.log para verificar datos
      console.log('Datos del archivo (files):', files);
  
      // Agrega un nuevo console.log para verificar si los datos del formulario están correctos
      console.log('Datos del formulario:', req.body);
  
      const nuevoProducto = await createNewProducto(body, files, variantesData);
      if (nuevoProducto && nuevoProducto.error) {
        res.status(404).json({ error: nuevoProducto.message });
      } else {
        res.status(200).json(nuevoProducto);
      }
    } catch (error) {
      console.error(error); // Registra el error en la consola del servidor o en algún servicio de registro
      res.status(500).json({ error: error.message }); // Devuelve el mensaje de error específico al cliente
    }
  });

  
router.get("/ProductoId/:id",async(req,res)=>{
    const id=req.params.id;
    try{
        const resultadoId=await productoId(id);
      res.status(200).json(resultadoId)
    }catch(error){
        res.status(500).json({error:"error al buscar id"})
    }
})

router.get("/categoria",async(req,res)=>{
    try{
        const producto=await getCat();
        res.status(200).json(producto);
    }catch(error){
        res.status(500).json({error:"erro al obtener el producto"})
    }
})

router.patch("/cambio/:id", async (req, res) => {
    try {
        await actualizarCantidadDisponibleVariante(req.params.id, req.body.cantidad_disponible); // Pasar solo la nueva cantidad disponible
        res.status(200).json();
    } catch (error) {
        console.error("Error al cambiar:", error);
        res.status(500).json({ error: "Error al cambiar el producto" });
    }
});


router.patch("/editar/:id", async (req, res) => {
    try {
        const productoModificado = await actualizarCantidadDisponibleVariante(req, res);
        res.status(200).json({
            message: "Producto modificado exitosamente",
            modifiedProduct: productoModificado
        });
    } catch (error) {
        console.error("Error al cambiar:", error);
        res.status(500).json({ error: "Error al cambiar el producto" });
    }
});


router.delete("/eliminar/:id",async(req,res)=>{
    const { id } = req.params;
    try{
        const eliminar=await deleteProduct(id);
        if(eliminar.error){
            res.status(404).json({error:eliminar.message});
        }else{
            res.status(200).json(eliminar);
        }
    }catch(error){
        console.error("error al intertar eliminar el producto",error);
        res.status(500).json({error:"error en el servidor"})
    }
})

router.get("/name/:nombre",async(req,res)=>{
    const nombre= req.params.nombre;
    try{
        const resultadoNombre=await buscar(nombre);
        res.status(200).json(resultadoNombre);
    }catch(error){
        res.status(500).json({error:"error al buscar el nombre"})
    }
})


module.exports=router;