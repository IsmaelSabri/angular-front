export class Home{
    viviendaId:string;
    lat:Number;
    lng:Number;
    ciudad:string;
    cp:string;
    habitaciones:string;
    aseos:string;
    superficie:string;
    condicion:string;
    tipo:string;
    ascensor:boolean;
    precioInicial:string;
    descuento:string;
    precioFinal:string;
    duracion:string;
    descripcion:string;
    aireAcondicionado:boolean;
    calefaccion:boolean;
    panelesSolares:string;
    armariosEmpotrados:string;
    terraza:string;
    parquet:boolean;
    balcon:string;
    antiguedad:string;
    garage:string;
    metroMasProximo:string;
    autobusMasProximo:string;
    estado:string; // nuevo, usado, a-reformar
    jardin:string;
    piscina:string;
    trastero:boolean;
    vistasDespejadas:string;
    distanciaAlMar:string;
    bajoOplantabaja:string;
    instalacionesDiscapacitados:boolean;
    nuevoProyecto:string; // ENUM
    creador:string;
    fechaCreacion:string;
    numeroVisitas:string;
    
    // foto
    imageUrl:string;
    imageName:string;
    imageId:string;
    foto:File;
    // video -> vip
    video:string; // url

    // alquiler
    mascotas:boolean;
    fianza:number;
    disponibilidad:string;
    estanciaMinima:number; // meses

    // compartir
    sepuedeFumar:boolean;
    seadmitenParejas:boolean;
    seadmitenMenoresdeedad:boolean;
    perfilCompartir:string; // chico, chica, ambos ENUM
    habitantesActualmente:string;
    propietarioviveEnlacasa:boolean;
    ambiente:string; // estudiantes, funcionarios, grupo social...
    internet:boolean;
    gastos:string; // incluidos, no incluidos luz etc

    // si el usuario lo desea
    numero:string; // del portal, del bajo
    puerta:string;
    piso:string;
    comentario:string;
    calle:string; // avendida, plaza...
    valoraciones:number;
    starRatingAverage:number;

}