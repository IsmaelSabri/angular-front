export class Property{
// venta y alquiler
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
// coste y variaciones
precioInicial:string;
descuento:number;
precioFinal:string;

duracion:string;
descripcion:string;
aireAcondicionado:boolean;
calefaccion:boolean;
panelesSolares:boolean;
armariosEmpotrados:string;
terraza:string;
parquet:string;
balcon:string;
antiguedad:string; // año de construcción
garage:string;
metroMasProximo:string;
autobusMasProximo:string;
estado:string; // nuevo, usado, a-reformar
jardin:string;
piscina:string;
trastero:string;
vistasDespejadas:boolean;
distanciaAlMar:string;
bajoOplantabaja:string;
instalacionesDiscapacitados:boolean;
nuevoProyecto:string;
creador:string;
fechaCreacion:Date;
numeroVisitas:string;

// foto
imageUrl:string;
imageName:string;
imageId:string;

// video -> vip
video:string;

// alquiler
mascotas:string;
fianza:string; // tamaño y meses
disponibilidad:string;
estanciaMinima:string;

// compartir
sepuedeFumar:string;
seadmitenParejas:string;
seadmitenMenoresdeedad:string;
perfil:string; // chico, chica, ambos
habitantesActualmente:string;
propietarioviveEnlacasa:string;
ambiente:string; // estudiantes, funcionarios, grupo social...
internet:boolean;
gastos:string; // incluidos, no incluidos luz etc

// si el usuario lo desea
numero:string; // del portal, del bajo
puerta:string;
comentario:string;
calle:string; // avendida, plaza...

}