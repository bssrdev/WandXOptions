import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import {CreateChannelService} from '../../services/services';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    animations: [routerTransition()]
})
export class DashboardComponent implements OnInit {

    constructor(private createService: CreateChannelService) {
        this.onReady(); 
    }

    onReady = () => {
        this.createService.getOwner();        
        //this.createService.createChannel();  
        this.createService.getChannelsBySender(); 
        //this.createService.getChannelsByReceiver();
        this.createService.getChannelInfo();
        //this.createService.rechargeChannel(); 
        this.createService.withdrawFromChannel(); 
        //this.createService.signBalanceHash();    
    }

    ngOnInit() {}    
}
