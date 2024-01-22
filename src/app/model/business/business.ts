export class Edificio {
  ascensores: number;
  usoOficinas: boolean;
  controlAccesos: boolean;
  puertaSeguridad: boolean;
  extintores: boolean;
  piso: string;
}

export class Local extends Edificio {
  licencia: boolean;
  actividad: string;
  titulo: string;
  descripcion: string;
  precioInicial: string;
  precioFinal: string;
}
