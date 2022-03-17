import React, { useState } from "react";
import { useWallet } from "use-wallet";
import { useNavigate, useParams } from "react-router-dom";
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
  DataView,
  ProgressBar,
  Text,
  Timer,
  Modal,
  SidePanel,
  Slider,
  Popover,
  IconCross,
  IconCheck,
  IconGroup,
  IconVote,
  RadioList,
  CircleGraph,
  TableCell,
  TableRow,
  Table,
  TableHeader
} from "@aragon/ui";
import * as Contract from "../Web3Client";

function Fundraising() {
  const dao = useParams();
  const wallet = useWallet();

  const [update, setCount] = React.useState(0);
  const forceUpdate = () => {
    setCount(update + 1);
  };

  const [amount, setamount] = React.useState(0);
  const [usdtBalance, setusdtBalance] = React.useState(0);
  const [share, setshare] = React.useState(0);
  const [history, sethistory] = React.useState(<></>);

  const contribute = async() => {
    await Contract.contribute(dao.addr, wallet.account)
    forceUpdate()
  }

  React.useEffect(() => {
    let isMounted = true;
    if (isMounted) {
        Contract.get_amount(dao.addr).then((value)=>setamount(value))
        Contract.display_token(wallet.account).then((value)=>setusdtBalance(value))
        Contract.get_share(dao.addr, wallet.account).then((value)=>setshare(value))
        Contract.get_history(dao.addr).then((H)=>{
            sethistory(H.map((h)=><Transfer sender={h.sender} date={h.date} amount={h.amount}/>))
        })
    }
    return () => {
      isMounted = false;
    };
  }, [update]);


  return (
    <>
      <Split
        primary={
          <>
            <Box heading="Token Exchange">Primary content</Box>
            <Table header={
        <TableRow>
          <TableHeader title="Date" />
          <TableHeader title="Source/Recipient" />
          <TableHeader title="Amount" />
        </TableRow>
        
      }>{history}</Table>
          </>
        }
        secondary={
          <>
            <Box
              heading="fundraising progress"
              css={`
                text-align: center;
              `}
            >
              <CircleGraph value={amount / 20000} size={220} strokeWidth={7} />
              <div
                css={`
                  margin-top: 20px;
                `}
              >
                {amount} USDT of 20,000 USDT
              </div>
              <Button
                label="Contribute"
                mode="strong"
                onClick={()=>contribute()}
                css={`
                  margin-top: 20px;
                `}
                
              />
            </Box>
            <Box heading="My Balance">
              <div>Your USDT balance: {usdtBalance}</div>{" "}
              <div>Your Share balance: {share}</div>
            </Box>
          </>
        }
        invert="horizontal"
      />
    </>
  );
}

function Transfer(props) {
    const d = new Date(props.date*1000);
    const time = d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate()
    const addrBadge = (
        <IdentityBadge
          entity={props.sender}
          connectedAccount
        />
      )
  return (
    <>
      <TableRow>
        <TableCell>
          <Text>{time}</Text>
        </TableCell>
        <TableCell>
          <Text>{addrBadge}</Text>
        </TableCell>
        <TableCell>
          <Text>{props.amount}</Text>
        </TableCell>
      </TableRow>
    </>
  );
}

export default Fundraising;
