export interface IResponse {
  info: IRespInfo;
  results: ICharacterDetails[];
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

export type IQueryError = {
  status: number;
  data: {
    error: string;
  };
};

export type ICharacterFilters = {
  page?: number;
  status?: string;
  id?: string;
};

export type IParamsType = {
  page: number;
  status: string;
};
