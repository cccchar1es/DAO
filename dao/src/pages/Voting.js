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
  RadioList
} from "@aragon/ui";
import * as Contract from "../Web3Client";
import { async } from "@aragon/ui/dist/ToastHub";

function voting() {
  return (
    <>
      <div
        css={`
          display: flex;
          flex-wrap: wrap;
          margin-left: 10px;
        `}
      >
        <VotingsCard />
      </div>
    </>
  );
}

function VotingsCard() {
  const wallet = useWallet();
  const dao = useParams();

  const [update, forceUpdate] = React.useReducer((x) => x + 1, 0);
  const [opened, setOpened] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [approvalPct, setapprovalPct] = React.useState(0);
  const [Days, setDays] = React.useState(1);
  const [Mins, setMins] = React.useState(0);
  const [Hours, setHours] = React.useState(0);
  const now = Math.floor(Date.now() / 1000);
  const DAY = 60 * 60 * 24;
  const endDate = now + Days * DAY + Mins * (DAY / 1440) + Hours * (DAY / 24);
  // console.log("time is " + typeof(endDate) +" | the now :" +typeof(now))
  const vote_method = [
    {
      title: 'Token Base',
      description: 'The voting will be based on the goverance token.',
    },
    {
      title: 'Person Base',
      description: 'The voting will be based on token holders.',
    },
  ]

  const [VoteMethod, setVoteMethod] = React.useState(0);
  console.log(VoteMethod)
 

  const create_voting = async (account, content, endDate, approvalPct, vote_method) => {
    const addr = await Contract.get_voting(wallet.account, dao.addr);
    await Contract.create_Voting(account, addr, content, endDate, approvalPct, vote_method);
  };

 

  return (
    <>
      <Card
        onClick={() => setOpened(true)}
        css={`
          margin: 8px;
          padding: 25px;
        `}
        width="255px"
      >
        <div
          css={`
            ${textStyle("body3")};
          `}
        >
          Create Vote
        </div>
      </Card>

      <SidePanel
        title="Create Vote"
        opened={opened}
        onClose={() => setOpened(false)}
      >
        Proposal:
        <TextInput
          autofocus={true}
          css={`
            margin-top: 20px;
            margin-bottom: 30px;
          `}
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
          }}
        />
        Vote Method: {VoteMethod}
        <RadioList
        items={vote_method}
        selected={VoteMethod}
        onChange={setVoteMethod}
        css={`
            margin-top: 20px;
            margin-bottom: 30px;
          `}
      />
        Approval Percentage: {Math.round(approvalPct * 100)}%
        <Slider
          css={`
            margin-top: 20px;
            margin-bottom: 30px;
          `}
          value={approvalPct}
          onUpdate={setapprovalPct}
        />
        Duration:
        <div
          css={`
            margin-bottom: 30px;
            margin-top: 20px;
          `}
        >
          <TextInput
            css={`
              width: 120px;
            `}
            value={Days}
            onChange={(event) => {
              setDays(event.target.value);
            }}
            adornment="Days"
            adornmentPosition="end"
          />
          <TextInput
            css={`
              width: 120px;
              margin-left: 20px;
            `}
            value={Hours}
            onChange={(event) => {
              setHours(event.target.value);
            }}
            adornment="Hours"
            adornmentPosition="end"
          />
          <TextInput
            css={`
              width: 120px;
              margin-left: 20px;
            `}
            value={Mins}
            onChange={(event) => {
              setMins(event.target.value);
            }}
            adornment="Minutes"
            adornmentPosition="end"
          />
        </div>
        <div>
          <Button
            css={`
              margin-top: 5px;
              margin-left: 140px;
              margin-bottom: 30px;
            `}
            label="Create"
            mode="strong"
            onClick={async () => {
              create_voting(
                wallet.account,
                value,
                endDate,
                Math.round(approvalPct * 100),
                VoteMethod
              ).then(() => {
                setOpened(false);
                forceUpdate();
              });
            }}
          />
        </div>
      </SidePanel>
      <AllVotings update={update} />
    </>
  );
}

function VoteCard(props) {
  //[content, endDate, approvalPct, yes, no, VoterStatus]
  const [opened, setOpened] = React.useState(false);

  const open = () => setOpened(true);
  const close = () => setOpened(false);

  const Now = Date.now();
  const endDate = new Date(props.endDate * 1000);
  // console.log("get the time: " + endDate +" now: "+ Now);

  const wallet = useWallet();
  const dao = useParams();
  const [VoteAddr, setVoteAddr] = React.useState(false);
  const vote = (voteId, support) => {
    Contract.get_voting(wallet.account, dao.addr).then(async (value) =>{
      const fin_addr = await Contract.get_finance(dao.addr)
      const road_addr = await Contract.get_roadmap(dao.addr)
      let event = await Contract.take_Vote(wallet.account, value, voteId, support,fin_addr, road_addr)
      props.update()
      console.log("the event I get ")
      console.log(event.events.Voter_Status)
    }
    );
  };

  const vote_is_open = endDate > Now;
  const vote_is_approved = props.yes >= props.approvalPct;
  const vote_is_not_approved = props.no > (100-props.approvalPct)

  let ToP;
  if(props.votemethod == 0){
    ToP=<> token </>
  } else {
    ToP=<> person </>
  }

  let timer_in_voting;
  let status;
  let VoterStatus;
  if (vote_is_approved) {
    status = timer_in_voting = (
      <Text
        color="#2CC68F"
        css={`
          ${textStyle("body1")};
        `}
      >
        <IconCheck /> Approved
      </Text>
    );
  } else if (!vote_is_approved && !vote_is_open || vote_is_not_approved) {
    status = timer_in_voting = (
      <Text
        color="#FF6969"
        css={`
          ${textStyle("body1")};
        `}
      >
        <IconCross />
        Rejected
      </Text>
    );
  } else {
    timer_in_voting = <Timer end={endDate} />;
    status = (
      <Text
        color="#C4CDD5"
        css={`
          ${textStyle("body1")};
        `}
      >
        <IconGroup /> Pending <Timer end={endDate} />
      </Text>
    );
  }

  if (props.VoterStatus == 0) {
    VoterStatus = (
      <div
        css={`
          margin-top: 20px;
          margin-left: 100px;
        `}
      >
        <Button
          label="Yes"
          mode="positive"
          onClick={() => vote(props.voteId, true)}
        />
        <Button
          label="No"
          mode="negative"
          css={`
            margin-left: 100px;
          `}
          onClick={() => vote(props.voteId, false)}
        />
      </div>
    );
  } else if (props.VoterStatus == 1) {
    VoterStatus = (
      <div
        css={`
          margin-top: 20px;
          margin-left: 100px;
        `}
      >
        <Text
          color="#2CC68F"
          css={`
            ${textStyle("body1")};
          `}
        >
          <IconCheck /> you voted Yes!
        </Text>
      </div>
    );
  } else if (props.VoterStatus == 2) {
    VoterStatus = (
      <div
        css={`
          margin-top: 20px;
          margin-left: 100px;
        `}
      >
        <Text
          color="#FF6969"
          css={`
            ${textStyle("body1")};
          `}
        >
          <IconCross /> you voted No!
        </Text>
      </div>
    );
  }
  
  return (
    <>
      <Card
        onClick={open}
        css={`
          margin: 8px;
          padding: 25px;
          justify-content: flex-start;
          align-items: start;
          word-break: break-all;
        `}
        width="255px"
      >
        <div
          css={`
            ${textStyle("body3")};
          `}
        >
          {props.content}
        </div>
        <div
          css={`
            margin-top: 180px;
            margin-bottom: 20px;
            position: absolute;
          `}
        >
          <Text
            color="#2CC68F"
            css={`
              margin-right: 180px;
              ${textStyle("label2")};
            `}
          >
            Yes
          </Text>

          <ProgressBar value={props.yes / 100} color="#2CC68F" />

          <Text
            color="#FF6969"
            css={`
              margin-right: 180px;
              ${textStyle("label2")};
            `}
          >
            No
          </Text>

          <ProgressBar value={props.no / 100} color="#FF6969" />
          <div
            css={`
              margin-top: 12px;
            `}
          >
            {/* <Timer end={endDate} /> */}
            {timer_in_voting}
          </div>
        </div>
      </Card>

      {/* vote proposal inside card **********************************************************/}
      <Modal visible={opened} onClose={close}>
        <div
          css={`
            ${textStyle("body1")};
          `}
        >
          Proposoal:
        </div>
        <div
          css={`
            ${textStyle("body1")};
          `}
        >
          {props.content}
        </div>

        {/* vote status **********************************************************/}
        <div
          css={`
            margin-bottom: 10px;
          `}
        >
          <div
            css={`
              ${textStyle("body1")};
            `}
          >
            Status:
          </div>
          {status}
        </div>
        {/* vote progerss ****************************************************************/}
        <div
          css={`
            ${textStyle("body1")};
          `}
        >
          Votes:
        </div>
        <ProgressBar value={props.yes / 100} />

        <div
          css={`
            ${textStyle("body1")};
            margin-top: 10px;
          `}
        >
          <IconVote color="#2CC68F" />
          Yes: {props.yesNum} {ToP}
          <IconVote color="#FF6969" />
          No: {props.noNum} {ToP}
        </div>

        {/* vote button ****************************************************************/}
        {VoterStatus}
      </Modal>
    </>
  );
}

function AllVotings(props) {
  const wallet = useWallet();
  const dao = useParams();
  const [display_votings, setdisplay_votings] = React.useState(null);
  const [update, setCount] = useState(0);
  const forceUpdate = () => {
    setCount(update + 1);
  };

  // #1: get vote_length #2: push each vote struct into lits #3pass the to component
  //[content, endDate, approvalPct, yes_voted_Pct, no_voted_Pct, voter_voted]

  const votings = [];
  React.useEffect(() => {
    let isMounted = true;
    Contract.get_voting(wallet.account, dao.addr).then(async (value) => {
      if (isMounted) {
        const vote_length = await Contract.get_Votes_length(value);
        // const a = await Contract.get_Votings(value,1);
        
        for (let i = vote_length; i >= 1; i--) {
          const _votings = await Contract.get_Votings(value, wallet.account, i);
          const _votings2 = await Contract.get_Votings2(value, i)
          console.log("yes voted"+ _votings2[0])
        console.log("vote_method"+ _votings2[2])
          votings.push({
            content: _votings[0],
            endDate: parseInt(_votings[1]),
            approvalPct: parseInt(_votings[2]),
            yes: parseInt(_votings[3]),
            no: parseInt(_votings[4]),
            VoterStatus: parseInt(_votings[5]),
            yesNum: parseInt(_votings2[0]),
            noNum: parseInt(_votings2[1]),
            votemethod: parseInt(_votings2[2]),
            voteId: i,
          });
          console.log("(update)The vote detail I receive")
          console.log(_votings)
        }
        setdisplay_votings(
          votings.map((voting) => (
            <VoteCard
              content={voting.content}
              endDate={voting.endDate}
              approvalPct={voting.approvalPct}
              yes={voting.yes}
              no={voting.no}
              VoterStatus={voting.VoterStatus}
              yesNum = {voting.yesNum}
              noNum = {voting.noNum}
              votemethod = {voting.votemethod}
              voteId={voting.voteId}
              update={forceUpdate}
            />
          ))
        );
      }
    });
    return () => {
      isMounted = false;
    };
  }, [props.update, update]);
  return <>{display_votings}</>;
}

export default voting;
