const nodemailer = require('nodemailer')


const transporter = nodemailer.createTransport({
    service:'Gmail',
    auth:{
        user: 'amoremioshowroomok@gmail.com',
        pass: 'z a l b s c v l l f d l x h w y'
    }
})


const enviarCorreo = async (idPedido,infoPedido,destinatario)=>{
    console.log("infopedido en back:",infoPedido)
    try{
        const mailOption ={
            from: 'amoremioshowroomok@gmail.com',
            to: destinatario,
            subject: 'confirmacion de pedido',
            html:`
            <h1>Confirmación de pedido</h1>
            <p>Número de pedido: ${idPedido}</p>
            <p>Detalles del pedido:</p>
            <ul>
              ${infoPedido.map(item => `<li>${item.nombre}: ${item.cantidad}: ${item.color}</li>`).join('')}
            </ul>
          `
        };
    const info=await transporter.sendMail(mailOption);
    console.log('correo enviado',info.response);
        }catch(error){
            console.error('Error al enviar el correo electrónico:', error);
            throw error;
        } 
 }
 module.exports = enviarCorreo;