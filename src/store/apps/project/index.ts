

// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'

// ** Employee Service Imports
import { ProjectServices } from 'src/services'

// ** Types Imports
import { IProject } from 'src/types/apps/project'

// ** helper & utils
import objectToQueryString from 'src/@core/helper/objectToQueryString'

import { Redux } from 'src/store'
// import { ApiParams } from 'src/types/api'

// interface InitialState {
//     projects: IProject[] | [];
//     project: IProject | {};
//     total: number;
//     params: ApiParams;
//     allData: never[];
//     status: 'pending' | 'error' | 'success' | 'idle';
// }

// export const ProjectQueryAction = createAsyncThunk(
//     'project/query',
//     async (query: ApiParams['query'], { getState, dispatch }: Redux) => {
//         dispatch(appProjectsSlice.actions.handleQuery(query))
//         dispatch(fetchProjectsAction({}))
//         return query;
//     }
// )

// export const fetchProjectAction = createAsyncThunk(
//     'project/fetchProject',
//     async (id: string) => {
//         return { id }
//     }
// )

// export const fetchProjectsAction = createAsyncThunk(
//     'project/fetchProjects',
//     async (params: ApiParams, { getState, dispatch }: Redux) => {
//         const query = getState().project.params.query;
//         // const { query } = params;

//         const response = await ProjectServices.getAll({ query: objectToQueryString(query) });
//         return response.data
//     }
// )

// export const addProjectAction = createAsyncThunk(
//     'project/addProject',
//     async (data: { [key: string]: number | string }, { getState, dispatch }: Redux) => {
//         dispatch(appProjectsSlice.actions.handleStatus('pending'))
//         try {
//             const response = await ProjectServices.add(data);
//             const query = getState().project.params.query;
//             dispatch(fetchProjectsAction({ query }))
//             toast.success("Project Added succesfully!")
//             dispatch(appProjectsSlice.actions.handleStatus('success'))
//             return response.data;
//         } catch (error: any) {
//             toast.error(error.response.data.message || "Something went wrong!")
//             dispatch(appProjectsSlice.actions.handleStatus('error'))
//             return error.response.data;
//         }
//     }
// )

// export const updateProjectAction = createAsyncThunk(
//     'project/updateProject',
//     async ({ id, data }: { id: string, data: IProject }, { getState, dispatch }: Redux) => {
//         dispatch(appProjectsSlice.actions.handleStatus('pending'))
//         try {
//             const response = await ProjectServices.update(id, data);
//             const query = getState().project.params.query;
//             dispatch(fetchProjectsAction({ query }))
//             toast.success("Project updated succesfully!")
//             dispatch(appProjectsSlice.actions.handleStatus('success'))
//             return response.data;
//         } catch (error: any) {
//             toast.error(error.response.data.message || "Something went wrong!")
//             dispatch(appProjectsSlice.actions.handleStatus('error'))
//             return error.response.data;
//         }
//     }
// )

// export const deleteProjectAction = createAsyncThunk(
//     'project/deleteProject',
//     async (id: string, { getState, dispatch }: Redux) => {
//         dispatch(appProjectsSlice.actions.handleStatus('pending'))
//         try {
//             const response = await ProjectServices.delete(id);
//             const query = getState().project.params.query;
//             dispatch(fetchProjectsAction({ query }))
//             toast.success("Project deleted succesfully!")
//             dispatch(appProjectsSlice.actions.handleStatus('success'))
//             return response.data
//         } catch (error: any) {
//             toast.error(error.response.data.message || "Something went wrong!")
//             dispatch(appProjectsSlice.actions.handleStatus('error'))
//             return error.response.data;
//         }
//     }
// )

// // @ts-ignore
// export const appProjectsSlice = createSlice({
//     name: 'project',
//     initialState: {
//         projects: [],
//         project: {},
//         total: 0,
//         params: {},
//         allData: [],
//     } as InitialState,
//     reducers: {
//         handleStatus: (state, action) => {
//             state.status = action.payload;
//         },
//         handleQuery: (state, action) => {
//             // @ts-ignore
//             state.params.query = { ...state.params.query, ...action.payload };
//         }
//     },
//     extraReducers: builder => {
//         builder.addCase(fetchProjectsAction.fulfilled, (state, action) => {
//             const { data } = action.payload;

//             state.projects = data.projects || []
//             state.total = data.projects?.length || 0
//         })
//         builder.addCase(fetchProjectAction.fulfilled, (state, action) => {
//             const { id } = action.payload;
//             state.project = state.projects.find((projects: any) => projects.id === id) || {};
//         })
//     }
// })

// export default appProjectsSlice.reducer
