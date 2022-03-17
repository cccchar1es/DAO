import {
    Main,
    Button,
    Split,
    Box,
    GU,
    Bar,
    BackButton,
    textStyle,
  } from "@aragon/ui";
  import React from 'react';
  import { useWallet, UseWalletProvider } from 'use-wallet'
  
  export function App () {
    const wallet = useWallet()
    return (
    <UseWalletProvider
      chainId={1}
      connectors={{
        // This is how connectors get configured
        portis: { dAppId: 'my-dapp-id-123-xyz' },
      }}
    >
    <Main>
  
      <div css={`margin-left: ${120 * GU}px; margin-top: ${3 * GU}px; `} >
        <Button label="connect wallet" onClick={() => wallet.connect()}/>
      </div>
  
    </Main>
    </UseWalletProvider>
    );
  }














  import React from "react";
import { useWallet, UseWalletProvider } from "use-wallet";
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
  IconConnection
} from "@aragon/ui";


function App() {
  const wallet = useWallet();
  const blockNumber = wallet.getBlockNumber();

  return (
    <Main>

      { /******** wallet connection **********/
        wallet.status === "connected" ? (//wallet is connected
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
          
          <Button icon={<IconConnection />}  label="Connected" mode="positive" size="mini"/>
          {/* <Button onClick={() => wallet.reset()}>disconnect</Button> */}
        </div>
      ) : ( //wallet is not connected
        <div>
        <div
          css={`
            margin-left: ${125 * GU}px;
            margin-top: ${3 * GU}px;
          `}
        >
          <Button icon={<IconWallet />} onClick={() => wallet.connect()} label="Connect Wallet"/>
         
        </div>
        <div
      css={`
        ${textStyle('body3')};
      `}
    >
      Body 3 text style
    </div>
        </div>
      )}
    </Main>
  );
}

// Wrap everything in <UseWalletProvider />
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


const wallet = useWallet();
{/* {wallet.status === "connected" ? (
        
      ) : (
        )} */}