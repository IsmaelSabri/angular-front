import { Component, output, input, model, signal, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { NotificationType } from 'src/app/class/notification-type.enum';
import { NotificationService } from 'src/app/service/notification.service';

@Component({
  selector: 'app-cropper',
  templateUrl: './cropper.component.html',
  styleUrl: './cropper.component.css',
  standalone: false
})
export class CropperComponent {

  //public imageLabel = input<string>('master');
  @Input('master') imageLabel = '';

  public imageChangedEvent: any = null
  public imageChangedEventChange = output<any>();
  // image cropped
  public croppedImage: any = null
  public croppedImageChange = output<any>();
  // image loaded
  public tempImage: File = null;
  public tempImageChange = output<File>();
  // tag
  public tempTagName: string;
  public tempTagNameChange = output<string>();

  constructor(private sanitizer: DomSanitizer, private notificationService: NotificationService) { }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    this.imageChangedEventChange.emit(event);
    if (event) {
      if (event.target.files[0].name) {
        this.tempTagName = event.target.files[0].name
        this.tempTagNameChange.emit(event.target.files[0].name);
      }
    }
  }
  imageCropped(event: ImageCroppedEvent) {
    var randomString = (Math.random() + 1).toString(36).substring(7);
    this.tempImageChange.emit(new File([event.blob], randomString + '.jpg'));
    this.croppedImageChange.emit(this.sanitizer.bypassSecurityTrustUrl(event.objectUrl));
  }
  imageLoaded(image: LoadedImage) {

  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    this.notificationService.notify(NotificationType.ERROR, `Algo salio mal. Por favor intentelo pasados unos minutos.`);
  }
  clearEnergySelection() {
    this.tempImage = null;
    this.tempImageChange.emit(null);
    this.imageChangedEvent = null;
    this.imageChangedEventChange.emit(null);
    this.tempTagName = null;
    this.tempTagNameChange.emit(null);
    this.croppedImage = null;
    this.croppedImageChange.emit(null);
  }

}

