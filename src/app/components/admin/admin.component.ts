import { Inject, Component, OnInit, OnDestroy, ViewEncapsulation, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { dynamicAdminScripts } from 'src/app/model/performance/js-scripts';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  encapsulation: ViewEncapsulation.None,

})
export class AdminComponent implements OnInit, OnDestroy {
  protected styleUser: HTMLLinkElement[] = [];
  protected scripts: HTMLScriptElement[] = [];

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer2: Renderer2,
  ) { }

  cssPath = ['../../../assets/css/admin-style/style.css',
    '../../../assets/vendor/jquery-nice-select/css/nice-select.css',
    '../../../assets/vendor/nouislider/nouislider.min.css'
  ];

  ngOnInit(): void {
    /*for (let i = 0; i < dynamicAdminScripts.length; i++) {
      this.scripts[i] = this.renderer2.createElement('script') as HTMLScriptElement;
      this.renderer2.appendChild(this.document.body, this.scripts[i]);
      this.renderer2.setProperty(this.scripts[i], 'type', 'text/javascript');
      this.renderer2.setProperty(this.scripts[i], 'async', 'false');
      this.renderer2.setProperty(this.scripts[i], 'src', dynamicAdminScripts[i]);
    }*/
    for (let i = 0; i < this.cssPath.length; i++) {
      this.styleUser[i] = this.renderer2.createElement('link') as HTMLLinkElement;
      this.renderer2.appendChild(this.document.head, this.styleUser[i]);
      this.renderer2.setProperty(this.styleUser[i], 'rel', 'stylesheet');
      this.renderer2.setProperty(this.styleUser[i], 'href', this.cssPath[i]);
    }
    this.loadScripts();
  }

  node:any;
  loadScripts() {
    for (let i = 0; i < dynamicAdminScripts.length; i++) {
      this.node = document.createElement('script');
      this.node.src = dynamicAdminScripts[i];
      this.node.type = 'text/javascript';
      this.node.async = false;
      document.getElementsByTagName('body')[0].appendChild(this.node);
    }
  }

  ngOnDestroy(): void {
    for (let i = 0; i < this.cssPath.length; i++) {
      this.renderer2.removeChild(this.document.head, this.styleUser[i]);
    }
    this.styleUser = [];
    for (let i = 0; i < dynamicAdminScripts.length; i++) {
      //document.getElementsByTagName('body')[0].removeChild(this.node)
      
      //this.renderer2.removeChild(this.document.body, this.scripts[i]);
    }
    this.scripts = [];
  }

}
