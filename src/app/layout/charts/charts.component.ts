import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import {Web3Service} from '../../services/services';


@Component({
    selector: 'app-charts',
    templateUrl: './charts.component.html',
    styleUrls: ['./charts.component.scss'],
    animations: [routerTransition()]
})
export class ChartsComponent implements OnInit {
    
    constructor(private web3Service: Web3Service) {
      this.onReady();
    }
    //constructor(){}

    onReady = () => {
     // Get the initial account balance so it can be displayed.
     this.web3Service.getAccounts().then(account => {
      alert(account);
     });
     
    }
    ngOnInit() {}
}