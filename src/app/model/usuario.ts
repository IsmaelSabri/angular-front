export class Usuario {
             public usuarioId: string;
             public nombre: string;
             public primerApellido: string;
             public username: string;
             public email: string;
             public fechaDeUltimoAcceso: Date;
             public mostrarFechaDeUltimoAcceso: Date;
             public fechaRegistro: Date;
             public fotoPerfilUrl: string;
             public active: boolean;
             public notLocked: boolean;
             public rol: string;
             public lastView: string;
             public authorities: [];
           
             constructor() {
               this.usuarioId = '';
               this.nombre = '';
               this.primerApellido = '';
               this.username = '';
               this.email = '';
               this.fechaDeUltimoAcceso = null;
               this.mostrarFechaDeUltimoAcceso = null;
               this.fechaRegistro = null;
               this.fotoPerfilUrl = '';
               this.active = false;
               this.notLocked = false;
               this.rol = '';
               this.authorities = [];
               this.lastView='';
             }
           
           }
           