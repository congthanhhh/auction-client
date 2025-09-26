import { Facebook, Twitter, Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4 sm:py-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 lg:gap-16">
          {/* Left side - Company info */}
          <div className="text-left">
            <h3 className="text-lg font-bold mb-2">
              DG - Đấu giá theo cách của bạn
            </h3>
            <p className="text-gray-300 mb-2">
              Website đấu giá hàng đầu Việt Nam, nâng cao chất lượng sản phẩm,
            </p>
            <p className="text-gray-300 mb-2">
              đột phá phong cách.
            </p>
            <p className="text-gray-300 mb-4">
              Uy tín - Chất lượng - Minh bạch
            </p>

            {/* Social Icons */}
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Right side - Links */}
          <div className="text-right">
            <h3 className="text-lg font-bold mb-2">Liên kết nhanh</h3>
            <div className="space-y-2">
              <a
                href="#"
                className="block text-gray-300 hover:text-white transition-colors"
              >
                Trang chủ
              </a>
              <a
                href="#"
                className="block text-gray-300 hover:text-white transition-colors"
              >
                Tìm kiếm
              </a>
              <a
                href="#"
                className="block text-gray-300 hover:text-white transition-colors"
              >
                Đấu giá
              </a>
              <a
                href="#"
                className="block text-gray-300 hover:text-white transition-colors"
              >
                Sản phẩm nổi bật
              </a>
            </div>
          </div>
        </div>

        {/* Bottom border */}
        <div className="border-t border-gray-700 mt-4 sm:mt-6 pt-3 sm:pt-4 text-center text-gray-400">
          <p className="text-sm sm:text-base">&copy; 2024 DG - Đấu giá. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
