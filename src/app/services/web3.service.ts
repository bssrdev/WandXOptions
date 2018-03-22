import { Injectable } from '@angular/core';

const Web3 = require('web3');

declare var window: any;

@Injectable()
export class Web3Service {

  public web3: any;
  public account: any;

  constructor() { 
  	this.checkAndInstantiateWeb3();
  }

  checkAndInstantiateWeb3 = () => {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof window.web3 !== 'undefined') {
      // Use Mist/MetaMask's provider
      console.log("Metamask Detected");
     this.web3 = new Web3(window.web3.currentProvider);
    } else {
      console.log('No web3 detected.');
    }
  };

  getAccounts = () =>{
    return new Promise((resolve, reject)=> { 
      console.log("Trying to fetch accounts from metamask");  
      this.web3.eth.getAccounts((err, accounts) => {
            if (err != null) {
              console.log('There was an error fetching your accounts.');
              reject('There was an error fetching your accounts.');
            }
            else if (accounts.length === 0) {
              console.log('Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.');
              reject('Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.');
            }
            else{
                this.web3.eth.defaultAccount = accounts[0];
                resolve(accounts[0]);
            }
      });
    });
  }
}
