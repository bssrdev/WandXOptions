import { Injectable } from '@angular/core';
import { Web3Service } from './web3.service';
const factoryAbi = require('../../config/factoryAbi.json');
const config = require('../../config/main.json');
const leftPad = require('left-pad');
const Web3 = require('web3');
const BigNumber = require('bignumber.js');

declare var window: any;

@Injectable()
export class CreateChannelService {

  public web3: any;
  public account: any;
  public factory: any;
  public receiver: any;
  public balance: any;
  public channelAddress: any;
  public tokenAddress: any;
  public hash: any;
  public sig: any;

  constructor(private web3Service: Web3Service) {
    this.channelAddress = "0x361aDF8A58828ab76ad1E2b06bF7116529D99F78";
    this.receiver = "0x9a8AAe0aF7cCd78f4E82e0243079abfcd41fbE3C";
    this.tokenAddress = "0xed957fc427e2ddbf1fcc54cdc68b8a1edacada55";

    if (typeof window.web3 !== 'undefined') {
        // Use Mist/MetaMask's provider
       this.web3 = new Web3(Web3.givenProvider);
      } else{
          alert("Metamask not integrated, Please check");
      }
      this.createInstance();
  }

  createInstance = () =>{
    this.factory = new this.web3.eth.Contract(factoryAbi, config.factoryAddress);  
  }
  
  getOwner = () =>{
    this.factory.methods.owner().call().then((result)=>{
        console.log(result);
    });
  }

  getChannelsBySender = () =>{
    this.web3Service.getAccounts().then((account)=>{
    this.factory.methods.getAllChannelsAsSender().call({from: account}).then((res)=>{
        console.log(res);
    });
  });
  }
  
  getChannelsByReceiver = () =>{
    this.web3Service.getAccounts().then((account)=>{
      this.factory.methods.getAllChannelsAsReceiver().call({from: account}).then((res)=>{
        console.log(res);
    });
  });
  
  }

  getChannelInfo = () =>{
    
    this.factory.methods.getInfo(this.channelAddress).call().then((res)=>{
        console.log(res);
    });
  
  }

  createChannel = () =>{
    this.web3Service.getAccounts().then((account)=>{
    this.factory.methods.createChannel(this.receiver, this.tokenAddress, 500).send({from: account})
    .on('transactionHash', function(hash){
      console.log(hash);
    })
    .on('receipt', function(receipt){
      console.log(receipt.events['ChannelCreated'].returnValues);
    })
    .on('error',function(error){
      console.log(error);
    })
  }).catch((error) => {
    console.log("Error in fetching accounts : "+ error);
  })
  }

  rechargeChannel = () =>{
    this.web3Service.getAccounts().then((account)=>{
      let deposit = new BigNumber(50).times(new BigNumber(10).pow(18));
    this.factory.methods.rechargeChannel(this.channelAddress, deposit).send({from: account})
    .on('transactionHash', function(hash){
      console.log(hash);
    })
    .on('receipt', function(receipt){
      console.log(receipt.events['ChannelRecharged'].returnValues);
    })
    .on('error',function(error){
      console.log(error);
    })
  }).catch((error) => {
    console.log("Error in fetching accounts : "+ error);
  })
  }

  withdrawFromChannel = () =>{
    this.sig = "0x6498eccfcdc7dcd0d7dd39aa7930609d734bfbf1d3b7feb3fdb5ff5911950e676b7b56891b3ddc036bae72c38c6968717bbdaaf7e416938a25cefae06f3245761c";
    this.web3Service.getAccounts().then((account)=>{
      this.sig = this.sig.substr(2, this.sig.length);
        let r = '0x' + this.sig.substr(0, 64);
        let s = '0x' + this.sig.substr(64, 64);
        let v = this.web3.utils.toDecimal(this.sig.substr(128, 2));
      let balance = new BigNumber(10).times(new BigNumber(10).pow(18));
      console.log("balance1",balance);
      console.log("balance2",r);
      console.log("balance3",s);
      console.log("balance4",v);
            
    this.factory.methods.withdrawFromChannel(this.channelAddress, balance, v, r, s).send({from: account})
    .on('transactionHash', function(hash){
      console.log(hash);
    })
    .on('receipt', function(receipt){
      console.log(receipt.events['ChannelWithdraw'].returnValues);
    })
    .on('error',function(error){
      console.log(error);
    })
  }).catch((error) => {
    console.log("Error in fetching accounts : "+ error);
  })
  }

  signBalanceHash = () =>{
    this.web3Service.getAccounts().then((account)=>{
      let balance = new BigNumber(10).times(new BigNumber(10).pow(18));
        
      this.hash = this.web3.utils.soliditySha3(this.receiver,balance,this.channelAddress);
        this.web3.eth.sign(this.hash, account, function (err, result) { 
          console.log(result); 
        });
    });
  }
}