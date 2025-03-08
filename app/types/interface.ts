export interface IResponse {
  info: IRespInfo;
  results: ICharacterDetails[];
}

export type IQueryError = {
  status: number;
  data: {
    error: string;
  };
};
export function isIResponse(data: IResponse | IQueryError): data is IResponse {
  return (data as IResponse).info !== undefined;
}

export function isIQueryError(
  data: IResponse | IQueryError
): data is IQueryError {
  return (data as IQueryError).data !== undefined;
}

export interface IRespInfo {
  count: number;
  pages: number;
  next: string;
  prev: string | null;
}

export interface ICharacterDetails {
  id: number;
  name: string;
  status: string;
  species?: string;
  gender?: string;
  image?: string;
  origin?: {
    name?: string;
  };
  location?: {
    name?: string;
  };
}
export function isICharacterDetails(
  data: ICharacterDetails | IQueryError
): data is ICharacterDetails {
  return (data as ICharacterDetails).name !== undefined;
}

export function isICharacterError(
  data: ICharacterDetails | IQueryError
): data is IQueryError {
  return (data as IQueryError).data !== undefined;
}

export type ICharacterFilters = {
  page?: number;
  status?: string;
  id?: string;
};

export type IParamsType = {
  page: number;
  status: string;
};
