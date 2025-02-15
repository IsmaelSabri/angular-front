export class Home {
  id: string;
  viviendaId: string;
  lat: number;
  lng: number;
  calle: string; // avendida, plaza...
  numero: string; // portal
  ciudad: string;
  cp: string;
  habitaciones: number;
  aseos: number;
  aseoEnsuite: number;
  superficie: number;
  condicion: string;
  tipo: string;
  precioInicial: number;
  precioFinal: number;
  precioAlquiler: number;
  precioAlquilerInicial: number;
  duracion: string;
  descripcion: string;
  armariosEmpotrados: boolean = false;
  terraza: boolean = false;
  piscinaPrivada: boolean = false;
  parquet: boolean = false;
  antiguedad: number;
  garage: number;
  estado: string; // nuevo, usado, a-reformar
  distanciaAlMar: string;
  beach = new Array<Beach>();
  nombreCreador: string; // username
  fechaCreacion: string;
  fechaUltimaModificacion: string;
  comentario: string;
  destacar: string;
  colorDestacar: any = '#3a3b3c';
  // servicios usuario minoritario
  destacado = new Featured();
  destacadoAsString: string;
  underPriceMarket = new UnderPriceMarket();
  underPriceMarketAsString: string;
  model: string;
  imagesAsString: string;
  images = new Array<HomeImage>();
  video: string;
  amueblado: boolean = false;
  direccionAproximada: boolean = false;
  gasNatural: boolean = false;
  universidades: string;
  metro: string;
  bus: string;
  tipoDeVia: string;
  distrito: string;
  orientacion: string;
  vendido: boolean = false;
  balcon: boolean = false;
  aireAcondicionado: boolean = false;
  calefaccion: boolean = false;
  plantaMasAlta: string;
  politicaPrivacidad: boolean = false;
  idCreador: string;
  cabinaHidromasaje: boolean = false;
  ascensor: boolean = false;
  piso: string;
  proColor: any;
  proImage: HomeImage;
  proImageAsString: string;
  mascotas: string = '';
  fianza: string = '';
  disponibilidad: string;
  estanciaMinima: string = ''; // meses
  likeMeForever: string[] = [];
  likeMeForeverAsString: string;
  piscinaComp: boolean = false;
  vistasDespejadas: string;
  instalacionesDiscapacitados: boolean = false;
  trastero: boolean = false;
  panelesSolares: boolean = false;
  jacuzzi: boolean = false;
  visitas = new Array<Visitas>();
  prototipo: string; // prototipo:vivienda||oficina||garage||trastero||......
  colorTextoDestacar: any = '#ccff00';

  // House profile
  alarma: boolean = false;
  recepcion24_7: boolean = false;
  videoVigilancia: boolean = false;
  alarmaIncendios: boolean = false;
  extintores: boolean = false;
  eficienciaEnergetica: boolean = false;
  colegios: string;
  supermercados: string;
  consumo: string;
  emisiones: string;
  aerotermia: boolean = false;
  ventilacionCruzada: boolean = false;
  dobleAcristalamiento: boolean = false;
  energyCertAsString: string;
  energyCert = new HomeImage;
  generadorEmergencia: boolean = false;
  aeropuerto: string;
  golf: boolean = false;
  gym: boolean = false;


  // Flat profile

  bajoOplantabaja: boolean = false;
  // Gated community ameninites
  jardin: boolean = false;
  columpios: boolean = false;
  tenis: boolean = false;
  padel: boolean = false;
  sauna: boolean = false;
  zonaDeOcio: boolean = false;
  videoPortero: boolean = false;



  // Room profile
  // We accept:
  sepuedeFumar: boolean = false;
  seadmitenParejas: boolean = false;
  seadmitenMenoresdeedad: boolean = false;
  seadmitenMochileros: boolean = false;
  seadmitenJubilados: boolean = false;
  seadmiteLGTBI: boolean = false;
  perfilCompartir: string; // chico, chica, ambos ENUM
  habitantesActualmente: string;
  propietarioviveEnlacasa: boolean = false;
  ambiente: string; // estudiantes, funcionarios, grupo social...
  gastos: string; // incluidos, no incluidos, luz aparte etc

  // NewProject profile
  /*planificacion: string;
  inicioDeVentas: string;
  inicioConstruccion: string;
  mudandose: string;*/
  nombreProyecto: string;
  estadoConstruccion: string; // terminado, en curso
  tipos: string; // tipos
  porcentajeTerminado: number; //progreso construcción
  porcentajeVendido: number;
  habitacionesDesde: number = 0;
  habitacionesHasta: number = 0;
  superficieDesde: number = 0;
  superficieHasta: number = 0;
  finDeObra: number;
  alturas: number;
  totalViviendasConstruidas: number;

  // HolidayRent profile
  numeroRegistro: string;
  personas: string;
  camas: string;
  toallas: boolean = false;
  sabanas: boolean = false;
  tv: boolean = false;
  tvCable: boolean = false;
  microondas: boolean = false;
  lavavajillas: boolean = false;
  lavadora: boolean = false;
  secadora: boolean = false;
  cafetera: boolean = false;
  plancha: boolean = false;
  cuna: boolean = false;
  secadorDePelo: boolean = false;
  wifi: boolean = false;
  primeraLineaPlaya: boolean = false;
  chimenea: boolean = false;
  mueblesJardin: boolean = false;
  barbacoa: boolean = false;

  valoracionesUsuarios: string;
  valoraciones: number;
  starRatingAverage: number;

  // Oficina profile
  aparcamientos: number = 0;
  climatizacion: string;
  disposicion: string; // a pie de calle, entresuelo, piso, centro comercial, sótano... 
  distribucion: string; // diáfana, tabicada, mamparas, tabicada, tabiques móviles...
  controlDeAccesoPersonal: boolean = false;
  controlDeAccesoVehiculos: boolean = false;
  falsoTecho: boolean = false;
  sueloTecnico: boolean = false;
  uso: boolean = false;
  /*  para el form desde la herencia:
  *   -aireAcondicionado
  *   -amueblado
  *   -recepción24_7
  *   -ascensores
  */

  // Edificio profile
  edificioExclusivoOficinas: boolean = false;
  ascensores: number = 0;
  inquilino: boolean = false;
  usoResidencial: boolean = false;
  usoComercial: boolean = false;
  usoOficinas: boolean = false;
  usoHotelero: boolean = false;
  edificioExento: boolean = false;

  //  Negocio Home
  nave: boolean = false;
  local: boolean = false;
  actividadComercial: string;
  haceEsquina: boolean = false;
  salidaDeHumos: boolean = false;
  traspaso: boolean = false;
  conAlmacen: boolean = false;
  conOficina: boolean = false;
  lucesSalidaEmergencia: boolean = false;
  escaparates: number = 0;

  //  Suelo profile
  urbano: boolean = false;
  urbanizable: boolean = false;
  noUrbanizable: boolean = false;

  //  Garage profile
  plazaParaCoche: boolean = false;
  plazaParaMoto: boolean = false;

  //  trastero va implícito en la superficie
}

export class Featured {
  featured: boolean = false;
  featuredFrom = new Date('2020-10-10');
  featuredTo = new Date('2020-10-10');
  featuredTimes: number = 0;
}

export class UnderPriceMarket {
  lessPrice: boolean = false;
  lessPriceFrom = new Date('2020-10-10');
  lessPriceTo = new Date('2020-10-10');
  lessPriceTimes: number = 0;
}

export class Visitas {
  count: number;
  date: string;
  userId: string = '';
}

export interface Colegio {
  lat: string;
  lng: string;
  nombre: string;
  ensenyanza: string;
  institucion: string;
  web: string;
  distancia: string;
  tiempo: string;
}

export interface Universidad {
  lat: string;
  lng: string;
  nombre: string;
  rama: string;
  institucion: string;
  web: string;
  distancia: string;
  tiempo: string;
}

export interface Bus {
  lat: string;
  lng: string;
  lineas: string;
  parada: string;
  distancia: string;
  tiempo: string;
}

export interface Metro {
  lat: string;
  lng: string;
  lineas: string;
  parada: string;
  distancia: string;
  tiempo: string;
}

export interface Supermercado {
  lat: string;
  lng: string;
  nombre: string;
  distancia: string;
  tiempo: string;
}

export interface Aeropuerto {
  lat: string;
  lng: string;
  nombre: string;
  distancia: string;
  tiempo: string;
}

export interface Beach {
  lat: string;
  lng: string;
  nombre: string;
  distancia: string;
  tiempo: string;
}

export class HomeImage {
  imageUrl: string;
  imageName: string;
  imageId: string;
  imageDeleteUrl: string;
}

export class HomeFilterRequest {
  // vivienda
  condicion: string;
  ciudad: string;
  tipo: string[] = [];
  estado: string[] = [];
  habitaciones: string;
  aseos: string;
  aseoEnsuite: string;
  garage: boolean;
  precioVentaMin: number;
  precioVentaMax: number;
  precioAlquilerMin: number;
  precioAlquilerMax: number;
  superficieMin: number;
  superficieMax: number;
  vistas: string[] = [];
  aireAcondicionado: boolean;
  balcon: boolean;
  calefaccion: boolean;
  cabinaHidromasaje: boolean;
  amueblado: boolean;
  ascensor: boolean;
  inmuebleAccesible: boolean; // para filtrar, intalacionesDiscapacitados en Home
  panelesSolares: boolean;
  jacuzzi: boolean;
  piscinaPrivada: boolean;
  piscinaComp: boolean;
  trastero: boolean;
  keywords: string = '';

  // Oficina
  // amueblado: boolean; está en herencia
  // aireAcondicionado: hace referencia a -climatización-
  aparcamientos: boolean;
  controlDeAccesoPersonal: boolean;
  controlDeAccesoVehiculos: boolean;
  videoVigilancia: boolean; // esta en herencia pero sale de -House-
  recepcion24_7: boolean;
  edificioExclusivoOficina: boolean;

  // Negocio HomeFilterRequest
  nave: boolean;
  local: boolean;
  haceEsquina: boolean;
  salidaDeHumos: boolean;
  traspaso: boolean;

  // Suelo
  urbano: boolean;
  urbanizable: boolean;
  noUrbanizable: boolean;

  // Garage
  plazaParaCoche: boolean;
  plazaParaMoto: boolean;

  // Trastero

  // Edificio
}
