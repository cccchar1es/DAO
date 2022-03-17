import React from "react";
import { useWallet, UseWalletProvider } from "use-wallet";
import {useNavigate} from 'react-router-dom'
import {
  Main,
  Button,
  Split,
  Box,
  GU,
  Bar,
  BackButton,
  textStyle,
  IdentityBadge,
  IconWallet,
  IconConnection,
  Card,
} from "@aragon/ui";

function App() {
  const wallet = useWallet();
  const blockNumber = wallet.getBlockNumber();
  const navigate = useNavigate();

  return (
    <Main>
      {wallet.status === "connected" ? ( //wallet is connected
        <div>
          {/******** wallet connection **********/}
          <div
            css={`
              margin-left: ${125 * GU}px;
              margin-top: ${3 * GU}px;
            `}
          >
            <IdentityBadge
              // customLabel={wallet.account}
              entity={wallet.account}
              connectedAccount
            />

            <Button
              icon={<IconConnection />}
              label="Connected"
              mode="positive"
              size="mini"
            />

            {/* <Button onClick={() => wallet.reset()}>disconnect</Button> */}
          </div>
          {/******** DAO creation and finder card **********/}

          <Card
            onClick=""
            height="200px"
            width="500px"
            css={`
              margin-left: ${35 * GU}px;
              margin-top: ${3 * GU}px;
            `}
          >
            Create a DAO
          </Card>
        </div>
      ) : (
        //wallet is not connected
        <div>
          <div
            css={`
              margin-left: ${125 * GU}px;
              margin-top: ${3 * GU}px;
            `}
          >
            <Button
              icon={<IconWallet />}
              onClick={() => wallet.connect()}
              label="Connect Wallet"
            />
          </div>
          <div
            css={`
              ${textStyle("title1")};
              margin-left: ${51 * GU}px;
              margin-top: ${15 * GU}px;
            `}
          >
            Welcome to DAO
          </div>
          <div
            css={`
              ${textStyle("title4")};
              margin-left: ${54 * GU}px;
              margin-top: ${3 * GU}px;
            `}
          >
            connect wallet first
          </div>
        </div>
      )}
    </Main>
  );
}

export default () => (
    <UseWalletProvider
      chainId={1}
      connectors={{
        // This is how connectors get configured
        portis: { dAppId: "my-dapp-id-123-xyz" },
      }}
    >
      <App />
    </UseWalletProvider>

);
