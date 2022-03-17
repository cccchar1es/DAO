// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
// import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./Voting.sol";
import "./Token.sol";
// import "@openzeppelin/contracts/utils/Strings.sol";

contract Finance{
    Voting voting;
    
    constructor(Voting _voting) {
        voting = _voting;       
    }

    struct transfer{
        address token;
        address receiver;
        uint256 date;
        uint256 amount;
        string refer;
        uint256 voteId;
        bool isTransfered;
        bool isWithdraw;
    }

    transfer[] transfers;
    Token[] tokens;
    

    function withdraw(address _token, address _receiver, string memory _refer, uint256 _amount) external {
        Token token = Token(_token);
        string memory Symbol= token.symbol();
        string memory amount = uint2str(_amount);
        string memory receiver = addressToString(_receiver);
        uint256 _voteId = voting.create_vote(append("Transfer ", amount, Symbol, " to ", receiver, ". Reference: ", _refer), block.timestamp+86400, 80, 0);
        transfer memory newtransfer = transfer(_token, _receiver, block.timestamp, _amount, _refer, _voteId, false, true);
        transfers.push(newtransfer);
    }

    function withdraw_take_vote(uint256 voteId, bool support) public {
        uint256 id;
        for(uint i; i<transfers.length; i++){
            if(voteId == transfers[i].voteId){
                id = i;
            }
        }
        voting.withdraw_vote(msg.sender, voteId, support);
        can_withdraw(id);
    }

    function is_withdraw_vote(uint256 voteId) public view returns(bool){
        for(uint i; i<transfers.length; i++){
            if(voteId == transfers[i].voteId){
                return true;
            }
        }
        return false;
    }

    function deposit(address _token, address _receiver, string memory _refer, uint256 _amount) external {
        Token token = Token(_token);
        tokens.push(token);
        transfer memory new_deposit = transfer(_token, _receiver, block.timestamp, _amount, _refer, 0, true, false);
        _transfer(_token, _receiver, address(this), _amount);
        transfers.push(new_deposit);
    }

    function _transfer(address _token, address _from, address _to, uint256 _amount) internal{
        Token(_token).mint(_to, _amount);
        Token(_token).burn(_from, _amount);
    }

    function get_transfer_length() public view returns(uint256){
        return transfers.length;
    }

    function get_transfer(uint256 id) public view returns(uint256, address, string memory, uint256){
        transfer storage t = transfers[id];    
        return(t.date, t.receiver, t.refer, t.amount);
        
    }
  
    function can_withdraw(uint256 id) internal returns(bool){
        transfer memory t = transfers[id];
        if(t.isTransfered == false && voting.vote_is_apporved(t.voteId) == 1){
            transfers[id].isTransfered = true;  
            _transfer(t.token, address(this), t.receiver, t.amount); 
        }
        return (t.isTransfered == false && voting.vote_is_apporved(t.voteId) == 1);
    }

    function is_withdraw(uint256 id) public view returns(bool){
        transfer memory t = transfers[id];
        return t.isWithdraw;
    }

    function is_transfered(uint256 id) public view returns(bool){
        transfer memory t = transfers[id];
        return t.isTransfered;
    }

    function transfer_state(uint256 id) public view returns(uint256){
        transfer memory t = transfers[id];
        return voting.vote_is_apporved(t.voteId);
    }




    //******* utils ************************************************//
    function addressToString(address _addr) public pure returns(string memory) {
    bytes32 value = bytes32(uint256(uint160(_addr)));
    bytes memory alphabet = "0123456789abcdef";

    bytes memory str = new bytes(51);
    str[0] = "0";
    str[1] = "x";
    for (uint i = 0; i < 20; i++) {
        str[2+i*2] = alphabet[uint(uint8(value[i + 12] >> 4))];
        str[3+i*2] = alphabet[uint(uint8(value[i + 12] & 0x0f))];
    }
    return string(str);
    }

    function uint2str(uint _i) public pure returns (string memory _uintAsString) {
        if (_i == 0) {
            return "0";
        }
        uint j = _i;
        uint len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint k = len;
        while (_i != 0) {
            k = k-1;
            uint8 temp = (48 + uint8(_i - _i / 10 * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }

    function append(string memory a, string memory b, string memory c, string memory d, string memory e, string memory f, string memory g) public pure returns (string memory) {

    return string(abi.encodePacked(a, b, c, d, e, f, g));

}
}