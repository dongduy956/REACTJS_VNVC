import { createSlice } from '@reduxjs/toolkit';
export default createSlice({
    name: 'manager-header',
    initialState: {
        searchText: '',
    },
    reducers: {
        setSearch: (state, action) => {
            state.searchText = action.payload;
        },
    },
});
