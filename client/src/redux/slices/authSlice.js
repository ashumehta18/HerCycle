import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../utils/api'

const tokenFromStorage = localStorage.getItem('token')
const userFromStorage = localStorage.getItem('user')

export const signupThunk = createAsyncThunk('auth/signup', async (payload, { rejectWithValue })=>{
  try{
    const { data } = await api.post('/auth/register', payload)
    return data
  }catch(e){
    return rejectWithValue(e.response?.data?.message || e.message)
  }
})

export const loginThunk = createAsyncThunk('auth/login', async (payload, { rejectWithValue })=>{
  try{
    const { data } = await api.post('/auth/login', payload)
    return data
  }catch(e){
    return rejectWithValue(e.response?.data?.message || e.message)
  }
})

const slice = createSlice({
  name:'auth',
  initialState:{ token: tokenFromStorage || null, user: userFromStorage? JSON.parse(userFromStorage): null, status:'idle', error:null },
  reducers:{
    logout(state){ state.token=null; state.user=null; localStorage.removeItem('token'); localStorage.removeItem('user') }
  },
  extraReducers: (b)=>{
    const fulfilled = (state, action)=>{ state.status='succeeded'; state.token=action.payload.token; state.user={ _id: action.payload._id, name: action.payload.name, email: action.payload.email }; localStorage.setItem('token', state.token); localStorage.setItem('user', JSON.stringify(state.user)) }
    const pending = (state)=>{ state.status='loading'; state.error=null }
    const rejected = (state, action)=>{ state.status='failed'; state.error=action.payload || 'Request failed' }
    b.addCase(signupThunk.pending, pending).addCase(signupThunk.fulfilled, fulfilled).addCase(signupThunk.rejected, rejected)
    b.addCase(loginThunk.pending, pending).addCase(loginThunk.fulfilled, fulfilled).addCase(loginThunk.rejected, rejected)
  }
})

export const { logout } = slice.actions
export default slice.reducer
