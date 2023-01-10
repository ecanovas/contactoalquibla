import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

export default function MyApp({ Component, pageProps }) {

    return (
        <GoogleReCaptchaProvider
            reCaptchaKey="6LeE2OgjAAAAAN4gGribZuDl6vWC30iTU6Xijs1D"
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