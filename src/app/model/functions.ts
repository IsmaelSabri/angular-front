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
