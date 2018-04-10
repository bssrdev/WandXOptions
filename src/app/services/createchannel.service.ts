import {Injectable} from '@angular/core';
import {Web3Service} from './web3.service';

const factoryAbi = require('../../config/factoryAbi.json');
const config = require('../../config/main.json');
const tokenList = require('../../config/tokenlist.json');
const leftPad = require('left-pad');
const Web3 = require('web3');
const BigNumber = require('bignumber.js');
import {Subscription} from 'rxjs/Subscription';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import has = Reflect.has;


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
    private _CreateChannel = new BehaviorSubject<Object>(null);
    CreateChannel$ = this._CreateChannel.asObservable();

    constructor(private web3Service: Web3Service) {

        // Parameters will be changed as per the execution
        this.channelAddress = '0x47fd281Ad46512E65510674e317424c3cb5f7017';
        this.receiver = '0x7f75e578b4c55a9f5c01eb7380149ed5e33987c8';
        this.tokenAddress = '0xed957fc427e2ddbf1fcc54cdc68b8a1edacada55';
        this.sender = '0x3f7d6f0825c4838529470dd2ad2ff5868571d706';

        if (typeof window.web3 !== 'undefined') {
            // Use Mist/MetaMask's provider
            this.web3 = new Web3(Web3.givenProvider);
        } else {
            alert('Metamask not integrated, Please check');
        }
        this.createInstance();
    }

    createInstance = () => {
        this.factory = new this.web3.eth.Contract(factoryAbi, config.factoryAddress);
    };

    getOwner = () => {
        this.factory.methods.owner().call().then((result) => {
            console.log(result);
        });
    };

    getChannelsBySender = (callaback) => {
        this.web3Service.getAccounts().then((account) => {
            this.factory.methods.getAllChannelsAsSender().call({from: account}).then((res) => {
                //console.log(res);
                //this._ChannelsBySender.next(res);
                callaback(res);
                //getChannelInfo()
            });
        });
    };

    getChannelsByReceiver = () => {
        return new Promise((resolve, reject) => {
            this.web3Service.getAccounts().then((account) => {
                this.factory.methods.getAllChannelsAsReceiver().call({from: account}).then((res) => {
                    if (res) {
                        resolve(res);
                    } else {
                        reject('error while fetching data');
                    }
                });
            });
        });
    };

    getChannelInfo = (channelAddress, callback) => {
        this.factory.methods.getInfo(channelAddress).call().then((res) => {
            //console.log("channel");
            //res.channelAddress = channelAddress;
            //this._ChannelInfo.next(res);
            callback(res);
        });
    };

    getChallengeInfo = (channelAddress) => {
        this.factory.methods.getChallengeDetails(channelAddress).call().then((res) => {
            console.log(res);
        });
    };

    createChannel = (tokenAddress, receiver, period) => {
        this.web3Service.getAccounts().then((account) => {
            this.factory.methods.createChannel(receiver, tokenAddress, period).send({from: account})
                .on('transactionHash', function (hash) {
                    console.log(hash);
                })
                .on('receipt', function (receipt) {
                    console.log(receipt.events['ChannelCreated'].returnValues);
                    this._CreateChannel.next(receipt.events['ChannelCreated'].returnValues);
                })
                .on('error', function (error) {
                    this._CreateChannel.next(error);
                    console.log(error);
                });
        }).catch((error) => {
            console.log('Error in fetching accounts : ' + error);
        });
    };

    rechargeChannel = (channelAddress, deposits) => {
        return new Promise((resolve, reject) => {
            this.web3Service.getAccounts().then((account) => {
                let deposit = new BigNumber(deposits).times(new BigNumber(10).pow(18));
                this.factory.methods.rechargeChannel(channelAddress, deposit).send({from: account})
                    .on('transactionHash', function (hash) {
                        console.log(hash);
                        //resolve(hash)
                    })
                    .on('receipt', function (receipt) {
                        console.log(receipt.events['ChannelRecharged'].returnValues);
                        resolve(receipt);
                    })
                    .on('error', function (error) {
                        console.log(error);
                        reject(error)
                    });
            }).catch((error) => {
                console.log('Error in fetching accounts : ' + error);
                reject(error)
            });
        })
    };

    withdrawFromChannel = (channelAddress, sig, amount) => {
        console.log("sig",sig);
        console.log("channelAddress",channelAddress);
        // Signature will be changed as per the execution
        //this.sig = '0xc3e4ebb25f45031eec6429a59b3ec77664299af65401672dbfe170e9b787d11c18488bc055f8d6aed834d25e23291f794d9abbe13ce10ba5b93f6ae49481ba881c';
        this.sig = sig;
        this.web3Service.getAccounts().then((account) => {
            this.sig = this.sig.substr(2, this.sig.length);
            let r = '0x' + this.sig.substr(0, 64);
            let s = '0x' + this.sig.substr(64, 64);
            let v = this.web3.utils.toDecimal(this.sig.substr(128, 2));
            let balance = new BigNumber(amount).times(new BigNumber(10).pow(18));
            debugger
            this.factory.methods.withdrawFromChannel(channelAddress, balance, v, r, s).send({from: account})
                .on('transactionHash', function (hash) {
                    console.log(hash);
                })
                .on('receipt', function (receipt) {
                    console.log(receipt.events['ChannelWithdraw'].returnValues);
                })
                .on('error', function (error) {
                    console.log(error);
                });
        }).catch((error) => {
            console.log('Error in fetching accounts : ' + error);
        });
    };


    mutualSettleChannel = (balanceSig, closingSig, amount, channelAddress) => {
        return new Promise((resolve, reject) => {
            // Signatures will be changed as per the execution
            // this.balanceSig = '0xb0654a0c8371d1eaced35398809fc3b143213745563b2eb0f536e9913a3024e818cfc71c3559167145ab7b9876915b74dbd105293d854a25655ec3cd834ec2e11b';
            this.balanceSig = balanceSig;
            //this.closingSig = '0x9c677b881a6f3dfc081447002da374effbb79dc9165dab948e52ee2e2ecf3d1c4e9712d47bd92ee84e052c06ca245307439fefe415b49becf5367eda661f6edf1b';
            this.closingSig = closingSig;
            this.web3Service.getAccounts().then((account) => {
                this.balanceSig = this.balanceSig.substr(2, this.balanceSig.length);
                let rbal = '0x' + this.balanceSig.substr(0, 64);
                let sbal = '0x' + this.balanceSig.substr(64, 64);
                let vbal = this.web3.utils.toDecimal(this.balanceSig.substr(128, 2));
                console.log('rbal : ', rbal);
                console.log('sbal : ', sbal);
                console.log('vbal : ', vbal);


                this.closingSig = this.closingSig.substr(2, this.closingSig.length);
                let rclose = '0x' + this.closingSig.substr(0, 64);
                let sclose = '0x' + this.closingSig.substr(64, 64);
                let vclose = this.web3.utils.toDecimal(this.closingSig.substr(128, 2));
                console.log('rclose : ', rclose);
                console.log('sclose : ', sclose);
                console.log('vclose : ', vclose);
                let balance = new BigNumber(amount).times(new BigNumber(10).pow(18));
                this.factory.methods.channelMutualSettlement(channelAddress, balance, vbal, rbal, sbal, vclose, rclose, sclose).send({from: account})
                    .on('transactionHash', function (hash) {
                        console.log(hash);
                        resolve(hash);
                    })
                    .on('receipt', function (receipt) {
                        console.log(receipt.events['ChannelSettled'].returnValues);
                        resolve(receipt.events['ChannelSettled'].returnValues);
                    })
                    .on('error', function (error) {
                        console.log(error);
                        reject(error);
                    });
            }).catch((error) => {
                console.log('Error in fetching accounts : ' + error);
                reject(error);
            });
        });
    };

    signBalanceHash = (receiver, amount, channel) => {
        return new Promise((resolve, reject) => {
            this.web3Service.getAccounts().then((account) => {
                let balance = new BigNumber(amount).times(new BigNumber(10).pow(18));
                this.hash = this.web3.utils.soliditySha3(receiver, balance, channel);
                this.web3.eth.sign(this.hash, account, function (err, sig) {
                    console.log('Balance signature', sig);
                    resolve(sig);
                });
            }).catch((error) => {
                console.log('Error in fetching accounts : ' + error);
                reject(error);
            });
        });
    };


    signClosingHash = (senderAddress, amount, channelAddress) => {
        return new Promise((resolve, reject) => {
            this.web3Service.getAccounts().then((account) => {
                let balance = new BigNumber(amount).times(new BigNumber(10).pow(18));
                this.hash = this.web3.utils.soliditySha3(senderAddress, balance, channelAddress);
                this.web3.eth.sign(this.hash, account, function (err, closingSig) {
                    console.log('Closing signature', closingSig);
                    resolve(closingSig);
                });
            }).catch((error) => {
                console.log('Error in fetching accounts : ' + error);
                reject(error);
            });
        });
    };


    challengeSettle = (amount,address) => {
        return new Promise((resolve, reject) => {
            this.web3Service.getAccounts().then((account) => {
                let balance = new BigNumber(amount).times(new BigNumber(10).pow(18));
                this.factory.methods.channelChallengedSettlement(address, balance).send({from: account})
                    .on('transactionHash', function (hash) {
                        console.log(hash);
                        resolve(hash)
                    })
                    .on('receipt', function (receipt) {
                        console.log(receipt.events['ChannelChallenged'].returnValues);
                    })
                    .on('error', function (error) {
                        console.log(error);
                        reject(error)
                    });
            }).catch((error) => {
                console.log('Error in fetching accounts : ' + error);
                reject(error)
            });
        });
    };

    afterChallengeSettle = (channelAddress) => {
        return new Promise((resolve, reject) => {
            this.web3Service.getAccounts().then((account) => {
                this.factory.methods.channelAfterChallengeSettlement(channelAddress).send({from: account})
                    .on('transactionHash', function (hash) {
                        console.log(hash);
                        resolve(hash)
                    })
                    .on('receipt', function (receipt) {
                        console.log(receipt.events['ChannelSettled'].returnValues);
                    })
                    .on('error', function (error) {
                        console.log(error);
                        reject(error);
                    });
            }).catch((error) => {
                console.log('Error in fetching accounts : ' + error);
                reject(error);
            });
        });
    };


    getTokenlist = (callack) => {
        callack(tokenList);
    };
    getNumber=(amt)=>{
        let deposit = new BigNumber(amt).dividedBy(new BigNumber(10).pow(18));
        console.log(deposit.toJSON())
        return deposit

    }

}
