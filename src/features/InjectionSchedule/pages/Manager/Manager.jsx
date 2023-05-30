import { AlipayCircleOutlined, EditOutlined, ExportOutlined } from '@ant-design/icons';
import { Badge, Pagination, Table, Tooltip, Typography } from 'antd';
import lodash from 'lodash';
import { lazy, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Head from '~/components/Head';
import ManagerHeader from '~/components/ManagerHeader';
import { configRoutes, configTitle } from '~/configs';
import { injectionStaff, namePages, pageSizeOptions } from '~/constraints';
import { useAuth, useDebounce, useResetSearch } from '~/hooks';
import { customerService, injectionScheduleService, staffService } from '~/services';
import { searchSelector } from '~/store';
import { arrayLibrary, roles } from '~/utils';
import Loadable from '~/components/Loadable';
const PayInjectionSchedule = Loadable(lazy(() => import('../../components/PayInjectionSchedule/PayInjectionSchedule')));
const InjectionScheduleDetail = Loadable(lazy(() => import('./../../components/InjectionScheduleDetail')));

const Manager = () => {
    useAuth();
    useResetSearch();
    const { isPermissionEdit, isPermissionView, isPermissionCreate } = roles;
    const namePage = namePages.InjectionSchedule.name;
    const history = useNavigate();
    const { pathname, search } = useLocation();
    const [openPay, setOpenPay] = useState(false);
    const [injectionSchedule, setInjectionSchedule] = useState({});
    const [filterCustomers, setFilterCustomers] = useState([]);
    const [filterStaffs, setFilterStaffs] = useState([]);
    const searchText = useSelector(searchSelector);
    const debounced = useDebounce(searchText, 500);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: search ? Number(search.split(configRoutes.page)[1]) : 1,
    });
    const [checkUpdate, setCheckUpdate] = useState(false);

    const columns = [
        {
            title: 'Thao tác',
            dataIndex: 'operation',
            render: (_, record) =>
                data.length >= 1 ? (
                    <div className="flex justify-center">
                        <div className="flex justify-center">
                            <Tooltip placement="bottom" className="mr-2" title={`Thanh toán`} color="cyan">
                                {record.checkPay && isPermissionCreate(namePages.Pay.name) && (
                                    <Typography.Link
                                        onClick={() => {
                                            setOpenPay(true);
                                            setInjectionSchedule(record);
                                        }}
                                        className="hover:text-cyan-500 cursor-pointer"
                                    >
                                        <AlipayCircleOutlined />
                                    </Typography.Link>
                                )}
                            </Tooltip>
                            {isPermissionEdit(namePage) && (
                                <Tooltip className="mr-2" placement="bottom" title={`Sửa`} color="cyan">
                                    <Link state={record} to={`${pathname}${configRoutes.update}/${record.id}`}>
                                        <Typography.Link className="hover:text-cyan-500 cursor-pointer">
                                            <EditOutlined />
                                        </Typography.Link>
                                    </Link>
                                </Tooltip>
                            )}
                            <Tooltip placement="bottom" title={`Xuất báo cáo`} color="cyan">
                                <Link state={record} to={`${pathname}${configRoutes.report}/${record.id}`}>
                                    <Typography.Link className="hover:text-cyan-500 cursor-pointer">
                                        <ExportOutlined />
                                    </Typography.Link>
                                </Link>
                            </Tooltip>
                        </div>
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
            title: 'Nhân viên tạo',
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
            render: (_, record) => (record.staffName ? record.staffName : 'User'),
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
            title: 'Ngày tạo',
            dataIndex: 'created',
            sorter: {
                compare: (a, b) => a.created > b.created,
            },
            render: (_, record) => new Date(record.created).toLocaleString(),
        },
        {
            title: 'Ngày hẹn',
            dataIndex: 'date',
            sorter: {
                compare: (a, b) => a.date > b.date,
            },
            render: (_, record) => new Date(record.date).toLocaleString(),
        },
        {
            title: 'Bác sĩ chỉ định',
            dataIndex: 'nominatorName',
            sorter: {
                compare: (a, b) => a.nominatorName > b.nominatorName,
            },
            filters:
                filterStaffs.length > 0
                    ? filterStaffs
                          .filter((x) => x.permissionName.toLowerCase().trim() === injectionStaff.doctor)
                          .reduce(
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
            onFilter: (value, record) => record.nominatorName?.toLowerCase().trim() === value,
        },
        {
            title: 'Thời gian cập nhật',
            dataIndex: 'updateTime',
            sorter: {
                compare: (a, b) => a.updateTime > b.updateTime,
            },
            render: (_, record) => (record.updateTime ? new Date(record.updateTime).toLocaleString() : ''),
        },
        {
            title: 'Nhân viên cập nhật',
            dataIndex: 'updaterName',
            sorter: {
                compare: (a, b) => a.updaterName > b.updaterName,
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
            onFilter: (value, record) => record.updaterName?.toLowerCase().trim() === value,
        },
        {
            title: 'Ưu tiên',
            dataIndex: 'priorities',
            sorter: {
                compare: (a, b) => a.priorities > b.priorities,
            },

            render: (_, record) => (
                <>
                    <Badge className="mr-2" status={record.priorities === 0 ? 'success' : 'warning'} />
                    {record.priorities === 0 ? 'Đặt trước' : 'Trực tiếp'}
                </>
            ),
            filters: [
                { text: 'Đặt trước', value: 0 },
                { text: 'Trực tiếp', value: 1 },
            ],
            onFilter: (value, record) => record.priorities === value,
        },
        {
            title: 'Ghi chú',
            dataIndex: 'note',
            sorter: {
                compare: (a, b) => a.note > b.note,
            },
        },
    ];

    useEffect(() => {
        (async () => {
            setLoading(true);
            const suppliers = (await customerService.getAllCustomers()).data;
            setFilterCustomers(suppliers);
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
                res = await injectionScheduleService.searchInjectionSchedules(
                    params.searchText,
                    params.pagination.current,
                    params.pagination.pageSize,
                );
            else
                res = await injectionScheduleService.getInjectionSchedules(
                    params.pagination.current,
                    params.pagination.pageSize,
                );
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
    }, [debounced, checkUpdate]);
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
            <Head title={`${configTitle.injectionSchedule}`} />

            {isPermissionCreate(namePages.Pay.name) && (
                <PayInjectionSchedule
                    open={openPay}
                    setOpen={setOpenPay}
                    injectionSchedule={injectionSchedule}
                    setLoading={setLoading}
                    setCheckUpdate={setCheckUpdate}
                />
            )}
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
                        title={() => 'Lịch tiêm'}
                        columns={columns}
                        rowKey={(record) => record.id}
                        dataSource={lodash.cloneDeep(data)}
                        pagination={false}
                        loading={loading}
                        onChange={handleTableChange}
                        scroll={{
                            x: true,
                        }}
                        expandable={{
                            expandedRowRender: (record) => (
                                <InjectionScheduleDetail
                                    key={record.id}
                                    checkUpdate={checkUpdate}
                                    injectionSchedule={record}
                                    setCheckUpdate={setCheckUpdate}
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
