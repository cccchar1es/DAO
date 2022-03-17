// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "./Token.sol";
import "./Voting.sol";
import "./Finance.sol";
import "./Fundraising.sol";
import "./Roadmap.sol";

contract DAOfactory{
    event newDAO(string name, address addr, address token, address voting, address finance);
    DAO[] daos;

    function create_DAO(string memory _name, string memory tok_name, string memory tok_symbol, uint256 tok_amount) public {
        Token token = new Token(tok_name, tok_symbol);
        Token t = new Token("share","SHARE");
        token.mint(msg.sender, tok_amount);
        Voting voting = new Voting(token);
        Finance finance = new Finance(voting);
        Fundraising fundraising = new Fundraising(t);
        Roadmap roadmap = new Roadmap(finance, voting);
        DAO dao = new DAO(_name, address(token), address(voting), address(finance), address(fundraising), address(roadmap));
        daos.push(dao);
        emit newDAO(_name, address(dao), address(token), address(voting), address(finance));
    }

    
    // function search_DAO(string memory _name) public view returns (address) {
    //     address addr;
    //     for(uint i=0; i<daos.length; i++){
    //         if(CompareStr(daos[i].getname(), _name)){
    //             addr = address(daos[i]);
    //         }
    //     }
    //     return addr;
    // }

    // function CompareStr(string memory a, string memory b) public pure returns (bool) {
    // return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    // }
}

contract DAO{
    string name;
    address token;
    address voting;
    address finance;
    address fundraising;
    address roadmap;

    constructor(string memory _name, address _token, address _voting, address _finance, address _fundraising, address _roadmap){
        name = _name;
        token = _token;
        voting = _voting;
        finance = _finance;
        fundraising = _fundraising;
        roadmap = _roadmap;
    }
    
    //get information of the contract
    function getname() public view returns (string memory) {return name;}

    //get goverance token
    function gettoken() public view returns (address) {return token;}

    //get voting
    function getvoting() public view returns (address) {return voting;}

    //get finance
    function getfinance() public view returns (address) {return finance;}

    //get fundraising
    function getfundraising()  public view returns (address) {return fundraising;}

    //get roadmap
    function getroadmap()  public view returns (address) {return roadmap;}
}