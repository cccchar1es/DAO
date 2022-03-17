import Web3 from "web3";
import DAOfactory from "./contracts/DAOfactory.json";
import DAO from "./contracts/DAO.json";
import Token from "./contracts/Token.json"
import Voting from "./contracts/Voting.json"
import Finance from "./contracts/Finance.json"
import { useWallet } from "use-wallet";
import Fundraising from "./contracts/Fundraising.json";
import Roadmap from "./contracts/Roadmap.json";


let provider = window.ethereum;
const web3 = new Web3(provider);

// Create.js -------------------------------------------------------------------------------------- //
export async function client_create_dao(
  account,
  name,
  tok_name,
  tok_symbol,
  tok_amount
) {
  const networkId = await web3.eth.net.getId();
  const daofactory = new web3.eth.Contract(
    DAOfactory.abi,
    DAOfactory.networks[networkId].address
  );

  return daofactory.methods
    .create_DAO(name, tok_name, tok_symbol, tok_amount)
    .send({ from: account });
}

export async function get_dao_name(addr) {
  const dao = new web3.eth.Contract(DAO.abi, addr);
  const wallet = useWallet();
  return dao.methods.getname().call({ from: wallet.account });
}

export async function get_token(account, addr) {
  const dao = new web3.eth.Contract(DAO.abi, addr);
  // const wallet = useWallet();
  return dao.methods.gettoken().call({ from: account });
}

export async function get_voting(account, addr) {
  const dao = new web3.eth.Contract(DAO.abi, addr);
  // const wallet = useWallet();
  return dao.methods.getvoting().call({ from: account });
}

export async function get_finance(addr) {
  const dao = new web3.eth.Contract(DAO.abi, addr);
  return dao.methods.getfinance().call();
}

export async function get_fundraising(addr) {
  const dao = new web3.eth.Contract(DAO.abi, addr);
  return dao.methods.getfundraising().call();
}

export async function get_roadmap(addr) {
  const dao = new web3.eth.Contract(DAO.abi, addr);
  return dao.methods.getroadmap().call();
}

// Token.js --------------------------------------------------------------------------------------- //
export async function get_holder(account, addr){
  // const tok_addr = await get_token(addr);
  const token = new web3.eth.Contract(Token.abi, addr);
  return token.methods._get_holder().call({ account });
}

export async function get_balance(account, addr){
  // const tok_addr = await get_token(addr);
  const token = new web3.eth.Contract(Token.abi, addr);
  return token.methods._get_balance().call({ account });
}

export async function get_tok_name(account, addr){
  // const tok_addr = await get_token(addr);
  const token = new web3.eth.Contract(Token.abi, addr);
  return token.methods.name().call({ account });
}

export async function get_total_supply(account, addr){
  // const tok_addr = await get_token(addr);
  const token = new web3.eth.Contract(Token.abi, addr);
  return token.methods.totalSupply().call({ account });
}

export async function add_token(account, addr){

  const token = new web3.eth.Contract(Token.abi, addr);
  return token.methods.mint('0x1fE9718Ed2C870d79110162FbD100FB69D266eBd', 10).send({from: account})
}

// Voting.js --------------------------------------------------------------------------------------- //
export async function create_Voting(account, addr, content, endDate, approvalPct, vote_method){
  const voting = new web3.eth.Contract(Voting.abi, addr);
  return voting.methods.create_vote(content, endDate, approvalPct, vote_method).send({ from: account });
}

//[content, endDate, approvalPct, yes_voted_Pct, no_voted_Pct, voter_voted]
export async function get_Votings(addr, voter, voteId){
  const voting = new web3.eth.Contract(Voting.abi, addr);
  return voting.methods.get_votings(voter, voteId).call();
}

export async function get_Votings2(addr, voteId){
  const voting = new web3.eth.Contract(Voting.abi, addr);
  return voting.methods.get_votings2(voteId).call();
}

export async function get_Votes_length(addr){
  const voting = new web3.eth.Contract(Voting.abi, addr);
  return voting.methods.votes_length().call();
}

export async function take_Vote(account, vot_addr, voteId, support, fin_addr, road_addr){
  const voting = new web3.eth.Contract(Voting.abi, vot_addr);
  const finance = new web3.eth.Contract(Finance.abi, fin_addr);
  const roadmap = new web3.eth.Contract(Roadmap.abi, road_addr)
  const is_withdraw = await finance.methods.is_withdraw_vote(voteId).call()
  const is_task_vote = await roadmap.methods.is_task_vote(voteId).call()
  if(is_withdraw){
    return finance.methods.withdraw_take_vote(voteId, support).send({ from: account })
  } else if(is_task_vote){
    return roadmap.methods.task_vote(voteId, support).send({from: account})
  }
  return voting.methods.take_vote(voteId, support).send({ from: account })
}

// Finance.js --------------------------------------------------------------------------------------- //
export async function deposit(source, tok_addr, fin_addr, ref, amount){
  let token = new web3.eth.Contract(Token.abi, tok_addr);
  let finance = new web3.eth.Contract(Finance.abi, fin_addr);
  return finance.methods.deposit(tok_addr, source, ref, amount).send({from: source});
}

export async function withdraw(source, tok_addr, receiver, fin_addr, ref, amount){
  let token = new web3.eth.Contract(Token.abi, tok_addr);
  let finance = new web3.eth.Contract(Finance.abi, fin_addr);
  return finance.methods.withdraw(tok_addr, receiver, ref, amount).send({from: source});
}

export async function request_token(caller, receiver){
  const networkId = await web3.eth.net.getId()
  let token = new web3.eth.Contract(Token.abi, Token.networks[networkId].address)
  return token.methods.mint(receiver, 10000).send({from: caller});
}

export async function display_token(owner){
  const networkId = await web3.eth.net.getId()
  let token = new web3.eth.Contract(Token.abi, Token.networks[networkId].address)
  return token.methods.balanceOf(owner).call();
}

export async function test_token_addr(){
  const networkId = await web3.eth.net.getId()
  return Token.networks[networkId].address
}

export async function get_transfer(dao_addr){
  const transfers = []
  const fin_addr = await get_finance(dao_addr)
  const finance = new web3.eth.Contract(Finance.abi, fin_addr); 
  const len = await finance.methods.get_transfer_length().call()
  for(let i=len-1; i>=0; i--){
    const transfer = await finance.methods.get_transfer(i).call()
    const isWithdraw = await finance.methods.is_withdraw(i).call()
    const isTransfered = await finance.methods.is_transfered(i).call()
    if(isTransfered){
      transfers.push({date: transfer[0], source: transfer[1], ref: transfer[2], amount: transfer[3], iswithdraw: isWithdraw})
    }
  }

  return transfers
}

// Fundraising.js --------------------------------------------------------------------------------------- //

export async function get_amount(dao_addr){
  const fun_addr = await get_fundraising(dao_addr)
  const fundraising = new web3.eth.Contract(Fundraising.abi, fun_addr);
  return fundraising.methods.amount().call()
}

export async function get_share(dao_addr, account){
  const fun_addr = await get_fundraising(dao_addr)
  const fundraising = new web3.eth.Contract(Fundraising.abi, fun_addr);
  return fundraising.methods.get_balance(account).call()
}

export async function contribute(dao_addr, account){
  const fun_addr = await get_fundraising(dao_addr)
  const fundraising = new web3.eth.Contract(Fundraising.abi, fun_addr);
  const test_token = await test_token_addr();
  return fundraising.methods.contribute(test_token).send({from: account})
}

export async function get_history(dao_addr){
  const fun_addr = await get_fundraising(dao_addr)
  const fundraising = new web3.eth.Contract(Fundraising.abi, fun_addr);
  const len = await fundraising.methods.h_len().call()
  const history = []
  for(let i=len-1; i>=0; i--){
    const h = await fundraising.methods.get_history(i).call()
    history.push({sender: h[0], date: h[1], amount: h[2]})
  }
  console.log(history)
  return history
}

// Roadmap.js --------------------------------------------------------------------------------------- //
export async function create_task(dao_addr, account, content, quater, rewards){
  const road_addr = await get_roadmap(dao_addr)
  const usdt_addr = await test_token_addr()
  const roadmap = new web3.eth.Contract(Roadmap.abi, road_addr)
  return roadmap.methods.create_task(content, quater, usdt_addr, rewards).send({from: account})
}

export async function apply(dao_addr, account, taskId){
  const road_addr = await get_roadmap(dao_addr)
  const roadmap = new web3.eth.Contract(Roadmap.abi, road_addr)
  return roadmap.methods.apply_(taskId).send({from: account})
}

export async function claim_reward(dao_addr, account, taskId){
  const road_addr = await get_roadmap(dao_addr)
  const roadmap = new web3.eth.Contract(Roadmap.abi, road_addr)
  return roadmap.methods.claim_reward(taskId).send({from: account})
}

export async function get_task(dao_addr, account, quater){
  const road_addr = await get_roadmap(dao_addr)
  const roadmap = new web3.eth.Contract(Roadmap.abi, road_addr)
  const fin_addr = await get_finance(dao_addr)
  const finance = new web3.eth.Contract(Finance.abi, fin_addr); 

  const len = await roadmap.methods.get_task_len().call()

  //task_state = 1. can apply 2. pending apply 3.rejected(belongs to other) 4.claim rewards 5.claim pending 6.clamined 
  const task = []
  // t.content, t.quater, t.token, t.rewards, t.worker, is_clamined, transferId
  for(let i=0; i<len; i++){

    const t = await roadmap.methods.get_task(i).call()
    if(quater == t[1]){
      //decide task state
      let task_state
      const is_applied = await roadmap.methods.is_applied(i, account).call()
      console.log("is applied:")
      console.log(is_applied)
      console.log(t)


      if(!is_applied){
        task_state = 1
      } else if (is_applied){
        task_state = 2}
        if( t[4] == account){
          let is_claimed = t[5]
          if(!is_claimed){
            task_state = 4
          } else {
            const transfer_state = await finance.methods.transfer_state(t[6]-1).call()
            console.log("transfer_state")
            console.log(transfer_state)
            if(transfer_state == 0){
              task_state = 4
            } else if (transfer_state == 1){
             task_state = 6 
            } else if (transfer_state ==2) {
             task_state = 5
           }
         }
        } else if(t[4] !="0x0000000000000000000000000000000000000000" &&t[4] != account){
          task_state = 3
  
        }
      


      //push
      task.push({content: t[0], rewards: t[3], worker: t[4], taskState: task_state ,taskId: i})
    }
  }
  return task;
}