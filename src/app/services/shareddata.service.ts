import {Injectable} from '@angular/core';

@Injectable()
export class ShareddataService {
    public channelData: any;

    getData(callback) {
        callback(this.channelData);
    }
    setData(data) {
        this.channelData = data;
    }

}
