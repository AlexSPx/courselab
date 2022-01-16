import type { AppProps } from "next/app";
import Layout from "../components/Layout";
import { ModalContextProvider } from "../contexts/ModalContex";
import UserCtxProvider from "../contexts/UserContext";

//styles
import "../styles/globals.css";
import "../styles/Calendar.css";
import "../styles/DatePicker.css";
import WebSocketProvider from "../contexts/SocketContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WebSocketProvider>
      <ModalContextProvider>
        <UserCtxProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </UserCtxProvider>
      </ModalContextProvider>
    </WebSocketProvider>
  );
}
export default MyApp;
