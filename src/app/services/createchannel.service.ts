import { Injectable } from '@angular/core';
import { Web3Service } from './web3.service';
const factoryAbi = require('../../config/factoryAbi.json');
const config = require('../../config/main.json');

const Web3 = require('web3');

declare var window: any;

@Injectable()
export class CreateChannelService {

  public web3: any;
  public account: any;
  public factory: any;

  constructor(private web3Service: Web3Service) {
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
    
    this.factory.methods.getAllChannelsAsReceiver().call({from: "0x9a8AAe0aF7cCd78f4E82e0243079abfcd41fbE3C"}).then((res)=>{
        console.log(res);
    });
  
  }

  getChannelInfo = () =>{
    
    this.factory.methods.getInfo("0x3C18541fFf78e8dac421379971Ac84BC37161435").call().then((res)=>{
        console.log(res);
    });
  
  }

  createChannel = () =>{
    this.web3Service.getAccounts().then((account)=>{
    this.factory.methods.createChannel("0x9a8AAe0aF7cCd78f4E82e0243079abfcd41fbE3C", "0xed957fc427e2ddbf1fcc54cdc68b8a1edacada55", 500).send({from: account})
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
    this.factory.methods.rechargeChannel("0x3C18541fFf78e8dac421379971Ac84BC37161435", 5).send({from: account})
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
}