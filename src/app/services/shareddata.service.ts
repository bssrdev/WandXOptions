import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {CreateChannelService} from './createchannel.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
@Injectable()
export class ShareddataService implements OnInit, OnDestroy {
    public channelData: any;
    public temp = [];
    public channel: any;
    public trackLength: any;
    public i = 1;
    constructor(private createChannelService: CreateChannelService) {
        this.initiateAutoRefresh();
    }
    private _SharedData = new BehaviorSubject<Object>(null);
    _SharedData$ = this._SharedData.asObservable();
    getData(callback) {
        callback(this.channelData);
    }
    setData(data) {
        this.channelData = data;
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
        let _this = this;
        this.createChannelService.getChannelInfo(address, function (result) {
            result.address = address;
            result.id =  _this.i++;
            _this.temp.push(result);
            if (_this.trackLength === _this.temp.length) {
                _this.setData( _this.temp);
                _this._SharedData.next(_this.temp);
            }
        });
    }
    private initiateAutoRefresh() {
        console.log("called timer")
        if (this.channel)
            clearTimeout(this.channel);
        this.channel = setTimeout(() => {
            this.getChannel();
            this.initiateAutoRefresh();
        }, 3000);
    }
    ngOnInit() {
    }
    ngOnDestroy(): void {
        console.log('destroying sender');
        if (this.channel) {
            clearTimeout(this.channel);
        }
    }

}
