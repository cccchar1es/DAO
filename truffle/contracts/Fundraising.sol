// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "./Token.sol";

contract Fundraising{
    Token t;

    constructor(Token _t){
        t = _t;
    }

    uint256 public amount = 0;

    struct history{
        address sender;
        uint256 date;
        uint256 amount;
    }
    history[] h;

    function contribute(address tok) public {
        _transfer(tok, msg.sender, address(this), 500);
        amount += 500;
        t.mint(msg.sender, 50000);
        h.push(history(msg.sender, block.timestamp, 500));
    }

    function _transfer(address _token, address _from, address _to, uint256 _amount) internal{
        Token(_token).mint(_to, _amount);
        Token(_token).burn(_from, _amount);
    }    

    function get_history(uint256 id) public view returns(address, uint256, uint256){
        history memory H = h[id];
        return(H.sender, H.date, H.amount);
    }

    function get_balance(address account) public view returns(uint256){
        return t.balanceOf(account);
    }

    function h_len()public view returns(uint256){
        return h.length;
    }
}