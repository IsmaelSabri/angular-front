import { Component, ElementRef, inject, model, signal, ViewChild } from '@angular/core';
import { NotificationService } from '../../service/notification.service';
import { NotificationType } from '../../class/notification-type.enum';
import { NzSelectSizeType } from 'ng-zorro-antd/select';
import $ from 'jquery';
import { BadgeDestacar } from 'src/app/class/property-type.enum';
import {
  injectStripe, StripeCardNumberComponent, StripeElementsDirective, StripePaymentElementComponent
} from 'ngx-stripe';
import { APIKEY } from 'src/environments/environment.key';
import { StripeCardElementOptions,StripeIssuingCardNumberDisplayElement, StripeElementsOptions, StripeElementsUpdateOptions, StripePaymentElement, StripePaymentElementOptions, StripeExpressCheckoutElementOptions } from '@stripe/stripe-js';
import { loadStripe } from '@stripe/stripe-js/pure';
import { FormBuilder, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-pricing-card',
  templateUrl: './pricing-card.component.html',
  styleUrl: './pricing-card.component.css',
  standalone: false

})
export class PricingCardComponent {
  public sizeM: NzSelectSizeType = 'default';
  public badge: string[] = Object.values(BadgeDestacar);

  constructor(public notificationService: NotificationService,private fb: FormBuilder,) { }

  public seleccionDestacado = model(false);
  public seleccionUbicacionMapa = model(false);
  public seleccionNota = model(false);
  public fraseDestacar = model('');
  public colorFondoDestacar = model('');
  public colorTextoDestacar = model('');

  ngOnInit(): void {
    initFlowbite();
    this.stripeTest = this.fb.group({
      name: ['Angular v10', [Validators.required]],
      amount: [1001, [Validators.required, Validators.pattern(/d+/)]],
    });
  }

  stripe = injectStripe(APIKEY.stripePublicKey);
  elementsOptions: StripeElementsOptions = {
    mode: 'payment',
    amount: 1099,
    currency: 'eur',
    locale: 'es'
  };

  options: StripeExpressCheckoutElementOptions = {
    buttonType: {
      applePay: 'buy',
      googlePay: 'buy'
    }
  };
  @ViewChild(StripeCardNumberComponent) card: StripeCardNumberComponent;
  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        fontWeight: '300',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '18px',
        '::placeholder': {
          color: '#CFD7E0',
        },
      },
    },
  };
  stripeTest: FormGroup;
  pay() {console.log('pagado!')}






  showFledgedServices(e: any, flag: string) {
    if (flag == 'destacado') {
      this.notificationService.notify(NotificationType.INFO, 'Guardado ' + this.seleccionDestacado);
    } else if (flag == 'location') {
      this.notificationService.notify(NotificationType.INFO, 'Guardado ' + this.seleccionUbicacionMapa);
    }
  }

  private addTextIdx: number = 0;
  @ViewChild('textOptional') textOptional: ElementRef;
  addText(input: HTMLInputElement): void {
    if (this.textOptional.nativeElement.value) {
      const value = input.value;
      if (this.badge.indexOf(value) === -1) {
        this.badge = [...this.badge, input.value || `New item ${this.addTextIdx++}`];
      }
    }
  }

  rotateArrows(e: any, id: string) {
    if (e)
      $("." + id).find(".ant-select-arrow").toggleClass("ant-select-arrow-down");
    else
      $("." + id).find(".ant-select-arrow").removeClass("ant-select-arrow-down");
  }
}
