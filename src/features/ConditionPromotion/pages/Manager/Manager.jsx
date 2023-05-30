import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { notification, Pagination, Popconfirm, Table, Tooltip, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import Head from '~/components/Head';
import ManagerHeader from '~/components/ManagerHeader';
import { configRoutes, configTitle } from '~/configs';
import { namePages, pageSizeOptions } from '~/constraints';
import { useAuth, useDebounce, useResetSearch } from '~/hooks';
import {
    conditionPromotionService,
    customerRankService,
    paymentMethodService,
    promotionService,
    vaccinePackageService,
    vaccineService,
} from '~/services';
import { searchSelector } from '~/store';
import { arrayLibrary, roles } from '~/utils';

const Manager = () => {
    useAuth();
    useResetSearch();
    const { isPermissionEdit, isPermissionDelete, isPermissionView } = roles;
    const namePage = namePages.ConditionPromotion.name;
    const history = useNavigate();
    const { pathname, search } = useLocation();
    const searchText = useSelector(searchSelector);
    const debounced = useDebounce(searchText, 500);
    const [data, setData] = useState([]);
    const [filterVaccines, setFilterVaccines] = useState([]);
    const [filterCustomerRanks, setFilterCustomerRanks] = useState([]);
    const [filterVaccinePackages, setFilterVaccinePackages] = useState([]);
    const [filterPaymentMethods, setFilterPaymentMethods] = useState([]);
    const [filterPromotions, setFilterPromotions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: search ? Number(search.split(configRoutes.page)[1]) : 1,
    });
    const columns = [
        {
            title: 'No.',
            dataIndex: 'no',
            sorter: {
                compare: (a, b) => a.no - b.id,
            },
        },
        {
            title: 'Mã khuyến mãi',
            dataIndex: 'promotionCode',
            sorter: {
                compare: (a, b) => a.promotionCode > b.promotionCode,
            },
            filters:
                filterPromotions.length > 0
                    ? filterPromotions.reduce(
                          (arr, item) =>
                              arr.some((x) => x.value === item.promotionCode.toLowerCase().trim())
                                  ? arr
                                  : [
                                        ...arr,
                                        { text: item.promotionCode, value: item.promotionCode.toLowerCase().trim() },
                                    ],
                          [],
                      )
                    : [],
            onFilter: (value, record) => record.promotionCode.toLowerCase().trim() === value,
        },
        {
            title: 'Gói vaccine',
            dataIndex: 'packageVaccineName',
            sorter: {
                compare: (a, b) => a.packageVaccineName > b.packageVaccineName,
            },
            filters:
                filterVaccinePackages.length > 0
                    ? filterVaccinePackages.reduce(
                          (arr, item) =>
                              arr.some((x) => x.value === item.name.toLowerCase().trim())
                                  ? arr
                                  : [...arr, { text: item.name, value: item.name.toLowerCase().trim() }],
                          [],
                      )
                    : [],
            onFilter: (value, record) => record.vaccinePackageName.toLowerCase().trim() === value,
        },
        {
            title: 'Vaccine',
            dataIndex: 'vaccineName',
            sorter: {
                compare: (a, b) => a.vaccineName > b.vaccineName,
            },
            filters:
                filterVaccines.length > 0
                    ? filterVaccines.reduce(
                          (arr, item) =>
                              arr.some((x) => x.value === item.name.toLowerCase().trim())
                                  ? arr
                                  : [...arr, { text: item.name, value: item.name.toLowerCase().trim() }],
                          [],
                      )
                    : [],
            onFilter: (value, record) => record.vaccineName.toLowerCase().trim() === value,
        },
        {
            title: 'Xếp loại khách hàng',
            dataIndex: 'customerRankName',
            sorter: {
                compare: (a, b) => a.customerRankName > b.customerRankName,
            },
            filters:
                filterCustomerRanks.length > 0
                    ? filterCustomerRanks.reduce(
                          (arr, item) =>
                              arr.some((x) => x.value === item.name.toLowerCase().trim())
                                  ? arr
                                  : [...arr, { text: item.name, value: item.name.toLowerCase().trim() }],
                          [],
                      )
                    : [],
            onFilter: (value, record) => record.customerRankName.toLowerCase().trim() === value,
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
                                  : [...arr, { text: item.name, value: item.name.toLowerCase().trim() }],
                          [],
                      )
                    : [],
            onFilter: (value, record) => record.paymentMethodName?.toLowerCase().trim() === value,
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
    const fetchData = (params = {}) => {
        if (searchText && !params.searchText) params.searchText = searchText;
        setLoading(true);
        (async () => {
            let res;
            if (params.searchText)
                res = await conditionPromotionService.searchConditionPromotions(
                    params.searchText,
                    params.pagination.current,
                    params.pagination.pageSize,
                );
            else
                res = await conditionPromotionService.getConditionPromotions(
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
            const res = await conditionPromotionService.deleteConditionPromotion(id);
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
        (async () => {
            setLoading(true);
            const vaccines = (await vaccineService.getAllVaccines()).data;
            setFilterVaccines(vaccines);
            const promotions = (await promotionService.getAllPromotions()).data;
            setFilterPromotions(promotions);
            const paymentMethods = (await paymentMethodService.getAllPaymentMethods()).data;
            setFilterPaymentMethods(paymentMethods);
            const vaccinePackages = (await vaccinePackageService.getAllVaccinePackages()).data;
            setFilterVaccinePackages(vaccinePackages);
            const customerRanks = (await customerRankService.getAllCustomerRanks()).data;
            setFilterCustomerRanks(customerRanks);
            setLoading(false);
        })();
    }, []);
    useEffect(() => {
        if (!data.every((x) => x.no) || !arrayLibrary.isGrow(data))
            setData((pre) => pre.map((x, i) => ({ ...x, no: i + 1 })));
    }, [data]);
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
            <Head title={configTitle.conditionPromotion} />
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
                        title={() => 'Điều kiện khuyến mãi'}
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
