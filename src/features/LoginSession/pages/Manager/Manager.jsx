import { DeleteOutlined } from '@ant-design/icons';
import { Badge, notification, Pagination, Popconfirm, Table, Tooltip, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Head from '~/components/Head';

import ManagerHeader from '~/components/ManagerHeader';
import { configRoutes, configStorage, configTitle } from '~/configs';
import { useAuth, useDebounce, useResetSearch } from '~/hooks';
import { customerService, loginSessionService, staffService } from '~/services';
import { searchSelector } from '~/store';
import Cookies from 'js-cookie';
import { useLocation, useNavigate } from 'react-router-dom';
import { arrayLibrary, roles } from '~/utils';
import { namePages, pageSizeOptions } from '~/constraints';

const Manager = () => {
    useAuth();
    useResetSearch();
    const { isPermissionDelete, isPermissionView } = roles;
    const namePage = namePages.LoginSession.name;
    const history = useNavigate();
    const { search } = useLocation();
    const accessToken = Cookies.get(configStorage.login)
        ? JSON.parse(Cookies.get(configStorage.login)).accessToken
        : '';
    const [filterCustomers, setFilterCustomers] = useState([]);
    const [filterStaffs, setFilterStaffs] = useState([]);
    const searchText = useSelector(searchSelector);
    const debounced = useDebounce(searchText, 500);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: search ? Number(search.split(configRoutes.page)[1]) : 1,
    });
    const columns = [
        {
            title: 'No.',
            dataIndex: 'no',
            sorter: {
                compare: (a, b) => a.no - b.no,
            },
        },
        {
            title: 'Token id',
            dataIndex: 'tokenId',
            sorter: {
                compare: (a, b) => a.tokenId > b.tokenId,
            },
        },
        {
            title: 'Thu hồi',
            dataIndex: 'isRevoked',
            sorter: {
                compare: (a, b) => a.isRevoked > b.isRevoked,
            },
            render: (_, record) =>
                record.isRevoked ? (
                    <span>
                        <Badge className="mr-2" status={'error'} />
                        Đã thu hồi
                    </span>
                ) : record.accessToken !== accessToken ? (
                    <Typography.Link onClick={() => handleUpdateIsRevoked(record.id)}>
                        <span>
                            <Badge className="mr-2" status={'success'} />
                            Chưa thu hồi
                        </span>
                    </Typography.Link>
                ) : (
                    <span>
                        <Badge className="mr-2" status={'success'} />
                        Chưa thu hồi
                    </span>
                ),
            filters: [
                {
                    text: 'Đã thu hồi',
                    value: true,
                },
                {
                    text: 'Chưa thu hồi',
                    value: false,
                },
            ],
            onFilter: (value, record) => record.isRevoked === value,
        },
        {
            title: 'Nhân viên',
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
            title: 'Khách hàng',
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
        {
            title: 'Địa chỉ IP',
            dataIndex: 'ipAddress',
            sorter: {
                compare: (a, b) => a.ipAddress > b.ipAddress,
            },
        },
        {
            title: 'Ngày hết hạn',
            dataIndex: 'expired',
            sorter: {
                compare: (a, b) => a.expired > b.expired,
            },
            render: (_, record) => new Date(record.expired).toLocaleString(),
        },
    ];
    if (isPermissionDelete(namePage))
        columns.unshift({
            title: 'Thao tác',
            dataIndex: 'operation',
            render: (_, record) =>
                data.length >= 1 && accessToken !== record.accessToken ? (
                    <div className="flex justify-center">
                        {isPermissionDelete(namePage) && (
                            <Tooltip placement="bottom" title={`Xoá`} color="cyan">
                                <Typography.Link className="mr-2">
                                    <Popconfirm title="Bạn chắc chắn xoá?" onConfirm={() => handleDelete(record.id)}>
                                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                        <DeleteOutlined />
                                    </Popconfirm>
                                </Typography.Link>
                            </Tooltip>
                        )}
                    </div>
                ) : null,
        });
    useEffect(() => {
        (async () => {
            setLoading(true);
            const customers = (await customerService.getAllCustomers()).data;
            setFilterCustomers(customers);
            const staffs = (await staffService.getAllStaffs()).data;
            setFilterStaffs(staffs);
            setLoading(false);
        })();
    }, []);
    useEffect(() => {
        if (!data.every((x) => x.no) || !arrayLibrary.isGrow(data))
            setData((pre) => pre.map((x, i) => ({ ...x, no: i + 1 })));
    }, [data]);
    const fetchData = (params = {}) => {
        if (searchText && !params.searchText) params.searchText = searchText;
        setLoading(true);
        (async () => {
            let res;
            if (params.searchText)
                res = await loginSessionService.searchLoginSessions(
                    params.searchText,
                    params.pagination.current,
                    params.pagination.pageSize,
                );
            else
                res = await loginSessionService.getLoginSessions(params.pagination.current, params.pagination.pageSize);
            setLoading(false);
            setData(res.data.map((item) => ({ ...item, key: item.id })));
            setPagination({
                ...params.pagination,
                pageSize: params.pagination.pageSize ? params.pagination.pageSize : res.pageSize,
                total: res.totalItems,
            });
        })();
    };
    const handleDelete = async (id) => {
        setLoading(true);
        const res = await loginSessionService.deleteLoginSession(id);
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
        fetchData({
            pagination,
            delete: true,
            searchText: debounced,
        });
        setLoading(false);
    };
    const handleUpdateIsRevoked = (id) => {
        (async () => {
            setLoading(true);
            const res = await loginSessionService.updateLoginSession(id);
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
    useEffect(() => {
        handleSetData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debounced]);
    const handleTableChange = (_, filters, sorter) => {
        fetchData({
            sortField: sorter.field,
            sortOrder: sorter.order,
            pagination,
            ...filters,
        });
    };
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
    const handleChangPagination = (page, pageSize) => {
        if (page > 1) history(configRoutes.page + page);
        else history('.');
        handleSetData({ page, pageSize });
    };
    return (
        <>
            <Head title={`${configTitle.loginSession}`} />

            <ManagerHeader noAdd pageName={namePage} />
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
                        title={() => 'Phiên đăng nhập'}
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
