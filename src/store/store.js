import { configureStore } from '@reduxjs/toolkit';

import { SliceAuth, SliceManagerHeader } from './Slice';

const store = configureStore({
    reducer: {
        managerHeader: SliceManagerHeader.reducer,
        auth: SliceAuth.reducer,
    },
});
export default store;
