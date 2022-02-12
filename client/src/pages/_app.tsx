import type { AppProps } from "next/app";
import Layout from "../components/Layout";
import { ModalContextProvider } from "../contexts/ModalContex";
import UserCtxProvider from "../contexts/UserContext";
import WebSocketProvider from "../contexts/SocketContext";

//styles
import "../styles/globals.css";
import "../styles/Calendar.css";
import "../styles/DatePicker.css";
import "react-datetime-picker/dist/DateTimePicker.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WebSocketProvider>
      <UserCtxProvider user={pageProps.user}>
        <Layout isAuth={pageProps.user?.isAuth}>
          <ModalContextProvider>
            <Component {...pageProps} />
          </ModalContextProvider>
        </Layout>
      </UserCtxProvider>
    </WebSocketProvider>
  );
}
export default MyApp;
