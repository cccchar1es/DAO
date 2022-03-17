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
  DataView,
  SidePanel,
  DropDown,
} from "@aragon/ui";

function Finance() {
  const dao = useParams();
  const wallet = useWallet();
  const [opened, setOpened] = React.useState(false);
  const close_panel = () => {
    setOpened(false);
  };
  const [update, setCount] = React.useState(0);
  const forceUpdate = () => {
    setCount(update + 1);
  };

  //******************** token balance ********************** //
  const [TokenBalance, setTokenBalance] = React.useState(0);
  let display_balance = <div css={`
      height:94.5px  
  `}></div>;
  Contract.test_token_addr().then((value) => console.log(value));
  const test_token = async () => {
    const fin_addr = await Contract.get_finance(dao.addr);
    await Contract.request_token(wallet.account, fin_addr);
    forceUpdate();
  };
  if (TokenBalance != 0) {
    display_balance = (
      <div heading="Token balance" css={`
      text-align: center
    `}>
        <img
          src={require("./usdt.png")}
          width={"40px"}
          height={"40px"}
          alt={"USDT"}
          
        />
        <figcaption> {TokenBalance} USDT</figcaption>
        <figcaption> ${TokenBalance}</figcaption>
      </div>
    );
  }

  React.useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      //get token balance in finance
      Contract.get_finance(dao.addr).then((value) =>
        Contract.display_token(value).then((value) => setTokenBalance(value))
      );
    }
    return () => {
      isMounted = false;
    };
  }, [update]);
  console.log(TokenBalance);

  return (
    <>
      <div
        css={`
          ${textStyle("title2")};
          margin-left: 20px;
        `}
      >
        Finance
        <Button
          label="Request Test Token"
          mode="normal"
          css={`
            margin-left: 600px;
            margin-bottom: 5px;
          `}
          onClick={() => test_token()}
        />
        <Button
          label="New Transfer"
          mode="strong"
          css={`
            margin-left: 20px;
            margin-bottom: 5px;
          `}
          onClick={() => setOpened(true)}
        />
      </div>

      <Box heading="Token balance" >{display_balance}</Box>
      <Transfers update={update}/>
      <SidePanel
        title="Create Transfer"
        opened={opened}
        onClose={() => setOpened(false)}
      >
        <CreateTransfer closePanel={close_panel} update={forceUpdate} />
      </SidePanel>
    </>
  );
}

function CreateTransfer(props) {
  const wallet = useWallet();
  const dao = useParams();

  // deposit *********************************** //
  const [selected1, setSelected1] = React.useState(null);
  const [amount1, setamount1] = React.useState(0);
  const [ref1, setref1] = React.useState("");
  let mode;
  const deposit = async (ref, amount) => {
    const token_addr = await Contract.test_token_addr(dao.addr);
    const fin_addr = await Contract.get_finance(dao.addr);
    await Contract.deposit(wallet.account, token_addr, fin_addr, ref, amount);
    props.closePanel();
    props.update();
  };

  const Deposit = (
    <>
      Choose token:
      <DropDown
        items={["USDT"]}
        selected={selected1}
        onChange={setSelected1}
        css={`
          margin-bottom: 15px;
        `}
      />
      Amount:
      <TextInput
        value={amount1}
        onChange={(event) => {
          setamount1(event.target.value);
        }}
        css={`
          margin-bottom: 15px;
        `}
      />
      Reference:
      <TextInput
        value={ref1}
        onChange={(event) => {
          setref1(event.target.value);
        }}
        css={`
          margin-bottom: 15px;
        `}
      />
      <Button
        label="Deposit"
        mode="strong"
        onClick={() => deposit(ref1, amount1)}
      />
    </>
  );

  // withdraw *********************************** //
  const [selected2, setSelected2] = React.useState(null);
  const [amount2, setamount2] = React.useState(0);
  const [ref2, setref2] = React.useState("");
  const [recipient, setrecipient] = React.useState(null);

  const withdraw = async (receiver, ref, amount) => {
    const token_addr = await Contract.test_token_addr(dao.addr);
    const fin_addr = await Contract.get_finance(dao.addr);
    await Contract.withdraw(
      wallet.account,
      token_addr,
      receiver,
      fin_addr,
      ref,
      amount
    );
    props.closePanel();
  };

  const Withdraw = (
    <>
      Recipient:
      <TextInput
        value={recipient}
        onChange={(event) => {
          setrecipient(event.target.value);
        }}
        css={`
          margin-bottom: 15px;
        `}
      />
      Choose token:
      <DropDown
        items={["USDT"]}
        selected={selected2}
        onChange={setSelected2}
        css={`
          margin-bottom: 15px;
        `}
      />
      Amount:
      <TextInput
        value={amount2}
        onChange={(event) => {
          setamount2(event.target.value);
        }}
        css={`
          margin-bottom: 15px;
        `}
      />
      Reference:
      <TextInput
        value={ref2}
        onChange={(event) => {
          setref2(event.target.value);
        }}
        css={`
          margin-bottom: 15px;
        `}
      />
      <Button
        label="Create Vote"
        mode="strong"
        onClick={() => withdraw(recipient, ref2, amount2)}
      />
    </>
  );

  const [selected3, setSelected3] = React.useState(0);
  if (selected3 == 0) {
    mode = Deposit;
  } else {
    mode = Withdraw;
  }
  return (
    <>
      <Tabs
        items={["Deposit", "Withdraw"]}
        selected={selected3}
        onChange={setSelected3}
      />
      {mode}
    </>
  );
}

function Transfers(props) {
  const wallet = useWallet();
  const dao = useParams();
  const [transfers, settransfers] = React.useState(<></>);

  React.useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      Contract.get_transfer(dao.addr).then((tra) =>
        settransfers(
          tra.map((t) =>
            Transfer(t.date, t.source, t.ref, t.amount, t.iswithdraw)
          )
        )
      );
    }

    return () => {
      isMounted = false;
    };
  }, [props.update]);

  const Transfer = (date, addr, ref, amount, isWithdraw) => {
    const d = new Date(date*1000);
    const time = d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate()
    const addrBadge = (
      <IdentityBadge
        entity={addr}
        connectedAccount
      />
    );
    let amount1
    if(isWithdraw){
      amount1 = <Text
      color="#FF6969"
      css={`
        ${textStyle("body1")};
      `}
    > - {amount} </Text>
    } else {
      amount1 = <Text
      color="#2CC68F"
      css={`
        ${textStyle("body1")};
      `}
    > + {amount} </Text>
    }
    return (
      <>
        <TableRow>
        <TableCell>
          <Text>{time}</Text>
        </TableCell>
        <TableCell>
          {addrBadge}
        </TableCell>
        <TableCell>
          <Text>{ref}</Text>
        </TableCell>
        <TableCell>
          {amount1}
        </TableCell>
        </TableRow>
      </>
    );
  };

  return (
    <Table
      header={
        <TableRow>
          <TableHeader title="Date" />
          <TableHeader title="Source/Recipient" />
          <TableHeader title="Reference" />
          <TableHeader title="Amount" />
        </TableRow>
        
      }
    >
      {transfers}
    </Table>
  );
}

export default Finance;

// React.useEffect(() => {
//   let isMounted = true;
//   if (isMounted) {

//   }

//   return () => {
//     isMounted = false;
//   };
// }, []);
