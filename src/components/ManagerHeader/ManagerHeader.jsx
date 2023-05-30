import { FileAddTwoTone } from '@ant-design/icons';
import { Button, Input } from 'antd';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';

import { configRoutes } from '~/configs';
import { searchSelector } from '~/store';
import { SliceManagerHeader } from '~/store/Slice';
import { roles } from '~/utils';
import ImportExcel from '../ImportExcel';

const { Search } = Input;
const ManagerHeader = ({ titleImport = '', noAdd = false, typeImport = '', setTable, pageName = '' }) => {
    const [openImport, setOpenImport] = useState(false);
    const { isPermissionCreate, isPermissionView } = roles;
    const dispatch = useDispatch();
    const searchText = useSelector(searchSelector);
    const { pathname } = useLocation();
    const handleValueChange = (e) => {
        const value = e.target.value;
        if (value.charAt(0) === ' ') return;
        dispatch(SliceManagerHeader.actions.setSearch(e.target.value));
    };
    return (
        <div className="mb-4 mt-4 flex flex-wrap justify-between items-center">
            {noAdd || (pageName && !isPermissionCreate(pageName)) ? (
                <div></div>
            ) : (
                <Link className=" md:ml-0 ml-auto md:mb-0 mb-5" to={pathname + configRoutes.add}>
                    <Button
                        className="flex justify-center items-center md:mt-0 mt-2"
                        type="primary"
                        icon={<FileAddTwoTone />}
                    >
                        Thêm
                    </Button>
                </Link>
            )}
            {pageName && isPermissionView(pageName) ? (
                <Search
                    className="md:basis-2/6 basis-full"
                    placeholder="Tìm kiếm từ khoá"
                    value={searchText}
                    onChange={handleValueChange}
                    enterButton
                />
            ) : (
                <div></div>
            )}
            {typeImport && pageName && isPermissionCreate(pageName) ? (
                <>
                    <Button
                        className="flex justify-center items-center md:mt-0 mt-2"
                        type="primary"
                        icon={<FileAddTwoTone />}
                        onClick={() => setOpenImport(true)}
                    >
                        Nhập excel
                    </Button>
                    <ImportExcel
                        setTable={setTable}
                        title={titleImport}
                        type={typeImport}
                        open={openImport}
                        setOpen={setOpenImport}
                    />
                </>
            ) : (
                <div></div>
            )}
        </div>
    );
};

export default ManagerHeader;
