// Model valga la redundancia
export enum Model {
  Flat = 'Flat',
  House = 'House',
  Room = 'Room',
  NewProject = 'NewProject',
  Other = 'Other',
  HolidayRent = 'HolidayRent'
}
// Prototipo para distinguir los modelos Other tirando de herencia
export enum OtherValues {
  Vivienda = 'Vivienda',
  Oficina = 'Oficina',
  Negocio = 'Negocio',
  Suelo = 'Suelo',
  Garage = 'Garage',
  Trastero = 'Trastero'
}

export enum PropertyTo { // condicion
  AlquiloYvendo = 'Alquiler y venta',
  Alquiler = 'Alquiler',
  Venta = 'Venta',
  Compartir = 'Compartir',
  //intercambio_vacacional = 'Intercambio vacacional',
  //nuevoProyectoObra = 'Nuevo proyecto obra nueva',
  //alquilerDias = 'Alquiler por días',
}
export enum PropertyTypeSelectHeader { // condicion
  AlquiloYvendo = 'Alquiler y venta',
  Alquiler = 'Alquiler',
  Venta = 'Venta',
  Compartir = 'Compartir',
  //intercambio_vacacional = 'Intercambio vacacional',
  //nuevoProyectoObra = 'Nuevo proyecto obra nueva',
  //alquilerDias = 'Alquiler por días',
}

export enum PropertyFilterOptions {
  Alquiler = 'Alquiler',
  Venta = 'Venta',
  Compartir = 'Compartir'
}

export enum PropertyShareType { // condicion
  Compartir = 'Compartir',
}

export enum NearlyServices {
  Colegio = 'Colegio',
  Universidad = 'Universidad',
  Autobus = 'Autobús',
  Metro = 'Metro',
  Supermercado = 'Supermercado',
  Aeropuerto = 'Aeropuerto',
  Playa = 'Playa'
}

export enum HouseType { // tipo
  Piso = 'Piso',
  Apartamento = 'Apartamento',
  Estudio = 'Estudio',
  Habitacion = 'Habitación',
  Atico = 'Ático',
  Duplex = 'Duplex',
  Chalet = 'Chalet',
  Adosado = 'Adosado',
  Pareado = 'Pareado',
  Casa_rustica = 'Casa Rústica',
  Villa = 'Villa',
}

export enum HouseTypeFilters { // tipo
  Piso = 'Piso',
  Apartamento = 'Apartamento',
  Estudio = 'Estudio',
  Atico = 'Ático',
  Duplex = 'Duplex',
  Chalet = 'Chalet',
  Adosado = 'Adosado',
  Pareado = 'Pareado',
  Casa_rustica = 'Casa Rústica',
  Villa = 'Villa',
  proyectoNuevo = 'Proyecto nuevo'
}

export enum ProjectFeatures { // tipo
  Pisos = 'Pisos',
  Apartamentos = 'Apartamentos',
  Estudios = 'Estudios',
  Aticos = 'Áticos',
  Duplex = 'Duplex',
  Chalets = 'Chalets',
  Adosados = 'Adosados',
  Pareados = 'Pareados',
  Casas_rusticas = 'Casas Rústicas',
  Villas = 'Urb. de Villas',
  Locales_y_naves = 'Locales y naves',
  Oficinas = 'Oficinas',
  Garages = 'Garages',
  Trasteros = 'Trasteros'
}

export enum EmptyType {
  Solar = 'Solar',
  Terreno = 'Terreno',
  Nave = 'Nave',
  Garage = 'Garage',
  Trastero = 'Trastero',
  Parcela = 'Parcela',
  SueloRustico = 'Suelo Rústico'
}

export enum Bedrooms {
  indiferente = 'Indiferente',
  estudio = 'Estudio - Loft',
  uno = '1',
  dos = '2',
  tres = '3',
  cuatro = '4',
  cinco = '5',
  masDeCinco = '5+',
}

export enum Bathrooms {
  cero = '0',
  uno = '1',
  dos = '2',
  tres = '3',
  cuatro = '4',
  cinco = '5',
  masDeCinco = '5+',
}

export enum CarPlaces {
  cero = '0',
  uno = '1',
  dos = '2',
  tres = '3',
  cuatro = '4',
  cinco = '5',
  masCinco = '5+'
}

export enum Escaparates {
  cero = '0',
  uno = '1',
  dos = '2',
  tres = '3',
  cuatro = '4',
  cinco = '5',
  masCinco = '5+'
}

export enum Views {
  Ciudad = 'Ciudad',
  Jardines = 'Jardines',
  Deslunado = 'Deslunado',
  Mar = 'Mar',
  Piscina = 'Piscina',
  Montanya = 'Montaña',
  Rio = 'Río',
}

export enum PropertyState {
  Nuevo = 'Obra nueva',
  Usado = 'Usado',
  A_Reformar = 'A reformar',
  Okupada = 'Ocupada ilegalmente'
}

export enum BadgeDestacar {
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
  publica = 'Pública',
  privada = 'Privada',
}

export enum RamasConocimiento {
  artes = 'Artes y Humanidades',
  ciencias = 'Ciencias',
  cienciasSalud = 'Ciencias de la salud',
  ingenieria = 'Ingeniería y arquitectura',
  ccss = 'CC. SS. y Jurídicas',
}

export enum ConsumoEnergetico {
  A = 'A: consumo energético inferior a 44,6 kWh/m2/año',
  B = 'B: consumo energético inferior a 72,3 kWh/m2/año',
  C = 'C: consumo energético inferior a 112,1 kWh/m2/año',
  D = 'D: consumo energético inferior a 172,3 kWh/m2/año',
  E = 'E: consumo energético inferior a 303,7 kWh/m2/año',
  F = 'F: consumo energético inferior a 382,6 kWh/m2/año',
  G = 'G: consumo energético superior a 382,6 kWh/m2/año',
}

export enum EmisionesCO2 {
  A = 'A: emisiones de CO2 inferiores a 10 Kg de CO2/m2/año',
  B = 'B: emisiones de CO2 inferiores a 16,3 Kg de CO2/m2/año',
  C = 'C: emisiones de CO2 inferiores a 25,3 Kg de CO2/m2/año',
  D = 'D: emisiones de CO2 inferiores a 38,9 Kg de CO2/m2/año',
  E = 'E: emisiones de CO2 inferiores a 66 Kg de CO2/m2/año',
  F = 'F: emisiones de CO2 inferiores a 79,2 Kg de CO2/m2/año',
  G = 'G: emisiones de CO2 superiores a 79,2 Kg de CO2/m2/año',
}

export enum TipoDeVia {
  Calle = 'Calle',
  Carrer = 'Carrer',
  Avenida = 'Avenida',
  Avinguda = 'Avinguda',
  Plaza = 'Plaza',
  Plaça = 'Plaça',
  Praza = 'Praza',
  Camino = 'Camino',
  Cami = 'Camí',
  Paseo = 'Paseo',
  Pasaje = 'Pasaje',
  Passeig = 'Passeig',
  Passatge = 'Passatge',
  Bulevar = 'Bulevar',
  Carretera = 'Carretera',
  Glorieta = 'Glorieta',
  Jardines = 'Jardines',
  Jardins = 'Jardins',
  Alameda = 'Alameda',
  Rambla = 'Rambla',
  Sector = 'Sector',
  Travesia = 'Travesía',
  Urbanizacion = 'Urbanización',
  Barrio = 'Barrio',
  Calleja = 'Calleja',
  Kalea = 'Kalea',
  Campo = 'Campo',
  Carrera = 'Carrera',
  Cuesta = 'Cuesta',
  Edificio = 'Edificio',
  Enparantza = 'Enparantza',
  Estrada = 'Estrada',
  Ronda = 'Ronda',
  Rua = 'Rúa',
  Parque = 'Parque',
  Plazuela = 'Plazuela',
  Placeta = 'Placeta',
  Poblado = 'Poblado',
  Via = 'Via',
  Travessera = 'Travessera',
  Polígono = 'Polígono',
  Puente = 'Puente',
  Otros = 'Otros',
}

export enum Orientacion {
  Norte = 'Norte',
  Noreste = 'Noreste',
  Noroeste = 'Noroeste',
  Este = 'Este',
  Oeste = 'Oeste',
  Sureste = 'Sureste',
  Suroeste = 'Suroeste',
  Sur = 'Sur',
}

export enum Provincias {
  Todas = 'Todas',
  A_Corunya = 'A Coruña',
  Alava = 'Alava',
  Albacete = 'Albacete',
  Alicante = 'Alicante',
  Almeria = 'Almería',
  Asturias = 'Asturias',
  Avila = 'Avila',
  Badajoz = 'Badajoz',
  Barcelona = 'Barcelona',
  Burgos = 'Burgos',
  Caceres = 'Cáceres',
  Cadiz = 'Cádiz',
  Cantabria = 'Cantabria',
  Castellon = 'Castellón',
  Ciudad_Real = 'Ciudad Real',
  Cordoba = 'Córdoba',
  Cuenca = 'Cuenca',
  Gerona = 'Gerona',
  Granada = 'Granada',
  Guadalajara = 'Guadalajara',
  Guipuzkoa = 'Guipúzcoa',
  Huelva = 'Huelva',
  Huesca = 'Huesca',
  Islas_baleares = 'Islas Baleares',
  Jaen = 'Jaén',
  Leon = 'León',
  Lerida = 'Lérida',
  Lugo = 'Lugo',
  Madrid = 'Madrid',
  Malaga = 'Málaga',
  Murcia = 'Murcia',
  Navarra = 'Navarra',
  Ourense = 'Ourense',
  Palencia = 'Palencia',
  Las_Palmas = 'Las Palmas',
  Pontevedra = 'Pontevedra',
  La_Rioja = 'La Rioja',
  Salamanca = 'Salamanca',
  Segovia = 'Segovia',
  Sevilla = 'Sevilla',
  Soria = 'Soria',
  Tarragona = 'Tarragona',
  Santa_Cruz_de_Tenerife = 'Santa Cruz de Tenerife',
  Teruel = 'Teruel',
  Toledo = 'Toledo',
  Valencia = 'Valencia',
  Valladolid = 'Valladolid',
  Vizcaya = 'Vizcaya',
  Zamora = 'Zamora',
  Zaragoza = 'Zaragoza',
}

export enum PrecioMinimoAlquiler {
  cualquiera = 'Cualquiera',
  cien = '100€',
  doscien = '200€',
  trescien = '300€',
  cuatrocien = '400€',
  cincocien = '500€',
  seiscien = '600€',
  setecien = '700€',
  ochocien = '800€',
  novecien = '900€',
  mil = '1,000€',
  milcien = '1,100€',
  mildos = '1,200€',
  miltres = '1,300€',
  milcuatro = '1,400€',
  milcinco = '1,500€',
  milseis = '1,600€',
  milsiete = '1,700€',
  milocho = '1,800€',
  milnueve = '1,900€',
  dosmil = '2,000€',
  dosmilcien = '2,100€',
  dosmildoscien = '2,200€',
  dosmiltrescien = '2,300€',
  dosmilcuatrocien = '2,400€',
  dosmilcincocien = '2,500€',
  dosmilseiscien = '2,600€',
  dosmilsetecien = '2,700€',
  dosmilochocien = '2,800€',
  dosmilnovecien = '2,900€',
  tresmil = '3,000€',
}

export enum PrecioMaximoAlquiler {
  cualquiera = 'Cualquiera',
  cien = '100€',
  doscien = '200€',
  trescien = '300€',
  cuatrocien = '400€',
  cincocien = '500€',
  seiscien = '600€',
  setecien = '700€',
  ochocien = '800€',
  novecien = '900€',
  mil = '1,000€',
  milcien = '1,100€',
  mildos = '1,200€',
  miltres = '1,300€',
  milcuatro = '1,400€',
  milcinco = '1,500€',
  milseis = '1,600€',
  milsiete = '1,700€',
  milocho = '1,800€',
  milnueve = '1,900€',
  dosmil = '2,000€',
  dosdoscincuen = '2,250€',
  dosquini = '2500€',
  dosmilsietecincuen = '2,750€',
  tresmil = '3,000€',
  tresmilquini = '3,500€',
  cuatromil = '4,000€',
  cuatromilquini = '4,500€',
  cincomil = '5,000€',
  cincomilquini = '5,500€',
  seismil = '6,000€',
}

export enum PrecioMinimoVenta {
  cualquiera = 'Cualquiera',
  cien = '10,000€',
  veintemil = '20,000€',
  treintamil = '30,000€',
  cuarentamil = '40,000€',
  cincuentamil = '50,000€',
  sesentamil = '60,000€',
  setentamil = '70,000€',
  ochentamil = '80,000€',
  noventamil = '90,000€',
  cienmil = '100,000€',
  cientoveintemil = '120,000€',
  cientocincuentamil = '150,000€',
  cientoochentamil = '180,000€',
  doscientosmil = '200,000€',
  doscientosveintemil = '220,000€',
  doscientoscincuentamil = '250,000€',
  doscientosochentamil = '280,000€',
  trescientosmil = '300,000€',
  trescientoscincuentamil = '350,000€',
  trescientosochentamil = '380,000€',
  cuatrocientosmil = '400,000€',
  cuantrocientoscincuentamil = '450,000€',
  quinientosmil = '500,000€',
  quinientoscincuentamil = '550,000€',
  seiscientosmil = '600,000€',
  seiscientoscincuentamil = '650,000€',
  setecientosmil = '700,000€',
  ochocientosmil = '800,000€',
  novecientosmil = '900,000€',
  unmillon = '1,000,000€',
}

export enum PrecioMaximoVenta {
  cualquiera = 'Cualquiera',
  treintamil = '30,000€',
  cincuentamil = '50,000€',
  ochentamil = '80,000€',
  cientoveintemil = '120,000€',
  cientocincuentamil = '150,000€',
  doscientosmil = '200,000€',
  doscientoscincuentamil = '250,000€',
  trescientosmil = '300,000€',
  trescientoscincuentamil = '350,000€',
  cuatrocientosmil = '400,000€',
  cuantrocientoscincuentamil = '450,000€',
  quinientosmil = '500,000€',
  seiscientosmil = '600,000€',
  setecientosmil = '700,000€',
  ochocientosmil = '800,000€',
  novecientosmil = '900,000€',
  unmillon = '1,000,000€',
  dosmillones = '2,000,000€',
  tresmillones = '3,000,000€',
  cuatromillones = '4,000,000€',
  cincomillones = '5,000,000€',
  seismillones = '6,000,000€',
  sietemillones = '7,000,000€',
  ochomillones = '8,000,000€',
  nuevemillones = '9,000,000€',
  diezmillones = '10,000,000€',
}

export enum PrecioMaximoVentaEdificio {
  cien = '10,000€',
  veintemil = '20,000€',
  treintamil = '30,000€',
  cuarentamil = '40,000€',
  cincuentamil = '50,000€',
  sesentamil = '60,000€',
  setentamil = '70,000€',
  ochentamil = '80,000€',
  noventamil = '90,000€',
  cienmil = '100,000€',
  cientoveintemil = '120,000€',
  cientocincuentamil = '150,000€',
  cientoochentamil = '180,000€',
  doscientosmil = '200,000€',
  doscientosveintemil = '220,000€',
  doscientoscincuentamil = '250,000€',
  doscientosochentamil = '280,000€',
  trescientosmil = '300,000€',
  trescientoscincuentamil = '350,000€',
  trescientosochentamil = '380,000€',
  cuatrocientosmil = '400,000€',
  cuantrocientoscincuentamil = '450,000€',
  quinientosmil = '500,000€',
  quinientoscincuentamil = '550,000€',
  seiscientosmil = '600,000€',
  seiscientoscincuentamil = '650,000€',
  setecientosmil = '700,000€',
  ochocientosmil = '800,000€',
  novecientosmil = '900,000€',
  unmillon = '1,000,000€',
  cincomillones = '5,000,000€',
  diezmillones = '10,000,000€',
  veintemillones = '20,000,000€',
  cincuentamillones = '50,000,000€'
}

export enum Superficie {
  cualquiera = 'Cualquiera',
  cincuentaM = '50m²',
  ochentaM = '80m²',
  cientoveinteM = '120m²',
  cientocincuentaM = '150m²',
  cientoochentaM = '180m²',
  doscientosM = '200m²',
  doscincuenM = '250m²',
  trescienM = '300m²',
  trescincuen = '350m²',
  cuantrocien = '400m²',
  quinientosM = '500m²',
  seiscientosM = '600m²',
  setecientosM = '700m²',
  ochocientosM = '800m²',
  novencientos = '900m²',
  unkM = '1,000m²',
  doskM = '2,000m²',
}

export enum DisposicionOficina {
  plantaBaja = 'Planta baja',
  entresuelo = 'Entresuelo',
  piso = 'Piso',
  edificio = 'Edificio',
  sotano = 'Sótano',
  otro = 'Otro'
}

export enum DisposicionNegocio {
  aPieDecalle = 'A pie de calle',
  entresuelo = 'Entresuelo',
  piso = 'Piso',
  centroComercial = 'Centro comercial',
  sotano = 'Sótano',
  otro = 'Otro'
}

export enum Climatizacion{
  difusores='Difusores',
  rejillas='Rejillas',
  difusoresYrejillas='Difusores y rejillas',
  split='Split',
  preinstalacion='Preinstalación',
  ninguna='Ninguna'
}

export enum DistribucionOficina {
  diafana = 'Diáfana',
  tabicada = 'Tabicada',
  mamparas = 'Mamparas',
  tabiquesMoviles = 'Tabiques móviles'
}