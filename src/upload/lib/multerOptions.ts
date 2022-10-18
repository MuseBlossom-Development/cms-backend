import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';

export const multerOptions = {
  fileFilter: (request, file: Express.Multer.File, callback) => {
    if (file.mimetype.match(/\/(wav|mp3|wave)$/)) {
      // 형식은 wav, mp3, png만 허용합니다.
      callback(null, true);
    } else {
      callback({ status: 400, error: '지원하지 않는 파일 형식입니다.' }, false);
    }
  },

  storage: diskStorage({
    destination: (request, file, callback) => {
      const uploadPath = 'original';

      if (!existsSync(uploadPath)) {
        // original 폴더가 존재하지 않을시, 생성합니다.
        mkdirSync(uploadPath);
      }

      callback(null, uploadPath);
    },

    filename: (request, file, callback) => {
      // console.log('file name:', request.body);
      callback(null, request.body.titles);
    },
  }),
};

export const createURL = (title: string): string => {
  // const serverAddress: string = process.env.SERVER_ADDRESS;

  // 파일이 저장되는 경로: 서버주소/original 폴더
  // 위의 조건에 따라 파일의 경로를 생성해줍니다.
  return `../original/${title}`;
};
