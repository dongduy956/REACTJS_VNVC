import { Pagination, Table, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { notification, Popconfirm, Tooltip } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import ManagerHeader from '~/components/ManagerHeader';
import { useAuth, useDebounce, useResetSearch } from '~/hooks';
import { searchSelector } from '~/store';
import { typeOfVaccineService, vaccineService } from '~/services';
import { configRoutes, configTitle } from '~/configs';
import Head from '~/components/Head';
import { namePages, pageSizeOptions, typeImportExcel } from '~/constraints';
import htmlParse from 'html-react-parser';
import { arrayLibrary, roles } from '~/utils';
const Manager = () => {
    useAuth();
    useResetSearch();
    const { isPermissionEdit, isPermissionDelete, isPermissionView } = roles;
    const namePage = namePages.Vaccine.name;
    const history = useNavigate();
    const { pathname, search } = useLocation();
    const searchText = useSelector(searchSelector);
    const debounced = useDebounce(searchText, 500);
    const [data, setData] = useState([]);
    const [filterTypeOfVaccines, setFilterTypeOfVaccine] = useState([]);
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
            dataIndex: 'name',
            sorter: {
                compare: (a, b) => a.name > b.name,
            },
        },
        {
            title: 'Loại vaccine',
            dataIndex: 'typeOfVaccineName',
            sorter: {
                compare: (a, b) => a.typeOfVaccineName > b.typeOfVaccineName,
            },
            filters:
                filterTypeOfVaccines.length > 0
                    ? filterTypeOfVaccines.reduce(
                          (arr, item) =>
                              arr.some((x) => x.value === item.name.toLowerCase().trim())
                                  ? arr
                                  : [...arr, { text: item.name, value: item.name.toLowerCase().trim() }],
                          [],
                      )
                    : [],
            onFilter: (value, record) => record.typeOfVaccineName.toLowerCase().trim() === value,
        },
        {
            title: 'Hình ảnh',
            dataIndex: 'image',
            render: (_, record) => {
                return (
                    <img
                        className="rounded-full w-full h-12 text-center object-cover"
                        alt={record.name}
                        src={record.image}
                    />
                );
            },
        },
        {
            title: 'Phòng bệnh',
            dataIndex: 'diseasePrevention',
            sorter: {
                compare: (a, b) => a.diseasePrevention > b.diseasePrevention,
            },
        },
        {
            title: 'Vị trí tiêm',
            dataIndex: 'injectionSite',
            sorter: {
                compare: (a, b) => a.injectionSite > b.injectionSite,
            },
        },
        {
            title: 'Phản ứng phụ',
            dataIndex: 'sideEffects',
            sorter: {
                compare: (a, b) => a.sideEffects > b.sideEffects,
            },
        },
        {
            title: 'Liều lượng',
            dataIndex: 'amount',
            sorter: {
                compare: (a, b) => a.amount - b.amount,
            },
            render: (_, record) => record.amount + 'ml',
        },
        {
            title: 'Nơi lưu trữ',
            dataIndex: 'storage',
            sorter: {
                compare: (a, b) => a.storage > b.storage,
            },
        },
        {
            title: 'Nhiệt độ',
            dataIndex: 'storageTemperatures',
            sorter: {
                compare: (a, b) => a.storageTemperatures > b.storageTemperatures,
            },
            render: (_, record) => record.storageTemperatures + '°C',
        },

        {
            title: 'Số lượng còn',
            dataIndex: 'quantityRemain',
            sorter: {
                compare: (a, b) => a.quantityRemain > b.quantityRemain,
            },
        },
        {
            title: 'Nội dung',
            dataIndex: 'content',
            sorter: {
                compare: (a, b) => a.content > b.content,
            },
            render: (_, record) => htmlParse(record.content ?? ''),
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
        (async () => {
            setLoading(true);
            const typeOfVaccines = (await typeOfVaccineService.getAllTypeOfVaccines()).data;
            setFilterTypeOfVaccine(typeOfVaccines);
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
                res = await vaccineService.searchVaccines(
                    params.searchText,
                    params.pagination.current,
                    params.pagination.pageSize,
                );
            else res = await vaccineService.getVaccines(params.pagination.current, params.pagination.pageSize);
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
            const res = await vaccineService.deleteVaccine(id);
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
            <Head title={`${configTitle.vaccine}`} />

            <ManagerHeader
                pageName={namePage}
                setTable={handleSetData}
                titleImport="Nhập dữ liệu vaccine"
                typeImport={typeImportExcel.vaccine}
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
                        title={() => 'Vaccine'}
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
