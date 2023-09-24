import { IPropertiesOptions } from './propiedades.interface';
import { tileLayers, tileLayersWMS } from './data';
import { tileLayer } from 'leaflet';

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

export const tileLayerTransportes = (
  service: string = 'https://servicios.idee.es/wms-inspire/transportes',
  options: IPropertiesOptions = {
    minZoom: 0,
    maxZoom: 20,
    layers: 'transportes',
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

/*export const Hplatform = new H.service.Platform({
  apikey: '{NPVBWuDUxwN0cy2wFI9NYEYNr0mGJviQKWuHPBaK91E}'
});
export const Hlayers = Hplatform.createDefaultLayers();*/
