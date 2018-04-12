import {Component, OnInit} from '@angular/core';
import {ViewChild, ElementRef} from '@angular/core';
import {routerTransition} from '../../router.animations';
import {ActivatedRoute, Router} from '@angular/router';
import {ShareddataService} from '../../services/shareddata.service';
import {CreateChannelService} from '../../services/services';
import {NotificationManagerService} from '../../services/notification-manager.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Subscription} from 'rxjs/Subscription';

declare var jQuery: any;

@Component({
    selector: 'app-bs-element',
    templateUrl: './bs-element.component.html',
    styleUrls: ['./bs-element.component.scss'],
    animations: [routerTransition()]
})
export class BsElementComponent implements OnInit {
    public detailData: any;
    public parameter: any;
    public page: any;
    @ViewChild('closeBtn') closeBtn1: ElementRef;
    @ViewChild('closinghash') closeBtn2: ElementRef;
    @ViewChild('balanceHash') closeBtn3: ElementRef;
    @ViewChild('Settle') closeBtn4: ElementRef;
    @ViewChild('Settle') closeBtn5: ElementRef;
    @ViewChild('withdraw') closeBtn6: ElementRef;
    @ViewChild('challenge') closeBtn7: ElementRef;
    @ViewChild('settleC') closeBtn8: ElementRef;
    @ViewChild('settleCf') closeBtn9: ElementRef;
    public getData: Subscription;

    constructor(private notificationsService: NotificationManagerService, private createService: CreateChannelService, private shareddataService: ShareddataService, private route: ActivatedRoute, private router: Router) {
        console.log(this.route);
        this.route.params.subscribe(params => {
            this.parameter = params.id;
            this.page = params.page;
            console.log(params);
        });
    }

    ngOnInit() {
        this.shareddataService.getData((item) => {
            if (item) {
                this.getChannelData(item);
            }
        });
        this.getData = this.shareddataService._SharedData$.subscribe((item) => {
            if (item) {
                this.getChannelData(item);
            }
        });
    }

    getNumber(number) {
        return this.createService.getNumber(number);
    }

    getChannelData(item) {
        const _thiss = this;
        if (item) {
            item.map((key, value) => {
                if (key.address == _thiss.parameter) {
                    _thiss.detailData = key;
                }
            });
            //console.log('details', _thiss.detailData);
        } else {
            _thiss.router.navigateByUrl('/charts');
        }
    }

    private closeModal(): void {
        console.log('called close');
        this.closeBtn1.nativeElement.click();
        this.closeBtn2.nativeElement.click();
        this.closeBtn3.nativeElement.click();
        this.closeBtn4.nativeElement.click();
        this.closeBtn5.nativeElement.click();
        this.closeBtn6.nativeElement.click();
        this.closeBtn7.nativeElement.click();
        this.closeBtn8.nativeElement.click();
        this.closeBtn9.nativeElement.click();
    }

    submit(token, address) {
        let _t = this;
        this.closeModal();
        this.createService.rechargeChannel(address, token).then((result) => {
            if (result) {
                _t.notificationsService.showNotification('Info', 'Recharge channel is in progress', 'Text');
                //_t.getChannelData();
            }
        });

    }

    signBalanceHash(channelAddress, recieverAddress, amount) {
        this.closeModal();
        let _thiss = this;
        console.log(channelAddress, recieverAddress, amount);
        this.createService.signBalanceHash(recieverAddress, amount, channelAddress).then(function (result) {
            if (result) {
                _thiss.notificationsService.showNotification('Info', 'Share this balanceMessage with your receiver ' + result, 'Text');
                console.log('Balance signature complete', result);
            }
        });

    }

    closeBalanceHash(channelAddress, senderAddress, amount) {
        let _thiss = this;
        this.closeModal();
        console.log(channelAddress, senderAddress, amount);
        this.createService.signClosingHash(senderAddress, amount, channelAddress).then(function (result) {
            if (result) {
                _thiss.notificationsService.showNotification('Info', 'Share this balanceMessage with your Sender ' + result, 'Text');
                console.log('Balance signature complete', result);
            }
        });

    }

    settleChannel(balanceMessage, closingMessage, balance) {
        console.log(balanceMessage.length, closingMessage.length);
        let _thiss = this;
        this.closeModal();
        this.createService.mutualSettleChannel(balanceMessage, closingMessage, balance, this.detailData.address).then(function (result) {
            if (result) {
                _thiss.notificationsService.showNotification('Info', 'Settle balance is in progress ' + result, 'Text');
                console.log('Balance signature complete', result);
            }
        });

    }

    Withdraw(balanceMessage, balance) {
        this.closeModal();
        let _thiss = this;
        this.createService.withdrawFromChannel(this.detailData.address, balanceMessage, balance).then((result) => {
            if (result) {
                _thiss.notificationsService.showNotification('Info', 'Withdraw balance is in progress ' + result, 'Text');
                console.log('success', result);
            }
        });
    }

    challengeSettle(balance) {
        this.closeModal();
        let _thiss = this;
        this.createService.challengeSettle(balance, this.detailData.address).then((result) => {
            _thiss.notificationsService.showNotification('Info', 'challengeSettle  is in progress ' + result, 'Text');
            console.log('success', result);
        });

    }

    afterChallengeSettle() {
        this.closeModal();
        let _thiss = this;
        this.createService.afterChallengeSettle(this.detailData.address).then((result) => {
            console.log('success', result);
            _thiss.notificationsService.showNotification('Info', 'After Challenge Settle  is in progress ' + result, 'Text');

        });

    }

    testNotify() {
        this.notificationsService.showNotification('Info', 'Share this balanceMessage with your receiver ', 'Text');
    }
}
