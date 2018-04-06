import {Component, OnInit} from '@angular/core';
import {routerTransition} from '../../router.animations';
import {ActivatedRoute, Router} from '@angular/router';
import {ShareddataService} from '../../services/shareddata.service';
import {CreateChannelService} from '../../services/services';

@Component({
    selector: 'app-bs-element',
    templateUrl: './bs-element.component.html',
    styleUrls: ['./bs-element.component.scss'],
    animations: [routerTransition()]
})
export class BsElementComponent implements OnInit {
    public detailData: any;
    public parameter: any;

    constructor(private createService: CreateChannelService,private shareddataService: ShareddataService, private route: ActivatedRoute, private router: Router) {
        this.route.params.subscribe(params => {
            this.parameter = params.id;
            console.log(params);
        });
    }

    ngOnInit() {
        const _thiss = this;
        this.shareddataService.getData(function (result) {
            if (result) {
                _thiss.detailData = result[_thiss.parameter];
                console.log('details', _thiss.detailData);
            } else {
                _thiss.router.navigateByUrl('/charts');
            }


        });
    }
    submit(token,address){
    this.createService.rechargeChannel(address,token);
    }
}
