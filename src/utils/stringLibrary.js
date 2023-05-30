export const formatMoney = (money) => {
    const config = { style: 'currency', currency: 'VND', maximumFractionDigits: 9 };
    const format = new Intl.NumberFormat('vi-VN', config).format(money);
    return format;
};

export const unFormatMoney = (v) => {
    if (!v) {
        return 0;
    }
    v = v.split('.').join('');
    v = v.split(',').join('.');
    return Number(v.replace(/[^0-9.]/g, ''));
};
