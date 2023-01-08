// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import * as nodemailer from 'nodemailer';

export default async function fun(req, res) {

    const { nombre, apellidos, email, poblacion, conocer, edad, opinion, provincia } = req.body;

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        requireTLS: true,
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASSWORD_APP,
        },
    });
    // transporter.verify().then(console.log).catch(console.error);

    let texto = `
        NOMBRE: ${nombre}
        APELLIDOS: ${apellidos}
        POBLACIÓN: ${poblacion}
        PROVINCIA: ${provincia}
        CONOCER: ${conocer.join(', ')}
        EDAD: ${edad}
        OPINION: ${opinion}
    `;

    let info = await transporter.sendMail({
        from: `${nombre} ${apellidos} <${email}>`, //'"Fred Foo " <foo@example.com>', // sender address
        to: "ernesto.canovas@gmail.com", // list of receivers
        subject: "Formulario Contacto - WEB", // Subject line
        text: texto, // plain text body
        //        html: JSON.stringify(req.body), // html body
    });

    res.status(200).json({ error: info.accepted.length === 0, info: info})

        
}
