import { useLocation } from 'react-router-dom';
import Head from '~/components/Head';
import ReportViewer from '~/components/ReportViewer';
import { configTitle } from '~/configs';
import { useAuth } from '~/hooks';

const Report = () => {
    useAuth();
    const { state } = useLocation();
    return (
        <>
            <Head title={`${configTitle.report} ${configTitle.injectionSchedule.toLowerCase()} ${state.id}`} />

            <div className="mb-2">
                <ReportViewer state={state} injectionSchedule />
            </div>
        </>
    );
};
export default Report;
