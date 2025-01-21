import React from 'react';
import { useAtom } from 'jotai';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import imageService from '../service/ImageService';
import { userAtom } from '../store/LoginStore';

const ImageUploader = ({ onImageSent }) => {
const [user] = useAtom(userAtom);
console.log('[ImageUploader] user : ', user);
  const imagePickerOptions = {
    mediaType: 'photo',
    quality: 0.8,
    maxWidth: 1024,
    maxHeight: 1024,
  };

  const handleImagePick = async (type) => {
    try {
        console.log('[ImageUploader] user : ', user);
        // user null 체크
        if (!user) {
            Alert.alert('오류', '로그인이 필요합니다.');
            return;
        }
        const result = type === 'camera' 
            ? await launchCamera(imagePickerOptions)
            : await launchImageLibrary(imagePickerOptions);

        if (result.assets && result.assets[0]) {
            const imageData = result.assets[0];
            const imageUrl = await imageService.uploadImage(imageData, user.name);
            onImageSent(imageUrl);
        }
    } catch (error) {
      Alert.alert(
        '오류',
        error.message || '이미지 업로드에 실패했습니다.',
        [{ text: '확인' }]
      );
      console.error('Image upload error:', error);
    }
  };

  const showImagePickerOptions = () => {
    Alert.alert(
      '이미지 선택',
      '이미지를 선택하거나 촬영하세요',
      [
        {
          text: '카메라로 촬영',
          onPress: () => handleImagePick('camera'),
        },
        {
          text: '갤러리에서 선택',
          onPress: () => handleImagePick('gallery'),
        },
        {
          text: '취소',
          style: 'cancel',
        },
      ],
    );
  };

  return (
    <TouchableOpacity 
      onPress={showImagePickerOptions}
      style={styles.button}
    >
      <Text style={styles.buttonText}>↑</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  buttonText: {
    fontSize: 24,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  }
});

export default ImageUploader;