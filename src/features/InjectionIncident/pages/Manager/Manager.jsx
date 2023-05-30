import { Pagination, Table } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import Head from '~/components/Head';

import ManagerHeader from '~/components/ManagerHeader';
import { configRoutes, configTitle } from '~/configs';
import { namePages, pageSizeOptions } from '~/constraints';
import { useAuth, useDebounce, useResetSearch } from '~/hooks';
import { injectionIncidentService, injectionScheduleService, shipmentService, vaccineService } from '~/services';
import { searchSelector } from '~/store';
import { arrayLibrary, roles } from '~/utils';

const Manager = () => {
    useAuth();
    useResetSearch();
    const { isPermissionView } = roles;
    const namePage = namePages.InjectionIncident.name;
    const history = useNavigate();
    const { search } = useLocation();
    const searchText = useSelector(searchSelector);
    const debounced = useDebounce(searchText, 500);
    const [data, setData] = useState([]);
    const [filterVaccines, setFilterVaccines] = useState([]);
    const [filterShipments, setFilterShipments] = useState([]);
    const [filterInjectionSchedules, setFilterInjectionSchedules] = useState([]);
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
                                  : [
                                        ...arr,
                                        {
                                            text: item.name,
                                            value: item.name.toLowerCase(),
                                        },
                                    ],
                          [],
                      )
                    : [],
            onFilter: (value, record) => record.vaccineName.toLowerCase().trim() === value,
        },
        {
            title: 'Lô vaccine',
            dataIndex: 'shipmentCode',
            sorter: {
                compare: (a, b) => a.shipmentCode > b.shipmentCode,
            },
            filters:
                filterShipments.length > 0
                    ? filterShipments.reduce(
                          (arr, item) =>
                              arr.some((x) => x.value === item.shipmentCode.toLowerCase().trim())
                                  ? arr
                                  : [
                                        ...arr,
                                        {
                                            text: item.shipmentCode,
                                            value: item.shipmentCode.toLowerCase(),
                                        },
                                    ],
                          [],
                      )
                    : [],
            onFilter: (value, record) => record.shipmentCode.toLowerCase().trim() === value,
        },
        {
            title: 'Lịch tiêm',
            dataIndex: 'injectionScheduleId',
            sorter: {
                compare: (a, b) => a.injectionScheduleId > b.injectionScheduleId,
            },
            filters:
                filterInjectionSchedules.length > 0
                    ? filterInjectionSchedules.reduce(
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
            onFilter: (value, record) => record.injectionScheduleId === value,
        },
        {
            title: 'Ngày tiêm',
            dataIndex: 'injectionTime',
            sorter: {
                compare: (a, b) => a.injectionTime > b.injectionTime,
            },
            render: (_, record) => new Date(record.injectionTime).toLocaleString(),
        },
        {
            title: 'Ngày báo cáo',
            dataIndex: 'created',
            sorter: {
                compare: (a, b) => a.created > b.created,
            },
            render: (_, record) => new Date(record.created).toLocaleString(),
        },
        {
            title: 'Nội dung',
            dataIndex: 'content',
            sorter: {
                compare: (a, b) => a.content > b.content,
            },
        },
    ];
    useEffect(() => {
        (async () => {
            setLoading(true);
            const vaccines = (await vaccineService.getAllVaccines()).data;
            setFilterVaccines(vaccines);
            const shipments = (await shipmentService.getAllShipments()).data;
            setFilterShipments(shipments);
            const injectionSchedules = (await injectionScheduleService.getAllInjectionSchedules()).data;
            setFilterInjectionSchedules(injectionSchedules);
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
                res = await injectionIncidentService.searchInjectionIncidents(
                    params.searchText,
                    params.pagination.current,
                    params.pagination.pageSize,
                );
            else
                res = await injectionIncidentService.getInjectionIncidents(
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
            <Head title={`${configTitle.injectionIncident}`} />

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
                        title={() => 'Sự cố tiêm'}
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
