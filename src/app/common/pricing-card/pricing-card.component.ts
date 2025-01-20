import { Component, model } from '@angular/core';
import { NotificationService } from '../../service/notification.service';
import { NotificationType } from '../../class/notification-type.enum';

@Component({
  selector: 'app-pricing-card',
  templateUrl: './pricing-card.component.html',
  styleUrl: './pricing-card.component.css',
  standalone: false

})
export class PricingCardComponent {

  constructor(public notificationService: NotificationService,) { }

  remarcado = model(false);
  ubicacionMapa = model(false);

  showFledgedServices(e: any, flag: string) {
    if (flag == 'destacado') {
      this.notificationService.notify(NotificationType.INFO, 'Guardado ' + this.remarcado);
    } else if (flag == 'location') {
      this.notificationService.notify(NotificationType.INFO, 'Guardado ' + this.ubicacionMapa);
    }
  }
}
