export enum PropertyType { // condicion
  alquiler = 'Alquiler anual',
  alquiler_temporada = 'Alquiler temporada',
  venta = 'Venta',
  compartir = 'Habitación',
  intercambio_vacacional = 'Intercambio vacacional',
  nuevoProyectoObra = 'Nuevo proyecto obra nueva',
  alquilerDias = 'Alquiler por días',
}

export enum HouseType { // tipo
  piso = 'Piso',
  apartamento = 'Apartamento',
  estudio = 'Estudio',
  atico = 'Ático',
  duplex = 'Duplex',
  chalet = 'Chalet',
  adosado = 'Adosado',
  pareado = 'Pareado',
  casa_rustica = 'Casa Rústica',
  villa = 'Villa',
}

export enum EmptyType {
  solar = 'Solar',
  terreno = 'Terreno',
  nave = 'Nave',
}

export enum Bedrooms {
  indiferente = 'Indiferente',
  estudio = 'Estudio',
  uno = '1',
  dos = '2',
  tres = '3',
  cuatro = '4',
  cinco = '5',
  masDeCinco = '5+',
}

export enum Bathrooms {
  indiferente = 'Indiferente',
  uno = '1',
  dos = '2',
  tres = '3',
  cuatro = '4',
  cinco = '5',
  masDeCinco = '5+',
}

export enum PropertyState {
  nuevo = 'Obra nueva',
  usado = 'Usado',
  a_reformar = 'A reformar',
}

export enum Badge {
  precio_negociable = 'Precio negociable',
  urge_vender = 'Urge vender',
  listo_para_mudarse = 'Listo para su bienvenida',
  precio_ya_rebajado = 'Precio rebajado',
  propiedad_de_lujo = 'Lujo',
}

export enum Enseñanza {
  primaria = 'Primaria',
  secundaria = 'Secundaria',
  combinado = 'Combinado',
}

export enum Institucion {
  publica='Pública',
  privada='Privada',
}

export enum RamasConocimiento{
  artes='Artes y Humanidades',
  ciencias='Ciencias',
  cienciasSalud='Ciencias de la salud',
  ingenieria='Ingeniería y arquitectura',
  ccss='CC. SS. y Jurídicas'
}

export enum ConsumoEnergetico {
  A='A: consumo energético inferior a 44,6 kWh/m2/año',
  B='B: consumo energético inferior a 72,3 kWh/m2/año',
  C='C: consumo energético inferior a 112,1 kWh/m2/año',
  D='D: consumo energético inferior a 172,3 kWh/m2/año',
  E='E: consumo energético inferior a 303,7 kWh/m2/año',
  F='F: consumo energético inferior a 382,6 kWh/m2/año',
  G='G: consumo energético superior a 382,6 kWh/m2/año'
}

export enum EmisionesCO2 {
  A='A: emisiones de CO2 inferiores a 10 Kg de CO2/m2/año',
  B='B: emisiones de CO2 inferiores a 16,3 Kg de CO2/m2/año',
  C='C: emisiones de CO2 inferiores a 25,3 Kg de CO2/m2/año',
  D='D: emisiones de CO2 inferiores a 38,9 Kg de CO2/m2/año',
  E='E: emisiones de CO2 inferiores a 66 Kg de CO2/m2/año',
  F='F: emisiones de CO2 inferiores a 79,2 Kg de CO2/m2/año',
  G='G: emisiones de CO2 superiores a 79,2 Kg de CO2/m2/año'
}