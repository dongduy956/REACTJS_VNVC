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
import { typeOfVaccineService } from '~/services';
import { searchSelector } from '~/store';
import { arrayLibrary, roles } from '~/utils';
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
    const namePage = namePages.TypeOfVaccine.name;
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
    const columns = [
        {
            title: 'No.',
            dataIndex: 'no',
            sorter: {
                compare: (a, b) => a.no - b.no,
            },
        },
        {
            title: 'Tên loại vaccine',
            editable: true,
            dataIndex: 'name',
            sorter: {
                compare: (a, b) => a.name > b.name,
            },
        },
    ];
    if (isPermissionEdit(namePage) || isPermissionDelete(namePage))
        columns.unshift({
            title: 'Thao tác',
            dataIndex: 'operation',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <div className="flex justify-center">
                        <Typography.Link onClick={() => save(record.id)} className="mr-4">
                            Lưu
                        </Typography.Link>
                        <Typography.Link onClick={cancel}>Huỷ</Typography.Link>
                    </div>
                ) : (
                    data.length > 0 && (
                        <div className="flex justify-center">
                            {isPermissionDelete(namePage) && (
                                <Tooltip placement="bottom" title={`Xoá ${record.name.toLowerCase()}`} color="cyan">
                                    <Typography.Link className="mr-2">
                                        <Popconfirm
                                            title="Bạn chắc chắn xoá?"
                                            onConfirm={() => handleDelete(record.id)}
                                        >
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
                    )
                );
            },
        });
    useEffect(() => {
        if (!data.every((x) => x.no) || !arrayLibrary.isGrow(data))
            setData((pre) => pre.map((x, i) => ({ ...x, no: i + 1 })));
    }, [data]);
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
    //lưu dữ liệu sửa 1 dòng
    const save = async (id) => {
        setLoading(true);
        try {
            const row = await form.validateFields();
            if (id > 0) {
                const resultUpdate = await typeOfVaccineService.updateTypeOfVaccine(id, row);
                if (resultUpdate.isSuccess) {
                    if (debounced)
                        fetchData({
                            pagination,
                            searchText: debounced,
                        });
                    else
                        fetchData({
                            pagination,
                        });
                    notification.success({
                        message: 'Thành công',
                        description: resultUpdate.messages[0],
                        duration: 3,
                    });
                }
                setEditingKey('');
            }
        } catch (errInfo) {}
        setLoading(false);
    };
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

    const fetchData = (params = {}) => {
        setLoading(true);
        (async () => {
            let res;
            if (params.searchText)
                res = await typeOfVaccineService.searchTypeOfVaccines(
                    params.searchText,
                    params.pagination.current,
                    params.pagination.pageSize,
                );
            else
                res = await typeOfVaccineService.getTypeOfVaccines(
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
            const res = await typeOfVaccineService.deleteTypeOfVaccine(id);
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
            <Head title={`${configTitle.typeOfVaccine}`} />

            <ManagerHeader
                pageName={namePage}
                setTable={handleSetData}
                titleImport="Nhập dữ liệu loại khách"
                typeImport={typeImportExcel.typeOfVaccine}
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
                            components={{
                                body: {
                                    cell: EditableCell,
                                },
                            }}
                            dataSource={data}
                            pagination={false}
                            loading={loading}
                            onChange={handleTableChange}
                            scroll={{
                                x: true,
                            }}
                            columns={mergedColumns}
                            rowClassName="editable-row"
                            title={() => 'Loại vaccine'}
                            rowKey={(record) => record.id}
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
