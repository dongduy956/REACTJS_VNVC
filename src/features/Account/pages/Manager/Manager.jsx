import { DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import { Badge, notification, Pagination, Popconfirm, Table, Tooltip, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Head from '~/components/Head';

import ManagerHeader from '~/components/ManagerHeader';
import { configRoutes, configTitle } from '~/configs';
import { useAuth, useDebounce, useResetSearch } from '~/hooks';
import { customerService, loginService, staffService } from '~/services';
import { searchSelector } from '~/store';
import { defaultAccount, namePages, pageSizeOptions } from '~/constraints';
import { useLocation, useNavigate } from 'react-router-dom';
import { arrayLibrary, roles } from '~/utils';
const Manager = () => {
    //check đăng nhập
    useAuth();
    //reset lại text search
    useResetSearch();
    //check quyền
    const { isPermissionEdit, isPermissionDelete, isPermissionView } = roles;
    const namePage = namePages.Login.name;
    const history = useNavigate();
    const { search } = useLocation();
    //text search
    const searchText = useSelector(searchSelector);
    const debounced = useDebounce(searchText, 500);
    //data filter
    const [filterCustomers, setFilterCustomers] = useState([]);
    const [filterStaffs, setFilterStaffs] = useState([]);
    //data table
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    //phân trang
    const [pagination, setPagination] = useState({
        current: search ? Number(search.split(configRoutes.page)[1]) : 1,
    });
    //cột table
    const columns = [
        {
            title: 'No.',
            dataIndex: 'no',
            sorter: {
                compare: (a, b) => a.no - b.no,
            },
        },
        {
            title: 'Tên tài khoản',
            dataIndex: 'username',
            sorter: {
                compare: (a, b) => a.username > b.username,
            },
        },
        {
            title: 'Xác thực',
            dataIndex: 'isValidate',
            sorter: {
                compare: (a, b) => {
                    const aIsValidate = a.isValidate ? 'Đã xác thực' : 'Chưa xác thực';
                    const bIsValidate = b.isValidate ? 'Đã xác thực' : 'Chưa xác thực';
                    return aIsValidate > bIsValidate;
                },
            },

            render: (_, record) => (
                <>
                    {record.isValidate ? (
                        <span>
                            <Badge className="mr-2" status="success" />
                            Đã xác thực
                        </span>
                    ) : (
                        <Typography.Link onClick={() => handleUpdateValidate(record.id)}>
                            <Badge className="mr-2" status="error" />
                            Chưa xác thực
                        </Typography.Link>
                    )}
                </>
            ),
            filters: [
                { text: 'Đã xác thực', value: true },
                { text: 'Chưa xác thực', value: false },
            ],
            onFilter: (value, record) => record.isValidate === value,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isLock',
            sorter: {
                compare: (a, b) => {
                    const aIsLock = a.isLock ? 'Khoá' : 'Hoạt động';
                    const bIsLock = b.isLock ? 'Khoá' : 'Hoạt động';

                    return aIsLock > bIsLock;
                },
            },
            render: (_, record) => (
                <>
                    {Object.values(defaultAccount).every(
                        (x) => x.toLowerCase().trim() !== record.username.trim().toLowerCase(),
                    ) ? (
                        <Typography.Link onClick={() => handleUpdateLock(record.id)}>
                            <span>
                                <Badge className="mr-2" status={!record.isLock ? 'success' : 'error'} />
                                {record.isLock ? 'Khoá' : 'Hoạt động'}
                            </span>
                        </Typography.Link>
                    ) : (
                        <span>
                            <Badge className="mr-2" status={!record.isLock ? 'success' : 'error'} />
                            {record.isLock ? 'Khoá' : 'Hoạt động'}
                        </span>
                    )}
                </>
            ),
            filters: [
                { text: 'Khoá', value: true },
                { text: 'Hoạt động', value: false },
            ],
            onFilter: (value, record) => record.isLock === value,
        },
        {
            title: 'Tên nhân viên',
            dataIndex: 'staffName',
            sorter: {
                compare: (a, b) => a.staffName > b.staffName,
            },
            filters:
                filterStaffs.length > 0
                    ? filterStaffs.reduce(
                          (arr, item) =>
                              arr.some((x) => x.value === item.staffName.toLowerCase().trim())
                                  ? arr
                                  : [
                                        ...arr,
                                        {
                                            text: item.staffName,
                                            value: item.staffName.toLowerCase().trim(),
                                        },
                                    ],
                          [],
                      )
                    : [],
            onFilter: (value, record) => record.staffName?.toLowerCase().trim() === value,
        },
        {
            title: 'Tên khách hàng',
            dataIndex: 'customerName',
            sorter: {
                compare: (a, b) => a.customerName > b.customerName,
            },
            filters:
                filterCustomers.length > 0
                    ? filterCustomers.reduce(
                          (arr, item) =>
                              arr.some((x) => x.value === (item.firstName + ' ' + item.lastName).toLowerCase().trim())
                                  ? arr
                                  : [
                                        ...arr,
                                        {
                                            text: item.firstName + ' ' + item.lastName,
                                            value: (item.firstName + ' ' + item.lastName).toLowerCase().trim(),
                                        },
                                    ],
                          [],
                      )
                    : [],
            onFilter: (value, record) => record.customerName?.toLowerCase().trim() === value,
        },
    ];
    //kiểm tra quyền để hiện nút xoá sửa
    if (isPermissionEdit(namePage) || isPermissionDelete(namePage))
        columns.unshift({
            title: 'Thao tác',
            dataIndex: 'operation',
            render: (_, record) =>
                data.length > 0 ? (
                    <>
                        <div className="flex justify-center">
                            {Object.values(defaultAccount).every(
                                (x) => x.toLowerCase().trim() !== record.username.trim().toLowerCase(),
                            ) &&
                                isPermissionDelete(namePage) && (
                                    <Tooltip
                                        placement="bottom"
                                        title={`Xoá ${record.username.toLowerCase()}`}
                                        color="cyan"
                                    >
                                        <Typography.Link className="mr-2">
                                            <Popconfirm
                                                title="Bạn chắc chắn xoá?"
                                                onConfirm={() => handleDelete(record.id)}
                                            >
                                                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                                <DeleteOutlined />
                                            </Popconfirm>
                                        </Typography.Link>
                                    </Tooltip>
                                )}
                            {isPermissionEdit(namePage) && (
                                <Tooltip
                                    placement="bottom"
                                    title={'Reset password ' + record.username.toLowerCase().trim()}
                                    color="cyan"
                                >
                                    <Typography.Link
                                        onClick={() => {
                                            handleResetPassword(record.id);
                                        }}
                                        className="hover:text-cyan-400 cursor-pointer"
                                    >
                                        <ReloadOutlined />
                                    </Typography.Link>
                                </Tooltip>
                            )}
                        </div>
                    </>
                ) : null,
        });
    //lấy data (chỉ chạy 1 lần duy nhất (lần load trang))
    useEffect(() => {
        (async () => {
            setLoading(true);
            //lấy data khách haàng
            const customers = (await customerService.getAllCustomers()).data;
            setFilterCustomers(customers);
            //lấy data nhân viên
            const staffs = (await staffService.getAllStaffs()).data;
            setFilterStaffs(staffs);
            setLoading(false);
        })();
    }, []);
    // chạy khi biến data thay đổi và lần đầu
    useEffect(() => {
        //kiểm tra có đánh số thứ tưự hay chưa hoặc chưa xếp tăng dần thì đánh lại stt và set lại data
        if (!data.every((x) => x.no) || !arrayLibrary.isGrow(data))
            setData((pre) => pre.map((x, i) => ({ ...x, no: i + 1 })));
    }, [data]);
    //khi load trang hoặc khi search
    const fetchData = (params = {}) => {
        if (searchText && !params.searchText) params.searchText = searchText;
        setLoading(true);
        (async () => {
            let res;
            //search
            if (params.searchText)
                res = await loginService.searchLogins(
                    params.searchText,
                    params.pagination.current,
                    params.pagination.pageSize,
                );
            //load trang , qua trang khác, thay đổi sl trang
            else res = await loginService.getLogins(params.pagination.current, params.pagination.pageSize);
            setLoading(false);
            setData(res.data.map((item) => ({ ...item, key: item.id })));
            setPagination({
                ...params.pagination,
                pageSize: params.pagination.pageSize ? params.pagination.pageSize : res.pageSize,
                total: res.totalItems,
            });
        })();
    };
    //xoá 1 tử
    const handleDelete = (id) => {
        (async () => {
            setLoading(true);
            const res = await loginService.deleteLogin(id);
            if (res.data)
                notification.success({
                    message: 'Thành công',
                    description: res.messages[0],
                    duration: 3,
                });
            else
                notification.error({
                    message: 'Lỗi',
                    description: res.messages[0],
                    duration: 3,
                });
            setLoading(false);
            fetchData({
                pagination,
                delete: true,
                searchText: debounced,
            });
        })();
    };
    const handleResetPassword = (id) => {
        (async () => {
            setLoading(true);
            const res = await loginService.resetPassword(id);
            if (res.isSuccess)
                notification.success({
                    message: 'Thành công',
                    description: res.messages[0],
                    duration: 3,
                });
            else
                notification.error({
                    message: 'Lỗi',
                    description: res.messages[0],
                    duration: 3,
                });
            setLoading(false);
        })();
    };
    const handleUpdateValidate = (id) => {
        (async () => {
            setLoading(true);
            const res = await loginService.updateLoginValidate(id);
            if (res.data)
                notification.success({
                    message: 'Thành công',
                    description: res.messages[0],
                    duration: 3,
                });
            else
                notification.error({
                    message: 'Lỗi',
                    description: res.messages[0],
                    duration: 3,
                });
            setLoading(false);
            fetchData({
                pagination,
                delete: true,
                searchText: debounced,
            });
        })();
    };
    //update khoá hay ko khoá tài khoản
    const handleUpdateLock = (id) => {
        (async () => {
            setLoading(true);
            const res = await loginService.updateLoginLock(id);
            if (res.data)
                notification.success({
                    message: 'Thành công',
                    description: res.messages[0],
                    duration: 3,
                });
            else
                notification.error({
                    message: 'Lỗi',
                    description: res.messages[0],
                    duration: 3,
                });
            setLoading(false);
            fetchData({
                pagination,
                delete: true,
                searchText: debounced,
            });
        })();
    };
    //chạy khi lần đầu hoặc khi deboundced thay đổi
    useEffect(() => {
        handleSetData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debounced]);
    //xử lý khi filter, hoặc sort
    const handleTableChange = (_, filters, sorter) => {
        fetchData({
            sortField: sorter.field,
            sortOrder: sorter.order,
            pagination,
            ...filters,
        });
    };
    //set lại data
    const handleSetData = (params = {}) => {
        const newPagination = { ...pagination };
        if (params.page) newPagination.current = params.page;
        if (params.pageSize) newPagination.pageSize = params.pageSize;
        if (debounced)
            fetchData({
                pagination: newPagination,
                searchText: debounced,
            });
        else
            fetchData({
                pagination: newPagination,
            });
    };
    //khi qua trang khác
    const handleChangPagination = (page, pageSize) => {
        if (page > 1) history(configRoutes.page + page);
        else history('.');
        handleSetData({ page, pageSize });
    };
    return (
        <>
            <Head title={configTitle.account} />
            <ManagerHeader pageName={namePage} />
            {isPermissionView(namePage) && (
                <div
                    className="site-layout-background"
                    style={{
                        padding: 24,
                        minHeight: 360,
                    }}
                >
                    <Table
                        bordered
                        title={() => 'Tài khoản'}
                        columns={columns}
                        rowKey={(record) => record.id}
                        dataSource={data}
                        pagination={false}
                        loading={loading}
                        onChange={handleTableChange}
                        scroll={{
                            x: true,
                        }}
                    />
                    {!!pagination.pageSize && !!pagination.total && (
                        <>
                            <Pagination
                                current={pagination.current}
                                className="mt-5 inline-block mb-5 float-right"
                                total={pagination.total}
                                onChange={handleChangPagination}
                                showSizeChanger
                                pageSizeOptions={pageSizeOptions}
                            />
                        </>
                    )}
                </div>
            )}
        </>
    );
};
export default Manager;
