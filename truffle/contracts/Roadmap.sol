// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "./Voting.sol";
import "./Finance.sol";

contract Roadmap{
    Finance f;
    Voting v;

    constructor(Finance _f, Voting _v){
        f =  _f;
        v =  _v;
    }
    struct task{
        string content;
        uint256 quater;
        address token;
        uint256 rewards;
        address worker;
    }

    task[] T;
    mapping(uint256 => uint256[]) T_V;
    mapping(uint256 => uint256) T_F;
    mapping(uint256 => address) WorkerInVote;


    function create_task(string memory _content, uint256 _quater, address _token, uint256 _rewards) public {
        task memory t = task(_content, _quater, _token, _rewards, address(0));
        T.push(t);
    }

    function task_len() public view returns(uint256){
        return T.length;
    }

    function apply_(uint256 _id) external {
        string memory me = f.addressToString(msg.sender);
        string memory id = f.uint2str(_id);
        uint256 voteId = v.create_vote(f.append("Approve ", me, " to finish task#", id,"","",""), block.timestamp+86400, 80, 0);
        T_V[_id].push(voteId);
        WorkerInVote[voteId] = msg.sender;
    }

    function task_vote(uint256 voteId, bool support) external {
        v.withdraw_vote(msg.sender, voteId, support);
        uint256 taskId;
        for(uint256 i=0; i<T.length; i++){
            for(uint256 j=0; j<T_V[i].length; j++){
                if(T_V[i][j] == voteId){
                    taskId = i;
                }
            }
        }
        if(T[taskId].worker == address(0) && v.vote_is_apporved(voteId) == 1){
            T[taskId].worker = WorkerInVote[voteId];
        }

    }

    function is_task_vote(uint256 _voteId) public view returns(bool) {
        for(uint i=0; i<T.length; i++){
            for(uint j=0; j<T_V[i].length; j++){
                if(T_V[i][j] == _voteId){
                    return true;
                }
            }
        }
        return false; 
    }


    function is_applied(uint256 taskId, address caller) public view returns(bool){
        uint256[] memory votes = T_V[taskId];
        for(uint i=0; i<votes.length; i++){
            if(WorkerInVote[votes[i]] == caller){
                return true;
            }
        }
        return false;
    }

    function claim_reward(uint256 taskId) external {
        string memory id = f.uint2str(taskId);
        bool is_Rewarded = false;
        if(T_F[taskId] != 0){
            is_Rewarded = f.is_transfered(T_F[taskId]-1);
        }
        if(msg.sender == T[taskId].worker && !is_Rewarded){
            f.withdraw(T[taskId].token, T[taskId].worker, f.append("rewards for task #",id,"","","","",""),T[taskId].rewards);
            T_F[taskId] = f.get_transfer_length();
        }
    }


    function get_task_len() public view returns(uint256){
        return T.length;
    }

    function get_task(uint256 id) public view returns(string memory, uint256, address, uint256, address, bool, uint256) {
        task memory t = T[id];
        bool is_clamined = false;
        uint256 transferId = 0;
        if(T_F[id] != 0){
            is_clamined = true;
            transferId = T_F[id];
        }
        return (t.content, t.quater, t.token, t.rewards, t.worker, is_clamined, transferId);
    }

    // function ooo() public {
    //     T_V[0].push(3);
    // }

    // function okok() public view returns(uint256){
    //     return T_V[0][0];
    // }


}