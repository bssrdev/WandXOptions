import {Component, OnInit} from '@angular/core';
import {routerTransition} from '../../router.animations';
import {CreateChannelService} from '../../services/services';
import {NgModel} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {NotificationManagerService} from '../../services/notification-manager.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    animations: [routerTransition()]
})
export class DashboardComponent implements OnInit {
    public tokenList: any;
    public createChannel: Subscription;

    constructor(private notificationsService: NotificationManagerService,private createService: CreateChannelService,private route: ActivatedRoute, private router: Router) {
        // this.onReady();
    }
    ngOnInit() {
        let _this = this;
        this.createService.getTokenlist(function (result) {
            console.log('result', result);
            _this.tokenList = result.testToken;
        });
    }
    create(tokenAddress, receiverAddress, period) {
        let _thiss=this;
        console.log('data', tokenAddress, receiverAddress, period);
        this.createService.createChannel(tokenAddress, receiverAddress , period).then((result)=>{
        if(result){
            _thiss.notificationsService.showNotification('Info', 'Create Channel is in progress', 'Text');
            console.log("hash",result);
            this.router.navigateByUrl('/charts');
        }
        });

    }
}
