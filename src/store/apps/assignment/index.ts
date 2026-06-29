
// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'

// ** Employee Service Imports
import { AssignmentServices, CategoryService } from 'src/services'


// // ** Types Imports
// import { ApiParams } from 'src/types/api'
// import { IAssignment, } from 'src/types/apps/assignment'
// import { Redux } from 'src/store'

// // ** helper & utils
// import objectToQueryString from 'src/@core/helper/objectToQueryString'

// interface InitialState {
//     entities: IAssignment[] | [];
//     entity: IAssignment | {};
//     total: number;
//     params: ApiParams;
//     allData: never[];
//     status: 'pending' | 'error' | 'success' | 'idle';
// }

// export const AssignmmentQueryAction = createAsyncThunk(
//     'assignment/query',
//     async (query: ApiParams['query'], { getState, dispatch }: Redux) => {
//         dispatch(appAssignmentsSlice.actions.handleQuery(query))
//         dispatch(fetchAssignmentsAction({}))
//         return query;
//     }
// )

// // ** Fetch Client
// export const fetchAssignmentAction = createAsyncThunk(
//     'assignment/fetchAssignment',
//     async (id: string) => {
//         return { id }
//     }
// )

// // ** Fetch Clients
// export const fetchAssignmentsAction = createAsyncThunk(
//     'assignment/fetchAssignments',
//     async (params: ApiParams, { getState, dispatch }: Redux) => {
//         const query = getState().assignment.params.query;
//         // const { query } = params;

//         const response = await categoryService.search({ query: objectToQueryString(query) });
//         return response.data
//     }
// )

// // ** Add Client
// export const addAssignmmentAction = createAsyncThunk(
//     'assignment/addClient',
//     async (data: { [key: string]: number | string }, { getState, dispatch }: Redux) => {
//         dispatch(appAssignmentsSlice.actions.handleStatus('pending'))
//         try {
//             const response = await AssignmentServices.add(data);
//             dispatch(fetchAssignmentsAction(getState().user.params))
//             toast.success("Assignment Added succesfully!")
//             dispatch(appAssignmentsSlice.actions.handleStatus('success'))
//             return response.data;
//         } catch (error: any) {
//             toast.error(error.response.data.message || "Something went wrong!")
//             dispatch(appAssignmentsSlice.actions.handleStatus('error'))
//             return error.response.data;
//         }
//     }
// )

// // ** Add Client
// export const updateAssignmentAction = createAsyncThunk(
//     'assignment/updateAssignment',
//     async ({ id, data }: { id: string, data: IAssignment }, { getState, dispatch }: Redux) => {
//         dispatch(appAssignmentsSlice.actions.handleStatus('pending'))
//         try {
//             const response = await AssignmentServices.update(id, data);
//             dispatch(fetchAssignmentsAction(getState().user.params))
//             toast.success("Assignment updated succesfully!")
//             dispatch(appAssignmentsSlice.actions.handleStatus('success'))
//             return response.data;
//         } catch (error: any) {
//             toast.error(error.response.data.message || "Something went wrong!")
//             dispatch(appAssignmentsSlice.actions.handleStatus('error'))
//             return error.response.data;
//         }
//     }
// )

// // ** Delete Client
// export const deleteAssignmentAction = createAsyncThunk(
//     'assignment/deleteEmployee',
//     async (id: string, { getState, dispatch }: Redux) => {
//         dispatch(appAssignmentsSlice.actions.handleStatus('pending'))
//         try {
//             const response = await AssignmentServices.delete(id);
//             dispatch(fetchAssignmentsAction(getState().user.params))
//             toast.success("Assignment deleted succesfully!")
//             dispatch(appAssignmentsSlice.actions.handleStatus('success'))
//             return response.data
//         } catch (error: any) {
//             toast.error(error.response.data.message || "Something went wrong!")
//             dispatch(appAssignmentsSlice.actions.handleStatus('error'))
//             return error.response.data;
//         }
//     }
// )

// // @ts-ignore
// export const appAssignmentsSlice = createSlice({
//     name: 'assignment',
//     initialState: {
//         assignments: [],
//         assignment: {},
//         total: 0,
//         params: {},
//         allData: []
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
//         builder.addCase(fetchAssignmentsAction.fulfilled, (state, action) => {
//             const { data } = action.payload;

//             state.assignments = data.categories || []
//             state.total = data.categories.length || 0
//         })
//         builder.addCase(fetchAssignmentAction.fulfilled, (state, action) => {
//             const { id } = action.payload;
//             state.assignment = state.categories.find((assignment: any) => assignment.id === id) || {};
//         })
//     }
// })

// export default appAssignmentsSlice.reducer
