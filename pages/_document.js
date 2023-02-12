// This file allows to customize entire html document

import Document, { Html, Head, Main, NextScript } from 'next/document';

// Defining div-overlays dynamically allows to use React-portals or Modals later
class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head />
        <body>
          <div id="overlays" />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
