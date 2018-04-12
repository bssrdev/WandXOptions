import {Component, OnInit, OnDestroy} from '@angular/core';
import {routerTransition} from '../../router.animations';
import {Web3Service} from '../../services/services';
import {CreateChannelService} from '../../services/createchannel.service';
import {ShareddataService} from '../../services/shareddata.service';
import {Subscription} from 'rxjs/Subscription';
import * as _ from 'underscore';

@Component({
    selector: 'app-charts',
    templateUrl: './charts.component.html',
    styleUrls: ['./charts.component.scss'],
    animations: [routerTransition()]
})
export class ChartsComponent implements OnInit, OnDestroy {
    private senderChannel = [];
    private temp = [];
    public createChannel: Subscription;
    public channel: any;
    public trackLength: any;
    public i = 1;
    constructor(private web3Service: Web3Service, private createChannelService: CreateChannelService, private shareddataService: ShareddataService) {

    }

    ngOnInit() {
        this.senderChannel = [];
        console.log(this.senderChannel);
        this.getChannel();
        this.initiateAutoRefresh();
    }

    getChannel() {
        let _this = this;
        this.temp = [];
        this.i = 1;
        this.createChannelService.getChannelsBySender(function (result) {
            _this.trackLength = result.length;
            result.map((key) => {
                _this.getChannelInfo(key);
            });
        });
    }

    getChannelInfo(address) {
        console.log('called');
        let _this = this;
        this.createChannelService.getChannelInfo(address, function (result) {
            result.address = address;
            result.id =  _this.i++;
            _this.temp.push(result);
            // console.log(_this.trackLength, _this.temp.length);
            if (_this.trackLength === _this.temp.length) {
                _this.shareddataService.setData(_this.senderChannel);
                _this.senderChannel = _.sortBy(_this.temp, function (o) {
                    return o['4'];
                });

            }
            //console.log('finalArray', _this.senderChannel);
        });
    }

    private initiateAutoRefresh() {
        if (this.channel)
            clearTimeout(this.channel);

        this.channel = setTimeout(() => {
            this.getChannel();
            this.initiateAutoRefresh();
        }, 3000);
    }

    ngOnDestroy(): void {
        console.log('destroying sender');
        if (this.channel) {
            clearTimeout(this.channel);
        }
    }
}
