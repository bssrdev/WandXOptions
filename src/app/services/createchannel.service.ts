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
  public sender: any;
  public balance: any;
  public channelAddress: any;
  public tokenAddress: any;
  public hash: any;
  public sig: any;
  public balanceSig: any;
  public closingSig: any;

  constructor(private web3Service: Web3Service) {
    this.channelAddress = "0x2e50f8FAC4a0D2BEe55AAe6dc23B0630Fa9E5b6e";
    this.receiver       = "0x7f75e578b4c55a9f5c01eb7380149ed5e33987c8";
    this.tokenAddress   = "0xed957fc427e2ddbf1fcc54cdc68b8a1edacada55";
    this.sender         = "0x3f7d6f0825c4838529470dd2ad2ff5868571d706";

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

  getChallengeInfo = () =>{    
    this.factory.methods.getChallengeDetails(this.channelAddress).call().then((res)=>{
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
    this.sig = "0xc3e4ebb25f45031eec6429a59b3ec77664299af65401672dbfe170e9b787d11c18488bc055f8d6aed834d25e23291f794d9abbe13ce10ba5b93f6ae49481ba881c";
    this.web3Service.getAccounts().then((account)=>{
      this.sig = this.sig.substr(2, this.sig.length);
        let r = '0x' + this.sig.substr(0, 64);
        let s = '0x' + this.sig.substr(64, 64);
        let v = this.web3.utils.toDecimal(this.sig.substr(128, 2));
      let balance = new BigNumber(10).times(new BigNumber(10).pow(18));            
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


  mutualSettleChannel = () =>{
    this.balanceSig = "0x7a0bb416f9b674695504490c72a4969775a33e9d2c1b5c4668701fd495263ab6174f2f6f302cd3dde4db0adb011dd4fd7f0a70fba4b7a50465cd7762df9c0fe21c";
    this.closingSig = "0x96793048237d2f28bc67afc8a60be3c2d812692611e1d0db0d2dc330a590034f1c03611aaf0c50300a0945e6d2a1ffaf5333be04e53efeeefa2b9f7e5a56234d1c";
    this.web3Service.getAccounts().then((account)=>{
      this.balanceSig = this.balanceSig.substr(2, this.balanceSig.length);
        let rbal = '0x' + this.balanceSig.substr(0, 64);
        let sbal = '0x' + this.balanceSig.substr(64, 64);
        let vbal = this.web3.utils.toDecimal(this.balanceSig.substr(128, 2));
        console.log("rbal : ",rbal);
        console.log("sbal : ",sbal);
        console.log("vbal : ",vbal);
        

        this.closingSig = this.closingSig.substr(2, this.closingSig.length);
        let rclose = '0x' + this.closingSig.substr(0, 64);
        let sclose = '0x' + this.closingSig.substr(64, 64);
        let vclose = this.web3.utils.toDecimal(this.closingSig.substr(128, 2));

        console.log("rclose : ",rclose);
        console.log("sclose : ",sclose);
        console.log("vclose : ",vclose);
        

      let balance = new BigNumber(40).times(new BigNumber(10).pow(18));            
    this.factory.methods.channelMutualSettlement(this.channelAddress, balance, vbal, rbal, sbal, vclose, rclose, sclose).send({from: account})
    .on('transactionHash', function(hash){
      console.log(hash);
    })
    .on('receipt', function(receipt){
      console.log(receipt.events['ChannelSettled'].returnValues);
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
        this.web3.eth.sign(this.hash, account, function (err, sig) {
          console.log("Balance signature",sig);
        });
      }).catch((error) => {
          console.log("Error in fetching accounts : "+ error);          
  });
  }


  signClosingHash = () =>{
    this.web3Service.getAccounts().then((account)=>{
      let balance = new BigNumber(40).times(new BigNumber(10).pow(18));
        
      this.hash = this.web3.utils.soliditySha3(this.sender, balance,this.channelAddress);
        this.web3.eth.sign(this.hash, account, function (err, closingSig) {
          console.log("Closing signature",closingSig);
        });
      }).catch((error) => {
          console.log("Error in fetching accounts : "+ error);          
  });
  }


  challengeSettle = () =>{
    this.web3Service.getAccounts().then((account)=>{
      let balance = new BigNumber(40).times(new BigNumber(10).pow(18));
    this.factory.methods.channelChallengedSettlement(this.channelAddress, balance).send({from: account})
    .on('transactionHash', function(hash){
      console.log(hash);
    })
    .on('receipt', function(receipt){
      console.log(receipt.events['ChannelChallenged'].returnValues);
    })
    .on('error',function(error){
      console.log(error);
    })
  }).catch((error) => {
    console.log("Error in fetching accounts : "+ error);
  })
  }

  afterChallengeSettle = () =>{
    this.web3Service.getAccounts().then((account)=>{
    this.factory.methods.channelAfterChallengeSettlement(this.channelAddress).send({from: account})
    .on('transactionHash', function(hash){
      console.log(hash);
    })
    .on('receipt', function(receipt){
      console.log(receipt.events['ChannelSettled'].returnValues);
    })
    .on('error',function(error){
      console.log(error);
    })
  }).catch((error) => {
    console.log("Error in fetching accounts : "+ error);
  })
  }

  

}