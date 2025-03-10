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
  gender?: string;
  TC: boolean;
  file: File | null;
  country?: string;
}
