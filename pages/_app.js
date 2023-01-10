import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

export default function MyApp({ Component, pageProps }) {
    return (
        <GoogleReCaptchaProvider
            reCaptchaKey={`${process.env.NEXT_PUBLIC_RECAPTCHA_CLAVE_SITIO_WEB}`}
            scriptProps={{
                async: false,
                defer: false,
                appendTo: "head",
                nonce: undefined,
            }}
        >
            <Component {...pageProps} />
        </GoogleReCaptchaProvider>
    )
}