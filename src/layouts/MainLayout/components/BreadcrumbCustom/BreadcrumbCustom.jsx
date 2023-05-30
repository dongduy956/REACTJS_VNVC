import { Breadcrumb } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { configRoutes, configTitle } from '~/configs';

function BreadcrumbCustom() {
    const { pathname } = useLocation();
    const [breadcrumbItems, setBreadcrumbItems] = useState([]);
    useEffect(() => {
        if (pathname.length > 1) {
            const items = pathname
                .split('/')
                .reduce(
                    (arr, item, index) =>
                        index !== 0 ? (index === 1 || index === 2 ? [...arr, '/' + item] : [...arr, item]) : arr,
                    [],
                )
                .reduce((arr, item, index) => {
                    const i = Object.values(configRoutes).findIndex((temp) => temp === item);
                    const key = Object.keys(configRoutes)[i];
                    let newData = [];
                    const obj = {};
                    if (index !== 2) {
                        obj.path = item;
                        obj.title = configTitle[key];
                        if (arr.length > 0) obj.title = configTitle[key] + ' ' + arr[0].title.toLowerCase();
                        newData = [...arr, obj];
                    } else newData = arr;
                    return newData;
                }, []);
            setBreadcrumbItems(items);
        } else setBreadcrumbItems([]);
    }, [pathname]);
    return (
        <Breadcrumb separator={<span className="text-white">{'>'}</span>}>
            <Breadcrumb.Item className={`text-white ${breadcrumbItems.length > 0 ? 'cursor-pointer' : 'opacity-60'}`}>
                {breadcrumbItems.length > 0 ? (
                    <Link className="text-white" to={configRoutes.dashboard}>
                        Trang chủ
                    </Link>
                ) : (
                    'Trang chủ'
                )}
            </Breadcrumb.Item>
            {breadcrumbItems.map((item, index, curArr) =>
                index === curArr.length - 1 ? (
                    <Breadcrumb.Item className="text-white opacity-60">{item.title}</Breadcrumb.Item>
                ) : (
                    <Breadcrumb.Item className="text-white cursor-pointer">
                        <Link className="text-white" to={item.path}>
                            {item.title}
                        </Link>
                    </Breadcrumb.Item>
                ),
            )}
        </Breadcrumb>
    );
}

export default BreadcrumbCustom;
