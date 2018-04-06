import {Component, OnInit, OnDestroy} from '@angular/core';
import {routerTransition} from '../../router.animations';
import {Web3Service} from '../../services/services';
import {CreateChannelService} from '../../services/createchannel.service';
import {ShareddataService} from '../../services/shareddata.service';
import {Subscription} from 'rxjs/Subscription';


@Component({
    selector: 'app-charts',
    templateUrl: './charts.component.html',
    styleUrls: ['./charts.component.scss'],
    animations: [routerTransition()]
})
export class ChartsComponent implements OnInit {
    private senderChannel = [];


    constructor(private web3Service: Web3Service, private createChannelService: CreateChannelService,private shareddataService:ShareddataService) {

    }

    ngOnInit() {
            let _this=this;
            this.senderChannel = [];
            console.log(this.senderChannel);
            this.createChannelService.getChannelsBySender(function (result) {
                result.map((key) => {
                    _this.getChannelInfo(key);
                });
            });
    }

    getChannelInfo(address) {
        console.log('called')
        let _this=this;
        this.createChannelService.getChannelInfo(address, function (result) {
            result.address=address;
            _this.senderChannel.push(result);
            _this.shareddataService.setData( _this.senderChannel);
           console.log('finalArray', _this.senderChannel);
        });
    }
}
