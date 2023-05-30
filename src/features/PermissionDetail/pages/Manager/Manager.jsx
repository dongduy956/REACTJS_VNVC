import { Checkbox, Col, Form, notification, Pagination, Row, Select, Table } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import Head from '~/components/Head';
import ManagerHeader from '~/components/ManagerHeader';
import { configRoutes, configTitle } from '~/configs';
import { defaultPermissions, namePages, pageSizeOptions } from '~/constraints';
import { useAuth, useDebounce, useResetSearch } from '~/hooks';
import { permissionDetailService, permissionService } from '~/services';
import { searchSelector } from '~/store';
import { arrayLibrary, roles } from '~/utils';

const Manager = () => {
    useAuth();
    useResetSearch();
    const history = useNavigate();
    const { search } = useLocation();
    const [form] = Form.useForm();
    const searchText = useSelector(searchSelector);
    const debounced = useDebounce(searchText, 500);
    const [data, setData] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: search ? Number(search.split(configRoutes.page)[1]) : 1,
    });

    const [checked, setChecked] = useState([]);
    const handlePermissionDB = async (e, record, type) => {
        setLoading(true);
        setChecked((pre) =>
            pre.map((x) =>
                x.pageName === record.pageName ? { ...x, [type]: { ...x[type], isSelect: e.target.checked } } : x,
            ),
        );
        let res;
        if (e.target.checked)
            res = await permissionDetailService.insertPermissionDetails({
                permissionId: form.getFieldValue('permissionId'),
                permissionType: 'permission',
                permissionValue: record[type].permission,
            });
        else {
            const permissionDetail = await permissionDetailService.getPermissionDetailsByNameAndPermissionId(
                record[type].permission,
                form.getFieldValue('permissionId'),
            );
            if (permissionDetail.isSuccess)
                res = await permissionDetailService.deletePermissionDetails(permissionDetail.data.id);
        }
        if (res.isSuccess)
            notification.success({
                message: 'Thành công',
                description: 'Cập nhật quyền thành công.',
                duration: 3,
            });
        else
            notification.error({
                message: 'Thất bại',
                description: 'Cập nhật quyền thất bại.',
                duration: 3,
            });
        setLoading(false);
    };
    let columns = [
        {
            title: 'No.',
            dataIndex: 'no',
            sorter: {
                compare: (a, b) => a.no - b.no,
            },
        },
        {
            title: 'Trang',
            dataIndex: 'pageName',
            sorter: {
                compare: (a, b) => a.pageName - b.pageName,
            },
            render: (_, record) => namePages[record.pageName].text,
        },
        {
            title: 'Xem',
            dataIndex: roles.types.view,
            render: (_, record) => (
                <Checkbox
                    checked={checked.find((x) => x.pageName === record.pageName).view.isSelect}
                    onChange={(e) => {
                        handlePermissionDB(e, record, roles.types.view);
                    }}
                />
            ),
        },
        {
            title: 'Thêm',
            dataIndex: roles.types.create,
            render: (_, record) => (
                <Checkbox
                    checked={checked.find((x) => x.pageName === record.pageName).create.isSelect}
                    onChange={(e) => {
                        handlePermissionDB(e, record, roles.types.create);
                    }}
                />
            ),
        },
        {
            title: 'Sửa',
            dataIndex: roles.types.edit,
            render: (_, record) => (
                <Checkbox
                    checked={checked.find((x) => x.pageName === record.pageName).edit.isSelect}
                    onChange={(e) => {
                        handlePermissionDB(e, record, roles.types.edit);
                    }}
                />
            ),
        },
        {
            title: 'Xoá',
            dataIndex: roles.types.delete,
            render: (_, record) => (
                <Checkbox
                    checked={checked.find((x) => x.pageName === record.pageName).delete.isSelect}
                    onChange={(e) => {
                        handlePermissionDB(e, record, roles.types.delete);
                    }}
                />
            ),
        },
    ];
    useEffect(() => {
        (async () => {
            setLoading(true);
            // eslint-disable-next-line no-undef
            const resultPermissions = (await permissionService.getAllPermissions()).data.filter(
                (x) =>
                    !Object.values(defaultPermissions).some(
                        (y) => y.toLowerCase().trim() === x.name.toLowerCase().trim(),
                    ),
            );
            setPermissions(resultPermissions);
            setLoading(false);
        })();
    }, []);
    useEffect(() => {
        if (!data.every((x) => x.no) || !arrayLibrary.isGrow(data))
            setData((pre) => pre.map((x, i) => ({ ...x, no: i + 1 })));
    }, [data]);
    const fetchData = (params = {}) => {
        setLoading(true);
        (async () => {
            let res;
            if (params.searchText) {
                let searchText = ' ';
                Object.values(namePages).forEach((page, index) => {
                    if (page.text.toLowerCase().trim().includes(params.searchText.toLowerCase().trim()))
                        searchText += page.name + ' ';
                });
                searchText = searchText.trim();
                if (!searchText) searchText = '*';

                res = await permissionDetailService.searchControllerNames(
                    params.permissionId,
                    searchText,
                    params.pagination.current,
                    params.pagination.pageSize,
                );
            } else
                res = await permissionDetailService.getControllerNamesPaging(
                    params.permissionId,
                    params.pagination.current,
                    params.pagination.pageSize,
                );
            setLoading(false);

            const newData = res.data.map(({ pageName, permissionPageDetails }) => {
                let obj = { pageName };
                permissionPageDetails.forEach(({ permission, isSelect }) => {
                    obj = {
                        ...obj,
                        ...roles.getRolesName(permission, isSelect),
                    };
                });
                return obj;
            });
            setChecked(newData);
            setData(newData);
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
        const permissionId = form.getFieldValue('permissionId');
        if (permissionId !== -1)
            fetchData({
                permissionId,
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
        const permissionId = form.getFieldValue('permissionId');
        if (permissionId !== -1)
            if (debounced)
                fetchData({
                    permissionId,
                    pagination: newPagination,
                    searchText: debounced,
                });
            else
                fetchData({
                    permissionId,
                    pagination: newPagination,
                });
    };
    const handleChangPagination = (page, pageSize) => {
        if (page > 1) history(configRoutes.page + page);
        else history('.');
        handleSetData({ page, pageSize });
    };
    const handlePermission = () => {
        handleSetData();
    };
    return (
        <>
            <Head title={`${configTitle.permissionDetail}`} />

            <ManagerHeader noAdd pageName={namePages.PermissionDetails.name} />
            <div
                className="site-layout-background"
                style={{
                    padding: 24,
                    minHeight: 360,
                }}
            >
                <Form
                    form={form}
                    name="wrap"
                    labelCol={{
                        flex: '110px',
                    }}
                    labelAlign="left"
                    labelWrap
                    wrapperCol={{
                        flex: 1,
                    }}
                    colon={false}
                >
                    <Row gutter={[16, 0]}>
                        <Col span={24} sm={{ span: 12 }}>
                            <Form.Item
                                rules={[
                                    { required: true },
                                    {
                                        message: 'Vui lòng chọn quyền.',
                                        validator: (rule, value, cb) =>
                                            value <= -1 ? cb('Vui lòng chọn quyền.') : cb(),
                                    },
                                ]}
                                label="Quyền"
                                name="permissionId"
                                initialValue={-1}
                            >
                                <Select onChange={handlePermission}>
                                    <Select.Option value={-1}>Chọn quyền</Select.Option>
                                    {permissions.map((x) => (
                                        <Select.Option value={x.id}>{x.name}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
                <Table
                    bordered
                    title={() => 'Phân quyền'}
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
        </>
    );
};
export default Manager;
