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
import { supplierService } from '~/services';
import { searchSelector } from '~/store';
import { arrayLibrary, roles } from '~/utils';

const Manager = () => {
    useAuth();
    useResetSearch();
    const { isPermissionEdit, isPermissionDelete, isPermissionView } = roles;
    const namePage = namePages.Supplier.name;

    const history = useNavigate();
    const { pathname, search } = useLocation();
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
            title: 'Tên nhà cung cấp',
            dataIndex: 'name',
            sorter: {
                compare: (a, b) => a.name - b.name,
            },
        },

        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            sorter: {
                compare: (a, b) => a.address - b.address,
            },
            filters:
                data.length > 0
                    ? data.reduce(
                          (arr, item) =>
                              arr.some((x) => x.value === item.address.toLowerCase().trim())
                                  ? arr
                                  : [...arr, { text: item.address, value: item.address.toLowerCase().trim() }],
                          [],
                      )
                    : [],
            onFilter: (value, record) => record.address.toLowerCase().trim() === value,
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phoneNumber',
            sorter: {
                compare: (a, b) => a.phoneNumber - b.phoneNumber,
            },
        },
        {
            title: 'Tax code',
            dataIndex: 'taxCode',
            sorter: {
                compare: (a, b) => a.taxCode - b.taxCode,
            },
        },
        {
            title: 'E-mail',
            dataIndex: 'email',
            sorter: {
                compare: (a, b) => a.email - b.email,
            },
        },
    ];
    if (isPermissionEdit(namePage) || isPermissionDelete(namePage))
        columns.unshift({
            title: 'Thao tác',
            dataIndex: 'operation',
            render: (_, record) =>
                data.length >= 1 ? (
                    <div className="flex justify-center ">
                        {isPermissionDelete(namePage) && (
                            <Tooltip placement="bottom" title={`Xoá ${record.name.toLowerCase()}`} color="cyan">
                                <Typography.Link className="mr-2">
                                    <Popconfirm title="Bạn chắc chắn xoá?" onConfirm={() => handleDelete(record.id)}>
                                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                        <DeleteOutlined />
                                    </Popconfirm>
                                </Typography.Link>
                            </Tooltip>
                        )}
                        {isPermissionEdit(namePage) && (
                            <Tooltip placement="bottom" title={'Sửa ' + record.name.toLowerCase()} color="cyan">
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
        setLoading(true);
        (async () => {
            let res;
            if (params.searchText)
                res = await supplierService.searchSuppliers(
                    params.searchText,
                    params.pagination.current,
                    params.pagination.pageSize,
                );
            else res = await supplierService.getSuppliers(params.pagination.current, params.pagination.pageSize);
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
            const res = await supplierService.deleteSupplier(id);
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
            <Head title={`${configTitle.supplier}`} />

            <ManagerHeader
                pageName={namePage}
                setTable={handleSetData}
                titleImport="Nhập dữ liệu nhà cung cấp"
                typeImport={typeImportExcel.supplier}
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
                        title={() => 'Nhà cung cấp'}
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
