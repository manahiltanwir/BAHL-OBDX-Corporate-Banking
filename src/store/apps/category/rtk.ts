import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { ICategory } from 'src/types/apps/category'

// Define a service using a base URL and expected endpoints
export const pokemonApi = createApi({
    reducerPath: 'categoryApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://192.168.0.45:5001/api/v1/' }),
    endpoints: (builder) => ({
        getPokemonByName: builder.query<ICategory, string>({
            query: (name) => `category`,
        }),
    }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetPokemonByNameQuery } = pokemonApi