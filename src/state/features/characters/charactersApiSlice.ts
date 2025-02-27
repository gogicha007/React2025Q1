import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ICharacterDetails, IResponse } from '../../../types/interface';

export const characterApiSlice = createApi({
  reducerPath: 'charachters',
  tagTypes: ['Characters'], 
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://rickandmortyapi.com/api/character',
  }),
  endpoints: (builder) => {
    return {
      getList: builder.query<IResponse, { page: number; status?: string }>({
        query: ({ page, status }) =>{
          console.log("RTK Query Called:", { page, status });
          return `?page=${page}${status ? `&status=${status}` : ''}`
        },
        providesTags: ['Characters'],
        keepUnusedDataFor: 30
      }),
      getDetails: builder.query<ICharacterDetails, { id: string }>({
        query: ({ id }) => `/${id}`,
        providesTags: ['Characters'],
      }),
    };
  },
});

export const { useGetListQuery, useGetDetailsQuery } = characterApiSlice;
