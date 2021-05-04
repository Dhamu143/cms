import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
// import * as S3 from 'aws-sdk/clients/s3';

// const bucket = new S3({
//   accessKeyId: 'environment.s3bucketaccessKeyId',
//   secretAccessKey: environment.s3secretAccessKey,
//   region: 'us-east-1'
// });

@Injectable()
export class ImageGenerateService {
  constructor() {}

  // createRandomId() {
  //   return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
  //     var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
  //     return v.toString(16);
  //   });
  // }

  // uploadfile = async (file, FolderName) => {
  //   const params = {
  //     Bucket: environment.s3BucketName,
  //     Key: FolderName + this.createRandomId() + '.' + file['type'].substring(6),
  //     Body: file
  //   };
  //   return await bucket.upload(params).promise().then(function (data) {
  //     return data;
  //   }).catch(function (err) {
  //     return err;
  //   });
  // }

  // uploadBase64 = async (file, FolderName) => {
  //   const type = file.split(';')[0].split('/')[1];
  //   var buf = Buffer.from(file.replace(/^data:image\/\w+;base64,/, ""), 'base64');
  //   const data = {
  //     Bucket: environment.s3BucketName,
  //     Key:  FolderName + this.createRandomId() + '.' + type,
  //     Body: buf,
  //     ContentEncoding: 'base64',
  //   };
  //   return await bucket.upload(data).promise().then(function (data) {
  //     return data;
  //   }).catch(function (err) {
  //     return err;
  //   });
  // }

  // getFolderData = async (item) => {
  //   const params = {
  //     Bucket: environment.s3BucketName,
  //     Delimiter: '/',
  //     Prefix: 'VibrantImages/' + item + '/',
  //   }
  //   return await bucket.listObjects(params).promise().then(function (data) {
  //     return data.Contents;
  //   }).catch(function (err) {
  //     return err;
  //   });
  // }
}
