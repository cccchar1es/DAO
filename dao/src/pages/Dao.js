import React from "react";
import { useWallet } from "use-wallet";
import { useNavigate, useParams } from "react-router-dom";
import Voting from "./Voting";
import Roadmap from "./Roadmap";
import Intro from "./Intro";
import Token from "./Token";
import Finance from "./Finance";
import Fundraising from "./Fundraising.js"
import * as Contract from "../Web3Client";
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
  TokenAmount,
  Header,
  EmptyStateCard,
  EthIdenticon,
  TextInput,
  Tabs,
  Popover,
  Modal,
} from "@aragon/ui";

function dao() {
  const wallet = useWallet();
  const dao = useParams();
  const [Name, setName] = React.useState(null);

  Contract.get_dao_name(dao.addr).then((value) => setName(value));

  const items = [
    "Home",
    "Voting",
    "Roadmap",
    "Token",
    "Finance",
    "Fundraising",
  ];
  const [selected, setSelected] = React.useState(0);
  let app;
  if (selected == 0) {
    app = <Intro />;
  } else if (selected == 1) {
    app = <Voting />;
  } else if (selected == 2) {
    app = <Roadmap />;
  } else if (selected == 3) {
    app = <Token />;
  } else if (selected == 4) {
    app = <Finance />;
  } else if (selected == 5) {
    app = <Fundraising />
  }


  return (
    <>
      <Header
        primary={Name}
        secondary={
          <EthIdenticon address={dao.addr} scale={2} radius={3} text="32" />
        }
      />

      <Tabs items={items} selected={selected} onChange={setSelected} />

      {app}

      {wallet.status === "connected" ? (
        <></>
      ) : (
        <Modal visible={true}>
          Wallet is disconnected!
          <Button
            icon={<IconWallet />}
            onClick={() => wallet.connect()}
            label="Connect Wallet"
          />
          
        </Modal>
      )}

    </>
  );
}

export default dao;
