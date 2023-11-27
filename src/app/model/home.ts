export class Home {
  id:string;
  viviendaId: string;
  lat: Number;
  lng: Number;
  calle: string; // avendida, plaza...
  numero: string; // portal
  ciudad: string;
  cp: string;
  habitaciones: string;
  aseos: string;
  aseoEnsuite: boolean = false;
  superficie: string;
  condicion: string;
  tipo: string;
  precioInicial: string;
  descuento: string;
  precioFinal: string;
  precioM2: string;
  precioAlquiler:string;
  duracion: string;
  descripcion: string;
  armariosEmpotrados: boolean = false;
  terraza: boolean = false;
  piscinaPrivada: boolean = false;
  parquet: boolean = false;
  antiguedad: string;
  garage: string;
  estado: string; // nuevo, usado, a-reformar
  distanciaAlMar: string;
  creador: string; // userId
  nombreCreador:string; // username
  fechaCreacion: string;
  fechaUltimaModificacion: string;
  numeroVisitas: string;
  comentario: string;
  destacar: string;
  model:string;
  imagesAsString:string
  images=new Array<HomeImage>();
  video: string;
  amueblado:boolean = false;
  streetView:string;
  direccionAproximada:boolean = false;
  gasNatural:boolean = false;
  universidades:string;
  metro: string;
  bus: string;
  tipoDeVia:string;
  distrito:string;
  orientacion:string;

  // House profile
  alarma: boolean = false;
  recepcion24_7: boolean = false;
  videoVigilancia: boolean = false;
  alarmaIncendios: boolean = false;
  extintores: boolean = false;
  aireAcondicionado: boolean = false;
  calefaccion: boolean = false;
  panelesSolares: boolean = false;
  eficienciaEnergetica: boolean = false;
  colegios: string;
  supermercados:string;
  consumo:string;
  emisiones:string;
  generadorEmergencia:boolean = false;
  aeropuerto:string;


  // Flat profile
  ascensor: boolean = false;
  trastero: boolean = false;
  vistasDespejadas: string;
  bajoOplantabaja: boolean = false;
  instalacionesDiscapacitados: boolean = false;
  puerta: string;
  piso: string;
  balcon: boolean = false;
  videoPortero: boolean = false;
  plantaMasAlta:boolean = false;
  // Gated community ameninites
  jardin: boolean = false;
  piscinaComp: boolean = false;
  columpios: boolean = false;
  gym: boolean = false;
  tenis: boolean = false;
  padel: boolean = false;
  sauna: boolean = false;
  jacuzzi: boolean = false;
  golf: boolean = false;
  zonaDeOcio:boolean = false

  // Home4rent profile
  mascotas: string;
  fianza:string;
  disponibilidad: string;
  estanciaMinima: string; // meses

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
  planificacion: string;
  inicioDeVentas: string;
  inicioConstruccion: string;
  mudandose: string;

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
  barbacoa:boolean = false;

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

export interface HomeImage{
    imageUrl: string;
    imageName: string;
    imageId: string;
    imageDeleteUrl:string;
}
