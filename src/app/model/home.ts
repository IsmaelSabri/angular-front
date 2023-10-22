export class Home {
  viviendaId: string;
  lat: Number;
  lng: Number;
  calle: string; // avendida, plaza...
  numero: string; // portal
  ciudad: string;
  cp: string;
  habitaciones: string;
  aseos: string;
  aseoEnsuite: boolean;
  superficie: string;
  condicion: string;
  tipo: string;
  precioInicial: string;
  descuento: string;
  precioFinal: string;
  precioM2: string;
  duracion: string;
  descripcion: string;
  armariosEmpotrados: string;
  terraza: boolean;
  piscinaPrivada: boolean;
  parquet: boolean;
  antiguedad: string;
  garage: string;
  estado: string; // nuevo, usado, a-reformar
  distanciaAlMar: string;
  creador: string;
  fechaCreacion: string;
  fechaUltimaModificacion: string;
  numeroVisitas: string;
  comentario: string;
  destacar: string;
  model:string;
  // foto
  imageUrl: string;
  imageName: string;
  imageId: string;
  foto: File;
  // video -> vip
  video: string; // url
  amueblado:boolean;
  streetView:string;
  direccionAproximada:boolean;
  gasNatural:boolean;

  // House profile
  alarma: boolean;
  recepcion24_7: boolean;
  videoVigilancia: boolean;
  alarmaIncendios: boolean;
  extintores: boolean;
  aireAcondicionado: boolean;
  calefaccion: boolean;
  panelesSolares: boolean;
  eficienciaEnergetica: boolean;
  colegios: string;
  universidades:string;
  supermercados:string;
  metro: string;
  bus: string;
  consumo:string;
  emisiones:string;

  // Flat profile
  ascensor: boolean;
  trastero: boolean;
  vistasDespejadas: string;
  bajoOplantabaja: string;
  instalacionesDiscapacitados: boolean;
  puerta: string;
  piso: string;
  balcon: string;
  videoPortero: string;
  plantaMasAlta:boolean;
  // Gated community ameninites
  jardin: boolean;
  piscinaComp: boolean;
  columpios: boolean;
  gym: boolean;
  tenis: boolean;
  padel: boolean;
  sauna: boolean;
  jacuzzi: boolean;
  golf: boolean;

  // Home4rent profile
  mascotas: boolean;
  fianza: number;
  disponibilidad: string;
  estanciaMinima: number; // meses

  // Room profile
  // We accept:
  sepuedeFumar: boolean;
  seadmitenParejas: boolean;
  seadmitenMenoresdeedad: boolean;
  seadmitenMochileros: boolean;
  seadmitenJubilados: boolean;
  seadmiteLGTBI: boolean;
  perfilCompartir: string; // chico, chica, ambos ENUM
  habitantesActualmente: string;
  propietarioviveEnlacasa: boolean;
  ambiente: string; // estudiantes, funcionarios, grupo social...
  gastos: string; // incluidos, no incluidos, luz aparte etc

  // NewProject profile
  planificacion: string;
  inicioDeVentas: string;
  inicioConstruccion: string;
  mudandose: string;

  // HolidayRent profile
  numeroRegistro: string;
  personas: string;
  camas: string;
  toallas: boolean;
  sabanas: boolean;
  tv: boolean;
  tvCable: boolean;
  microondas: boolean;
  lavavajillas: boolean;
  lavadora: boolean;
  secadora: boolean;
  cafetera: boolean;
  plancha: boolean;
  cuna: boolean;
  secadorDePelo: boolean;
  wifi: boolean;
  primeraLineaPlaya: boolean;
  chimenea: boolean;
  mueblesJardin: boolean;
  barbacoa:boolean;

  valoracionesUsuarios: string;
  valoraciones: number;
  starRatingAverage: number;
}

export interface Colegio{
  lat:string;
  lng:string;
  nombre:string;
  ensenyanza:string;
  institucion:string;
  web:string;
  distancia:string;
  tiempo:string;
}

export interface Universidad{
  lat:string;
  lng:string;
  nombre:string;
  rama:string;
  institucion:string;
  web:string
  distancia:string;
  tiempo:string;
}

export interface Bus{
  lat:string;
  lng:string;
  lineas:string;
  parada:string;
  distancia:string;
  tiempo:string;
}

export interface Metro{
  lat:string;
  lng:string;
  lineas:string;
  parada:string;
  distancia:string;
  tiempo:string;
}

export interface Supermercado{
  lat:string;
  lng:string;
  nombre:string;
  distancia:string;
  tiempo:string;
}

export interface Aeropuerto{
  lat:string;
  lng:string;
  nombre:string;
  distancia:string;
  tiempo:string;
}

export interface Beach{
  lat:string;
  lng:string;
  nombre:string;
  distancia:string;
  tiempo:string;
}

var COLEGIO: Colegio[] = [
  {lat:'',lng:'', nombre: '', ensenyanza: '', institucion: '', web: 'H',distancia:'',tiempo:''},
  {lat:'',lng:'', nombre: '', ensenyanza: '', institucion: '', web: 'H',distancia:'',tiempo:''},
  {lat:'',lng:'', nombre: '', ensenyanza: '', institucion: '', web: 'H',distancia:'',tiempo:''},
  {lat:'',lng:'', nombre: '', ensenyanza: '', institucion: '', web: 'H',distancia:'',tiempo:''},
  {lat:'',lng:'', nombre: '', ensenyanza: '', institucion: '', web: 'H',distancia:'',tiempo:''},
  {lat:'',lng:'', nombre: '', ensenyanza: '', institucion: '', web: 'H',distancia:'',tiempo:''},

];