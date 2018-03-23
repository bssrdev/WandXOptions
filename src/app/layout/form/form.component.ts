import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import {ApproveTokenService} from '../../services/services';

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss'],
    animations: [routerTransition()]
})
export class FormComponent implements OnInit {
    constructor(private tokenservice:ApproveTokenService) {
        this.onReady();
    }

    onReady = () =>{
        this.tokenservice.getSupply();
        //this.tokenservice.approveToken();
    }

    ngOnInit() {}
}
