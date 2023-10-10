import { IPropertiesOptions } from './propiedades.interface';
import { tileLayers, tileLayersWMS } from './data';
import { tileLayer } from 'leaflet';
import { APIKEY } from 'src/environments/environment.prod';
import * as L from 'leaflet';

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
  service: string = `https://1.base.maps.ls.hereapi.com/maptile/2.1/maptile/newest/normal.day/11/525/761/256/png8?apiKey=${APIKEY.hereToken}`,
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

export const Stadia_OSMBright = (
  service: string = 'https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png',
  options: IPropertiesOptions = {
    minZoom: 0,
    maxZoom: 20,
    attribution:
      '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }
) => {
  return tileLayer.wms(service, options);
};

export const OpenStreetMap_Mapnik = (
  service: string = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  options: IPropertiesOptions = {
    minZoom: 0,
    maxZoom: 20,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }
) => {
  return tileLayer.wms(service, options);
};

export const CartoDB_Voyager = (
  service: string = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
  options: IPropertiesOptions = {
    minZoom: 0,
    maxZoom: 20,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  }
) => {
  return tileLayer.wms(service, options);
};

export const Thunderforest_OpenCycleMap = (
  service: string = `https://tile.thunderforest.com/pioneer/{z}/{x}/{y}.png?apikey=${APIKEY.thunderForestToken}`,
  options: IPropertiesOptions = {
    minZoom: 0,
    maxZoom: 22,
    apikey: APIKEY.thunderForestToken,
    attribution:
      '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }
) => {
  return tileLayer.wms(service, options);
};

export const Jawg_Sunny = (
  service: string = `https://{s}.tile.jawg.io/jawg-sunny/{z}/{x}/{y}{r}.png?access-token=${APIKEY.jawgToken}`,
  options: IPropertiesOptions = {
    minZoom: 0,
    maxZoom: 22,
    accessToken: APIKEY.jawgToken,
    attribution:
      '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }
) => {
  return tileLayer.wms(service, options);
};





