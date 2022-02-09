import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);

    return initialProps;
  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
          <div
            id="notifications"
            className="absolute flex flex-col top-0 left-0"
          ></div>
          <div
            id="modals"
            className="absolute flex flex-col top-0 left-0"
          ></div>
        </body>
      </Html>
    );
  }
}

export default MyDocument;
