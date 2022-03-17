import React from "react";
import { useWallet } from "use-wallet";
import { useNavigate, useParams } from "react-router-dom";
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
  Tag,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  Text,
  Amount,
  Distribution,
} from "@aragon/ui";
import DataView from "@aragon/ui/dist/DataView";

function token() {
  const wallet = useWallet();
  const dao = useParams();

  const [update, setCount] = React.useState(0);
  const forceUpdate = () => {
    setCount(update + 1);
  };
  // get token name
  const [tok_name, set_tok_name] = React.useState(0);
  const [holder, set_holder] = React.useState(0);
  const [balance, set_balance] = React.useState(0);
  const [supply, set_supply] = React.useState(0);
  React.useEffect(() => {
    let isMounted = true;
    Contract.get_token(wallet.account, dao.addr).then((value) => {
      if (isMounted) {
        Contract.get_tok_name(wallet.account, value).then((value) => set_tok_name(value));
        Contract.get_holder(wallet.account, value).then((value) => set_holder(value));
        Contract.get_balance(wallet.account, value).then((value) => set_balance(value));
        Contract.get_total_supply(wallet.account, value).then((value) => set_supply(value));
      }
    });
    return () => {
      isMounted = false;
    };
  }, [update]);

  const holders = [];
  const distribution = [];
  for (let i = 0; i < holder.length; i++) {
    holders.push({ _holder: holder[i], _balance: balance[i] });
    distribution.push({ item: holder[i], percentage: Math.round(1000*(balance[i]/supply))/10 })
  }

  const add_m =async()=>{
    const addr = await Contract.get_token(wallet.account, dao.addr)
    await Contract.add_token(wallet.account, addr)
    forceUpdate()
  }

  const holder_list = holders.map((holder) => (
    <Holder holder={holder._holder} balance={holder._balance} />
  ));

  return (
    <>
      <div
        css={`
          ${textStyle("title1")};
        `}
      >
        Tokens: {tok_name}
        <Button
          label="Add Token"
          mode="strong"
          css={`
            margin-bottom: 10px;
            margin-left: 700px;
          `}
          onClick={() => add_m()}
        />
      </div>
      <Split
        primary={
          <Box padding={15} heading={"Holder"}>
            {holder_list}
          </Box>
        }
        secondary={
          <Box heading="Distribution">
            <Distribution
              items={distribution}
            />
          </Box>
        }
      />
    </>
  );
}

function Holder(props) {
  return (
    <TableRow>
      <div
        css={`
          margin-bottom: -12px;
          margin-top: -12px;
          margin-left: 5px;
        `}
      >
        <TableCell>
          <IdentityBadge entity={props.holder} />
        </TableCell>
        <TableCell>
          <div
            css={`
              margin-left: 430px;
            `}
          >
            <Text>{props.balance}</Text>
          </div>
        </TableCell>
      </div>
    </TableRow>
  );
}

export default token;
