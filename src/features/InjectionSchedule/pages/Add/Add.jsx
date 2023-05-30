import { ExclamationCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Button, Checkbox, Col, DatePicker, Form, Input, Modal, notification, Row, Select, Spin } from 'antd';
import Cookies from 'js-cookie';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Head from '~/components/Head';
import ModalCustom from '~/components/Modal';
import TitleAddUpdate from '~/components/TitleAddUpdate';
import { configRoutes, configStorage, configTitle } from '~/configs';
import { defaultUTC, injectionStaff, point } from '~/constraints';
import { useAuth } from '~/hooks';
import {
    conditionPromotionService,
    customerRankDetailService,
    customerRankService,
    customerService,
    injectionScheduleDetailService,
    injectionScheduleService,
    payDetailService,
    paymentMethodService,
    payService,
    promotionService,
    regulationCustomerService,
    regulationInjectionService,
    shipmentService,
    staffService,
    vaccinePackageDetailService,
    vaccinePackageService,
    vaccinePriceService,
    vaccineService,
} from '~/services';
import { dateLibrary, readDetail, stringLibrary } from '~/utils';
import AddInjectionScheduleDetail from '../../components/AddInjectionScheduleDetail';
const Add = () => {
    useAuth();
    const [dataModalVaccine, setDataModalVaccine] = useState({});
    const [openModalVaccine, setOpenModalVaccine] = useState(false);
    const [dataModalShipment, setDataModalShipment] = useState({});
    const [openModalShipment, setOpenModalShipment] = useState(false);
    const [dataModalNominator, setDataModalNominator] = useState({});
    const [openModalNominator, setOpenModalNominator] = useState(false);
    const [dataModalInjectionStaff, setDataModalInjectionStaff] = useState({});
    const [openModalInjectionStaff, setOpenModalInjectionStaff] = useState(false);
    const [dataModalCustomer, setDataModalCustomer] = useState({});
    const [openModalCustomer, setOpenModalCustomer] = useState(false);
    const [dataModalVaccinePackage, setDataModalVaccinePackage] = useState({});
    const [openModalVaccinePackage, setOpenModalVaccinePackage] = useState(false);
    const { confirm } = Modal;
    const [form] = Form.useForm();
    const [formPay] = Form.useForm();
    const history = useNavigate();
    const [loading, setLoading] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [shipments, setShipments] = useState([]);
    const [vaccines, setVaccines] = useState([]);
    const [vaccinePackages, setVaccinePackages] = useState([]);
    const [staffs, setStaffs] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [injectionScheduleDetails, setInjectionScheduleDetails] = useState([]);
    const [checkVaccinePackage, setCheckVaccinePackage] = useState(false);
    const [checkPreOrder, setCheckPreOrder] = useState(false);
    const [discountPackages, setDiscountPackages] = useState([]);
    const [promotionIds, setPromotionIds] = useState([]);
    //lấy danh sách các bảng khi khởi tạo
    useEffect(() => {
        (async () => {
            setLoading(true);
            //lấy danh sách khách hàng đủ điều kiện tiêm
            const customers = (await customerService.getCustomersEligible()).data;
            setCustomers(customers);
            //lấy danh sách nhân viên chức vụ là bác sĩ
            const staffs = (await staffService.getAllStaffs()).data.filter(
                (x) => x.permissionName.toLowerCase().trim() === injectionStaff.doctor,
            );
            setStaffs(staffs);
            //lấy danh sách vaccine
            const vaccines = (await vaccineService.getAllVaccines()).data;
            setVaccines(vaccines);
            //lấy danh sách phương thức thanh toán
            const paymentMethods = (await paymentMethodService.getAllPaymentMethods()).data;
            setPaymentMethods(paymentMethods);
            setLoading(false);
        })();
    }, []);
    //tính tiền và giảm giá khi thêm vaccine hoặc gói vaccine
    useEffect(() => {
        (async () => {
            setLoading(true);

            //khởi tạo các giảm giá
            let discountVaccinePackage = 0;
            //lấy danh sách id gói vacine
            const vaccinePackageIds = injectionScheduleDetails.reduce(
                (newArr, item) =>
                    !item.vaccinePackageId || newArr.includes(item.vaccinePackageId)
                        ? newArr
                        : [...newArr, item.vaccinePackageId],
                [],
            );
            //lặp qua danh sách id gói
            for (let i = 0; i < vaccinePackageIds.length; i++) {
                //tổng tiền từng gói vaccine
                const totalVaccinePackage =
                    injectionScheduleDetails.reduce(
                        (sum, item) =>
                            item.vaccinePackageId === vaccinePackageIds[i] ? sum + Number(item.total) : sum,
                        0,
                    ) *
                    //giảm giá mặc định của gói: tổng số lượng vaccine của gói đó / 100
                    (1 -
                        injectionScheduleDetails.reduce(
                            (sum, item) => (item.vaccinePackageId === vaccinePackageIds[i] ? sum + 1 : sum),
                            0,
                        ) /
                            100);
                //lấy giảm giá của từng gói vaccine tương ứng
                const resultConditionPromotionVaccinePackageId =
                    await conditionPromotionService.getConditionPromotionByVaccinePackageId(vaccinePackageIds[i]);
                if (resultConditionPromotionVaccinePackageId.isSuccess) {
                    const promotionId = resultConditionPromotionVaccinePackageId.data.promotionId;
                    setPromotionIds((pre) => (pre.some((x) => x === promotionId) ? pre : [...pre, promotionId]));
                    const resultPromotion = await promotionService.getPromotion(promotionId);

                    //nếu có giảm giá set lại danh giảm giá gói và * thêm giảm giá ngược lại thì không
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
            //tính tổng tiền tạm tính
            const temporaryMoney =
                //gói vaccine
                discountVaccinePackage +
                //vaccine lẻ
                injectionScheduleDetails.reduce(
                    (sum, item) => (item.vaccinePackageId ? sum : sum + Number(item.total)),
                    0,
                );
            //gán lại UI
            formPay.setFieldsValue({
                temporaryMoney: stringLibrary.formatMoney(temporaryMoney),
            });
            setLoading(false);
            await setDiscountCustomerRankPaymentMethod();
        })();
    }, [injectionScheduleDetails]);

    //thêm các vaccine của 1 gói vào chi tiết lịch tiêm (chưa lưu db)
    const addVaccinePackageDetails = async (params, resultVaccinePackageDetails, vaccinePackageDetailsQuantity) => {
        //giá trị state gán vào biến new
        const newInjectionScheduleDetails = [...injectionScheduleDetails];
        //biến kiểm tra đã hết hàng hay chưa (false: còn, true: hết hàng)
        let checkQuantityRemain = false;
        //kiểm tra các vaccine của 1 gói còn hàng hay không.
        for (let i = 0; i < vaccinePackageDetailsQuantity.length; i++) {
            const resultShipment = await shipmentService.getShipment(vaccinePackageDetailsQuantity[i].shipmentId);
            if (resultShipment.data.quantityRemain < vaccinePackageDetailsQuantity[i].numberOfInjections) {
                notification.warn({
                    message: 'Cảnh báo',
                    description: 'Gói vaccine lô vaccine hiện không đủ vaccine.',
                    duration: 3,
                });
                checkQuantityRemain = true;
                break;
            }
        }
        //còn hàng
        if (!checkQuantityRemain) {
            for (const item of resultVaccinePackageDetails.data) {
                //lấy quy định khách hàng để lấy liều lượng
                const customerId = form.getFieldValue('customerId');
                let amount = 0;
                if (customerId !== -1) {
                    const customer = customers.find((customer) => customer.id === customerId);
                    if (customer) {
                        const resultRegulationCustomer =
                            await regulationCustomerService.getRegulationCustomerByCustomerTypeIdAndVaccineId(
                                customer.customerTypeId,
                                item.vaccineId,
                            );
                        amount = resultRegulationCustomer.data?.amount;
                    }
                }
                //lấy giá hiện tại của vaccine
                const resultVaccinePrice = await vaccinePriceService.getVaccinePriceLastByVaccineIdAndShipmentId(
                    item.vaccineId,
                    item.shipmentId,
                );
                const price = resultVaccinePrice.data.retailPrice;
                //lấy giảm giá của vaccine nếu có
                let discount = 0;
                const resultConditionPromotion = await conditionPromotionService.getConditionPromotionByVaccineId(
                    item.vaccineId,
                );
                if (resultConditionPromotion.isSuccess) {
                    const promotionId = resultConditionPromotion.data.promotionId;
                    setPromotionIds((pre) => (pre.some((x) => x === promotionId) ? pre : [...pre, promotionId]));
                    const resultPromotion = await promotionService.getPromotion(promotionId);
                    if (resultPromotion.isSuccess) {
                        discount = resultPromotion.data.discount;
                    }
                }
                //tính lại tổng tiền theo giảm giá
                const total = (1 - Number(discount)) * Number(price);
                //lấy ra vị trí vaccine lẻ: !==-1 đã tồn tại trong lịch tiêm ngược lại thì chưa
                const index = newInjectionScheduleDetails.findIndex(
                    (newItem) => newItem.vaccineId === item.vaccineId && !newItem.vaccinePackageId,
                );
                for (let i = 1; i <= item.numberOfInjections; i++) {
                    let id = newInjectionScheduleDetails.length + 1;
                    const obj = {
                        id: id,
                        vaccineId: item.vaccineId,
                        shipmentId: item.shipmentId,
                        shipmentCode: item.shipmentCode,
                        vaccineName: item.vaccineName,
                        vaccinePackageId: item.vaccinePackageId,
                        vaccinePackageName: item.vaccinePackageName,
                        amount,
                        address: params.address,
                        injections: item.orderInjection,
                        injectionStaffId: params.injectionStaffId,
                        injectionStaffName: staffs.find((item) => item.id === params.injectionStaffId).staffName,
                        price,
                        discount,
                        total,
                        isGeneral: item.isGeneral,
                    };
                    //xoá đi vaccine lẻ chỉ 1 lần khi trùng với vaccine trong gói
                    if (index !== -1 && i === 1) newInjectionScheduleDetails.splice(index, 1, obj);
                    else newInjectionScheduleDetails.push(obj);
                    id++;
                }
            }
            setInjectionScheduleDetails(newInjectionScheduleDetails.map((item, index) => ({ ...item, id: index + 1 })));
        }
    };
    //thêm 1 gói hoặc vaccine lẻ vào lịch tiêm (chưa lưu DB)
    const onFinish = async (params) => {
        setLoading(true);
        //các prop của lịch tiêm xoá đi
        delete params.note;
        delete params.nominatorId;
        delete params.date;
        delete params.customerId;
        params.id = injectionScheduleDetails.length + 1;
        //thêm gói vaccine
        if (checkVaccinePackage) {
            //kiểm tra có gói đó chưa
            const index = injectionScheduleDetails.findIndex(
                (item) => item.vaccinePackageId === params.vaccinePackageId,
            );
            if (index !== -1) {
                notification.warn({
                    message: 'Cảnh báo',
                    description: 'Đã có gói vaccine này.',
                    duration: 3,
                });
            } else {
                //lấy danh sách chi tiết gói theo id gói
                const resultVaccinePackageDetails =
                    await vaccinePackageDetailService.getVaccinePackageDetailsByVaccinePackageId(
                        form.getFieldValue('vaccinePackageId'),
                    );
                if (resultVaccinePackageDetails.isSuccess) {
                    //kiểm tra đã có vaccine của 1 gói
                    let checkHaveVaccine = false;
                    //kiểm tra lô vaccine đã hết hạn hay chưa
                    let checkShipmentExpires = false;
                    for (let i = 0; i < resultVaccinePackageDetails.data.length; i++) {
                        const resultShipment = await shipmentService.getShipment(
                            resultVaccinePackageDetails.data[i].shipmentId,
                        );
                        if (resultShipment.data.isSuccess === false) {
                            checkShipmentExpires = true;
                            break;
                        }
                    }

                    if (checkShipmentExpires)
                        notification.warning({
                            message: 'Cảnh báo',
                            description: 'Gói chứa lô vaccine đã hết hạn.',
                            duration: 3,
                        });
                    else {
                        const vaccinePackageDetailsQuantity = resultVaccinePackageDetails.data.map((item) => {
                            const checkShipments = injectionScheduleDetails.filter(
                                (x) => x.vaccinePackageId && x.shipmentId === item.shipmentId,
                            );

                            if (
                                //false mới vào kiểm tra
                                !checkHaveVaccine &&
                                //vaccine của 1 gói đã có trong lịch tiêm
                                injectionScheduleDetails.find(
                                    (x) => x.vaccinePackageId && x.vaccineId === item.vaccineId,
                                )
                            )
                                checkHaveVaccine = true;
                            return { ...item, numberOfInjections: checkShipments.length + item.numberOfInjections };
                        });
                        //cảnh báo trùng
                        if (checkHaveVaccine) {
                            confirm({
                                title: 'Trùng vaccine trong lịch tiêm. Bạn tiếp tục thêm?',
                                icon: <ExclamationCircleOutlined />,
                                content: 'Gói vaccine bạn đang thêm có vaccine trùng với vaccine trong lịch tiêm.',
                                onOk: async () => {
                                    await addVaccinePackageDetails(
                                        params,
                                        resultVaccinePackageDetails,
                                        vaccinePackageDetailsQuantity,
                                    );
                                },
                                onCancel() {},
                            });
                        } else
                            await addVaccinePackageDetails(
                                params,
                                resultVaccinePackageDetails,
                                vaccinePackageDetailsQuantity,
                            );
                    }
                }
            }
            //thêm vaccine lẻ
        } else {
            const resultShipment = await shipmentService.getShipment(params.shipmentId);
            //Lô vaccine còn hàng
            if (resultShipment.data.quantityRemain > 0) {
                //gán mã lô để hiện lên UI
                const shipment = shipments.find((shipment) => shipment.id === params.shipmentId);
                if (shipment) params.shipmentCode = shipment.shipmentCode;
                //kiểm tra vaccine đã có trong lịch tiêm hay chưa
                const index = injectionScheduleDetails.findIndex((item) => item.vaccineId === params.vaccineId);
                if (index !== -1) {
                    notification.warning({
                        message: '',
                        description: 'Đã có vaccine này.',
                        duration: 3,
                    });
                } else {
                    //hiển thị tên nhân tiêm lên UI
                    const staff = staffs.find((staff) => staff.id === params.injectionStaffId);
                    if (staff) params.injectionStaffName = staff.staffName;
                    //lấy giá
                    const resultVaccinePrice = await vaccinePriceService.getVaccinePriceLastByVaccineIdAndShipmentId(
                        params.vaccineId,
                        params.shipmentId,
                    );
                    params.price = resultVaccinePrice.data.retailPrice;
                    //lấy giảm vaccine nếu có
                    let discount = 0;
                    const resultConditionPromotion = await conditionPromotionService.getConditionPromotionByVaccineId(
                        params.vaccineId,
                    );
                    if (resultConditionPromotion.isSuccess) {
                        const promotionId = resultConditionPromotion.data.promotionId;
                        setPromotionIds((pre) => (pre.some((x) => x === promotionId) ? pre : [...pre, promotionId]));
                        const resultPromotion = await promotionService.getPromotion(promotionId);
                        if (resultPromotion.isSuccess) discount = resultPromotion.data.discount;
                    }
                    //gán giảm giá và params
                    params.discount = discount;
                    //tính lại tổng tiền theo giảm gía
                    params.total = (1 - Number(discount)) * Number(params.price);
                    //hiển thị tên vaccine lên UI
                    params.vaccineName = vaccines.find((vaccine) => vaccine.id === params.vaccineId).name;
                    //thêm 1 vaccine vào lịch tiêm
                    const newInjectionScheduleDetails = [...injectionScheduleDetails, params];
                    newInjectionScheduleDetails.map((item, index) => ({ ...item, id: index + 1 }));
                    //set lại state
                    setInjectionScheduleDetails(newInjectionScheduleDetails);
                }
            } else
                notification.warn({
                    message: 'Cảnh báo',
                    description: 'Lô vaccine này hiện không đủ vaccine.',
                    duration: 3,
                });
        }
        setLoading(false);
    };
    //tính lại giảm phương thức thanh toán khi dữ liệu thay đổi
    const setDiscountCustomerRankPaymentMethod = async () => {
        setLoading(true);
        let discountCustomerRank = 0;
        //lấy giảm giá xếp loại khách hàng
        const resultCustomerRank = await customerRankService.getCustomerRankByCustomerId(
            form.getFieldValue('customerId'),
        );
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

        let discountPaymentMethod = 0;
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
    // xử lý khi chọn 1 khách hàng
    const handleCustomer = async (customerId) => {
        //set lại lịch tiêm rỗng
        setInjectionScheduleDetails([]);
        //nếu có khách hàng và chọn vaccine lẻ
        if (customerId !== -1 && !checkVaccinePackage) {
            setLoading(true);

            const vaccineId = form.getFieldValue('vaccineId');
            //nếu chọn vaccine rồi thì lấy quy định khách hàng theo id vaccine và id loại khách hàng
            if (vaccineId !== 0) {
                const customer = customers.find((customer) => customer.id === customerId);
                if (customer) {
                    const resultRegulationCustomer =
                        await regulationCustomerService.getRegulationCustomerByCustomerTypeIdAndVaccineId(
                            customer.customerTypeId,
                            vaccineId,
                        );
                    if (resultRegulationCustomer.isSuccess) {
                        form.setFieldsValue({
                            amount: resultRegulationCustomer.data.amount,
                        });
                    }
                }
            }
            setLoading(false);
        } else
            form.setFieldsValue({
                vaccineId: -1,
                vaccinePackageId: -1,
                amount: '',
                injections: '',
            });
    };
    //xử lý tích chọn gói hoặc vaccine lẻ
    const handleCheckVaccinePackage = async (e) => {
        setLoading(true);
        setCheckVaccinePackage(e.target.checked);
        //gói
        if (e.target.checked) {
            form.setFieldsValue({
                amount: '',
            });
            //lấy lại danh sách gói và gán lên UI
            const vaccinePackages = (await vaccinePackageService.getVaccinePackages()).data;
            setVaccinePackages(vaccinePackages);
            //vaccine lẻ
        } else {
            //lấy lại danh sách lô vaccine và gán lên UI
            const shipments = (await shipmentService.getAllShipments()).data;
            setShipments(shipments);
        }
        //set lại dropdownlist không chọn vaccine hay gói nào
        form.setFieldsValue({
            vaccineId: -1,
            vaccinePackageId: -1,
        });
        setLoading(false);
    };
    //xử lý khi chọn lô vaccine
    const handleShipment = async () => {
        //vaccine lẻ
        if (!checkVaccinePackage) {
            setLoading(true);
            //lấy thông tin vaccine theo id vaccine
            const resultVaccine = await vaccineService.getVaccine(form.getFieldValue('vaccineId'));
            if (resultVaccine.isSuccess) {
                //lấy quy định tiêm nếu có thì gán lại UI
                const resultRegulationInjection = await regulationInjectionService.getRegulationInjectionByVaccineId(
                    resultVaccine.data.id,
                );
                if (resultRegulationInjection.isSuccess) {
                    form.setFieldsValue({
                        injections: resultRegulationInjection.data.order,
                    });
                }

                const customerId = form.getFieldValue('customerId');
                if (customerId !== -1) {
                    //lấy thông tin khách hàng theo id khách hàng
                    const customer = customers.find((customer) => customer.id === customerId);
                    if (customer) {
                        //lấy định khách hàng
                        const resultRegulationCustomer =
                            await regulationCustomerService.getRegulationCustomerByCustomerTypeIdAndVaccineId(
                                customer.customerTypeId,
                                resultVaccine.data.id,
                            );
                        //gán lại liều lượng vaccine
                        if (resultRegulationCustomer.isSuccess) {
                            form.setFieldsValue({
                                amount: resultRegulationCustomer.data.amount,
                            });
                        }
                    }
                }
            } else {
                form.setFieldsValue({
                    amount: '',
                });
            }
            setLoading(false);
        }
    };
    //xử lý khi chọn vaccine
    const handleVaccine = async (vaccineId) => {
        setLoading(true);
        //gán lại combobox lô vaccine chưa chọn
        form.setFieldsValue({
            shipmentId: -1,
        });
        //lấy danh sách lô vaccine theo id vaccine
        const resultShipments = await shipmentService.getShipmentsByVaccineId(vaccineId);
        setShipments(resultShipments.data);
        setLoading(false);
    };
    //lưu lịch tiêm, thanh toán nếu mua trực tiếp vào db
    const onFinishAll = async (params) => {
        //lịch tiêm trống không làm gì
        if (injectionScheduleDetails.length === 0) {
            notification.warn({
                message: 'Cảnh báo',
                description: 'Lịch tiêm trống.',
                duration: 3,
            });
            return;
        }
        setLoading(true);
        //lấy id nhân viên đang đăng nhập
        const staffId = JSON.parse(Cookies.get(configStorage.login)).user.staffId;
        // thêm lịch tiêm
        let dateAgain = new Date(form.getFieldValue('date').format());
        dateAgain = new Date(dateAgain.setHours(dateAgain.getHours() + defaultUTC.hours)).toISOString();
        const resultInsertInjectionSchedule = await injectionScheduleService.insertInjectionSchedule({
            staffId,
            customerId: form.getFieldValue('customerId'),
            date: dateAgain,
            nominatorId: form.getFieldValue('nominatorId'),
            note: form.getFieldValue('note'),
            priorities: checkPreOrder ? 0 : 1,
        });
        //thêm lịch tiêm thành công
        if (resultInsertInjectionSchedule.isSuccess) {
            //khởi tạo danh sách chi tiết lịch tiêm để thêm vào db
            const listInjectionScheduleDetail = injectionScheduleDetails.map((item) => ({
                injections: item.injections,
                amount: item.amount,
                address: item.address,
                pay: !checkPreOrder,
                injectionStaffId: item.injectionStaffId,
                vaccineId: item.vaccineId,
                injectionScheduleId: resultInsertInjectionSchedule.data.id,
                vaccinePackageId: item.vaccinePackageId,
                shipmentId: item.shipmentId,
            }));
            //thêm ds chi tiết lịch tiêm vào db
            const resultInsertInjectionScheduleDetail =
                await injectionScheduleDetailService.insertInjectionScheduleDetailsRange(listInjectionScheduleDetail);
            if (resultInsertInjectionScheduleDetail.isSuccess) {
                notification.success({
                    message: 'Thành công',
                    description: resultInsertInjectionSchedule.messages[0],
                    duration: 3,
                });
                //đặt trực tiếp thêm thanh toán
                if (!checkPreOrder) await addPay(params, resultInsertInjectionSchedule, staffId);
                //đặt trước
                else history(configRoutes.injectionSchedule);
            }
        }
        setLoading(false);
    };
    //thêm thanh toán
    const addPay = async (params, resultInsertInjectionSchedule, staffId) => {
        //thêm thanh toán vào db
        const resultInsertPay = await payService.insertPay({
            staffId,
            injectionScheduleId: resultInsertInjectionSchedule.data.id,
            payer: params.payer,
            paymentMethodId: params.paymentMethodId,
            guestMoney: params.guestMoney,
            excessMoney: Math.round(stringLibrary.unFormatMoney(params.excessMoney)),
            discount: (
                stringLibrary.unFormatMoney(params.discount) / stringLibrary.unFormatMoney(params.temporaryMoney)
            ).toFixed(1),
        });
        //thêm thành công
        if (resultInsertPay.isSuccess) {
            //khởi tạo danh sách chi tiết thanh toán
            const listPayDetail = injectionScheduleDetails.reduce((arr, item) => {
                //lấy ra giảm giá của 1 gói vaccine
                const discountPackage = discountPackages.find(
                    (x) => x.vaccinePackageId === item.vaccinePackageId,
                )?.discount;
                //nếu item này là gói và dã thêm vào array (arr)
                if (
                    item.vaccinePackageId &&
                    arr.find(
                        (x) =>
                            x.vaccinePackageId === item.vaccinePackageId &&
                            x.shipmentId === item.shipmentId &&
                            x.vaccineId === item.vaccineId,
                    )
                ) {
                    //lấy ra vị trí của lô vaccine trong arr
                    const index = arr.findIndex(
                        (x) => x.shipmentId === item.shipmentId && x.vaccinePackageId === item.vaccinePackageId,
                    );
                    //xoá 1 phần tử tại vị trí hiện tại
                    arr.splice(
                        index,
                        //xoá 1 phần tử
                        1,
                        //thêm phần tử mới vào tại vị trí vừa xoá
                        {
                            ...arr[index],
                            number: arr[index].number + 1,
                        },
                    );
                    //chưa thêm vào arr
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
                //thêm vào chi tiết xếp loại khách hàng khi thanh toán
                const resultInsertCustomerRankDetail = await customerRankDetailService.insertCustomerRankDetail({
                    customerId: form.getFieldValue('customerId'),
                    payId: resultInsertPay.data.id,
                    //điểm = tổng tiền thanh toán/số diểm quy định (100000)
                    point: Math.floor(Number(stringLibrary.unFormatMoney(params.paidMoney)) / point),
                });
                if (resultInsertCustomerRankDetail.isSuccess) {
                    if (promotionIds.length > 0) {
                        const resultUpdatePromotions = await promotionService.updateCountPromotionsRange(promotionIds);
                        if (resultUpdatePromotions.isSuccess) {
                            notification.success({
                                message: 'Thành công',
                                description: resultInsertPay.messages[0],
                                duration: 3,
                            });
                            history(configRoutes.injectionSchedule);
                        }
                    } else history(configRoutes.injectionSchedule);
                }
            }
        }
    };
    //xử lý khi nhập số tiền khách cần trả
    const handleGuestMoney = (e) => {
        formPay.setFieldsValue({
            excessMoney: stringLibrary.formatMoney(
                Number(e.target.value) - stringLibrary.unFormatMoney(formPay.getFieldValue('paidMoney')),
            ),
        });
    };
    //xử lý khi tích chọn đặt trước hay trực tiếp
    const handleCheckPreOrder = (e) => {
        setCheckPreOrder(e.target.checked);
    };
    //xử lý chọn hiển thị chi tiết 1 dòng trong bảng nào đó

    const handleDetailShipment = async () => {
        await readDetail(form, 'shipmentId', setLoading, 'shipment', setDataModalShipment, setOpenModalShipment);
    };
    const handleDetailVaccine = async () => {
        await readDetail(form, 'vaccineId', setLoading, 'vaccine', setDataModalVaccine, setOpenModalVaccine);
    };
    const handleDetailCustomer = async () => {
        await readDetail(form, 'customerId', setLoading, 'customer', setDataModalCustomer, setOpenModalCustomer);
    };
    const handleDetailVaccinePackage = async () => {
        await readDetail(
            form,
            'vaccinePackageId',
            setLoading,
            'vaccinePackage',
            setDataModalVaccinePackage,
            setOpenModalVaccinePackage,
        );
    };
    const handleDetailNominator = async () => {
        await readDetail(form, 'nominatorId', setLoading, 'staff', setDataModalNominator, setOpenModalNominator);
    };
    const handleDetailInjectionStaff = async () => {
        await readDetail(
            form,
            'injectionStaffId',
            setLoading,
            'staff',
            setDataModalInjectionStaff,
            setOpenModalInjectionStaff,
        );
    };
    return (
        <>
            <ModalCustom
                open={openModalVaccine}
                setOpen={setOpenModalVaccine}
                data={dataModalVaccine}
                title="Thông tin vaccine"
            />
            <ModalCustom
                open={openModalVaccinePackage}
                setOpen={setOpenModalVaccinePackage}
                data={dataModalVaccinePackage}
                title="Thông tin gói vaccine"
            />
            <ModalCustom
                open={openModalShipment}
                setOpen={setOpenModalShipment}
                data={dataModalShipment}
                title="Thông tin lô vaccine"
            />
            <ModalCustom
                open={openModalCustomer}
                setOpen={setOpenModalCustomer}
                data={dataModalCustomer}
                title="Thông tin khách hàng"
            />
            <ModalCustom
                open={openModalInjectionStaff}
                setOpen={setOpenModalInjectionStaff}
                data={dataModalInjectionStaff}
                title="Thông tin nhân viên tiêm"
            />
            <ModalCustom
                open={openModalNominator}
                setOpen={setOpenModalNominator}
                data={dataModalNominator}
                title="Thông tin bác sĩ chỉ định"
            />
            <Head title={`${configTitle.add} ${configTitle.injectionSchedule.toLowerCase()}`} />

            <Spin spinning={loading} tip="Loading...">
                <Row>
                    <TitleAddUpdate>Thêm lịch tiêm</TitleAddUpdate>
                    <Col span={24}>
                        <Form
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
                            onFinish={onFinish}
                            form={form}
                        >
                            <Row gutter={[16, 0]}>
                                <Col span={24} sm={{ span: 12 }}>
                                    <Form.Item
                                        label="Khách hàng"
                                        name="customerId"
                                        rules={[
                                            {
                                                required: true,
                                            },
                                            {
                                                validator: (rule, value, cb) =>
                                                    value <= -1 ? cb('Vui lòng chọn khách hàng') : cb(),
                                                message: 'Vui lòng chọn khách hàng',
                                            },
                                        ]}
                                        initialValue={-1}
                                    >
                                        <Select
                                            suffixIcon={<InfoCircleOutlined onClick={handleDetailCustomer} />}
                                            onChange={handleCustomer}
                                        >
                                            <Select.Option value={-1}>Chọn khách hàng</Select.Option>
                                            {customers.map((customer) => (
                                                <Select.Option key={customer.id} value={customer.id}>
                                                    {customer.firstName + ' ' + customer.lastName}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={24} sm={{ span: 12 }}>
                                    <Form.Item
                                        label="Bác sĩ chỉ định"
                                        name="nominatorId"
                                        rules={[
                                            {
                                                required: true,
                                            },
                                            {
                                                validator: (rule, value, cb) =>
                                                    value <= -1 ? cb('Vui lòng chọn bác sĩ chỉ định') : cb(),
                                                message: 'Vui lòng chọn bác sĩ chỉ định',
                                            },
                                        ]}
                                        initialValue={-1}
                                    >
                                        <Select suffixIcon={<InfoCircleOutlined onClick={handleDetailNominator} />}>
                                            <Select.Option value={-1}>Chọn bác sĩ chỉ định</Select.Option>
                                            {staffs.map((staff) => (
                                                <Select.Option key={staff.id} value={staff.id}>
                                                    {staff.staffName}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={24} md={{ span: 12 }}>
                                    <Form.Item
                                        initialValue={moment(new Date(), 'dd/MM/yyyy')}
                                        label="Ngày hẹn"
                                        name="date"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng nhập ngày hẹn.',
                                            },
                                            {
                                                validator: (rule, value, cb) =>
                                                    dateLibrary.lessThanToday(new Date(value.format()))
                                                        ? cb('Ngày hẹn không được nhỏ hơn ngày hiện tại.')
                                                        : cb(),
                                                message: 'Ngày hẹn không được nhỏ hơn ngày hiện tại.',
                                            },
                                        ]}
                                    >
                                        <DatePicker style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                                <Col span={24} md={{ span: 12 }}>
                                    <Form.Item>
                                        <Checkbox onChange={handleCheckVaccinePackage} checked={checkVaccinePackage}>
                                            {checkVaccinePackage ? 'Gói vaccine' : 'Vaccine lẻ'}
                                        </Checkbox>
                                    </Form.Item>
                                </Col>
                                {checkVaccinePackage ? (
                                    <Col span={24} sm={{ span: 12 }}>
                                        <Form.Item
                                            label="Gói vaccine"
                                            name="vaccinePackageId"
                                            rules={[
                                                {
                                                    required: true,
                                                },
                                                {
                                                    validator: (rule, value, cb) =>
                                                        value <= -1 ? cb('Vui lòng chọn gói vaccine') : cb(),
                                                    message: 'Vui lòng chọn gói vaccine',
                                                },
                                            ]}
                                            initialValue={-1}
                                        >
                                            <Select
                                                suffixIcon={<InfoCircleOutlined onClick={handleDetailVaccinePackage} />}
                                            >
                                                <Select.Option value={-1}>Chọn gói vaccine</Select.Option>
                                                {vaccinePackages.map((vaccinePackage) => (
                                                    <Select.Option key={vaccinePackage.id} value={vaccinePackage.id}>
                                                        {vaccinePackage.name}
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                ) : (
                                    <>
                                        <Col span={24} sm={{ span: 12 }}>
                                            <Form.Item
                                                label="Vaccine"
                                                name="vaccineId"
                                                rules={[
                                                    {
                                                        required: true,
                                                    },
                                                    {
                                                        validator: (rule, value, cb) =>
                                                            value <= -1 ? cb('Vui lòng chọn vaccine.') : cb(),
                                                        message: 'Vui lòng chọn vaccine.',
                                                    },
                                                ]}
                                                initialValue={-1}
                                            >
                                                <Select
                                                    suffixIcon={<InfoCircleOutlined onClick={handleDetailVaccine} />}
                                                    onChange={handleVaccine}
                                                >
                                                    <Select.Option value={-1}>Chọn vaccine</Select.Option>
                                                    {vaccines.map((vaccine) => (
                                                        <Select.Option key={vaccine.id} value={vaccine.id}>
                                                            {vaccine.name}
                                                        </Select.Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col span={24} sm={{ span: 12 }}>
                                            <Form.Item
                                                label="Lô hàng"
                                                name="shipmentId"
                                                rules={[
                                                    {
                                                        required: true,
                                                    },
                                                    {
                                                        validator: (rule, value, cb) =>
                                                            value <= -1 ? cb('Vui lòng chọn lô hàng.') : cb(),
                                                        message: 'Vui lòng chọn lô hàng.',
                                                    },
                                                ]}
                                                initialValue={-1}
                                            >
                                                <Select
                                                    suffixIcon={<InfoCircleOutlined onClick={handleDetailShipment} />}
                                                    onChange={handleShipment}
                                                >
                                                    <Select.Option value={-1}>Chọn lô hàng</Select.Option>
                                                    {shipments.map((shipment) => (
                                                        <Select.Option key={shipment.id} value={shipment.id}>
                                                            {shipment.shipmentCode}
                                                        </Select.Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                        </Col>

                                        <Col span={24} sm={{ span: 12 }}>
                                            <Form.Item
                                                label="Thứ tự tiêm"
                                                name="injections"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            'Vui lòng chọn khách hàng và chọn vaccine để biết mũi tiêm thứ mấy.',
                                                    },
                                                ]}
                                            >
                                                <Input disabled />
                                            </Form.Item>
                                        </Col>
                                        <Col span={24} sm={{ span: 12 }}>
                                            <Form.Item
                                                label="Liều lượng"
                                                name="amount"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Vui lòng chọn khách hàng để hiển thị liều lượng.',
                                                    },
                                                ]}
                                            >
                                                <Input disabled />
                                            </Form.Item>
                                        </Col>
                                    </>
                                )}

                                <Col span={24} sm={{ span: 12 }}>
                                    <Form.Item
                                        label="Nhân viên tiêm"
                                        name="injectionStaffId"
                                        rules={[
                                            {
                                                required: true,
                                            },
                                            {
                                                validator: (rule, value, cb) =>
                                                    value <= -1 ? cb('Vui lòng chọn nhân viên tiêm.') : cb(),
                                                message: 'Vui lòng chọn nhân viên tiêm.',
                                            },
                                        ]}
                                        initialValue={-1}
                                    >
                                        <Select
                                            suffixIcon={<InfoCircleOutlined onClick={handleDetailInjectionStaff} />}
                                        >
                                            <Select.Option value={-1}>Chọn nhân viên tiêm</Select.Option>
                                            {staffs.map((staff) => (
                                                <Select.Option key={staff.id} value={staff.id}>
                                                    {staff.staffName}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>

                                <Col span={24} sm={{ span: 12 }}>
                                    <Form.Item
                                        label="Địa chỉ"
                                        name="address"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng nhập địa chỉ.',
                                            },
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={24} sm={{ span: 12 }}>
                                    <Form.Item label="Ghi chú" name="note">
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item label="">
                                        <Button className="ml-2" type="primary" htmlType="submit">
                                            Thêm
                                        </Button>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                    <Col span={24}>
                        <Col span={24}>
                            <AddInjectionScheduleDetail
                                setInjectionScheduleDetails={setInjectionScheduleDetails}
                                injectionScheduleDetails={injectionScheduleDetails}
                            />
                        </Col>
                    </Col>
                    <Col span={24}>
                        <Form
                            name="wrap"
                            labelCol={{
                                flex: '150px',
                            }}
                            labelAlign="left"
                            labelWrap
                            wrapperCol={{
                                flex: 1,
                            }}
                            colon={false}
                            form={formPay}
                            onFinish={onFinishAll}
                        >
                            <Row className="mt-4" gutter={[16, 0]}>
                                <Col span={24} md={{ span: 10 }}>
                                    <Form.Item>
                                        <Checkbox onChange={handleCheckPreOrder} checked={checkPreOrder}>
                                            {checkPreOrder ? 'Đặt trước' : 'Trực tiếp'}
                                        </Checkbox>
                                    </Form.Item>
                                </Col>

                                {!checkPreOrder && (
                                    <>
                                        <Col span={24} md={{ span: 14 }}>
                                            <Form.Item
                                                label="Phương thức thanh toán"
                                                name="paymentMethodId"
                                                rules={[
                                                    {
                                                        required: true,
                                                    },
                                                    {
                                                        validator: (rule, value, cb) =>
                                                            value <= -1
                                                                ? cb('Vui lòng chọn phương thức thanh toán')
                                                                : cb(),
                                                        message: 'Vui lòng chọn phương thức thanh toán',
                                                    },
                                                ]}
                                                initialValue={-1}
                                            >
                                                <Select onChange={handlePaymentMethod}>
                                                    <Select.Option value={-1}>
                                                        Chọn phương thức thanh toán
                                                    </Select.Option>
                                                    {paymentMethods.map((paymentMethod) => (
                                                        <Select.Option key={paymentMethod.id} value={paymentMethod.id}>
                                                            {paymentMethod.name}
                                                        </Select.Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col span={24} md={{ span: 10 }}>
                                            <Row gutter={[16, 0]}>
                                                <Col span={24}>
                                                    <Form.Item
                                                        initialValue={0}
                                                        label={<strong>Tạm tính:</strong>}
                                                        name="temporaryMoney"
                                                    >
                                                        <Input disabled />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={24}>
                                                    <Form.Item
                                                        initialValue={0}
                                                        label={<strong>Giảm giá:</strong>}
                                                        name="discount"
                                                    >
                                                        <Input disabled />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={24}>
                                                    <Form.Item
                                                        initialValue={0}
                                                        label={<strong>Tiền phải trả:</strong>}
                                                        name="paidMoney"
                                                    >
                                                        <Input disabled />
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        </Col>

                                        <Col span={24} md={{ span: 14 }}>
                                            <Row gutter={[16, 0]}>
                                                <Col span={24}>
                                                    <Form.Item
                                                        label="Tên người đóng tiền"
                                                        name="payer"
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: 'Vui lòng nhập tên người đóng tiền.',
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
                                                                message: 'Vui lòng nhập tiền khách đưa.',
                                                            },
                                                            {
                                                                validator: (rule, value, cb) =>
                                                                    value <= 0
                                                                        ? cb('Tiền khách đưa phải lớn hơn 0.')
                                                                        : cb(),
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
                                                                message:
                                                                    'Vui lòng nhập tiền khách đưa để hiển thị tiền thừa.',
                                                            },
                                                            {
                                                                validator: (rule, value, cb) => {
                                                                    value[0] === '-'
                                                                        ? cb('Khách đưa không đủ tiền')
                                                                        : cb();
                                                                },
                                                                message: 'khách đưa không đủ tiền.',
                                                            },
                                                        ]}
                                                    >
                                                        <Input disabled />
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </>
                                )}
                                <Col className="mt-4" span={24}>
                                    <Form.Item>
                                        <Link to={configRoutes.injectionSchedule}>
                                            <Button type="dashed">Trở lại</Button>
                                        </Link>
                                        <Button htmlType="submit" className="ml-2" type="primary">
                                            Lưu
                                        </Button>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>
            </Spin>
        </>
    );
};
export default Add;
