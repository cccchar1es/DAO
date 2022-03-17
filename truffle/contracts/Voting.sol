// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "./Token.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Voting{
    using SafeMath for uint256;
    Token token;
    
    
    constructor(Token tok){
        token = tok;
    }

    enum VoterState{ absent, yes, no }
    event Voter_Status(address voter, uint256 voteId, uint256 status);
    // TODO: how to run script
    struct Vote{
        string content;
        uint256 endDate;
        uint256 approvalPct;
        uint256 yes_voted;
        uint256 no_voted;
        uint256 voting_base;
        uint256 vote_method;
        mapping(address => VoterState) voters;
    }

    mapping (uint256 => Vote) internal votes;
    uint256 public votes_length;
    
    function create_vote(string memory content, uint256 endDate, uint256 approvalPct, uint256 vote_method) public returns(uint256){
        return newVote(content, endDate, approvalPct, vote_method);
    }

    function newVote(string memory content, uint256 endDate, uint256 approvalPct, uint256 vote_method) internal returns(uint256 voteId){
        voteId = votes_length += 1;
        Vote storage vote = votes[voteId];
        vote.content = content;
        vote.endDate = endDate;
        vote.approvalPct = approvalPct;
        vote.yes_voted = 0;
        vote.no_voted = 0;
        vote.voting_base = token.totalSupply();
        if(vote_method == 1){
            vote.voting_base = token._get_holder().length;
        }
        vote.vote_method =vote_method;
    }

    function take_vote(uint256 voteId, bool support) public {
        if(support){
            if(votes[voteId].vote_method == 0){
                votes[voteId].yes_voted = votes[voteId].yes_voted.add(token.balanceOf(msg.sender));
            } else {
                votes[voteId].yes_voted = votes[voteId].yes_voted.add(1);
            }
            votes[voteId].voters[msg.sender] = VoterState.yes;
            emit Voter_Status(msg.sender, voteId, uint(votes[voteId].voters[msg.sender]));
        }
        else{
            if(votes[voteId].vote_method == 0){
                votes[voteId].no_voted = votes[voteId].no_voted.add(token.balanceOf(msg.sender));
            } else {
                votes[voteId].no_voted = votes[voteId].no_voted.add(1);
            }
            votes[voteId].voters[msg.sender] = VoterState.no;
            emit Voter_Status(msg.sender, voteId, uint(votes[voteId].voters[msg.sender]));
        }
    }

    function withdraw_vote(address voter, uint256 voteId, bool support) public {
        if(support){
            votes[voteId].yes_voted = votes[voteId].yes_voted.add(token.balanceOf(voter));
            votes[voteId].voters[voter] = VoterState.yes;
            emit Voter_Status(voter, voteId, uint(votes[voteId].voters[voter]));
        }
        else{
            votes[voteId].no_voted = votes[voteId].no_voted.add(token.balanceOf(voter));
            votes[voteId].voters[voter] = VoterState.no;
            emit Voter_Status(voter, voteId, uint(votes[voteId].voters[voter]));
        }
    }     

    //retrive data
    // function get_vote_content(uint256 voteId) public view returns(string memory){
    //     return votes[voteId].content;
    // }

    function vote_is_open(uint256 voteId) public view returns(bool) {
        return (votes[voteId].endDate > block.timestamp);
    }

    function vote_yes_progress(uint256 voteId) public view returns(uint256){
        return uint256(votes[voteId].yes_voted*100/votes[voteId].voting_base);
    }

    function vote_no_progress(uint256 voteId) public view returns(uint256){
        return uint256(votes[voteId].no_voted*100/votes[voteId].voting_base);
    }

    function vote_is_apporved(uint256 voteId) public view returns(uint256){
        if(vote_yes_progress(voteId)>=votes[voteId].approvalPct){
            return 1;
        } else if(vote_no_progress(voteId)>(100-votes[voteId].approvalPct)){
            return 0;
        }
        else{
            return 2;
        }
    }


    function time() public view returns(uint256){
        return block.timestamp;
    }

    //[content, endDate, approvalPct, yes_voted_Pct, no_voted_Pct, voter_state, ]
    function get_votings(address voter, uint256 voteId) public view returns(string memory, uint256, uint256, uint256, uint256, uint){
        string memory content = votes[voteId].content;
        uint256 endDate = votes[voteId].endDate;
        uint256 approvalPct = votes[voteId].approvalPct;
        uint256 yes_voted_Pct = uint(vote_yes_progress(voteId));
        uint256 no_voted_Pct = uint(vote_no_progress(voteId));
        uint voter_state = uint(votes[voteId].voters[voter]);

        return (content, endDate, approvalPct, yes_voted_Pct, no_voted_Pct, voter_state);
    }

    function get_votings2(uint256 voteId) public view returns(uint256, uint256, uint256){
        uint256 yes_voted_Num = votes[voteId].yes_voted; 
        uint256 no_voted_Num = votes[voteId].no_voted;
        uint256 voteMethod = votes[voteId].vote_method;
        return (yes_voted_Num, no_voted_Num, voteMethod);
    }
}