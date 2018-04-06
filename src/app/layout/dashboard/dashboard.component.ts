import {Component, OnInit} from '@angular/core';
import {routerTransition} from '../../router.animations';
import {CreateChannelService} from '../../services/services';
import {NgModel} from '@angular/forms';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    animations: [routerTransition()]
})
export class DashboardComponent implements OnInit {
    public tokenList: any;
    public createChannel: Subscription;

    constructor(private createService: CreateChannelService) {
        // this.onReady();
    }
    ngOnInit() {
        let _this = this;
        this.createService.getTokenlist(function (result) {
            console.log('result', result);
            _this.tokenList = result.testToken;
        });
        this.createChannel = this.createService.CreateChannel$.subscribe(
            item => {
                console.log('create channel', item);
            });
    }

    create(tokenAddress, receiverAddress, period) {
        this.createService.createChannel(tokenAddress, receiverAddress , period);
        console.log('data', tokenAddress, receiverAddress, period);
    }
}
