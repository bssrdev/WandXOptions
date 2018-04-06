import {Component, OnInit} from '@angular/core';
import {routerTransition} from '../../router.animations';
import {CreateChannelService} from '../../services/services';
import {ShareddataService} from '../../services/shareddata.service';

@Component({
    selector: 'app-tables',
    templateUrl: './tables.component.html',
    styleUrls: ['./tables.component.scss'],
    animations: [routerTransition()]
})
export class TablesComponent implements OnInit {
    private receiverChannel = [];
    constructor(private createService: CreateChannelService,private shareddataService:ShareddataService) {
    }

    ngOnInit() {
        let _this=this
        this.createService.getChannelsByReceiver().then(function (result) {
            console.log('result', result);
            if(result){

            }
        });
    }

    getChannelInfo(address) {
        console.log('called');
        let _this = this;
        this.createService.getChannelInfo(address, function (result) {
            result.address = address;
            _this.receiverChannel.push(result);
            _this.shareddataService.setData(_this.receiverChannel);
            console.log('finalArray', _this.receiverChannel);
        });
    }
}
