export const lessThanToday = (date) => {
    const today = new Date();
    return today.getDate() === date.getDate() &&
        today.getMonth() === date.getMonth() &&
        today.getFullYear() === date.getFullYear()
        ? today.getDate() > date.getDate() &&
              today.getMonth() === date.getMonth() &&
              today.getFullYear() === date.getFullYear()
        : today > date;
};
