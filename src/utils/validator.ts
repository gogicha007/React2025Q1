import { IData } from '../types/interface';
import { convertFileToBase64 } from '../utils/convertFile';

export const validator = async (data: IData) => {
  const errors = {
    name: '',
    age: '',
    email: '',
    password1: '',
    password2: '',
    TC: '',
    file: '',
  };
  let base64File: string | null = null;
  for (const [key, value] of Object.entries(data)) {
    switch (key) {
      case 'name':
        if (value.length === 0) {
          errors.name = 'Name is required';
          break;
        }
        if (!/^[A-Z]/.test(value)) {
          errors.name = 'First letter of name must be uppercase';
          break;
        }
        break;
      case 'age':
        if (value < 0) {
          errors.age = 'No negative values';
          break;
        }
        break;
      case 'email':
        if (!/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(value)) {
          errors.email = 'Invalid email';
          break;
        }
        break;
      case 'password1':
        if (
          !/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*(),.?":{}|<>]).{4,}$/.test(
            value
          )
        ) {
          errors.password1 =
            'Password to contain: 1 number, 1 uppercased letter, 1 lowercased letter, 1 special character';
          break;
        }
        break;
      case 'password2':
        if (value !== data.password1) {
          errors.password2 = 'Passwords do not match';
          break;
        }
        break;
      case 'TC':
        if (!value) {
          errors.TC = 'You must accept the T&C';
          break;
        }
        break;
      case 'file':
        if (value === undefined) {
          errors.file = 'You must upload a file';
          break;
        }
        if (value.size < 2000) {
          errors.file = 'File size must be greater than 2000 bytes';
          break;
        }
        if (!['image/jpeg', 'image/png'].includes(value.type)) {
          errors.file = 'File type must be either jpeg or png';
          break;
        }

        try {
          base64File = await convertFileToBase64(value);
        } catch (error) {
          console.log(error);
          errors.file = 'Error converting file to base64';
          break;
        }
        break;
    }
  }
  if (Object.values(errors).some((error) => error !== '')) {
    return { error: errors };
  }
  const result = { data: { ...data, file: base64File } };
  return result;
};
