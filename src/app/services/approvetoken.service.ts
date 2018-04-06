import { Injectable } from '@angular/core';
import { Web3Service } from './web3.service';
const tokenAbi = require('../../config/testTokenAbi.json');
const config = require('../../config/tokenlist.json');
const BigNumber = require('bignumber.js');
const Web3 = require('web3');

declare var window: any;

@Injectable()
export class ApproveTokenService {

  public web3: any;
  public account: any;
  public token: any;
  public channelAddress: any;

  constructor(private web3Service: Web3Service) {
    this.channelAddress = "0x47fd281Ad46512E65510674e317424c3cb5f7017"; // Change it accordingly
    if (typeof window.web3 !== 'undefined') {
        // Use Mist/MetaMask's provider
       this.web3 = new Web3(Web3.givenProvider);
      } else{
          alert("Metamask not integrated, Please check");
      }
      this.createInstance();
  }

  createInstance = () =>{
    this.token = new this.web3.eth.Contract(tokenAbi, config.testToken.contractAddress);
  }

  getSupply = () =>{
    this.token.methods.totalSupply().call().then((result)=>{
        console.log(result);
    });
  }


  approveToken = (channelAddress, amt) =>{
      console.log(typeof amt);
    this.web3Service.getAccounts().then((account) => {
    this.token.methods.approve(channelAddress, amt).send({from: account})
    .on('transactionHash', function(hash){
      console.log(hash);
    })
    .on('receipt', function(receipt){
      console.log(receipt.events['Approval'].returnValues);
    })
    .on('error',function(error){
      console.log(error);
    })
  }).catch((error) => {
    console.log("Error in fetching accounts : "+ error);
  })
  }
}
