import { ExportOutlined } from '@ant-design/icons';
import { Pagination, Table, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Head from '~/components/Head';
import ManagerHeader from '~/components/ManagerHeader';
import { configRoutes, configTitle } from '~/configs';
import { filterPrices, namePages, pageSizeOptions } from '~/constraints';
import { useAuth, useDebounce, useResetSearch } from '~/hooks';
import { customerService, paymentMethodService, payService, staffService } from '~/services';
import { searchSelector } from '~/store';
import { arrayLibrary, stringLibrary } from '~/utils';
import PayDetail from './../../components/PayDetail';
const Manager = () => {
    useAuth();
    useResetSearch();
    const history = useNavigate();
    const { search, pathname } = useLocation();
    const [filterCustomers, setFilterCustomers] = useState([]);
    const [filterStaffs, setFilterStaffs] = useState([]);
    const [filterPaymentMethods, setFilterPaymentMethods] = useState([]);
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
                data.length ? (
                    <div className="flex justify-center">
                        <Link state={record} className="ml-3" to={`${pathname}${configRoutes.report}/${record.id}`}>
                            <Typography.Link className="hover:text-cyan-500 cursor-pointer">
                                <ExportOutlined />
                            </Typography.Link>
                        </Link>
                    </div>
                ) : null,
        },
        {
            title: 'No',
            dataIndex: 'no',
            sorter: {
                compare: (a, b) => a.no - b.no,
            },
        },
        {
            title: 'Ngày thanh toán',
            dataIndex: 'created',
            sorter: {
                compare: (a, b) => a.created - b.created,
            },
            render: (_, record) => new Date(record.created).toLocaleString(),
        },
        {
            title: 'Mã lịch tiêm',
            dataIndex: 'injectionScheduleId',
            sorter: {
                compare: (a, b) => a.injectionScheduleId > b.injectionScheduleId,
            },
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
                                            value: (item.firstName + ' ' + item.lastName).toLowerCase(),
                                        },
                                    ],
                          [],
                      )
                    : [],
            onFilter: (value, record) => record.customerName.toLowerCase().trim() === value,
        },
        {
            title: 'Người đóng tiền',
            dataIndex: 'payer',
            sorter: {
                compare: (a, b) => a.payer > b.payer,
            },
        },
        {
            title: 'Phương thức thanh toán',
            dataIndex: 'paymentMethodName',
            sorter: {
                compare: (a, b) => a.paymentMethodName > b.paymentMethodName,
            },
            filters:
                filterPaymentMethods.length > 0
                    ? filterPaymentMethods.reduce(
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
            onFilter: (value, record) => record.paymentMethodName.toLowerCase().trim() === value,
        },
        {
            title: 'Tiền khách trả',
            dataIndex: 'guestMoney',
            sorter: {
                compare: (a, b) => a.guestMoney > b.guestMoney,
            },
            render: (_, record) => stringLibrary.formatMoney(record.guestMoney),
            filters: filterPrices,
            onFilter: (value, record) =>
                value.length === 1
                    ? record.guestMoney >= value[0]
                    : record.guestMoney >= value[0] && record.guestMoney < value[1],
        },
        {
            title: 'Tiền thừa',
            dataIndex: 'excessMoney',
            sorter: {
                compare: (a, b) => a.excessMoney > b.excessMoney,
            },
            render: (_, record) => stringLibrary.formatMoney(record.excessMoney),
            filters: filterPrices,
            onFilter: (value, record) =>
                value.length === 1
                    ? record.excessMoney >= value[0]
                    : record.excessMoney >= value[0] && record.excessMoney < value[1],
        },
        {
            title: 'Giảm giá',
            dataIndex: 'discount',
            sorter: {
                compare: (a, b) => a.discount > b.discount,
            },
            render: (_, record) => record.discount * 100 + '%',
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
            const customers = (await customerService.getAllCustomers()).data;
            setFilterCustomers(customers);
            const staffs = (await staffService.getAllStaffs()).data;
            setFilterStaffs(staffs);
            const paymentMethods = (await paymentMethodService.getAllPaymentMethods()).data;
            setFilterPaymentMethods(paymentMethods);
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
                res = await payService.searchPays(
                    params.searchText,
                    params.pagination.current,
                    params.pagination.pageSize,
                );
            else res = await payService.getPays(params.pagination.current, params.pagination.pageSize);
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
            <Head title={`${configTitle.pay}`} />

            <ManagerHeader noAdd pageName={namePages.Pay.name} />
            <div
                className="site-layout-background"
                style={{
                    padding: 24,
                    minHeight: 360,
                }}
            >
                <Table
                    bordered
                    title={() => 'Thanh toán'}
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
                        expandedRowRender: (record) => <PayDetail key={record.id} pay={record} />,
                    }}
                    summary={() => (
                        <Table.Summary.Row>
                            <Table.Summary.Cell className="text-center text-red-600" index={0} colSpan={12}>
                                Giảm giá gói vaccine cơ bản lấy phần trăm theo tổng vaccine trong gói.
                            </Table.Summary.Cell>
                        </Table.Summary.Row>
                    )}
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
