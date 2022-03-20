import type { AppProps, NextWebVitalsMetric } from "next/app";
import Layout from "../components/Layout";
import { ModalContextProvider } from "../contexts/ModalContex";
import UserCtxProvider from "../contexts/UserContext";
import WebSocketProvider from "../contexts/SocketContext";

//styles
import "../styles/globals.css";
import "../styles/Calendar.css";
import "../styles/DatePicker.css";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import Script from "next/script";
import { SWRConfig } from "swr";
import { fetcher } from "../lib/fetcher";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-LP109PS804"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
        window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
        
          gtag('config', 'G-LP109PS804');
          `}
      </Script>

      <WebSocketProvider user={pageProps.user}>
        <SWRConfig value={{ fetcher: fetcher }}>
          <UserCtxProvider user={pageProps.user}>
            <Layout isAuth={pageProps.user?.isAuth}>
              <ModalContextProvider>
                <Component {...pageProps} />
              </ModalContextProvider>
            </Layout>
          </UserCtxProvider>
        </SWRConfig>
      </WebSocketProvider>
    </>
  );
}

export default MyApp;
