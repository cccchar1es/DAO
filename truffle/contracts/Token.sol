// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20{
    address[] holder;
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {

    }

    function mint(address owner, uint256 amount) public {
        _mint(owner, amount);
        for(uint i=0; i<holder.length; i++){
            if(owner == holder[i]){
                return;
            }
        }
        holder.push(owner);
    }

    function burn(address owner, uint256 amount) public {
        _burn(owner, amount);
    }

    function _get_holder() public view returns(address[] memory){
        return holder;
    } 

    function _get_balance() public view returns(uint256[] memory){
        uint256[] memory balance = new uint256[](holder.length);
        
        for(uint i=0; i<holder.length; i++){
            balance[i] = balanceOf(holder[i]);
        }
        return balance;
    }

    // function Mint(address owner, uint256 amount) public {
    //     _mint(owner, amount);
    //     approve(owner, amount);
    //     for(uint i=0; i<holder.length; i++){
    //         if(owner == holder[i]){
    //             return;
    //         }
    //     }
    //     holder.push(owner);
    // } 

    // function TransferFrom(address from, address to, uint256 amount) public {
    //     transferFrom(from, to, amount);
    //     approve(to, amount);

    //     for(uint i=0; i<holder.length; i++){
    //        if(to == holder[i]){
    //             return;
    //         }
    //     }
    //     holder.push(to);
    // }
}