// Hàm convert mảng Java LocalDateTime sang chuỗi hiển thị
export const formatJavaDate = (dateData: any): string => {
    if (!dateData) return '';

    // Nếu là mảng [yyyy, MM, dd, HH, mm, ss, ns]
    if (Array.isArray(dateData)) {
        const [year, month, day, hour, minute, second] = dateData;
        // Lưu ý: Month trong JS bắt đầu từ 0 (Java là 1) -> phải trừ 1
        const date = new Date(year, month - 1, day, hour, minute, second);
        return date.toLocaleString('vi-VN');
    }

    // Nếu là chuỗi ISO bình thường
    return new Date(dateData).toLocaleString('vi-VN');
};