import { Button, Col, Form, notification, Row } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import { injectionIncidentService } from '~/services';

function AddInjectionIncident({ open, injectionScheduleDetail, setOpen, setLoading, setCheckUpdate }) {
    const [form] = Form.useForm();

    const onSubmit = async (params) => {
        setLoading(true);
        const resultInsertInjectionIncident = await injectionIncidentService.insertInjectionIncident({
            content: params.content,
            injectionTime: injectionScheduleDetail.injectionTime,
            injectionScheduleId: injectionScheduleDetail.injectionScheduleId,
            vaccineId: injectionScheduleDetail.vaccineId,
            shipmentId: injectionScheduleDetail.shipmentId,
        });
        if (resultInsertInjectionIncident.isSuccess)
            notification.success({
                message: 'Thành công',
                description: resultInsertInjectionIncident.messages[0],
                duration: 3,
            });
        else
            notification.error({
                message: 'Lỗi',
                description: resultInsertInjectionIncident.messages[0],
                duration: 3,
            });
        setLoading(false);
        setOpen(false);
        setCheckUpdate((pre) => !pre);
    };
    return (
        <>
            <div
                onClick={() => setOpen(false)}
                className={`fixed top-0 left-0 right-0 bottom-0 bg-[rgba(0,0,0,0.5)] ${
                    open
                        ? 'transition delay-150 duration-300 ease-in-out opacity-100 z-[1000]'
                        : 'transition delay-150 duration-300 ease-in-out opacity-0 z-[-1]'
                }`}
            ></div>
            <div
                style={{
                    boxShadow:
                        '0 3px 1px -2px rgb(41 66 112 / 12%), 0 2px 2px 0 rgb(41 66 112 / 12%), 0 1px 5px 0 rgb(41 66 112 / 12%)',
                }}
                className={`bg-white rounded-[10px] fixed top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] md:w-min w-[calc(100%-30px)] ${
                    open
                        ? 'transition delay-150 duration-300 ease-in-out rotate-0 opacity-100 scale-100 z-[10000]'
                        : 'transition delay-150 duration-300 ease-in-out opacity-0 rotate-90 scale-0 z-[-1]'
                }`}
            >
                <div className="flex justify-between items-center border-b-[1px] border-b-[#e6edf0]">
                    <h2 className="m-0 ml-5">Báo cáo sự cố</h2>
                    <Button onClick={() => setOpen(false)} type="link">
                        X
                    </Button>
                </div>
                <Row className="md:min-w-[700px] min-w-full">
                    <Form
                        name="wrap"
                        labelAlign="left"
                        labelWrap
                        wrapperCol={{
                            flex: 1,
                        }}
                        colon={false}
                        onFinish={onSubmit}
                        className="w-full p-4"
                        form={form}
                        labelCol={{
                            flex: '200px',
                        }}
                    >
                        <Row gutter={[16, 0]}>
                            <Col span={24}>
                                <Form.Item
                                    label="Nội dung sự cố"
                                    name="content"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập nội dung sự cố.',
                                        },
                                    ]}
                                >
                                    <TextArea rows={4} />
                                </Form.Item>
                            </Col>

                            <Col span={24}>
                                <Form.Item>
                                    <Button className="ml-2" type="primary" htmlType="submit">
                                        Báo cáo
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Row>
            </div>
        </>
    );
}

export default AddInjectionIncident;
