import { IPropertiesOptions } from './propiedades.interface';
import { tileLayers, tileLayersWMS } from './data';
import { tileLayer, Icon } from 'leaflet';

export const tileLayerSelect = (
  layer: string = tileLayers.baseLayers.thunderForest.map.outdoors,
  options: IPropertiesOptions = {
    minZoom: 0,
    maxZoom: 20,
    attribution: tileLayers.baseLayers.default.atribution,
  }
) => {
  return tileLayer(layer, options);
};

export const tileLayerWMSSelect = (
  service: string = tileLayersWMS.mundialis.baseUrl,
  options: IPropertiesOptions = {
    minZoom: 0,
    maxZoom: 20,
    layers: tileLayersWMS.mundialis.layers.osmWMS,
    format: 'image/png',
    transparent: true,
    attribution: tileLayers.baseLayers.default.atribution,
  }
) => {
  return tileLayer.wms(service, options);
};

export const tileLayerWMSSelectIGN = (
  service: string = 'https://www.ign.es/wms-inspire/ign-base?',
  options: IPropertiesOptions = {
    minZoom: 0,
    maxZoom: 20,
    layers: 'IGNBaseTodo',
    format: 'image/png',
    transparent: true,
    attribution: tileLayers.baseLayers.default.atribution,
  }
) => {
  return tileLayer.wms(service, options);
};

export const tileLayerCP = (
  service: string = 'https://www.cartociudad.es/wms-inspire/direcciones-ccpp?',
  options: IPropertiesOptions = {
    minZoom: 0,
    maxZoom: 20,
    layers: 'codigo-postal',
    format: 'image/png',
    transparent: true,
    attribution: tileLayers.baseLayers.default.atribution,
  }
) => {
  return tileLayer.wms(service, options);
};

export const tileLayerHere = (
  service: string = 'https://1.base.maps.ls.hereapi.com/maptile/2.1/maptile/newest/normal.day/11/525/761/256/png8?apiKey=NPVBWuDUxwN0cy2wFI9NYEYNr0mGJviQKWuHPBaK91E',
  options: IPropertiesOptions = {
    minZoom: 0,
    maxZoom: 20,
    layers: 'Here',
    format: 'image/png',
    transparent: true,
    attribution: tileLayers.baseLayers.default.atribution,
  }
) => {
  return tileLayer.wms(service, options);
};

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
