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
                setIsExpired(false);
            } else {
                // Hết giờ
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
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
            <div className="w-full bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                <span className="text-red-600 font-bold text-lg">ĐÃ KẾT THÚC</span>
            </div>
        );
    }

    // Giao diện đếm ngược (Giữ đúng style của bạn)
    return (
        <div className="flex items-center justify-center gap-3 text-center">
            {/* Ngày - Chỉ hiển thị khi > 0 */}
            {timeLeft.days > 0 && (
                <>
                    <div className="bg-white rounded-lg shadow-sm border border-yellow-200 p-2 w-16 lg:w-20">
                        <span className="text-xl lg:text-2xl font-bold text-yellow-700 block animate-pulse-slow">
                            {pad(timeLeft.days)}
                        </span>
                        <span className="text-[10px] text-gray-500 uppercase font-semibold">Ngày</span>
                    </div>
                    <span className="text-xl font-bold text-yellow-400 pb-4">:</span>
                </>
            )}

            {/* Giờ */}
            <div className="bg-white rounded-lg shadow-sm border border-yellow-200 p-2 w-16 lg:w-20">
                <span className="text-xl lg:text-2xl font-bold text-yellow-700 block animate-pulse-slow">
                    {pad(timeLeft.hours)}
                </span>
                <span className="text-[10px] text-gray-500 uppercase font-semibold">Giờ</span>
            </div>

            {/* Dấu ngăn cách */}
            <span className="text-xl font-bold text-yellow-400 pb-4">:</span>

            {/* Phút */}
            <div className="bg-white rounded-lg shadow-sm border border-yellow-200 p-2 w-16 lg:w-20">
                <span className="text-xl lg:text-2xl font-bold text-yellow-700 block animate-pulse-slow">
                    {pad(timeLeft.minutes)}
                </span>
                <span className="text-[10px] text-gray-500 uppercase font-semibold">Phút</span>
            </div>

            {/* Dấu ngăn cách */}
            <span className="text-xl font-bold text-yellow-400 pb-4">:</span>

            {/* Giây */}
            <div className="bg-white rounded-lg shadow-sm border border-yellow-200 p-2 w-16 lg:w-20">
                <span className="text-xl lg:text-2xl font-bold text-yellow-700 block animate-pulse-slow">
                    {pad(timeLeft.seconds)}
                </span>
                <span className="text-[10px] text-gray-500 uppercase font-semibold">Giây</span>
            </div>
        </div>
    );
};

export default CountdownTimer;