import { PermissionsAndroid, Platform } from 'react-native';
import RNFS from 'react-native-fs'; 
import socket from '../utils/server';
import emojiSocket from '../utils/emoji_server';

const requestCameraPermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "카메라 권한",
          message: "사진 촬영을 위해 카메라 권한이 필요합니다.",
          buttonNeutral: "나중에",
          buttonNegative: "거부",
          buttonPositive: "허용"
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  }
  return true;
};

const requestStoragePermission = async () => {
  if (Platform.OS === 'android') {
    try {
      if (Platform.Version >= 33) {
        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        );
        return result === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
        );
        return result === PermissionsAndroid.RESULTS.GRANTED;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  }
  return true;
};

const imageService = {
  uploadImage: async (imageData, userId) => {
    console.log('[ImageService] uploadImage imageData : ', imageData);
    try {
      // 권한 체크
        const cameraPermission = await requestCameraPermission();
        const storagePermission = await requestStoragePermission();

        if (!cameraPermission || !storagePermission) {
            throw new Error('필요한 권한이 거부되었습니다.');
        }
        const base64Image = await RNFS.readFile(imageData.uri, 'base64');
        // 이미지 데이터 객체 생성
        const imagePayload = {
            uri: `data:image/jpeg;base64,${base64Image}`,
            type: imageData.type || 'image/jpeg',
            fileName: imageData.fileName || 'image.jpg',
            userId: userId
        };
        
        console.log('[ImageService] Sending image data');

        return new Promise((resolve, reject) => {
            emojiSocket.emit('upload_image', imagePayload, (response) => {
                console.log('[ImageService] Server response:', response);
                
                if (response.success) {
                resolve({
                    filePath: response.filePath,
                    fileName: response.fileName
                });
                } else {
                    reject(new Error(response.error || '이미지 업로드 실패'));
                }
            });
        });

    } catch (error) {
      console.error('[ImageService] uploadImage error:', error);
      throw error;
    }
  }
};

export default imageService;