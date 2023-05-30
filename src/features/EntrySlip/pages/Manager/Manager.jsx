import { Pagination, Table, Tooltip, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { ExportOutlined } from '@ant-design/icons';
import ManagerHeader from '~/components/ManagerHeader';
import { useAuth, useDebounce, useResetSearch } from '~/hooks';
import { entrySlipService, orderService, staffService, supplierService } from '~/services';

import Head from '~/components/Head';
import { configRoutes, configTitle } from '~/configs';
import { searchSelector } from '~/store';
import { arrayLibrary, stringLibrary } from '~/utils';
import EntrySlipDetail from './../../components/EntrySlipDetail';
import { filterPrices, pageSizeOptions, namePages } from '~/constraints';
const Manager = () => {
    useAuth();
    useResetSearch();
    const { pathname, search } = useLocation();
    const history = useNavigate();
    const [filterSuppliers, setFilterSuppliers] = useState([]);
    const [filterStaffs, setFilterStaffs] = useState([]);
    const [filterOrders, setFilterOrders] = useState([]);
    const searchText = useSelector(searchSelector);
    const debounced = useDebounce(searchText, 500);
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
                    <div className="flex justify-center">
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
            title: 'Mã đơn đặt hàng',
            dataIndex: 'orderId',
            sorter: {
                compare: (a, b) => a.orderId - b.orderId,
            },
            filters:
                filterOrders.length > 0
                    ? filterOrders.reduce(
                          (arr, item) =>
                              arr.some((x) => x.value === item.id)
                                  ? arr
                                  : [
                                        ...arr,
                                        {
                                            text: item.id,
                                            value: item.id,
                                        },
                                    ],
                          [],
                      )
                    : [],
            onFilter: (value, record) => record.orderId === value,
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
            title: 'Ngày nhập',
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
    ];
    useEffect(() => {
        (async () => {
            setLoading(true);
            const suppliers = (await supplierService.getAllSuppliers()).data;
            setFilterSuppliers(suppliers);
            const staffs = (await staffService.getAllStaffs()).data;
            setFilterStaffs(staffs);
            const orders = (await orderService.getAllOrders(false)).data;
            setFilterOrders(orders);
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
                res = await entrySlipService.searchEntrySlips(
                    params.searchText,
                    params.pagination.current,
                    params.pagination.pageSize,
                );
            else res = await entrySlipService.getEntrySlips(params.pagination.current, params.pagination.pageSize);
            setLoading(false);
            setData(res.data.map((item) => ({ ...item, key: item.id })));
            setPagination({
                ...params.pagination,
                pageSize: params.pagination.pageSize ? params.pagination.pageSize : res.pageSize,
                total: res.totalItems,
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
            <Head title={`${configTitle.entrySlip}`} />

            <ManagerHeader pageName={namePages.EntrySlip.name} />
            <div
                className="site-layout-background"
                style={{
                    padding: 24,
                    minHeight: 360,
                }}
            >
                <Table
                    bordered
                    title={() => 'Phiếu nhập'}
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
                            <EntrySlipDetail
                                pageCurrent={pagination.current}
                                pageSize={pagination.pageSize}
                                setEntrySlips={setData}
                                key={record.id}
                                entrySlip={record}
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
        </>
    );
};
export default Manager;
