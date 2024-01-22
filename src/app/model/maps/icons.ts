import * as L from 'leaflet';
import { tileLayer, Icon, divIcon } from 'leaflet';

export const grayIcon = new Icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export const greenIcon = new Icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export const grayPointerIcon = new divIcon({
  html: `<svg width="25" height="25" viewbox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
               <circle cx="20" cy="20" fill="none" r="10" stroke="#383a36" stroke-width="2">
                 <animate attributeName="r" from="8" to="20" dur="1.5s" begin="0s" repeatCount="indefinite"/>
                 <animate attributeName="opacity" from="1" to="0" dur="1.5s" begin="0s" repeatCount="indefinite"/>
               </circle>
               <circle cx="20" cy="20" fill="#383a36" r="10"/>
             </svg>`,
  iconSize: [25, 25],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export const fancyGreen = new Icon({
  iconUrl: '../assets/svg/marker/marker_green.svg',
  iconSize: [35, 35],
  iconAnchor: [12, 41],
  popupAnchor: [0, -30],
  shadowSize: [41, 41],
});

export const luxuryRed = new Icon({
  iconUrl: '../assets/svg/marker/ic-pin-2.svg',
  iconSize: [35, 35],
  iconAnchor: [12, 41],
  popupAnchor: [0, -30],
  shadowSize: [41, 41],
});

export const priceIcon= L.divIcon({
  className: 'custom-div-icon',
  html: `<div class="property-pill streamlined-marker-container streamlined-marker-position pill-color-forsale with-icon"
            role="link"
            tabindex="-1"
            data-test="property-marker">
            <div style="display: inline-block; overflow: hidden;">4.70M</div>
        </div>`,
  iconSize: [30, 42],
  iconAnchor: [15, 42]
});

export const homeicon= L.divIcon({
  className: 'custom-div-icon',
  html: "<div style='background-color:#3a3b3c;' class='marker-pin'></div><i class='fa fa-home'>",
  iconSize: [30, 42],
  iconAnchor: [15, 42]
});

export const beachIcon= L.divIcon({
  className: 'custom-div-icon',
  html: `<div style='background-color:dodgerblue;' class='marker-pin'></div><i style="color: dodgerblue; " class="bi bi-sun-fill"></i>` ,
  iconSize: [30, 42],
  iconAnchor: [15, 42]
});

export const airportIcon= L.divIcon({
  className: 'custom-div-icon',
  html: `<div style='background-color:#3200ff;' class='marker-pin'></div><ion-icon class="ionicon" style="color: #3200ff;" name="airplane-outline"></ion-icon>` ,
  iconSize: [30, 42],
  iconAnchor: [15, 42]
});

export const marketIcon= L.divIcon({
  className: 'custom-div-icon',
  html: `<div style='background-color: #6f5e53;' class='marker-pin'></div><i style="color: #6f5e53;" class="bi bi-cart3"></i>` ,
  iconSize: [30, 42],
  iconAnchor: [15, 42]
});

export const subwayIcon= L.divIcon({
  className: 'custom-div-icon',
  html: `<div style='background-color: #d6a323;' class='marker-pin'></div><i style="color: #d6a323;" class="bi bi-train-lightrail-front"></i>` ,
  iconSize: [30, 42],
  iconAnchor: [15, 42]
});

export const busIcon= L.divIcon({
  className: 'custom-div-icon',
  html: `<div style='background-color: #960018;' class='marker-pin'></div><ion-icon class="ionicon" style="color: #960018;" name="bus-outline"></ion-icon>` ,
  iconSize: [30, 42],
  iconAnchor: [15, 42]
});

export const schoolIcon= L.divIcon({
  className: 'custom-div-icon',
  html: `<div style='background-color: #808080;' class='marker-pin'></div><i style="color: #808080;" class="bi bi-mortarboard-fill"></i>` ,
  iconSize: [30, 42],
  iconAnchor: [15, 42]
});

export const universityIcon= L.divIcon({
  className: 'custom-div-icon',
  html: `<div style='background-color: #128c7e;' class='marker-pin'></div><ion-icon style="color: #128c7e;" class="ionicon" name="american-football-outline"></ion-icon>` ,
  iconSize: [30, 42],
  iconAnchor: [15, 42]
});