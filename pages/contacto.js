import style from '../styles/Contacto.module.css';
import { useRef, useState } from 'react';
import { render } from 'react-dom';

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

    let render = '';

    if (enviado)
    {
        render = (
            <div>
                Mensaje enviado correctamente !!!!
            </div>
        )
    }

    if (!enviado) {
        render = (
            <>
                <ErroresForm error={errores} />
                <form ref={fc} name="formulariocontacto" className={style.fcontacto} action="/send-data-here" method="post">
                    <label htmlFor="nombre">Nombre:</label>
                    <input type="text" id="nombre" name="nombre" placeholder="Nombre" required />

                    <label htmlFor="apellidos">Apellidos:</label>
                    <input type="text" id="apellidos" placeholder="Apellidos" name="apellidos" required />

                    <label htmlFor="email">Correo Electrónico:</label>
                    <input type="email" id="email" name="email" placeholder="Correco electrónico" pattern="^\w+([\.-\\+]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$" required />

                    <label htmlFor="poblacion">Población:</label>
                    <input type="text" id="poblacion" name="poblacion" placeholder="Población" />

                    <label htmlFor="provincia">Provincia:</label>
                    <input type="text" id="provincia" name="provincia" placeholder="Provincia" />

                    <fieldset>
                        <legend>Edad:</legend>
                        <input type="radio" id="edad1" name="edad" value="0-20" /><label htmlFor="edad1">0-20</label>
                        <input type="radio" id="edad2" name="edad" value="21-40" /><label htmlFor="edad2">21-40</label>
                        <input type="radio" id="edad3" name="edad" value="41-60" /><label htmlFor="edad3">41-60</label>
                        <input type="radio" id="edad4" name="edad" value="61-" /><label htmlFor="edad4">61-</label>
                    </fieldset>

                    <fieldset >
                        <legend>¿Cómo nos conociste?</legend>
                        <input type="checkbox" id="conocer-amigo" name="amigo" value="S" /><label htmlFor="edad1">A través de un amigo</label>
                        <input type="checkbox" id="conocer-buscador" name="buscador" value="S" /><label htmlFor="edad2">A través de un buscador</label>
                        <input type="checkbox" id="conocer-red" name="red" value="S" /><label htmlFor="edad3">Navegando por la red</label>
                        <input type="checkbox" id="conocer-otros" name="otros" value="S" /><label htmlFor="edad4">Otros</label>
                    </fieldset>

                    <label htmlFor="opinion">Opinión sobre nuestra página web:</label>
                    <textarea id="opinion" cols="40" rows="5" name="opinion" required minLength={50}></textarea>

                    <input type="submit" onClick={enviarManejador} value={deshabilitarEnvio ? 'Enviando...' : 'Enviar'} disabled={deshabilitarEnvio} />
                </form>
            </>

        )
    }

    return render;
}