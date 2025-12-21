import { X, ShieldAlert, Ban, AlertTriangle, Scale, FileText, CheckCircle2 } from 'lucide-react';

interface TermsAndRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsAndRulesModal = ({ isOpen, onClose }: TermsAndRulesModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 rounded-t-2xl sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 rounded-lg">
                <Scale size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Điều khoản & Quy định</h2>
                <p className="text-red-100 text-sm">Luật và nghị định về đấu giá trực tuyến</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Prohibited Items */}
          <div className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-600 rounded-lg p-5">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-red-600 text-white rounded-lg flex-shrink-0">
                <Ban size={22} />
              </div>
              <div>
                <h3 className="font-bold text-red-900 mb-3 text-lg">Hàng hóa bị cấm</h3>
                <div className="space-y-2 text-sm text-red-800">
                  <div className="flex items-start gap-2">
                    <span className="text-red-600 font-bold mt-0.5">✕</span>
                    <p><span className="font-semibold">Ma túy & chất kích thích:</span> Nghị định 105/2021/NĐ-CP</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-red-600 font-bold mt-0.5">✕</span>
                    <p><span className="font-semibold">Vũ khí, công cụ hỗ trợ:</span> Luật quản lý vũ khí 2017</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-red-600 font-bold mt-0.5">✕</span>
                    <p><span className="font-semibold">Thuốc không có đăng ký:</span> Luật dược 2016</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-red-600 font-bold mt-0.5">✕</span>
                    <p><span className="font-semibold">Động vật hoang dã:</span> Nghị định 06/2019/NĐ-CP</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-red-600 font-bold mt-0.5">✕</span>
                    <p><span className="font-semibold">Văn hóa phẩm độc hại:</span> Luật xuất bản 2012</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Counterfeit Products */}
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 border-l-4 border-orange-600 rounded-lg p-5">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-orange-600 text-white rounded-lg flex-shrink-0">
                <AlertTriangle size={22} />
              </div>
              <div>
                <h3 className="font-bold text-orange-900 mb-3 text-lg">Hàng giả, hàng nhái</h3>
                <div className="space-y-2 text-sm text-orange-800">
                  <div className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold mt-0.5">⚠</span>
                    <p><span className="font-semibold">Hàng giả mạo thương hiệu:</span> Vi phạm Luật Sở hữu trí tuệ 2019</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold mt-0.5">⚠</span>
                    <p><span className="font-semibold">Hàng không rõ nguồn gốc:</span> Phạt đến 50 triệu đồng</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold mt-0.5">⚠</span>
                    <p><span className="font-semibold">Sản phẩm kém chất lượng:</span> Nghị định 111/2021/NĐ-CP</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Seller Responsibilities */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-600 rounded-lg p-5">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-600 text-white rounded-lg flex-shrink-0">
                <ShieldAlert size={22} />
              </div>
              <div>
                <h3 className="font-bold text-blue-900 mb-3 text-lg">Trách nhiệm người bán</h3>
                <div className="space-y-2 text-sm text-blue-800">
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-0.5">•</span>
                    <p>Cung cấp thông tin chính xác, trung thực về sản phẩm</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-0.5">•</span>
                    <p>Xuất trình hóa đơn, chứng từ nguồn gốc hợp pháp</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-0.5">•</span>
                    <p>Chịu trách nhiệm pháp lý về sản phẩm đưa lên đấu giá</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-0.5">•</span>
                    <p>Giao hàng đúng mô tả, đúng hẹn với người mua</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Allowed Products */}
          <div className="bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-600 rounded-lg p-5">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-600 text-white rounded-lg flex-shrink-0">
                <CheckCircle2 size={22} />
              </div>
              <div>
                <h3 className="font-bold text-green-900 mb-3 text-lg">Hàng hóa được phép</h3>
                <div className="space-y-2 text-sm text-green-800">
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-0.5">✓</span>
                    <p>Điện tử, công nghệ có nguồn gốc rõ ràng</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-0.5">✓</span>
                    <p>Đồ gia dụng, nội thất sử dụng hợp pháp</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-0.5">✓</span>
                    <p>Phương tiện giao thông có giấy tờ đầy đủ</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-0.5">✓</span>
                    <p>Sách, đồ sưu tầm không vi phạm pháp luật</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Penalties */}
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 border-l-4 border-purple-600 rounded-lg p-5">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-600 text-white rounded-lg flex-shrink-0">
                <FileText size={22} />
              </div>
              <div>
                <h3 className="font-bold text-purple-900 mb-3 text-lg">Xử phạt vi phạm</h3>
                <div className="space-y-2 text-sm text-purple-800">
                  <div className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold mt-0.5">→</span>
                    <p><span className="font-semibold">Vi phạm lần 1:</span> Cảnh cáo + khóa tài khoản 7 ngày</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold mt-0.5">→</span>
                    <p><span className="font-semibold">Vi phạm lần 2:</span> Khóa tài khoản 30 ngày + phạt tiền</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold mt-0.5">→</span>
                    <p><span className="font-semibold">Vi phạm nghiêm trọng:</span> Khóa vĩnh viễn + xử lý pháp lý</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold mt-0.5">→</span>
                    <p><span className="font-semibold">Hàng giả, hàng cấm:</span> Chuyển cơ quan chức năng</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Legal References */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-5">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <FileText size={18} className="text-gray-600" />
              Căn cứ pháp lý
            </h3>
            <div className="space-y-2 text-xs text-gray-700">
              <p>• <span className="font-semibold">Luật Thương mại điện tử 2005</span> (sửa đổi 2020)</p>
              <p>• <span className="font-semibold">Nghị định 52/2013/NĐ-CP</span> về thương mại điện tử</p>
              <p>• <span className="font-semibold">Nghị định 111/2021/NĐ-CP</span> về phòng chống hàng giả</p>
              <p>• <span className="font-semibold">Luật Bảo vệ quyền lợi người tiêu dùng 2010</span></p>
              <p>• <span className="font-semibold">Bộ luật Dân sự 2015</span> về hợp đồng mua bán</p>
            </div>
          </div>

          {/* Warning Box */}
          <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-yellow-600 flex-shrink-0 mt-0.5" size={22} />
              <div>
                <p className="font-bold text-yellow-900 mb-2">⚠️ Lưu ý quan trọng</p>
                <p className="text-sm text-yellow-800">
                  Mọi giao dịch đều được hệ thống ghi lại và có thể làm bằng chứng pháp lý. 
                  Người bán vi phạm sẽ chịu trách nhiệm theo quy định của pháp luật Việt Nam.
                  Nền tảng có nghĩa vụ cung cấp thông tin cho cơ quan chức năng khi có yêu cầu.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-2xl border-t">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
            >
              Đã hiểu, tuân thủ quy định
            </button>
            <button
              onClick={() => window.open('https://thuvienphapluat.vn', '_blank')}
              className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors"
            >
              Xem thêm văn bản pháp luật
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndRulesModal;
