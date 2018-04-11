import {Component, OnInit} from '@angular/core';
import {routerTransition} from '../../router.animations';
import {ApproveTokenService, CreateChannelService,ShareddataService} from '../../services/services';
import {NotificationManagerService} from '../../services/notification-manager.service';

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss'],
    animations: [routerTransition()]
})
export class FormComponent implements OnInit {
    public tokenList: any;
    public senderChannel=[]
    constructor(private notificationsService: NotificationManagerService, private createService: CreateChannelService,private approveTokenService:ApproveTokenService) {
    }
    ngOnInit() {
        let _this = this;
        this.createService.getTokenlist(function (result) {
           // console.log('result', result);
            _this.tokenList = result.testToken;
        });
        this.senderChannel = [];
        console.log(this.senderChannel);
        this.createService.getChannelsBySender(function (result) {
            //console.log('channel address',result);
            result.map((key) => {
                _this.getChannelInfo(key);
            });
        });
    }
    getChannelInfo(address) {
        let _this=this;
        this.approveTokenService.getallowance(address);
        this.createService.getChannelInfo(address, function (result) {
            result.address=address;
            _this.senderChannel.push(result);
        });
    }
    approveToken(contractAddress,amount){
        let _thiss=this;
        console.log(contractAddress,amount );
        this.approveTokenService.approveToken(contractAddress, amount).then((result)=>{
            _thiss.notificationsService.showNotification('Info', 'Token approve in Progress', 'Text');
        },function(error) {
            console.log(error); // Stacktrace
            _thiss.notificationsService.showNotification('Info', 'Token approve failed', 'Text');
        });
    }
}
