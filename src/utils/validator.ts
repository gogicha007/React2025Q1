import { IData } from '../types/interface';

export const validator = (data: IData) => {
  const errors = {
    name: '',
    age: '',
    email: '',
    password1: '',
    password2: '',
    TC: '',
    file: '',
  };
  for (const [key, value] of Object.entries(data)) {
    switch (key) {
      case 'name':
        if (value.length === 0) return { ...errors, [key]: 'Name is required' };
        if (!/^[A-Z]/.test(value))
          return { ...errors, [key]: 'First letter of name must be uppercase' };
        break;
      case 'age':
        if (value < 0) return { ...errors, [key]: 'No negative values' };
        break;
      case 'email':
        if (!/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(value))
          return { ...errors, [key]: 'Invalid email' };
        break;
      case 'password1':
        if (
          !/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*(),.?":{}|<>]).{4,}$/.test(
            value
          )
        )
          return {
            ...errors,
            [key]:
              'Password to contain: 1 number, 1 uppercased letter, 1 lowercased letter, 1 special character',
          };
        break;
      case 'password2':
        if (value !== data.password1)
          return { ...errors, [key]: 'Passwords do not match' };
        break;
      case 'TC':
        if (!value)
          return {
            ...errors,
            [key]: 'You must accept the terms and conditions',
          };
        break;
      case 'file':
        if (value === undefined)
          return { ...errors, [key]: 'You must upload a file' };
        if (value.size < 2000)
          return {
            ...errors,
            [key]: 'File size must be greater than 2000 bytes',
          };
        if (!['image/jpeg', 'image/png'].includes(value.type))
          return { ...errors, [key]: 'File type must be either jpeg or png' };
        break;
      default:
        return null;
    }
  }
};
