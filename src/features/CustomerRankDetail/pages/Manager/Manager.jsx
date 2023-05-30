import { Pagination, Table } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Head from '~/components/Head';

import ManagerHeader from '~/components/ManagerHeader';
import { configRoutes, configTitle } from '~/configs';
import { namePages, pageSizeOptions } from '~/constraints';
import { useAuth, useDebounce, useResetSearch } from '~/hooks';
import { customerRankDetailService, customerService } from '~/services';
import { searchSelector } from '~/store';
import { arrayLibrary, roles } from '~/utils';

const Manager = () => {
    useAuth();
    useResetSearch();
    const { isPermissionView } = roles;
    const namePage = namePages.CustomerRankDetail.name;
    const history = useNavigate();
    const { search } = useLocation();
    const searchText = useSelector(searchSelector);
    const debounced = useDebounce(searchText, 500);
    const [data, setData] = useState([]);
    const [filterCustomers, setFilterCustomers] = useState([]);
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
            title: 'Mã thanh toán',
            dataIndex: 'payId',
            sorter: {
                compare: (a, b) => a.payId - b.payId,
            },
        },
        {
            title: 'Điểm',
            dataIndex: 'point',
            sorter: {
                compare: (a, b) => a.point - b.point,
            },
        },
    ];
    useEffect(() => {
        (async () => {
            setLoading(true);
            const customers = (await customerService.getAllCustomers()).data;
            setFilterCustomers(customers);
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
                res = await customerRankDetailService.searchCustomerRankDetails(
                    params.searchText,
                    params.pagination.current,
                    params.pagination.pageSize,
                );
            else
                res = await customerRankDetailService.getCustomerRankDetails(
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
            <Head title={`${configTitle.customerRankDetail}`} />

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
                        title={() => 'Chi tiết xếp loại khách hàng'}
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
