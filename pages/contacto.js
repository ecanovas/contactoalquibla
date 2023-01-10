import style from '../styles/Contacto.module.css';
import { useRef, useState } from 'react';

import { useGoogleReCaptcha } from "react-google-recaptcha-v3";


function ErroresForm(props) {

    if (props.error.length === 0) return '';
    return (
        <div className={style.erroresform}>
            <h3>Errores</h3>
            <ul>
                {
                    props.error.map((v, i) => {
                        return (
                            <li key={i}>
                                <span className={style.erroresformCampo}>{v.nombre}</span>
                                <span className={style.erroresformMensaje}>{v.mensaje}</span>
                            </li>)
                    })
                }
            </ul>
        </div>
    )
}

export default function Contacto() {
    let fc = useRef({});
    const { executeRecaptcha } = useGoogleReCaptcha();
    console.log(executeRecaptcha);
//    console.log(process.env.NEXT_PUBLIC_RECAPTCHA_CLAVE_SITIO_WEB);
//    console.log(process.env.RECAPTCHA_CLAVE_SECRETA);

    const [errores, setErrores] = useState([]);
    const [deshabilitarEnvio, setDeshabilitarEnvio] = useState(false);
    const [enviado, setEnviado] = useState(false);

    async function enviarManejador(e) {
        e.preventDefault();
        setDeshabilitarEnvio(true);

        let datos = {};
        let erroresL = [];

        let entries = Object.entries(fc.current);
        //console.log(entries);

        let cadregexp = /^(?<clave>.+)-(?<valor>.+)$/;
        entries.forEach((v, i) => {

            if (
                (
                    v[1].nodeName !== 'INPUT'
                    &&
                    v[1].nodeName !== 'TEXTAREA'
                    &&
                    v[1].nodeName !== 'SELECT'
                )
            ) return;

            if (!v[1].validity.valid) {
                let texto = '';

                if (v[1].labels.length >= 1)
                    texto = v[1].labels[0].innerText;

                erroresL.push({
                    campo: v[1]['name']
                    , nombre: texto
                    , mensaje: v[1].validationMessage
                    , elemento: v[1]
                });

                return;
            }

            if (v[1]['type'] === 'radio') {

                if (!datos[v[1]['name']])
                    datos[v[1]['name']] = null;

                if (v[1]['checked']) {
                    datos[v[1]['name']] = v[1].value;
                }

            }
            else if (v[1]['type'] === 'submit') {
                ;
            }
            else if (v[1]['type'] === 'checkbox') {

                let idt = v[1]['id'];

                let dat = idt.match(cadregexp);

                if (dat) {
                    // si tieene el formato pedido
                    if (!datos[dat.groups.clave])
                        datos[dat.groups.clave] = [];

                    if (v[1]['checked']) {
                        datos[dat.groups.clave].push(v[1].name);
                    }

                }

                //console.log(i, v);
            }
            else {
                datos[v[1]['name']] = v[1].value;
            }
        });

        // comprobaciones adicionales

        // comprobamos datos necesarios
        //        console.log(datos);
        //        console.log(erroresL);


        if (erroresL.length > 0) {
            setErrores(erroresL);
            setDeshabilitarEnvio(false);
        }
        else {
            setErrores([]);
            // enviando

            let ruta = `/api/contacto`;

            let correo = await fetch(ruta, {
                method: 'POST'
                , cache: 'no-cache'
                , headers: {
                    'Content-Type': 'application/json'
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: JSON.stringify(datos)
            })
                .then(response => response.json())
                ;

            if (!correo.error)
                setEnviado(true);

            setDeshabilitarEnvio(false);
        }
    }

    async function enviarManejadorRC(e) {
        e.preventDefault();

        if (!executeRecaptcha) {
            console.log("Execute recaptcha not yet available");
            return;
        }

        executeRecaptcha("enquiryFormSubmit").then((gReCaptchaToken) => {
            console.log(gReCaptchaToken, "response Google reCaptcha server");
            console.log('Enviar formulario');
        });
    }

    let render = '';

    if (enviado) {
        render = (
            <div>
                Mensaje enviado correctamente !!!!
            </div>
        )
    }

    if (!enviado) {
        render = (
            <>

                <h1>Buzón</h1>
                <div className={style.textoInformativo}>
                    <p>
                        Si deseas mandar una felicitación, queja, reclamación o sugerencia,
                        completa el siguiente cuestionario y te responderemos en un plazo máximo de 10 días lectivos.
                        Ten en cuenta que no se admiten anónimos y que, si la cuenta de correo está mal escrita, no podremos responder.
                        No se admitirán felicitaciones de los trabajadores del centro por razones obvias.
                    </p>
                </div>
                <ErroresForm error={errores} />
                <form ref={fc} name="formulariocontacto" className={style.fcontacto} action="/send-data-here" method="post">


                    <fieldset>
                        <legend>Mensaje de:</legend>
                        <input type="radio" id="mensaje1" name="mensaje" value="felicitacion" defaultChecked={'felicitacion'} /><label htmlFor="mensaje1">Felicitación</label>
                        <input type="radio" id="mensaje2" name="mensaje" value="queja" /><label htmlFor="mensaje2">Queja</label>
                        <input type="radio" id="mensaje3" name="mensaje" value="reclamacion" /><label htmlFor="mensaje3">Reclamación</label>
                        <input type="radio" id="mensaje4" name="mensaje" value="sugerencia" /><label htmlFor="mensaje4">Sugerencia</label>
                    </fieldset>


                    <label htmlFor="nombre">Nombre completo:</label>
                    <input type="text" id="nombre" name="nombre" placeholder="Nombre y Apellidos" required />

                    <fieldset>
                        <legend>Perfil:</legend>
                        <input type="radio" id="perfil1" name="perfil" value="alumnado" defaultChecked={'alumnado'} /><label htmlFor="perfil1">Alumnado</label>
                        <input type="radio" id="perfil2" name="perfil" value="familia" /><label htmlFor="perfil2">Familia</label>
                        <input type="radio" id="perfil3" name="perfil" value="personalcentro" /><label htmlFor="perfil3">Personal de Centro</label>
                        <input type="radio" id="perfil4" name="perfil" value="otro" /><label htmlFor="perfil4">Otro</label>
                    </fieldset>

                    <label htmlFor="email">Correo electrónico:</label>
                    <input type="email" id="email" name="email" placeholder="Correco electrónico" pattern="^\w+([\.-\\+]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$" required />

                    <label htmlFor="poblacion">Población:</label>
                    <input type="text" id="poblacion" name="poblacion" placeholder="Población" />

                    <label htmlFor="provincia">Provincia:</label>
                    <input type="text" id="provincia" name="provincia" placeholder="Provincia" />


                    <label htmlFor="opinion" className={style.comentario}>Comentario:</label>
                    <textarea id="opinion" cols="40" rows="5" name="opinion" required minLength={10}></textarea>

                    <input type="submit" onClick={enviarManejador} value={deshabilitarEnvio ? 'Enviando...' : 'Enviar'} disabled={deshabilitarEnvio} />
                </form>

            </>

        )
    }

    return render;
}