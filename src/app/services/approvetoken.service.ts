import {Injectable} from '@angular/core';
import {Web3Service} from './web3.service';
import {NotificationManagerService} from './notification-manager.service';

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

    constructor(private web3Service: Web3Service, private notificationsService: NotificationManagerService) {
        this.channelAddress = '0x47fd281Ad46512E65510674e317424c3cb5f7017'; // Change it accordingly
        if (typeof window.web3 !== 'undefined') {
            // Use Mist/MetaMask's provider
            this.web3 = new Web3(Web3.givenProvider);
        } else {
            alert('Metamask not integrated, Please check');
        }
        this.createInstance();
    }

    createInstance = () => {
        this.token = new this.web3.eth.Contract(tokenAbi, config.testToken.contractAddress);
    };

    getSupply = () => {
        this.token.methods.totalSupply().call().then((result) => {
            console.log(result);
        });
    };


    approveToken = (channelAddress, amt) => {
        let _thiss = this;
        return new Promise((resolve, reject) => {
            console.log(typeof amt);
            let balance = new BigNumber(amt).times(new BigNumber(10).pow(18));
            this.web3Service.getAccounts().then((account) => {
                this.token.methods.approve(channelAddress, balance).send({from: account})
                    .on('transactionHash', function (hash) {
                        console.log(hash);
                        resolve(hash)
                    })
                    .on('receipt', function (receipt) {
                        _thiss.notificationsService.showNotification('Info', 'Token approved', 'Text');
                        console.log(receipt.events['Approval'].returnValues);
                    })
                    .on('error', function (error) {
                        console.log(error);
                        reject(error)
                    });
            }).catch((error) => {
                console.log('Error in fetching accounts : ' + error);
                resolve(error)
            });
        });
    };
    getallowance = (channelAddress) => {
        this.web3Service.getAccounts().then((account) => {
            this.token.methods.allowance(account, channelAddress).call().then((res) => {
                console.log("allowance",res,channelAddress);
            });
        });

    };
}
