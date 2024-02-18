import { Inject, Component, OnInit, OnDestroy, ViewEncapsulation, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  encapsulation: ViewEncapsulation.None,

})
export class AdminComponent implements OnInit, OnDestroy {
  protected styleUser: HTMLLinkElement[] = [];

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer2: Renderer2,
  ) {}

  ngOnInit(): void {
    const cssPath = ['../../../assets/css/admin-style/style.css',
    '../../../assets/vendor/jquery-nice-select/css/nice-select.css',
    '../../../assets/vendor/nouislider/nouislider.min.css'
  ];
  for (let i = 0; i < cssPath.length; i++) {
    this.styleUser[i] = this.renderer2.createElement('link') as HTMLLinkElement;
    this.renderer2.appendChild(this.document.head, this.styleUser[i]);
    this.renderer2.setProperty(this.styleUser[i], 'rel', 'stylesheet');
    this.renderer2.setProperty(this.styleUser[i], 'href', cssPath[i]);
  }
    this.loadScripts();
  }

  loadScripts() {
    const dynamicScripts = [
      '../../../assets/vendor/global/global.min.js',
      '../../../assets/vendor/chart.js/Chart.bundle.min.js',
      '../../../assets/vendor/jquery-nice-select/js/jquery.nice-select.min.js',
      '../../../assets/vendor/apexchart/apexchart.js',
      '../../../assets/vendor/nouislider/nouislider.min.js',
      '../../../assets/vendor/wnumb/wNumb.js',
      '../../../assets/js/dashboard/dashboard-1.js',
      '../../../assets/js/dlabnav-init.js',
      '../../../assets/js/demo.js',
      '../../../assets/js/styleSwitcher.js',
      '../../../assets/js/custom.min.js',

      '../../../assets/js/bootstrap.bundle.min.js',
    ];
    for (let i = 0; i < dynamicScripts.length; i++) {
      const node = document.createElement('script');
      node.src = dynamicScripts[i];
      node.type = 'text/javascript';
      node.async = false;
      document.getElementsByTagName('body')[0].appendChild(node);
    }
  }

  ngAfterViewInit() {

  }

  ngOnDestroy(): void {
    this.renderer2.removeChild(this.document.head, this.styleUser);
  }


}
