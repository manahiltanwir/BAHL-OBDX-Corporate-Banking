import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { IUserManagement } from 'src/types/apps/userManagement'

// Define a service using a base URL and expected endpoints
export const pokemonApi = createApi({
    reducerPath: 'userManagementApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://192.168.0.45:5001/api/v1/' }),
    endpoints: (builder) => ({
        getPokemonByName: builder.query<IUserManagement, string>({
            query: (name) => `userManagement`,
        }),
    }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetPokemonByNameQuery } = pokemonApi