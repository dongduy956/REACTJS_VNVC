import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { Button } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { configRoutes } from '~/configs';
import InjectionScheduleReport from './InjectionSchedule/Report';
import OrderEntrySlipPayReport from './OrderEntrySlipPay/Report';
const ReportViewer = ({ state, injectionSchedule = false, pay = false, orderEntrySlip = false }) => {
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const refDownload = useRef();
    useEffect(() => {
        const handleResize = () => {
            setScreenWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [screenWidth]);
    return (
        <>
            {screenWidth <= 820 ? (
                <>
                    <p className="mt-4 text-red-600 sm:ml-0 ml-10">
                        <span>Pdf viewer chỉ hỗ trợ trên máy tính mời bạn tải xuống báo cáo </span>
                        <PDFDownloadLink
                            document={
                                <>
                                    {injectionSchedule ? (
                                        <InjectionScheduleReport state={state} />
                                    ) : pay ? (
                                        <OrderEntrySlipPayReport _pay state={state} />
                                    ) : orderEntrySlip ? (
                                        <OrderEntrySlipPayReport _order state={state} />
                                    ) : (
                                        <OrderEntrySlipPayReport _entrySlip state={state} />
                                    )}
                                </>
                            }
                            fileName="report.pdf"
                        >
                            {({ blob, url, loading, error }) => (
                                <a ref={refDownload} to={!loading && url && url} target="_blank">
                                    tại đây
                                </a>
                            )}
                        </PDFDownloadLink>
                    </p>
                </>
            ) : (
                <>
                    <PDFViewer style={{ margin: '0 auto', marginTop: 8, height: 490, display: 'table' }} width="100%">
                        {injectionSchedule ? (
                            <InjectionScheduleReport state={state} />
                        ) : pay ? (
                            <OrderEntrySlipPayReport _pay state={state} />
                        ) : orderEntrySlip ? (
                            <OrderEntrySlipPayReport _order state={state} />
                        ) : (
                            <OrderEntrySlipPayReport _entrySlip state={state} />
                        )}
                    </PDFViewer>
                </>
            )}
            <Link
                className="sm:ml-0 ml-10 mt-4 block "
                to={
                    injectionSchedule
                        ? configRoutes.injectionSchedule
                        : pay
                        ? configRoutes.pay
                        : orderEntrySlip
                        ? configRoutes.order
                        : configRoutes.entrySlip
                }
            >
                <Button>Trở về</Button>
            </Link>
        </>
    );
};

export default ReportViewer;
