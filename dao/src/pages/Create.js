import React from "react";
import { useWallet } from "use-wallet";
import { useNavigate } from "react-router-dom";
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
} from "@aragon/ui";

function CreationCard() {
  const wallet = useWallet();
  const [dao_name, setDao_name] = React.useState("");
  const [token_name, setToken_name] = React.useState("");
  const [token_symbol, setToken_symbol] = React.useState("");
  const [token_amount, setToken_amount] = React.useState("");
  const navigate = useNavigate();

  const create_dao = async (
    account,
    name,
    tok_name,
    tok_symbol,
    tok_amount
  ) => {
    let event = await Contract.client_create_dao(
      account,
      name,
      tok_name,
      tok_symbol,
      tok_amount
    );
    console.log(event.events.newDAO.returnValues.addr);
    navigate("/dao/" + event.events.newDAO.returnValues.addr);
  };

  return (
    <Card
      height="500px"
      width="700px"
      css={`
        margin-left: ${20 * GU}px;
        margin-top: ${3 * GU}px;
      `}
    >
      <div
        css={`
          ${textStyle("body3")};
        `}
      >
        DAO Name:
      </div>
      <TextInput
        value={dao_name}
        onChange={(event) => {
          setDao_name(event.target.value);
        }}
      />

      <div
        css={`
          ${textStyle("body3")};
        `}
      >
        Token Name:
      </div>
      <TextInput
        value={token_name}
        onChange={(event) => {
          setToken_name(event.target.value);
        }}
      />
      <div
        css={`
          ${textStyle("body3")};
        `}
      >
        Token Symbol:
      </div>
      <TextInput
        value={token_symbol}
        onChange={(event) => setToken_symbol(event.target.value)}
      />
      <div
        css={`
          ${textStyle("body3")};
        `}
      >
        Token Amount:
      </div>
      <TextInput
        value={token_amount}
        onChange={(event) => setToken_amount(event.target.value)}
      />
      <Button
        mode="strong"
        label="Create"
        onClick={() =>
          create_dao(
            wallet.account,
            dao_name,
            token_name,
            token_symbol,
            token_amount
          )
        }
      />
    </Card>
  );
}

function Create() {
  const wallet = useWallet();

  return (
    <>
      <Header
        primary="Create DAO"
        secondary={
          <EthIdenticon
            address={wallet.account}
            scale={1.2}
            radius={3}
            text="32"
          />
        }
      />

      <CreationCard />
    </>
  );
}

export default Create;
