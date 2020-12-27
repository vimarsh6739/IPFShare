const Users = artifacts.require('Users')
const truffleAssert = require('truffle-assertions');
const assert = require('chai').assert
require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Users', (accounts) => {
  let contract;
  const firstAccount = accounts[1]; 
  const secondAccount = accounts[2];
  const thirdAccount = accounts[3];

  before(async ()=>{
    contract = await Users.deployed()
  })
  describe('deployment',async () => {
    it('deployed succesfully', async () => {
      const address = contract.address
      assert.notEqual(address,'')
      assert.notEqual(address,null)
      assert.notEqual(address,undefined)
      assert.notEqual(address,0x0)
    })
  })

  describe('performance',async()=>{
    it('Check all functionalities',async ()=>{
      let tx11 = await contract.addUser('Qm1', {from: firstAccount})
      truffleAssert.eventEmitted(tx11,'Add',(ev) => {
        return ev.user==firstAccount && ev.Qmhash=='Qm1'
      })
      let tx12 = await contract.updateHash('Qm11',{from: firstAccount})
      truffleAssert.eventEmitted(tx12,'Update',(ev) => {
        return ev.user==firstAccount && ev.Qmhash=='Qm11'
      })
      await contract.addUser('Qm2', {from: secondAccount})
      await contract.addUser('Qm3', {from: thirdAccount})
      let tx2 = await contract.deleteUser({from:secondAccount})
      truffleAssert.eventEmitted(tx2,'Delete',(ev)=>{
        return ev.user==secondAccount && ev.Qmhash=='Qm2'
      })
      let tx3 = await contract.readAllHashes({from:accounts[0]})
      assert.deepEqual(tx3,['Qm11','Qm3'])
    })
  })
})