import { DeleteOutlined, ExportOutlined } from '@ant-design/icons';
import { Badge, Pagination, Popconfirm, Table, Tooltip, Typography, notification } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import Head from '~/components/Head';
import ManagerHeader from '~/components/ManagerHeader';
import { configRoutes, configTitle } from '~/configs';
import { filterPrices, namePages, pageSizeOptions } from '~/constraints';
import { useAuth, useDebounce, useResetSearch } from '~/hooks';
import { orderDetailService, orderService, staffService, supplierService } from '~/services';
import { searchSelector } from '~/store';
import { arrayLibrary, roles, stringLibrary } from '~/utils';
import OrderDetail from './../../components/OrderDetail';
const Manager = () => {
    useAuth();
    useResetSearch();
    const { isPermissionDelete, isPermissionView } = roles;
    const namePage = namePages.Order.name;
    const history = useNavigate();
    const { pathname, search } = useLocation();
    const searchText = useSelector(searchSelector);
    const debounced = useDebounce(searchText, 500);
    const [filterSuppliers, setFilterSuppliers] = useState([]);
    const [filterStaffs, setFilterStaffs] = useState([]);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: search ? Number(search.split(configRoutes.page)[1]) : 1,
    });
    const columns = [
        {
            title: 'Thao tác',
            dataIndex: 'operation',
            render: (_, record) =>
                data.length >= 1 ? (
                    <div className="flex justify-center ">
                        {!record.status && isPermissionDelete(namePage) && (
                            <Tooltip placement="bottom" title={`Xoá`} color="cyan">
                                <Typography.Link className="mr-2">
                                    <Popconfirm title="Bạn chắc chắn xoá?" onConfirm={() => handleDelete(record.id)}>
                                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                        <DeleteOutlined />
                                    </Popconfirm>
                                </Typography.Link>
                            </Tooltip>
                        )}
                        <Tooltip placement="bottom" title={'Xuất báo cáo'} color="cyan">
                            <Typography.Link>
                                <Link state={record} to={`${pathname}${configRoutes.report}/${record.id}`}>
                                    <Typography.Link className="hover:text-cyan-500 cursor-pointer">
                                        <ExportOutlined />
                                    </Typography.Link>
                                </Link>
                            </Typography.Link>
                        </Tooltip>
                    </div>
                ) : null,
        },
        {
            title: 'No.',
            dataIndex: 'no',
            sorter: {
                compare: (a, b) => a.no - b.no,
            },
        },
        {
            title: 'Nhà cung cấp',
            dataIndex: 'supplierName',
            sorter: {
                compare: (a, b) => a.supplierName > b.supplierName,
            },
            filters:
                filterSuppliers.length > 0
                    ? filterSuppliers.reduce(
                          (arr, item) =>
                              arr.some((x) => x.value === item.name.toLowerCase().trim())
                                  ? arr
                                  : [
                                        ...arr,
                                        {
                                            text: item.name,
                                            value: item.name.toLowerCase().trim(),
                                        },
                                    ],
                          [],
                      )
                    : [],
            onFilter: (value, record) => record.supplierName.toLowerCase().trim() === value,
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
            onFilter: (value, record) => record.staffName.toLowerCase().trim() === value,
        },
        {
            title: 'Ngày đặt',
            dataIndex: 'created',
            sorter: {
                compare: (a, b) => a.created > b.created,
            },
            render: (_, record) => new Date(record.created).toLocaleString(),
        },
        {
            title: 'Tổng tiền',
            dataIndex: 'total',
            sorter: {
                compare: (a, b) => a.total > b.total,
            },
            render: (_, record) => stringLibrary.formatMoney(record.total),
            filters: filterPrices,
            onFilter: (value, record) =>
                value.length === 1 ? record.total >= value[0] : record.total >= value[0] && record.total < value[1],
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            sorter: {
                compare: (a, b) => {
                    const aStatus = a.status === 2 ? 'Đã nhập' : a.status === 0 ? 'Chưa nhập' : 'Đang nhập';
                    const bStatus = b.status === 2 ? 'Đã nhập' : b.status === 0 ? 'Chưa nhập' : 'Đang nhập';
                    return aStatus > bStatus;
                },
            },
            render: (_, record) => (
                <Typography.Link>
                    <span>
                        <Badge
                            className="mr-2"
                            status={record.status === 2 ? 'success' : record.status === 0 ? 'error' : 'warning'}
                        />
                        {record.status === 2 ? 'Đã nhập' : record.status === 0 ? 'Chưa nhập' : 'Đang nhập'}
                    </span>
                </Typography.Link>
            ),
            filters: [
                {
                    text: 'Đã nhập',
                    value: 2,
                },
                {
                    text: 'Đang nhập',
                    value: 1,
                },
                {
                    text: 'Chưa nhập',
                    value: 0,
                },
            ],
            onFilter: (value, record) => record.status === value,
        },
    ];
    useEffect(() => {
        (async () => {
            setLoading(true);
            const suppliers = (await supplierService.getAllSuppliers()).data;
            setFilterSuppliers(suppliers);
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
                res = await orderService.searchOrders(
                    params.searchText,
                    params.pagination.current,
                    params.pagination.pageSize,
                );
            else res = await orderService.getOrders(params.pagination.current, params.pagination.pageSize);
            setLoading(false);
            setData(res.data.map((item) => ({ ...item, key: item.id })));
            setPagination({
                ...params.pagination,
                pageSize: params.pagination.pageSize ? params.pagination.pageSize : res.pageSize,
                total: res.totalItems,
            });
        })();
    };
    const handleDelete = (id) => {
        (async () => {
            setLoading(true);
            const resDetail = await orderDetailService.deleteOrderDetailsByOrderId(id);
            if (resDetail.data) {
                const res = await orderService.deleteOrder(id);
                if (res.data) {
                    notification.success({
                        message: 'Thành công',
                        description: res.messages[0],
                        duration: 3,
                    });
                    fetchData({
                        pagination,
                        delete: true,
                        searchText: debounced,
                    });
                } else
                    notification.error({
                        message: 'Lỗi',
                        description: res.messages[0],
                        duration: 3,
                    });
            }
            setLoading(false);
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
            <Head title={`${configTitle.order}`} />

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
                        title={() => 'Đặt hàng'}
                        columns={columns}
                        rowKey={(record) => record.id}
                        dataSource={data}
                        pagination={false}
                        loading={loading}
                        onChange={handleTableChange}
                        scroll={{
                            x: true,
                        }}
                        expandable={{
                            expandedRowRender: (record) => (
                                <OrderDetail
                                    pageCurrent={pagination.current}
                                    pageSize={pagination.pageSize}
                                    setOrders={setData}
                                    key={record.id}
                                    order={record}
                                />
                            ),
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
