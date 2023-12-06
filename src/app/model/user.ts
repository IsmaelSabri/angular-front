export class User {
  public id: string;
  public userId: string;
  public firstname: string;
  public lastname: string;
  public username: string;
  public password: string;
  public phone: string;
  public email: string;
  public domains: string;
  public lastaccessDate: Date;
  public showLastaccessDate: Date;
  public dateRegistry: Date;
  public fotoPerfilUrl: string;
  public color: string;
  public isactive: boolean;
  public isnotLocked: boolean;
  public role: string;
  public token: string;
  public refreshToken: string;
  public authorities: [];
}
