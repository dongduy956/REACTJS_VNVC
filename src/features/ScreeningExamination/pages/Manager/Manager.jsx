import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Badge, notification, Pagination, Popconfirm, Table, Tooltip, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import Head from '~/components/Head';
import ManagerHeader from '~/components/ManagerHeader';
import { configRoutes, configTitle } from '~/configs';
import { namePages, pageSizeOptions } from '~/constraints';
import { useAuth, useDebounce, useResetSearch } from '~/hooks';
import { customerService, screeningExaminationService, staffService } from '~/services';
import { searchSelector } from '~/store';
import { arrayLibrary, roles } from '~/utils';

const Manager = () => {
    useAuth();
    useResetSearch();
    const { isPermissionEdit, isPermissionDelete, isPermissionView } = roles;
    const namePage = namePages.ScreeningExamination.name;
    const history = useNavigate();
    const { pathname, search } = useLocation();
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
            title: 'Ngày khám',
            dataIndex: 'created',
            sorter: {
                compare: (a, b) => a.created > b.created,
            },
            render: (_, record) => new Date(record.created).toLocaleString(),
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
                                  : [...arr, { text: item.staffName, value: item.staffName.toLowerCase().trim() }],
                          [],
                      )
                    : [],
            onFilter: (value, record) => record.staffName.toLowerCase().trim() === value,
        },
        {
            title: 'Chuẩn đoán',
            dataIndex: 'diagnostic',
            sorter: {
                compare: (a, b) => a.diagnostic > b.diagnostic,
            },
        },
        {
            title: 'Chiều cao',
            dataIndex: 'height',
            sorter: {
                compare: (a, b) => a.height - b.height,
            },
            render: (_, record) => record.height + 'cm',
        },
        {
            title: 'Cân nặng',
            dataIndex: 'weight',
            sorter: {
                compare: (a, b) => a.weight - b.weight,
            },
            render: (_, record) => record.weight + 'kg',
        },
        {
            title: 'Nhiệt độ',
            dataIndex: 'temperature',
            sorter: {
                compare: (a, b) => a.temperature - b.temperature,
            },
            render: (_, record) => record.weight + '℃',
        },
        {
            title: 'Nhịp tim',
            dataIndex: 'heartbeat',
            sorter: {
                compare: (a, b) => a.heartbeat - b.heartbeat,
            },
            render: (_, record) => record.heartbeat + 'nhịp/phút',
        },
        {
            title: 'Huyết áp',
            dataIndex: 'bloodPressure',
            sorter: {
                compare: (a, b) => a.bloodPressure - b.bloodPressure,
            },
            render: (_, record) => record.bloodPressure + 'mmHg',
        },
        {
            title: 'Ghi chú',
            dataIndex: 'note',
            sorter: {
                compare: (a, b) => a.note - b.note,
            },
        },
        {
            title: 'Đủ điều kiện',
            dataIndex: 'isEligible',
            sorter: {
                compare: (a, b) => a.isEligible - b.isEligible,
            },
            render: (_, record) => (
                <span>
                    <Badge className="mr-2" status={record.isEligible ? 'success' : 'error'} />
                    {record.isEligible ? 'Được tiêm' : 'Theo dõi'}
                </span>
            ),
            filters: [
                {
                    text: 'Được tiêm',
                    value: true,
                },
                {
                    text: 'Theo dõi',
                    value: false,
                },
            ],
            onFilter: (value, record) => record.isEligible === value,
        },
    ];
    if (isPermissionEdit(namePage) || isPermissionDelete(namePage))
        columns.unshift({
            title: 'Thao tác',
            dataIndex: 'operation',
            render: (_, record) =>
                data.length > 0 ? (
                    <div className="flex justify-center ">
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
                        {!record.isHide && isPermissionEdit(namePage) && (
                            <Tooltip placement="bottom" title={'Sửa'} color="cyan">
                                <Typography.Link>
                                    <Link
                                        state={record}
                                        to={`${pathname}${configRoutes.update}/${record.id}`}
                                        className="hover:text-cyan-500"
                                    >
                                        <EditOutlined />
                                    </Link>
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
                res = await screeningExaminationService.searchScreeningExaminations(
                    params.searchText,
                    params.pagination.current,
                    params.pagination.pageSize,
                );
            else
                res = await screeningExaminationService.getScreeningExaminations(
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
    const handleDelete = (id) => {
        (async () => {
            setLoading(true);
            const res = await screeningExaminationService.deleteScreeningExamination(id);
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
            <Head title={`${configTitle.screeningExamination}`} />

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
                        title={() => 'Khám sàn lọc'}
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
