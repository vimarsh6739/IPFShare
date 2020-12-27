// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.9.0;
pragma experimental ABIEncoderV2;

contract Users{
  
  mapping(address => string) public hashList;
  mapping(address => uint) userIndex;
  address[] public userList;
  
  event Update(address user, string Qmhash);
  event Add(address user, string Qmhash);
  event Delete(address user, string Qmhash);

  function updateHash(string memory _ipfsHash) public {
    hashList[msg.sender] = _ipfsHash;
    emit Update(msg.sender, _ipfsHash);
  }

  function addUser(string memory _ipfsHash) public {
    userList.push(msg.sender);
    hashList[msg.sender] = _ipfsHash;
    userIndex[msg.sender] = userList.length;//1-indexed map
    emit Add(msg.sender, _ipfsHash);
  }

  function deleteUser() public {

    uint index = userIndex[msg.sender] - 1;
    require(index >= 0);

    if(userList.length > 1){
      userList[index] = userList[userList.length-1];
    }
    userIndex[userList[index]] = index+1;
    userList.pop();

    delete userIndex[msg.sender];
    string memory _Qmhash = hashList[msg.sender];
    delete hashList[msg.sender];
    emit Delete(msg.sender, _Qmhash);
  }

  function readHash() public view returns (string memory){
    return hashList[msg.sender];
  }

  //Experimental - hopefully wont be needed for search
  function readAllHashes() public view returns (string[] memory){
    string[] memory ans = new string[](userList.length);
    for(uint i=0;i<ans.length;i++){
      ans[i] = hashList[userList[i]];
    }
    return ans;
  }
}