import { Injectable, Inject, OnInit } from "@angular/core";
import { NotificationsService } from "angular2-notifications";


@Injectable()
export class NotificationManagerService{
    constructor(private notificationService: NotificationsService){
        console.log("Initialized notification manager");
    }

    showNotification(type,message, MessageType){
        console.log("notify",message,MessageType)
        if(message === null || message === undefined)
            return;
        if(MessageType == 'Text'){
            switch(type){
                case type==='Alert':
                    this.notificationService.alert(message);
                    break;
                case type==='Error':
                    this.notificationService.error(message, "", {theClass : 'test'});
                    break;
                case type==='Info':
                    this.notificationService.info(message);
                    break;
                case type==='Success':
                    this.notificationService.info(message);
                    break;
                default:
                    this.notificationService.bare(message);
                    break;
            }
        }
        else{
            this.notificationService.html(message, MessageType);
        }
    }
}
