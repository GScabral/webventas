const nodemailer = require('nodemailer')


const transporter = nodemailer.createTransport({
    service:'Gmail',
    auth:{
        user: 'amoremioshowroomok@gmail.com',
        pass: 'z a l b s c v l l f d l x h w y'
    }
})


const enviarCorreo = async (idPedido, infoPedido, destinatario) => {

    try {
        const mailOption = {

            from: 'amoremioshowroomok@gmail.com',
            to: destinatario,
            subject: 'Confirmación de Pedido',
            html: `
                <!DOCTYPE html>
                <html lang="es">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Confirmación de Pedido</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f9f9f9;
                            padding: 20px;
                            border:solid 1px  #e7e7e7
                        }
                        .container {
                            max-width: 600px;
                            margin: 0 auto;
                            background-color: #fff;
                            padding: 20px;
                            border-radius: 10px;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        }
                        h1 {
                            color: #333;
                            text-align: center;
                        }
                        p {
                            margin-bottom: 10px;
                        }
                        ul {
                            list-style-type: none;
                            padding: 0;
                        }
                        li {
                            margin-bottom: 5px;
                        }
                        .thanks {
                            text-align: center;
                            margin-top: 20px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>¡Confirmación de Pedido!</h1>
                        <p>Estimado cliente,</p>
                        <p>Gracias por su compra. A continuación, le mostramos los detalles de su pedido:</p>
                        <p><strong>Número de Pedido:</strong> ${idPedido}</p>
                        <p><strong>Detalles del Pedido:</strong></p>
                        <ul>
                            ${infoPedido.map(item => `
                                <li>
                                    <strong>Nombre:</strong> ${item.nombre}<br>
                                    <strong>Cantidad:</strong> ${item.cantidad}<br>
                                    <strong>Color:</strong> ${item.color}
                                </li>
                            `).join('')}
                        </ul>
                        <p><strong>TOTAL: $${infoPedido[0].total}</strong></p>
                        <div class="thanks">
                            <p>¡Gracias por confiar en nosotros!</p>
                            <p>Equipo de Amore mio</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };
        const info = await transporter.sendMail(mailOption);
        console.log('Correo enviado', info.response);
    } catch (error) {
        console.error('Error al enviar el correo electrónico:', error);
        throw error;
    }
};

module.exports = enviarCorreo;