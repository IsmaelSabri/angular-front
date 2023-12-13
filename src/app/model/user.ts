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
  public profileImageAsString: string;
  public brandImageAsString: string;
  public color: string;
  public isactive: boolean;
  public isnotLocked: boolean;
  public role: string;
  public token: string;
  public refreshToken: string;
  public authorities: [];
  public likePreferences: string[];
  public LikePreferencesAsString: string;
  public brandImage: BrandImage;
  public profileImage: ProfileImage;
}

export interface BrandImage {
  imageUrl: string;
  imageName: string;
  imageId: string;
  imageDeleteUrl: string;
}

export interface ProfileImage {
  imageUrl: string;
  imageName: string;
  imageId: string;
  imageDeleteUrl: string;
}
