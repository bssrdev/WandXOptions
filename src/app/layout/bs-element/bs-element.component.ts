import {Component, OnInit} from '@angular/core';
import {ViewChild, ElementRef} from '@angular/core';
import {routerTransition} from '../../router.animations';
import {ActivatedRoute, Router} from '@angular/router';
import {ShareddataService} from '../../services/shareddata.service';
import {CreateChannelService} from '../../services/services';
import {NotificationManagerService} from '../../services/notification-manager.service';

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
    @ViewChild('closeBtn') closeBtn: ElementRef;

    constructor(private notificationsService: NotificationManagerService, private createService: CreateChannelService, private shareddataService: ShareddataService, private route: ActivatedRoute, private router: Router) {
        console.log(this.route);
        this.route.params.subscribe(params => {
            this.parameter = params.id;
            this.page = params.page;
            console.log(params);
        });
    }

    ngOnInit() {
        this.getChannelData();
    }

    getNumber(number) {
        return this.createService.getNumber(number);
    }

    getChannelData() {
        const _thiss = this;
        this.shareddataService.getData(function (result) {
            if (result) {
                _thiss.detailData = result[_thiss.parameter];
                console.log('details', _thiss.detailData);
            } else {
                _thiss.router.navigateByUrl('/charts');
            }


        });
    }

    private closeModal(): void {
        this.closeBtn.nativeElement.click();
    }

    submit(token, address) {
        let _t = this;
        this.createService.rechargeChannel(address, token).then((result) => {
            if (result) {
                this.closeModal();
                _t.getChannelData();
            }
        });

    }

    signBalanceHash(channelAddress, recieverAddress, amount) {
        let _thiss = this;
        console.log(channelAddress, recieverAddress, amount);
        this.createService.signBalanceHash(recieverAddress, amount, channelAddress).then(function (result) {
            if (result) {
                //$('#myModal1').modal('hide');
                _thiss.notificationsService.showNotification('Alert', 'Share this balanceMessage with your receiver' + result, 'Text');
                console.log('Balance signature complete', result);
            }
        });

    }

    closeBalanceHash(channelAddress, senderAddress, amount) {
        let _thiss = this;
        console.log(channelAddress, senderAddress, amount);
        this.createService.signClosingHash(senderAddress, amount, channelAddress).then(function (result) {
            if (result) {
                //$('#myModal1').modal('hide');
                _thiss.notificationsService.showNotification('Alert', 'Share this balanceMessage with your receiver' + result, 'Text');
                console.log('Balance signature complete', result);
            }
        });

    }

    settleChannel(balanceMessage, closingMessage, balance) {
        console.log(balanceMessage.length, closingMessage.length);
        debugger;
        let _thiss = this;
        this.createService.mutualSettleChannel(balanceMessage, closingMessage, balance, this.detailData.address).then(function (result) {
            if (result) {
                //$('#myModal1').modal('hide');
                _thiss.notificationsService.showNotification('Alert', 'Share this balanceMessage with your receiver' + result, 'Text');
                console.log('Balance signature complete', result);
            }
        });

    }

    Withdraw(balanceMessage, balance) {
        this.createService.withdrawFromChannel(this.detailData.address, balanceMessage, balance);
    }

    challengeSettle(balance) {
        this.createService.challengeSettle(balance, this.detailData.address).then((result) => {
            console.log('success', result);
        });

    }

    afterChallengeSettle() {
        this.createService.afterChallengeSettle(this.detailData.address).then((result) => {
            console.log('success', result);
        });

    }
}
