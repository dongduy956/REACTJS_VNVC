import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Form, Input, InputNumber, notification, Pagination, Popconfirm, Table, Tooltip, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import Head from '~/components/Head';
import ManagerHeader from '~/components/ManagerHeader';
import { configRoutes, configTitle } from '~/configs';
import { namePages, pageSizeOptions, typeImportExcel } from '~/constraints';
import { useAuth, useDebounce, useResetSearch } from '~/hooks';
import { vaccinePackageDetailService, vaccinePackageService } from '~/services';
import { searchSelector } from '~/store';
import { arrayLibrary, roles } from '~/utils';
import VaccinePackageDetail from '../../components/VaccinePackageDetail';
const EditableCell = ({ editing, dataIndex, title, inputType, record, index, children, ...restProps }) => {
    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{
                        margin: 0,
                    }}
                    rules={[
                        {
                            required: true,
                            message: `Vui lòng nhập ${title.toLowerCase()}`,
                        },
                        {
                            validator: (rule, value, cb) => (value < 0 ? cb(`${title} không được nhỏ hơn 0.`) : cb()),
                            message: `${title} không được nhỏ hơn 0.`,
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};
const Manager = () => {
    useAuth();
    useResetSearch();
    const { isPermissionEdit, isPermissionDelete, isPermissionView } = roles;
    const namePage = namePages.VaccinePackage.name;
    const history = useNavigate();
    const { search } = useLocation();
    const [form] = Form.useForm();
    const [editingKey, setEditingKey] = useState('');
    const searchText = useSelector(searchSelector);
    const debounced = useDebounce(searchText, 500);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: search ? Number(search.split(configRoutes.page)[1]) : 1,
    });
    useEffect(() => {
        if (!data.every((x) => x.no) || !arrayLibrary.isGrow(data))
            setData((pre) => pre.map((x, i) => ({ ...x, no: i + 1 })));
    }, [data]);
    const columns = [
        {
            title: 'No.',
            dataIndex: 'no',
            sorter: {
                compare: (a, b) => a.no - b.no,
            },
        },
        {
            title: 'Tên gói',
            dataIndex: 'name',
            sorter: {
                compare: (a, b) => a.name > b.name,
            },
        },
        {
            title: 'Đối tượng tiêm',
            dataIndex: 'objectInjection',
            sorter: {
                compare: (a, b) => a.objectInjection > b.objectInjection,
            },
            editable: true,
        },
    ];
    if (isPermissionEdit(namePage) || isPermissionDelete(namePage))
        columns.unshift({
            title: 'Thao tác',
            dataIndex: 'operation',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Typography.Link
                            onClick={() => save(record.id)}
                            style={{
                                marginRight: 8,
                            }}
                        >
                            Lưu
                        </Typography.Link>
                        <Popconfirm title="Bạn chắc chắn huỷ?" onConfirm={cancel}>
                            <a>Huỷ</a>
                        </Popconfirm>
                    </span>
                ) : (
                    <div className="flex justify-center">
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
                            <Tooltip placement="bottom" title={`Sửa ${record.name.toLowerCase()}`} color="cyan">
                                <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                                    <EditOutlined />
                                </Typography.Link>
                            </Tooltip>
                        )}
                    </div>
                );
            },
        });
    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: col.dataIndex === 'number' ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });
    const isEditing = (record) => record.id === editingKey;
    const edit = (record) => {
        form.setFieldsValue({
            ...record,
        });
        setEditingKey(record.id);
    };
    const cancel = () => {
        setEditingKey('');
    };

    const save = async (id) => {
        setLoading(true);
        try {
            const row = await form.validateFields();
            const newData = [...data];
            const index = newData.findIndex((item) => id === item.id);
            if (index > -1) {
                const resultUpdateVaccinePackage = await vaccinePackageService.updateVaccinePackage(id, {
                    ...row,
                    name: newData[index].name,
                });
                if (resultUpdateVaccinePackage.data) {
                    notification.success({
                        message: 'Thành công',
                        description: resultUpdateVaccinePackage.messages[0],
                        duration: 3,
                    });
                    if (debounced)
                        fetchData({
                            pagination,
                            searchText: debounced,
                        });
                    else
                        fetchData({
                            pagination,
                        });
                } else
                    notification.error({
                        message: 'Lỗi',
                        description: resultUpdateVaccinePackage.messages[0],
                        duration: 3,
                    });
                setEditingKey('');
            }
        } catch (errInfo) {}
        setLoading(false);
    };

    const fetchData = (params = {}) => {
        setLoading(true);
        (async () => {
            let res;
            if (params.searchText)
                res = await vaccinePackageService.searchVaccinePackages(
                    params.searchText,
                    params.pagination.current,
                    params.pagination.pageSize,
                );
            else
                res = await vaccinePackageService.getVaccinePackages(
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
            const resDetail = await vaccinePackageDetailService.deleteVaccinePackageDetailByVaccinePackageId(id);
            if (resDetail.data) {
                const res = await vaccinePackageService.deleteVaccinePackage(id);
                if (res.data) {
                    notification.success({
                        message: 'Thành công',
                        description: res.messages[0],
                        duration: 3,
                    });
                    fetchData({
                        pagination,
                        delete: true,
                        searchText: debounced,
                    });
                } else
                    notification.error({
                        message: 'Lỗi',
                        description: res.messages[0],
                        duration: 3,
                    });
            }
            setLoading(false);
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
            <Head title={`${configTitle.vaccinePackage}`} />

            <ManagerHeader
                pageName={namePage}
                setTable={handleSetData}
                titleImport="Nhập dữ liệu gói vaccine"
                typeImport={typeImportExcel.vaccinePackage}
            />
            {isPermissionView(namePage) && (
                <div
                    className="site-layout-background"
                    style={{
                        padding: 24,
                        minHeight: 360,
                    }}
                >
                    <Form form={form} component={false}>
                        <Table
                            bordered
                            title={() => 'Gói vaccine'}
                            components={{
                                body: {
                                    cell: EditableCell,
                                },
                            }}
                            dataSource={data}
                            pagination={false}
                            loading={loading}
                            columns={mergedColumns}
                            rowClassName="editable-row"
                            rowKey={(record) => record.id}
                            onChange={handleTableChange}
                            scroll={{
                                x: true,
                            }}
                            expandable={{
                                expandedRowRender: (record) => (
                                    <VaccinePackageDetail key={record.id} vaccinePackage={record} />
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
                    </Form>
                </div>
            )}
        </>
    );
};
export default Manager;
