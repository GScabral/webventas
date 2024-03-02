const { Router } = require("express");
const crearPedido = require("../controllers/pedido/newPedido");
const getPedidos = require("../controllers/pedido/getPedidos")

const router = Router();

router.post("/nuevoPedido", async (req, res) => {
    try {
       
        const nuevoPedido = await crearPedido(req.body);
        if (nuevoPedido.success === false) {
            res.status(400).json({ error: nuevoPedido.error });
        } else {
            res.status(200).json({ success: true, message: nuevoPedido.message, id_pedido: nuevoPedido.id_pedido }); // Enviar también el número de pedido al cliente
        }
    } catch (error) {
        res.status(500).json({ error: error.message }); // Enviar el mensaje de error específico
    }
});

router.get("/Lpedidos",async(req,res)=>{
    try{
        const pedido=await getPedidos();
        res.status(200).json(pedido);
    }catch(error){
        res.status(500).json({error:"error al obtener el pedido"})
    }
})

module.exports = router;