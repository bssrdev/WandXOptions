import { Injectable } from '@angular/core';

import * as Web3 from 'web3';

declare var window: any;

@Injectable()
export class Web3Service {

	public web3: any;

  constructor() { 
  	this.checkAndInstantiateWeb3();
  }

  checkAndInstantiateWeb3 = () => {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof window.web3 !== 'undefined') {
      console.warn(
        'Using web3 detected from external source. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask'
      );
      // Use Mist/MetaMask's provider
     this.web3 = new Web3(window.web3.currentProvider);
    } else {
      console.warn(
        'No web3 detected.'
      );
    }
  };

  getAccounts = () =>{
      this.web3.eth.getAccounts((err, accs) => {
            if (err != null) {
                alert('There was an error fetching your accounts.');
            }
            else if (accs.length === 0) {
                alert('Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.');
            }
            else
                alert(accs);
            });
            } 
}
