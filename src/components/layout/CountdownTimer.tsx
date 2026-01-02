// src/components/CountdownTimer.tsx
import { useEffect, useState } from 'react';
import { intervalToDuration } from 'date-fns';

interface CountdownTimerProps {
    targetDate: string | null; // Thời gian kết thúc (ISO String từ Backend)
}

const CountdownTimer = ({ targetDate }: CountdownTimerProps) => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });
    const [isExpired, setIsExpired] = useState(false);
    const [totalHours, setTotalHours] = useState(0);

    useEffect(() => {
        if (!targetDate) return;

        const calculateTimeLeft = () => {
            const target = new Date(targetDate);
            const now = new Date();

            if (target > now) {
                // Sử dụng date-fns để tính duration
                const duration = intervalToDuration({ start: now, end: target });

                setTimeLeft({
                    days: duration.days || 0,
                    hours: duration.hours || 0,
                    minutes: duration.minutes || 0,
                    seconds: duration.seconds || 0
                });

                // Tính tổng số giờ còn lại
                const diffMs = target.getTime() - now.getTime();
                const totalHoursLeft = Math.floor(diffMs / (1000 * 60 * 60));
                setTotalHours(totalHoursLeft);

                setIsExpired(false);
            } else {
                // Hết giờ
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                setTotalHours(0);
                setIsExpired(true);
            }
        };

        // Tính ngay lập tức khi component mount
        calculateTimeLeft();

        // Cập nhật mỗi giây
        const timer = setInterval(calculateTimeLeft, 1000);

        // Cleanup khi unmount
        return () => clearInterval(timer);
    }, [targetDate]);

    // Helper để thêm số 0 đằng trước (VD: 5 -> 05)
    const pad = (num: number) => String(num).padStart(2, '0');

    // Giao diện khi đã kết thúc
    if (isExpired) {
        return (
            <span className="text-red-600 font-semibold text-sm">Đã kết thúc</span>
        );
    }

    // Nếu thời gian còn lại > 24 giờ: hiển thị dạng text
    if (totalHours >= 24) {
        const daysText = timeLeft.days > 0 ? `${timeLeft.days} ngày` : '';
        const hoursText = timeLeft.hours > 0 ? `${timeLeft.hours} giờ` : '';

        return (
            <span className="text-sm font-semibold text-gray-700">
                {daysText} {hoursText}
            </span>
        );
    }

    // Nếu < 24 giờ: hiển thị ô đếm thời gian
    return (
        <div className="flex items-center gap-1">
            {/* Giờ */}
            <div className="bg-red-50 border border-red-200 rounded px-1.5 py-0.5">
                <span className="text-sm font-bold text-red-600">
                    {pad(timeLeft.hours)}
                </span>
            </div>
            <span className="text-xs font-bold text-red-500">:</span>

            {/* Phút */}
            <div className="bg-red-50 border border-red-200 rounded px-1.5 py-0.5">
                <span className="text-sm font-bold text-red-600">
                    {pad(timeLeft.minutes)}
                </span>
            </div>
            <span className="text-xs font-bold text-red-500">:</span>

            {/* Giây */}
            <div className="bg-red-50 border border-red-200 rounded px-1.5 py-0.5">
                <span className="text-sm font-bold text-red-600">
                    {pad(timeLeft.seconds)}
                </span>
            </div>
        </div>
    );
};

export default CountdownTimer;