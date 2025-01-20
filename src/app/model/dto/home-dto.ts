import { Featured } from "../home";

export class HomeDto {
    id: any;
    viviendaId: any;
    lat: any;
    lng: any;
    calle: any;
    numero: any;
    ciudad: any;
    cp: any;
    habitaciones: any;
    aseos: any;
    aseoEnsuite: any;
    superficie: any;
    condicion: any;
    tipo: any;
    precioInicial: any;
    precioFinal: any;
    precioAlquiler: any;
    precioAlquilerInicial: any;
    duracion: any;
    descripcion: any;
    armariosEmpotrados: any = false;
    terraza: any = false;
    piscinaPrivada: any = false;
    parquet: any = false;
    antiguedad: any;
    garage: any;
    estado: any;
    distanciaAlMar: any;
    nombreCreador: any;
    fechaCreacion: any;
    fechaUltimaModificacion: any;
    comentario: any;
    destacar: any;
    colorDestacar: any = '#3a3b3c';
    destacado = new Featured();
    underPriceMarket: any;
    underPriceMarketAsString: any;

    model: any;
    imagesAsString: any;
    // images = new Array<HomeImage>(); // variable local
    video: any;
    amueblado: any = false;
    direccionAproximada: any = false;
    gasNatural: any = false;
    universidades: any;
    metro: any;
    bus: any;
    tipoDeVia: any;
    distrito: any;
    orientacion: any;
    vendido: any = false;
    balcon: any = false;
    aireAcondicionado: any = false;
    calefaccion: any = false;
    plantaMasAlta: any;
    politicaPrivacidad: any = false;
    idCreador: any;
    cabinaHidromasaje: any = false;
    ascensor: any = false;
    piso: any;
    proColor: any;
    proImageAsString: any;
    mascotas: any;
    fianza: any;
    disponibilidad: any;
    estanciaMinima: any;
    likeMe4everAsString: any;

    // House profile
    alarma: any = false;
    recepcion24_7: any = false;
    videoVigilancia: any = false;
    alarmaIncendios: any = false;
    extintores: any = false;
    panelesSolares: any = false;
    eficienciaEnergetica: any = false
    colegios: any;
    supermercados: any;
    consumo: any;
    emisiones: any;
    aerotermia: any = false;
    ventilacionCruzada: any = false;
    dobleAcristalamiento: any = false;
    energyCertAsString: any;
    // energyCert = new HomeImage; // variable local en home
    generadorEmergencia: any = false;
    aeropuerto: any;
    vistasDespejadas: any;
    instalacionesDiscapacitados: any = false;
    trastero: any = false;
    golf: any = false;
    gym: any = false;
    jacuzzi: any = false;

    // Flat profile
    bajoOplantabaja: any = false
    // Gated community ameninites
    jardin: any = false
    piscinaComp: any = false
    columpios: any = false
    tenis: any = false
    padel: any = false
    sauna: any = false
    zonaDeOcio: any = false
    videoPortero: any = false

    // Room profile
    // We accept:
    sepuedeFumar: any = false;
    seadmitenParejas: any = false;
    seadmitenMenoresdeedad: any = false;
    seadmitenMochileros: any = false;
    seadmitenJubilados: any = false;
    seadmiteLGTBI: any = false;
    perfilCompartir: any; // chico, chica, ambos ENUM
    habitantesActualmente: any;
    propietarioviveEnlacasa: any = false;
    ambiente: any; // estudiantes, funcionarios, grupo social...
    gastos: any; // incluidos, no incluidos, luz aparte etc

    // NewProject profile
    /*planificacion: any;
    inicioDeVentas: any;
    inicioConstruccion: any;
    mudandose: any;*/
    nombreProyecto: any;
    estadoConstruccion: any; // terminado, en curso
    tipos: any; // tipos
    porcentajeTerminado: any = 0; //progreso obra
    porcentajeVendido: any = 0;
    habitacionesDesde: any = 0;
    habitacionesHasta: any = 0;
    superficieDesde: any = 0;
    superficieHasta: any = 0;
    finDeObra: any = 0;
    alturas: any;
    totalViviendasConstruidas: any;

    // HolidayRent profile
    numeroRegistro: any;
    personas: any;
    camas: any;
    toallas: any;
    sabanas: any;
    tv: any;
    tvCable: any;
    microondas: any;
    lavavajillas: any;
    lavadora: any;
    secadora: any;
    cafetera: any;
    plancha: any;
    cuna: any;
    secadorDePelo: any;
    wifi: any;
    primeraLineaPlaya: any;
    chimenea: any;
    mueblesJardin: any;
    barbacoa: any;

    valoracionesUsuarios: any;
    valoraciones: any;
    starRatingAverage: any;

    prototipo: any; // model:'other'; prototipo:oficina||garage||trastero||......

    // Oficina profile
    aparcamientos: any = false;
    climatizacion: string;
    disposicion: string;  // a pie de calle, entresuelo, piso, centro comercial, sótano... 
    distribucion: string;  // diáfana, tabicada, mamparas, tabicada, tabiques móviles...
    controlDeAccesoPersonal: any = false;
    controlDeAccesoVehiculos: any = false;
    falsoTecho: any = false;
    sueloTecnico: any = false;
    uso: any = false;
    /*  para el form desde la herencia:
    *   -aireAcondicionado
    *   -amueblado -> con mobiliario
    *   -recepción24_7 -> seguridad 24/7
    *   -ascensor
    */

    // Edificio profile
    edificioExclusivoOficinas: any = false;

    //  Negocio Home
    nave: any = false;
    local: any = false;
    actividadComercial: string;
    haceEsquina: any = false;
    salidaDeHumos: any = false;
    traspaso: any = false;
    conAlmacen: any = false;
    conOficina: any = false;
    lucesSalidaEmergencia: any = false;
    escaparates: any;

    //  Suelo profile
    urbano: any = false;
    urbanizable: any = false;
    noUrbanizable: any = false;

    //  Garage profile
    plazaParaCoche: any = false;
    plazaParaMoto: any = false;

    //  trastero va implícito en la superficie
}

export class SingleDtoHomeRequest {
    id: any;
    model: any;
}