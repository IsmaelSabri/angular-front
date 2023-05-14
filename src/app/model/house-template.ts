export class HouseTemplate{
    viviendaId:string;
    lat:string;
    lng:string;
    ciudad:string;
    cp:string;
    habitaciones:string;
    aseos:string;
    superficie:string;
    condicion:string;
    tipo:string;
    ascensor:string;
    precioInicial:string;
    descuento:string;
    precioFinal:string;
    duracion:string;
    descripcion:string;
    aireAcondicionado:string;
    calefaccion:string;
    panelesSolares:string;
    armariosEmpotrados:string;
    terraza:string;
    parquet:string;
    balcon:string;
    antiguedad:string;
    garage:string;
    metroMasProximo:string;
    autobusMasProximo:string;
    estado:string; // nuevo, usado, a-reformar
    jardin:string;
    piscina:string;
    trastero:string;
    vistasDespejadas:string;
    distanciaAlMar:string;
    bajoOplantabaja:string;
    instalacionesDiscapacitados:string;
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
    mascotas:string;
    fianza:string;
    disponibilidad:string;
    estanciaMinima:string; // meses

    // compartir
    sepuedeFumar:string;
    seadmitenParejas:string;
    seadmitenMenoresdeedad:string;
    perfilCompartir:string; // chico, chica, ambos ENUM
    habitantesActualmente:string;
    propietarioviveEnlacasa:string;
    ambiente:string; // estudiantes, funcionarios, grupo social...
    internet:string;
    gastos:string; // incluidos, no incluidos luz etc

    // si el usuario lo desea
    numero:string; // del portal, del bajo
    puerta:string;
    comentario:string;
    calle:string; // avendida, plaza...

}