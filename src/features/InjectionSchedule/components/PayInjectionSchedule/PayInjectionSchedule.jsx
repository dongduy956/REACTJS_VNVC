import { Button, Col, Form, Input, notification, Row, Select, Spin } from 'antd';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { configStorage } from '~/configs';
import { point } from '~/constraints';
import {
    conditionPromotionService,
    customerRankDetailService,
    customerRankService,
    injectionScheduleDetailService,
    payDetailService,
    paymentMethodService,
    payService,
    promotionService,
    vaccinePriceService,
} from '~/services';
import { stringLibrary } from '~/utils';

const PayInjectionSchedule = ({ open, injectionSchedule, setOpen, setLoading, setCheckUpdate }) => {
    const [formPay] = Form.useForm();
    const [injectionScheduleDetails, setInjectionScheduleDetails] = useState([]);
    const [discountPackages, setDiscountPackages] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [promotionIds, setPromotionIds] = useState([]);
    //lấy các dữ liệu tương ứng gán vào các state
    useEffect(() => {
        (async () => {
            const resultInjectionScheduleDetails = (
                await injectionScheduleDetailService.getInjectionScheduleDetails(injectionSchedule.id ?? 0)
            ).data;
            setInjectionScheduleDetails(resultInjectionScheduleDetails);
            const resultPaymentMethods = await paymentMethodService.getAllPaymentMethods();
            if (resultPaymentMethods.status !== 403) setPaymentMethods(resultPaymentMethods.data);
        })();
    }, [injectionSchedule]);
    //gán giá giảm giá cho từng vaccine có trong lịch và tính lại tiền (giảm giá nếu có)
    useEffect(() => {
        (async () => {
            setLoading(true);
            //khởi giá biến giảm gí gói vaccine
            let discountVaccinePackage = 0;
            //lặp qua từng chi tiết lịch gán giá và giảm tương ứng với từng chi tiết
            for (let i = 0; i < injectionScheduleDetails.length; i++) {
                let discount = 0,
                    price = 0;
                const resultVaccinePrice = await vaccinePriceService.getVaccinePriceLastByVaccineIdAndShipmentId(
                    injectionScheduleDetails[i].vaccineId,
                    injectionScheduleDetails[i].shipmentId,
                );
                if (resultVaccinePrice.isSuccess) {
                    price = resultVaccinePrice.data.preOderPrice;
                }
                const resultConditionPromotion = await conditionPromotionService.getConditionPromotionByVaccineId(
                    injectionScheduleDetails[i].vaccineId,
                );
                if (resultConditionPromotion.isSuccess) {
                    const promotionId = resultConditionPromotion.data.promotionId;
                    setPromotionIds((pre) => (pre.some((x) => x === promotionId) ? pre : [...pre, promotionId]));
                    const resultPromotion = await promotionService.getPromotion(promotionId);
                    if (resultPromotion.isSuccess) discount = resultPromotion.data.discount;
                }
                injectionScheduleDetails[i].total = (1 - Number(discount)) * Number(price);
                injectionScheduleDetails[i].discount = discount;
                injectionScheduleDetails[i].price = price;
            }
            //lấy danh sách id các gói có trong lịch tiêm
            const vaccinePackageIds = injectionScheduleDetails.reduce(
                (newArr, item) =>
                    !item.vaccinePackageId || newArr.includes(item.vaccinePackageId)
                        ? newArr
                        : [...newArr, item.vaccinePackageId],
                [],
            );
            //lặp qua từng id gói
            for (let i = 0; i < vaccinePackageIds.length; i++) {
                //tính giảm giá mặc đỉnh của gói (tổng số lượng vaccine có trong gói/100)*tổng tiền các vaccine trong gói
                const totalVaccinePackage =
                    //tổng các gói
                    injectionScheduleDetails.reduce(
                        (sum, item) =>
                            item.vaccinePackageId === vaccinePackageIds[i] ? sum + Number(item.total) : sum,
                        0,
                    ) *
                    //lấy phần %=tổng số lượng các vaccine trong gói tương ứng/100
                    (1 -
                        injectionScheduleDetails.reduce(
                            (sum, item) => (item.vaccinePackageId === vaccinePackageIds[i] ? sum + 1 : sum),
                            0,
                        ) /
                            100);
                const resultConditionPromotionVaccinePackageId =
                    await conditionPromotionService.getConditionPromotionByVaccinePackageId(vaccinePackageIds[i]);
                if (resultConditionPromotionVaccinePackageId.isSuccess) {
                    const promotionId = resultConditionPromotionVaccinePackageId.data.promotionId;
                    setPromotionIds((pre) => (pre.some((x) => x === promotionId) ? pre : [...pre, promotionId]));
                    const resultPromotion = await promotionService.getPromotion(promotionId);
                    if (resultPromotion.isSuccess) {
                        setDiscountPackages((pre) => [
                            ...pre,
                            { vaccinePackageId: vaccinePackageIds[i], discount: Number(resultPromotion.data.discount) },
                        ]);

                        discountVaccinePackage += (1 - Number(resultPromotion.data.discount)) * totalVaccinePackage;
                    } else {
                        discountVaccinePackage += totalVaccinePackage;
                        setDiscountPackages((pre) => [...pre, { vaccinePackageId: vaccinePackageIds[i], discount: 0 }]);
                    }
                } else {
                    discountVaccinePackage += totalVaccinePackage;
                    setDiscountPackages((pre) => [...pre, { vaccinePackageId: vaccinePackageIds[i], discount: 0 }]);
                }
            }
            const temporaryMoney =
                discountVaccinePackage +
                //tổng tiền vaccine lẻ
                injectionScheduleDetails.reduce(
                    (sum, item) => (item.vaccinePackageId ? sum : sum + Number(item.total)),
                    0,
                );
            formPay.setFieldsValue({
                temporaryMoney: stringLibrary.formatMoney(temporaryMoney),
            });
            setLoading(false);
            await setDiscountCustomerRankPaymentMethod();
        })();
    }, [injectionScheduleDetails]);
    //cập nhật lại giảm giá xếp loại khách hàng, phương thức thanh toán
    const setDiscountCustomerRankPaymentMethod = async () => {
        setLoading(true);
        //khởi tạo biến giảm giá phương thức thanh toán, xếp loại khách hàng
        let discountPaymentMethod = 0,
            discountCustomerRank = 0;
        //lấy giảm giá phương thức thanh toán
        const resultConditionPromotionPaymentMethod =
            await conditionPromotionService.getConditionPromotionByPaymentMethodId(
                formPay.getFieldValue('paymentMethodId'),
            );
        if (resultConditionPromotionPaymentMethod.isSuccess) {
            const promotionId = resultConditionPromotionPaymentMethod.data.promotionId;
            setPromotionIds((pre) => (pre.some((x) => x === promotionId) ? pre : [...pre, promotionId]));
            const resultPromotion = await promotionService.getPromotion(promotionId);
            if (resultPromotion.isSuccess) discountPaymentMethod = resultPromotion.data.discount;
        }
        //lấy giảm giá xếp loại khách hàng
        const resultCustomerRank = await customerRankService.getCustomerRankByCustomerId(injectionSchedule.customerId);
        if (resultCustomerRank.isSuccess) {
            const resultConditionPromotionCustomerRank =
                await conditionPromotionService.getConditionPromotionByCustomerRankId(resultCustomerRank.data.id);
            if (resultConditionPromotionCustomerRank.isSuccess) {
                const promotionId = resultConditionPromotionCustomerRank.data.promotionId;
                setPromotionIds((pre) => (pre.some((x) => x === promotionId) ? pre : [...pre, promotionId]));
                const resultPromotion = await promotionService.getPromotion(promotionId);
                if (resultPromotion.isSuccess) {
                    discountCustomerRank = resultPromotion.data.discount;
                }
            }
        }

        const temporaryMoney = stringLibrary.unFormatMoney(formPay.getFieldValue('temporaryMoney'));
        const discountMoney = -(discountCustomerRank + discountPaymentMethod) * temporaryMoney;
        //gán lại UI
        formPay.setFieldsValue({
            discount: stringLibrary.formatMoney(discountMoney),
            paidMoney: stringLibrary.formatMoney(temporaryMoney + discountMoney),
        });
        setLoading(false);
    };
    //xử lý khi chọn phương thức thanh toán
    const handlePaymentMethod = async () => {
        await setDiscountCustomerRankPaymentMethod();
    };
    const handleGuestMoney = (e) => {
        formPay.setFieldsValue({
            excessMoney: stringLibrary.formatMoney(
                Number(e.target.value) - stringLibrary.unFormatMoney(formPay.getFieldValue('paidMoney')),
            ),
        });
    };
    const onPay = async (params) => {
        //lấy id nhân viên đang đăng nhập
        const staffId = JSON.parse(Cookies.get(configStorage.login)).user.staffId;
        // thêm thanh toán
        const resultInsertPay = await payService.insertPay({
            staffId,
            injectionScheduleId: injectionSchedule.id,
            payer: params.payer,
            paymentMethodId: params.paymentMethodId,
            guestMoney: params.guestMoney,
            excessMoney: stringLibrary.unFormatMoney(params.excessMoney),
            discount: (
                stringLibrary.unFormatMoney(params.discount) / stringLibrary.unFormatMoney(params.temporaryMoney)
            ).toFixed(1),
        });
        if (resultInsertPay.isSuccess) {
            //khởi tạo và gán giá chi ds chi tiết thanh toán
            const listPayDetail = injectionScheduleDetails.reduce((arr, item) => {
                const discountPackage = discountPackages.find(
                    (x) => x.vaccinePackageId === item.vaccinePackageId,
                )?.discount;
                if (
                    item.vaccinePackageId &&
                    arr.find(
                        (x) =>
                            x.vaccinePackageId === item.vaccinePackageId &&
                            x.shipmentId === item.shipmentId &&
                            x.vaccineId === item.vaccineId,
                    )
                ) {
                    const index = arr.findIndex(
                        (x) => x.shipmentId === item.shipmentId && x.vaccinePackageId === item.vaccinePackageId,
                    );
                    arr.splice(index, 1, {
                        ...arr[index],
                        number: arr[index].number + 1,
                    });
                } else
                    arr = [
                        ...arr,
                        {
                            number: 1,
                            price: item.price,
                            discount: item.discount,
                            vaccineId: item.vaccineId,
                            shipmentId: item.shipmentId,
                            payId: resultInsertPay.data.id,
                            vaccinePackageId: item.vaccinePackageId,
                            discountPackage,
                        },
                    ];
                return arr;
            }, []);
            //thêm ds chi tiết thanh toán vào db
            const resultInsertPayDetail = await payDetailService.insertPayDetailsRange(listPayDetail);
            if (resultInsertPayDetail.isSuccess) {
                //thêm chi tiết xếp loại khách hàng vào db
                const resultInsertCustomerRankDetail = await customerRankDetailService.insertCustomerRankDetail({
                    customerId: injectionSchedule.customerId,
                    payId: resultInsertPay.data.id,
                    point: Math.floor(Number(stringLibrary.unFormatMoney(params.paidMoney)) / point),
                });
                if (resultInsertCustomerRankDetail.isSuccess) {
                    const idsInjectionScheduleDetail = injectionScheduleDetails.reduce(
                        (ids, item) => [...ids, item.id],
                        [],
                    );
                    //cập nhật lại trạng đã thanh toán vào db
                    const resultUpdateScheduleDetail =
                        await injectionScheduleDetailService.updatePayInjectionScheduleDetails(
                            idsInjectionScheduleDetail,
                        );
                    //update lại số lượt dùng mã giảm giá nếu có
                    if (promotionIds.length > 0) await promotionService.updateCountPromotionsRange(promotionIds);
                    if (resultUpdateScheduleDetail.isSuccess) {
                        notification.success({
                            message: 'Thành công',
                            description: 'Cập nhật thanh toán thành công.',
                            duration: 3,
                        });
                        setCheckUpdate((pre) => !pre);
                        setOpen(false);
                    }
                }
            }
        }
    };
    return (
        <>
            <div
                className={`fixed top-0 left-0 right-0 bottom-0 bg-[rgba(0,0,0,0.5)] ${
                    open
                        ? 'transition delay-150 duration-300 ease-in-out opacity-100 z-[100]'
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
                        ? 'transition delay-150 duration-300 ease-in-out rotate-0 opacity-100 scale-100 z-[100]'
                        : 'transition delay-150 duration-300 ease-in-out opacity-0 rotate-90 scale-0 z-[-1]'
                }`}
            >
                <div className="flex justify-between items-center border-b-[1px] border-b-[#e6edf0]">
                    <h2 className="m-0 ml-5">Thanh toán</h2>
                    <Button onClick={() => setOpen(false)} type="link">
                        X
                    </Button>
                </div>
                <Row className="md:min-w-[700px] min-w-full max-h-[500px] overflow-y-scroll overflow-x-hidden">
                    <Form
                        name="wrap"
                        labelAlign="left"
                        labelWrap
                        wrapperCol={{
                            flex: 1,
                        }}
                        colon={false}
                        onFinish={onPay}
                        className="w-full p-4"
                        form={formPay}
                        labelCol={{
                            flex: '200px',
                        }}
                    >
                        <Row gutter={[16, 0]}>
                            <Col span={24}>
                                <Form.Item label="Tạm tính" name="temporaryMoney">
                                    <Input disabled />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item label="Giảm giá" name="discount">
                                    <Input disabled />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item label="Tiền phải trả" name="paidMoney">
                                    <Input disabled />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    label="Phương thức thanh toán"
                                    name="paymentMethodId"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                        {
                                            validator: (rule, value, cb) =>
                                                value <= -1 ? cb('Vui lòng chọn phương thức thanh toán') : cb(),
                                            message: 'Vui lòng chọn phương thức thanh toán',
                                        },
                                    ]}
                                    initialValue={-1}
                                >
                                    <Select onChange={handlePaymentMethod}>
                                        <Select.Option value={-1}>Chọn phương thức thanh toán</Select.Option>
                                        {paymentMethods.map((paymentMethod) => (
                                            <Select.Option key={paymentMethod.id} value={paymentMethod.id}>
                                                {paymentMethod.name}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    label="Người thanh toán"
                                    name="payer"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập đầy đủ người thanh toán.',
                                        },
                                    ]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    label="Tiền khách đưa"
                                    name="guestMoney"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui nhập số tiền khách đưa.',
                                        },
                                        {
                                            validator: (rule, value, cb) =>
                                                value <= 0 ? cb('Tiền khách đưa phải lớn hơn 0.') : cb(),
                                            message: 'Tiền khách đưa phải lớn hơn 0.',
                                        },
                                    ]}
                                >
                                    <Input type="number" onChange={handleGuestMoney} />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    label="Tiền thừa"
                                    name="excessMoney"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập tiền khách đưa để hiển thị tiền thừa.',
                                        },
                                        {
                                            validator: (rule, value, cb) => {
                                                value[0] === '-' ? cb('Khách đưa không đủ tiền') : cb();
                                            },
                                            message: 'Khách đưa không đủ tiền.',
                                        },
                                    ]}
                                >
                                    <Input disabled />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item>
                                    <Button className="ml-2" type="primary" htmlType="submit">
                                        Thêm
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Row>
            </div>
        </>
    );
};

export default PayInjectionSchedule;
