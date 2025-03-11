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
        if (value.length === 0)
          return { error: { ...errors, [key]: 'Name is required' } };
        if (!/^[A-Z]/.test(value))
          return {
            error: {
              ...errors,
              [key]: 'First letter of name must be uppercase',
            },
          };
        break;
      case 'age':
        if (value < 0)
          return { error: { ...errors, [key]: 'No negative values' } };
        break;
      case 'email':
        if (!/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(value))
          return { error: { ...errors, [key]: 'Invalid email' } };
        break;
      case 'password1':
        if (
          !/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*(),.?":{}|<>]).{4,}$/.test(
            value
          )
        )
          return {
            error: {
              ...errors,
              [key]:
                'Password to contain: 1 number, 1 uppercased letter, 1 lowercased letter, 1 special character',
            },
          };
        break;
      case 'password2':
        if (value !== data.password1)
          return { error: { ...errors, [key]: 'Passwords do not match' } };
        break;
      case 'TC':
        if (!value)
          return {
            error: {
              ...errors,
              [key]: 'You must accept the terms and conditions',
            },
          };
        break;
      case 'file':
        if (value === undefined)
          return { error: { ...errors, [key]: 'You must upload a file' } };
        if (value.size < 2000)
          return {
            error: {
              ...errors,
              [key]: 'File size must be greater than 2000 bytes',
            },
          };
        if (!['image/jpeg', 'image/png'].includes(value.type))
          return {
            error: { ...errors, [key]: 'File type must be either jpeg or png' },
          };

        try {
          base64File = await convertFileToBase64(value);
        } catch (error) {
          console.log(error);
          return {
            error: { ...errors, [key]: 'Error converting file to base64' },
          };
        }
        break;
      default: {
        const result = { data: { ...data, file: base64File } };
        console.log(result);
        return result;
      }
    }
  }
};
