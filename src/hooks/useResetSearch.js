import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { SliceManagerHeader } from '~/store/Slice';

const useResetSearch = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        return () => dispatch(SliceManagerHeader.actions.setSearch(''));
    }, []);
};

export default useResetSearch;
