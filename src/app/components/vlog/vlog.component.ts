import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-vlog',
  templateUrl: './vlog.component.html',
  styleUrls: ['./vlog.component.css']
})
export class VlogComponent implements OnInit {

  constructor() { }

  imagenes = [
    'img/background.png',
    'img/background2.png',
    'img/background3.png',
  ];

  ngOnInit(): void {
  }

}
