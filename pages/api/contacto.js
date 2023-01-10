// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import * as nodemailer from 'nodemailer';

export default async function fun(req, res) {

    const { nombre, apellidos, email, poblacion, conocer, edad, opinion, provincia, perfil, mensaje } = req.body;

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

    const mensajeTxt = {
        'felicitacion': 'Felicitación'
        ,'queja': 'Queja'
        ,'reclamacion': 'Reclamación'
        ,'sugerencia': 'Sugerencia'
    };

    const perfilTxt = {
        'alumnado': 'Alumnado'
        ,'familia': 'Familia'
        ,'personalcentro': 'Personal de Centro'
        ,'sugerencia': 'Sugerencia'
    };

    let conocerTxt =conocer.join(', ');
    if (conocerTxt==='')
        conocerTxt = 'Sin especificar';

    let edadTxt = edad||'Sin especificar';

    let texto = `
        MENSAJE: ${mensajeTxt[mensaje]}
        NOMBRE: ${nombre}
        APELLIDOS: ${apellidos}
        PERFIL: ${perfilTxt[perfil]}        
        POBLACIÓN: ${poblacion}
        PROVINCIA: ${provincia}
        CONOCER: ${conocerTxt}
        EDAD: ${edadTxt}
        OPINION: ${opinion}
    `;

    let nom = [];
    if (apellidos.trim()!=='')
        nom.push(apellidos.trim());

    if (nombre.trim()!=='')
        nom.push(nombre.trim());

    let sujeto = '';
    if (nom.length > 0)
        sujeto = ` - ${nom.join(', ')}`;

    let asunto = `${mensajeTxt[mensaje]}${sujeto} (${perfilTxt[perfil]}) - Buzón de sugerencias WEB`;

    let info = await transporter.sendMail({
        from: `${nombre} ${apellidos} <${email}>`, //'"Fred Foo " <foo@example.com>', // sender address
        to: process.env.MAIL_TO, // list of receivers
        subject: asunto, // Subject line
        text: texto, // plain text body
        //        html: JSON.stringify(req.body), // html body
    });

    res.status(200).json({ error: info.accepted.length === 0, info: info})

        
}
