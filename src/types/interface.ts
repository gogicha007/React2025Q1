export interface ICountry {
  code: string;
  name: string;
}

export interface IData {
  name: string;
  age: number;
  email: string;
  password1: string;
  password2: string;
  gender: string;
  TC: boolean;
  file: File | string | null;
  country: string;
}

export interface IValidatedData {
  data: IData;
}
export interface IError {
  error: {
    name: string;
    age: string;
    email: string;
    password1: string;
    password2: string;
    TC: string;
    file: string;
  };
}
