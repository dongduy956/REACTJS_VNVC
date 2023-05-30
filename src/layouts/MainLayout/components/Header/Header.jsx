import { DownOutlined, KeyOutlined, LogoutOutlined } from '@ant-design/icons';
import { Dropdown, Layout, Menu, Space } from 'antd';
import Cookies from 'js-cookie';
import { useState } from 'react';
import ChangePassword from '~/components/ChangePassword';
import Modal from '~/components/Modal';
import { configStorage } from '~/configs';
import { useLogout } from '~/hooks';
import { authService } from '~/services';
import { dataModal } from '~/utils';
import BreadcrumbCustom from '../BreadcrumbCustom';

const HeaderCB = () => {
    const [openModal, setOpenModal] = useState(false);
    const [openChangePass, setOpenChangePass] = useState(false);
    const [dataInfo, setDataInfo] = useState({});
    const logout = useLogout();
    const { Header } = Layout;
    let login = Cookies.get(configStorage.login) ? JSON.parse(Cookies.get(configStorage.login)) : {};
    const handleLogout = async () => {
        login = Cookies.get(configStorage.login) ? JSON.parse(Cookies.get(configStorage.login)) : {};
        const result = await authService.logout({
            accessToken: login?.accessToken,
            refreshToken: login?.refreshToken,
        });
        if (result.isSuccess) logout();
    };
    const handleDetailInfo = async () => {
        const staffId = JSON.parse(Cookies.get(configStorage.login)).user.staffId;
        const staff = await dataModal.staff(staffId);
        setDataInfo(staff);
        setOpenModal(true);
    };
    const menu = (
        <Menu
            items={[
                {
                    label: <span onClick={handleDetailInfo}>Xem thông tin chi tiết</span>,
                    key: '1',
                    icon: <KeyOutlined />,
                },
                {
                    label: (
                        <span
                            onClick={() => {
                                setOpenChangePass(true);
                            }}
                        >
                            Đổi mật khẩu
                        </span>
                    ),
                    key: '2',
                    icon: <KeyOutlined />,
                },
                {
                    label: <span onClick={handleLogout}>Đăng xuất</span>,
                    key: '3',
                    icon: <LogoutOutlined />,
                },
            ]}
        />
    );

    return (
        <>
            <Modal title="Thông tin tài khoản" data={dataInfo} open={openModal} setOpen={setOpenModal} />
            <ChangePassword open={openChangePass} setOpen={setOpenChangePass} />
            <Header
                className="flex justify-between m-0 items-center"
                style={{
                    padding: 16,
                }}
            >
                <BreadcrumbCustom />
                <Dropdown className="text-white bg-[#001529] cursor-pointer" overlay={menu}>
                    <button onClick={(e) => e.preventDefault()}>
                        <Space>
                            <img src={login?.user?.avatar} className="w-10 rounded-full" alt="avatar" />
                            <span> {login?.user?.staffName}</span>
                            <DownOutlined />
                        </Space>
                    </button>
                </Dropdown>
            </Header>
        </>
    );
};
export default HeaderCB;
