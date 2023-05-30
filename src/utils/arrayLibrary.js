export const isGrow = (arr = []) => {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        if (arr[i]?.no > arr[i + 1]?.no) return false;
    }
    return true;
};
