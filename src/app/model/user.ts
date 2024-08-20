import { Home } from "./home";

export class User {
  public id: string;
  public userId: string;
  public firstname: string;
  public lastname: string;
  public username: string;
  public password: string;
  public phone: string;
  public email: string;
  public domains: Home[] = [];
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
  public likePreferences: string[] = [];
  public likePreferencesAsString: string;
  public brandImage: BrandImage;
  public profileImage: ProfileImage;
  public company: string;
  public reviews: Review[] = [];
  public reviewsAsString: string;
  public isPro: boolean = false;
  public status: string = '';
  public chatsOpened: User[] = [];
  public chatsOpenedAsString: string = '';
}

export class Review {
  commment: string;
  rating: number;
  userId: string;
}

export class BrandImage {
  imageUrl: string;
  imageName: string;
  imageId: string;
  imageDeleteUrl: string;
}

export class ProfileImage {
  imageUrl: string;
  imageName: string;
  imageId: string;
  imageDeleteUrl: string;
}
