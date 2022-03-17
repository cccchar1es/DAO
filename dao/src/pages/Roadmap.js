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
  SidePanel,
  Radio,
  RadioGroup,
  DropDown,
  IconGroup,
  Text,
  IconCheck
} from "@aragon/ui";

function roadmap() {
  const dao = useParams();
  const wallet = useWallet();

  const RADIO_LABELS = ["Quater1", "Quater2", "Quater3", "Quater4"];
  const [quater, setQuater] = React.useState(0);
  const [opened, setOpened] = React.useState(false);
  const [content, setcontent] = React.useState("");
  const [selected1, setSelected1] = React.useState(null);
  const [reward, setReward] = React.useState(0);

  const [task1, settask1] = React.useState(<></>);
  const [task2, settask2] = React.useState(<></>);
  const [task3, settask3] = React.useState(<></>);
  const [task4, settask4] = React.useState(<></>);

  const [update, setCount] = React.useState(0);
  const forceUpdate = () => {
    setCount(update + 1);
  };

  const add_task = async (_content, _quater, _reward) => {
    console.log("information I have: " + content + quater + reward);
    await Contract.create_task(
      dao.addr,
      wallet.account,
      _content,
      _quater,
      _reward
    );
    setOpened(false);
    forceUpdate();
  };

  React.useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      // {content: t[0], rewards: t[3], worker: t[4], taskState: task_state}
      console.log(wallet.account)
      Contract.get_task(dao.addr, wallet.account, 1).then((T) =>
        settask1(
          T.map((t) => (
            <Task
              content={t.content}
              rewards={t.rewards}
              worker={t.worker}
              task_state={t.taskState}
              task_id={t.taskId}
              update={forceUpdate}
            />
          ))
        )
      );
      Contract.get_task(dao.addr, wallet.account, 2).then((T) =>
        settask2(
          T.map((t) => (
            <Task
              content={t.content}
              rewards={t.rewards}
              worker={t.worker}
              task_state={t.taskState}
              task_id={t.taskId}
              update={forceUpdate}
            />
          ))
        )
      );
      Contract.get_task(dao.addr, wallet.account, 3).then((T) =>
        settask3(
          T.map((t) => (
            <Task
              content={t.content}
              rewards={t.rewards}
              worker={t.worker}
              task_state={t.taskState}
              task_id={t.taskId}
              update={forceUpdate}
            />
          ))
        )
      );
      Contract.get_task(dao.addr, wallet.account, 4).then((T) =>
        settask4(
          T.map((t) => (
            <Task
              content={t.content}
              rewards={t.rewards}
              worker={t.worker}
              task_state={t.taskState}
              task_id={t.taskId}
              update={forceUpdate}
            />
          ))
        )
      );
    }

    return () => {
      isMounted = false;
    };
  }, [update]);

  return (
    <>
      <div
        css={`
          ${textStyle("title2")};
          margin-left: 20px;
        `}
      >
        Roadmap
        <Button
          label="Add Task"
          mode="strong"
          css={`
            margin-bottom: 10px;
            margin-left: 800px;
          `}
          onClick={() => setOpened(true)}
        />
      </div>

      {/* box **************************************************************** */}
      <Box heading={"Q1"}>
        <div
          css={`
            display: flex;
            flex-wrap: wrap;
            margin-left: 10px;
          `}
        >
          {task1}
        </div>
      </Box>
      <Box heading={"Q2"}>
        <div
          css={`
            display: flex;
            flex-wrap: wrap;
            margin-left: 10px;
          `}
        >
          {task2}
        </div>
      </Box>
      <Box heading={"Q3"}>
        <div
          css={`
            display: flex;
            flex-wrap: wrap;
            margin-left: 10px;
          `}
        >
          {task3}
        </div>
      </Box>
      <Box heading={"Q4"}>
        <div
          css={`
            display: flex;
            flex-wrap: wrap;
            margin-left: 10px;
          `}
        >
          {task4}
        </div>
      </Box>

      {/* side panel **************************************************************** */}
      <SidePanel
        title="Add Task"
        opened={opened}
        onClose={() => setOpened(false)}
      >
        Task Content:
        <TextInput
          css={`
            margin-top: 10px;
            margin-bottom: 30px;
          `}
          value={content}
          onChange={(event1) => {
            setcontent(event1.target.value);
          }}
        />
        Which Quater: {quater}
        <RadioGroup
          onChange={setQuater}
          selected={quater}
          css={`
            margin-top: 10px;
            margin-bottom: 30px;
          `}
        >
          {RADIO_LABELS.map((label, i) => {
            const radioId = i + 1;
            return (
              <label key={i}>
                <Radio id={radioId} />
                {label}
              </label>
            );
          })}
        </RadioGroup>
        Choose reward Token:
        <DropDown
          items={["USDT"]}
          selected={selected1}
          onChange={setSelected1}
          css={`
            margin-top: 10px;
            margin-bottom: 30px;
          `}
        />
        Reward Amount:
        <TextInput
          value={reward}
          onChange={(event) => {
            setReward(event.target.value);
          }}
          css={`
            margin-top: 10px;
            margin-bottom: 30px;
          `}
        />
        <div>
          <Button
            label="Add"
            css={`
              margin-top: 5px;
              margin-left: 140px;
              margin-bottom: 30px;
            `}
            mode="strong"
            onClick={() => add_task(content, quater, reward)}
          />
        </div>
      </SidePanel>
    </>
  );
}

function Task(props) {
  // content = {t.content} rewards={t.rewards} worker={t.worker} task_state={t.taskState}
  const dao = useParams();
  const wallet = useWallet();
  const addrBadge = <IdentityBadge entity={props.worker} />;

  const apply = async() =>{
    await Contract.apply(dao.addr, wallet.account, props.task_id)
    props.update()
  }

  const claim = async() =>{
    await Contract.claim_reward(dao.addr, wallet.account, props.task_id)
    props.update()
  }

  //task_state = 1. can apply 2. pending apply 3.rejected(belongs to other) 4.claim rewards 5.claim pending 6.clamined
  // task status *******************************************************************//
  let task_status = <Button label="apply" mode="strong" onClick={()=>apply()}/>;
  console.log("task state")
  console.log(props.task_state)
  if (props.task_state == 2) {
    task_status = (
      <Text
        color="#C4CDD5"
        css={`
          ${textStyle("body1")};
        `}
      >
        <IconGroup /> Apply Pending
      </Text>
    );
  } else if (props.task_state == 3) {
    task_status =<> { addrBadge }</>
  } else if (props.task_state == 4) {
    task_status = (
      <Button
        css={`
          margin-left: 15px;
        `}
        label="Claim"
        mode="strong"
        onClick={()=>claim()}
      />
    );
  } else if (props.task_state == 5) {
    task_status = (
      <Text
        color="#C4CDD5"
        css={`
          ${textStyle("body1")};
        `}
      >
        <IconGroup /> Claim Pending
      </Text>
    );
  } else if (props.task_state == 6) {
    task_status = <Text
        color="#2CC68F"
        css={`
          ${textStyle("body1")};
        `}
      >
        <IconCheck /> Claimed!
      </Text>
  }

  return (
    <>
      <Card
        css={`
          margin: 14px;
          padding: 15px;
          justify-content: flex-start;
          align-items: start;
          word-break: break-all;
        `}
        width={230}
        height={265}
      >
        <div>task #{props.task_id}</div>
        {props.content}
        <div
          css={`
            margin-top: 170px;
            margin-left: 25px;
            position: absolute;
            text-align: center;
          `}
        >
          Rewards: {props.rewards}USDT
          <div>{task_status}</div>
        </div>
      </Card>
    </>
  );
}

export default roadmap;
