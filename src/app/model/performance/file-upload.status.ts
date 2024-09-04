export class FileUploadStatus {
  public status: string;
  public percentage: number;
  public total: number;
  public current: number;

  constructor() {
    this.status = '';
    this.percentage = 0;
    this.total = 0;
    this.current = 0;
  }
}
