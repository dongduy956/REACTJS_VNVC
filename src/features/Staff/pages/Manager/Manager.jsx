import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { notification, Pagination, Popconfirm, Table, Tooltip, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Head from '~/components/Head';

import ManagerHeader from '~/components/ManagerHeader';
import { configRoutes, configTitle } from '~/configs';
import { namePages, pageSizeOptions, typeImportExcel } from '~/constraints';
import { useAuth, useDebounce, useResetSearch } from '~/hooks';
import { permissionService, staffService } from '~/services';
import { searchSelector } from '~/store';
import { arrayLibrary, roles } from '~/utils';

const Manager = () => {
    useAuth();
    useResetSearch();
    const { isPermissionEdit, isPermissionDelete, isPermissionView } = roles;
    const namePage = namePages.Staff.name;
    const history = useNavigate();
    const { pathname, search } = useLocation();
    const searchText = useSelector(searchSelector);
    const debounced = useDebounce(searchText, 500);
    const [data, setData] = useState([]);
    const [filterPermissions, setFilterPermissions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: search ? Number(search.split(configRoutes.page)[1]) : 1,
    });
    useEffect(() => {
        (async () => {
            setLoading(true);
            const permissions = (await permissionService.getAllPermissions()).data;
            setFilterPermissions(permissions);
            setLoading(false);
        })();
    }, []);
    const columns = [
        {
            title: 'No.',
            dataIndex: 'no',
            sorter: {
                compare: (a, b) => a.no - b.no,
            },
        },
        {
            title: 'Tên nhân viên',
            dataIndex: 'staffName',
            sorter: {
                compare: (a, b) => a.staffName > b.staffName,
            },
        },
        {
            title: 'Chức vụ',
            dataIndex: 'permissionName',
            sorter: {
                compare: (a, b) => a.permissionName > b.permissionName,
            },
            filters:
                filterPermissions.length > 0
                    ? filterPermissions.reduce(
                          (arr, item) =>
                              arr.some((x) => x.value === item.name.toLowerCase().trim())
                                  ? arr
                                  : [...arr, { text: item.name, value: item.name.toLowerCase().trim() }],
                          [],
                      )
                    : [],
            onFilter: (value, record) => record.permissionName.toLowerCase().trim() === value,
        },
        {
            title: 'E-mail',
            dataIndex: 'email',
            sorter: {
                compare: (a, b) => a.email > b.email,
            },
        },
        {
            title: 'Giới tính',
            dataIndex: 'sex',
            render: (_, record) => (record.sex ? 'Nam' : 'Nữ'),
            filters: [
                {
                    text: 'Nam',
                    value: true,
                },
                {
                    text: 'Nữ',
                    value: false,
                },
            ],
            onFilter: (value, record) => record.sex === value,
        },
        {
            title: 'Ngày sinh',
            dataIndex: 'dateOfBirth',
            sorter: {
                compare: (a, b) => a.dateOfBirth > b.dateOfBirth,
            },
            render: (_, record) => new Date(record.dateOfBirth).toLocaleDateString(),
        },
        {
            title: 'CCCD/CMND',
            dataIndex: 'identityCard',
            sorter: {
                compare: (a, b) => a.identityCard > b.identityCard,
            },
        },
        {
            title: 'Hình ảnh',
            dataIndex: 'avatar',
            render: (_, record) => {
                return (
                    <img
                        className="rounded-full w-full h-12 text-center object-cover"
                        alt={record.staffName}
                        src={record.avatar}
                    />
                );
            },
        },
        {
            title: 'Quốc gia',
            dataIndex: 'country',
            sorter: {
                compare: (a, b) => a.country > b.country,
            },
            filters:
                data.length > 0
                    ? data.reduce(
                          (arr, item) =>
                              arr.some((x) => x.value === item.country.toLowerCase().trim())
                                  ? arr
                                  : [...arr, { text: item.country, value: item.country.toLowerCase().trim() }],
                          [],
                      )
                    : [],
            onFilter: (value, record) => record.country.toLowerCase().trim() === value,
        },
        {
            title: 'Tỉnh/Thành phố',
            dataIndex: 'province',
            sorter: {
                compare: (a, b) => a.province > b.province,
            },
        },
        {
            title: 'Quận/Huyện',
            dataIndex: 'district',
            sorter: {
                compare: (a, b) => a.district > b.district,
            },
        },
        {
            title: 'Xã/Phường',
            dataIndex: 'village',
            sorter: {
                compare: (a, b) => a.village > b.village,
            },
        },
        {
            title: 'Số nhà/thôn/xóm',
            dataIndex: 'address',
            sorter: {
                compare: (a, b) => a.address > b.address,
            },
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phoneNumber',
            sorter: {
                compare: (a, b) => a.phoneNumber > b.phoneNumber,
            },
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
                            <Tooltip placement="bottom" title={`Xoá ${record.staffName.toLowerCase()}`} color="cyan">
                                <Typography.Link className="mr-2">
                                    <Popconfirm title="Bạn chắc chắn xoá?" onConfirm={() => handleDelete(record.id)}>
                                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                        <DeleteOutlined />
                                    </Popconfirm>
                                </Typography.Link>
                            </Tooltip>
                        )}
                        {isPermissionEdit(namePage) && (
                            <Tooltip placement="bottom" title={'Sửa ' + record.staffName.toLowerCase()} color="cyan">
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
        if (!data.every((x) => x.no) || !arrayLibrary.isGrow(data))
            setData((pre) => pre.map((x, i) => ({ ...x, no: i + 1 })));
    }, [data]);
    const fetchData = (params = {}) => {
        if (searchText && !params.searchText) params.searchText = searchText;
        setLoading(true);
        (async () => {
            let res;
            if (params.searchText)
                res = await staffService.searchStaffs(
                    params.searchText,
                    params.pagination.current,
                    params.pagination.pageSize,
                );
            else res = await staffService.getStaffs(params.pagination.current, params.pagination.pageSize);
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
            const res = await staffService.deleteStaff(id);
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
            <Head title={`${configTitle.staff}`} />

            <ManagerHeader
                pageName={namePage}
                setTable={handleSetData}
                titleImport="Nhập dữ liệu nhân viên"
                typeImport={typeImportExcel.staff}
            />
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
                        title={() => 'Nhân viên'}
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
