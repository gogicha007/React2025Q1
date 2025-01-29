export interface IFResponse {
  info: IFRespInfo;
  results: IFCharacter[];
}

export interface IFRespInfo {
  count: number;
  pages: number;
  next: string;
  prev: string | null;
}

export interface IFCharacter {
  id: number;
  name: string;
  status: string;
  species: string;
  gender: string;
  image: string;
  origin: {
    name: string;
  };
  location: {
    name: string;
  };
}

export type CharacterFilters = {
  page?: number;
  status?: string;
};
