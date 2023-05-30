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
import { additionalCustomerInformationService, customerService, customerTypeService } from '~/services';
import { searchSelector } from '~/store';
import { arrayLibrary, roles } from '~/utils';

const Manager = () => {
    useAuth();
    useResetSearch();
    const { isPermissionEdit, isPermissionDelete, isPermissionView } = roles;
    const namePage = namePages.Customer.name;
    const history = useNavigate();
    const { pathname, search } = useLocation();
    const searchText = useSelector(searchSelector);
    const debounced = useDebounce(searchText, 500);
    const [data, setData] = useState([]);
    const [filterCustomerTypes, setFilterCustomerTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: search ? Number(search.split(configRoutes.page)[1]) : 1,
    });
    useEffect(() => {
        (async () => {
            setLoading(true);
            const customerTypes = (await customerTypeService.getAllCustomerTypes()).data;
            setFilterCustomerTypes(customerTypes);
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
            title: 'Tên khách hàng',
            dataIndex: 'fullName',
            sorter: {
                compare: (a, b) => a.fullName > b.fullName,
            },
        },
        {
            title: 'Loại khách hàng',
            dataIndex: 'customerTypeName',
            sorter: {
                compare: (a, b) => a.customerTypeName > b.customerTypeName,
            },
            filters:
                filterCustomerTypes.length > 0
                    ? filterCustomerTypes.reduce(
                          (arr, item) =>
                              arr.some((x) => x.value === item.name.toLowerCase().trim())
                                  ? arr
                                  : [...arr, { text: item.name, value: item.name.toLowerCase().trim() }],
                          [],
                      )
                    : [],
            onFilter: (value, record) => record.customerTypeName.toLowerCase().trim() === value,
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
            title: 'CMND/CCCD',
            dataIndex: 'identityCard',
            sorter: {
                compare: (a, b) => a.identityCard > b.identityCard,
            },
        },
        {
            title: 'Mã bảo hiểm',
            dataIndex: 'insuranceCode',
            sorter: {
                compare: (a, b) => a.insuranceCode > b.insuranceCode,
            },
        },
        {
            title: 'Hình ảnh',
            dataIndex: 'avatar',
            render: (_, record) => {
                return (
                    <img
                        className="rounded-full w-full h-12 text-center object-cover"
                        alt={record.firstName + ' ' + record.lastName}
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
        {
            title: 'Cân nặng khi sinh',
            dataIndex: 'weightAtBirth',
            sorter: {
                compare: (a, b) => a.weightAtBirth > b.weightAtBirth,
            },
            render: (_, record) => (record.weightAtBirth ? record.weightAtBirth + 'kg' : ''),
        },
        {
            title: 'Chiều cao khi sinh',
            dataIndex: 'heightAtBirth',
            sorter: {
                compare: (a, b) => a.heightAtBirth > b.heightAtBirth,
            },
            render: (_, record) => (record.heightAtBirth ? record.heightAtBirth + 'cm' : ''),
        },
        {
            title: 'Họ tên cha',
            dataIndex: 'fatherFullName',
            sorter: {
                compare: (a, b) => a.fatherFullName > b.fatherFullName,
            },
        },
        {
            title: 'Số điện thoại cha',
            dataIndex: 'fatherPhoneNumber',
            sorter: {
                compare: (a, b) => a.fatherPhoneNumber > b.fatherPhoneNumber,
            },
        },
        {
            title: 'Họ tên mẹ',
            dataIndex: 'motherFullName',
            sorter: {
                compare: (a, b) => a.motherFullName > b.motherFullName,
            },
        },
        {
            title: 'Số điện thoại mẹ',
            dataIndex: 'motherPhoneNumber',
            sorter: {
                compare: (a, b) => a.motherPhoneNumber > b.motherPhoneNumber,
            },
        },
        {
            title: 'Ghi chú',
            dataIndex: 'note',
            sorter: {
                compare: (a, b) => a.note > b.note,
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
                            <Tooltip placement="bottom" title={`Xoá ${record.fullName.toLowerCase()}`} color="cyan">
                                <Typography.Link className="mr-2">
                                    <Popconfirm title="Bạn chắc chắn xoá?" onConfirm={() => handleDelete(record.id)}>
                                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                        <DeleteOutlined />
                                    </Popconfirm>
                                </Typography.Link>
                            </Tooltip>
                        )}
                        {isPermissionEdit(namePage) && (
                            <Tooltip placement="bottom" title={'Sửa ' + record.fullName.toLowerCase()} color="cyan">
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
            let resultCustomers, resultAdditionalCustomerInformations, result;
            if (params.searchText) {
                resultCustomers = await customerService.searchCustomers(
                    params.searchText,
                    params.pagination.current,
                    params.pagination.pageSize,
                );
                resultAdditionalCustomerInformations =
                    await additionalCustomerInformationService.searchAdditionalCustomerInformations(
                        params.searchText,
                        params.pagination.current,
                        params.pagination.pageSize,
                    );
            } else {
                resultCustomers = await customerService.getCustomers(
                    params.pagination.current,
                    params.pagination.pageSize,
                );
                resultAdditionalCustomerInformations =
                    await additionalCustomerInformationService.getAdditionalCustomerInformations(
                        params.pagination.current,
                        params.pagination.pageSize,
                    );
            }
            if (params.searchText) {
                const ids = [];
                resultCustomers.data.forEach((customer) => {
                    ids.push(customer.id);
                });
                resultAdditionalCustomerInformations.data.forEach((item) => {
                    if (!ids.includes(item.customerId)) ids.push(item.customerId);
                });
                resultCustomers = await customerService.GetCustomerByIds(
                    ids,
                    params.pagination.current,
                    params.pagination.pageSize,
                );
                resultAdditionalCustomerInformations =
                    await additionalCustomerInformationService.getAdditionalCustomerInformationByIds(
                        ids,
                        params.pagination.current,
                        params.pagination.pageSize,
                    );
            }
            result = resultCustomers.data.map((customer) => {
                const additionalCustomerInformation = resultAdditionalCustomerInformations.data.find(
                    (item) => item.customerId === customer.id,
                );
                if (additionalCustomerInformation)
                    return {
                        ...additionalCustomerInformation,
                        ...customer,
                        fullName: customer.firstName + ' ' + customer.lastName,
                        key: customer.id,
                    };
                return {
                    ...customer,
                    fullName: customer.firstName + ' ' + customer.lastName,
                    key: customer.id,
                };
            });
            setLoading(false);
            setData(result);
            setPagination({
                ...params.pagination,
                pageSize: params.pagination.pageSize ? params.pagination.pageSize : resultCustomers.pageSize,
                total: resultCustomers.totalItems,
            });
        })();
    };
    const handleDelete = (id) => {
        (async () => {
            setLoading(true);
            const resultCustomer = await customerService.deleteCustomer(id);

            if (resultCustomer.data) {
                const resultAdditionalCustomerInformation =
                    await additionalCustomerInformationService.deleteAdditionalCustomerInformation(id);
                if (resultAdditionalCustomerInformation.data)
                    notification.success({
                        message: 'Thành công',
                        description: resultCustomer.messages[0],
                        duration: 3,
                    });
            } else
                notification.error({
                    message: 'Lỗi',
                    description: resultCustomer.messages[0],
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
            <Head title={configTitle.customer} />
            <ManagerHeader
                pageName={namePage}
                setTable={handleSetData}
                typeImport={typeImportExcel.customer}
                titleImport="Nhập dữ liệu khách hàng"
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
                        title={() => 'Khách hàng'}
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
