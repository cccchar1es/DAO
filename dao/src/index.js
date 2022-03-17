import React from "react";
import ReactDOM from "react-dom";
import App from "./App1";
import reportWebVitals from "./reportWebVitals";
import { Main } from "@aragon/ui";
import { UseWalletProvider } from "use-wallet";
import { BrowserRouter } from "react-router-dom";

ReactDOM.render(
  <UseWalletProvider
    chainId={1}
    connectors={{
      // This is how connectors get configured
      portis: { dAppId: "my-dapp-id-123-xyz" },
    }}
  >
    <Main>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Main>
  </UseWalletProvider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
