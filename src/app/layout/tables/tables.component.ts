import {Component, OnInit} from '@angular/core';
import {routerTransition} from '../../router.animations';
import {CreateChannelService} from '../../services/services';

@Component({
    selector: 'app-tables',
    templateUrl: './tables.component.html',
    styleUrls: ['./tables.component.scss'],
    animations: [routerTransition()]
})
export class TablesComponent implements OnInit {
    private receiverChannel = [];
    constructor(private createService: CreateChannelService) {
    }

    ngOnInit() {
        let _this=this
        this.createService.getChannelsByReceiver().then(function (result) {
            console.log('result', result);
            result.map((key) => {
                _this.getChannelInfo(key);
            });
        });
    }

    getChannelInfo(address) {
        console.log('called');
        let _this = this;
        this.createService.getChannelInfo(address, function (result) {
            result.address = address;
            _this.receiverChannel.push(result);
            console.log('finalArray', _this.receiverChannel);
        });
    }
}
