export class FileUploadDto {
  originalname: string;
  mimetype: string;
  buffer: Buffer;

  constructor(originalname: string, mimetype: string, buffer: Buffer) {
    this.originalname = originalname;
    this.mimetype = mimetype;
    this.buffer = buffer;
  }
}
