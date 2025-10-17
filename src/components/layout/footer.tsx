import { Facebook, Twitter, Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 sm:py-8 lg:py-12 w-full mt-auto">
      <div className="container mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 xl:px-12 max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
          {/* Company info */}
          <div className="sm:col-span-2 lg:col-span-2">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 lg:mb-6">
              DG - Đấu giá theo cách của bạn
            </h3>
            <p className="text-gray-300 mb-2 sm:mb-3 text-sm sm:text-base lg:text-lg leading-relaxed">
              Website đấu giá hàng đầu Việt Nam, nâng cao chất lượng sản phẩm,
              đột phá phong cách.
            </p>
            <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base lg:text-lg font-medium">
              Uy tín - Chất lượng - Minh bạch
            </p>

            {/* Social Icons */}
            <div className="flex space-x-4 sm:space-x-6">
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-700"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5 sm:w-6 sm:h-6" />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-700"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5 sm:w-6 sm:h-6" />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-700"
                aria-label="Github"
              >
                <Github className="w-5 h-5 sm:w-6 sm:h-6" />
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
