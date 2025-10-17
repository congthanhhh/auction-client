import { Facebook, Twitter, Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 lg:py-12 w-full mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <h3 className="text-xl lg:text-2xl font-bold mb-4">
              DG - Đấu giá theo cách của bạn
            </h3>
            <p className="text-gray-300 mb-4 leading-relaxed text-sm lg:text-base">
              Website đấu giá hàng đầu Việt Nam, nâng cao chất lượng sản phẩm,
              đột phá phong cách.
            </p>
            <p className="text-gray-400 text-sm font-medium mb-6">
              Uy tín - Chất lượng - Minh bạch
            </p>

            {/* Social Icons */}
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors duration-200 p-2 rounded-full hover:bg-gray-700"
                aria-label="Facebook"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors duration-200 p-2 rounded-full hover:bg-gray-700"
                aria-label="Twitter"
              >
                <Twitter className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors duration-200 p-2 rounded-full hover:bg-gray-700"
                aria-label="Github"
              >
                <Github className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Liên kết nhanh</h4>
            <ul className="space-y-2">
              <li>
                <a 
                  href="/" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm lg:text-base"
                >
                  Trang chủ
                </a>
              </li>
              <li>
                <a 
                  href="/search" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm lg:text-base"
                >
                  Tìm kiếm
                </a>
              </li>
              <li>
                <a 
                  href="/auctions" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm lg:text-base"
                >
                  Đấu giá
                </a>
              </li>
              <li>
                <a 
                  href="/featured" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 text-sm lg:text-base"
                >
                  Sản phẩm nổi bật
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Liên hệ</h4>
            <ul className="space-y-2">
              <li className="text-gray-300 text-sm lg:text-base">
                Email: info@dgauction.com
              </li>
              <li className="text-gray-300 text-sm lg:text-base">
                Hotline: 1900 1234
              </li>
              <li className="text-gray-300 text-sm lg:text-base">
                Địa chỉ: TP. Hồ Chí Minh
              </li>
            </ul>
          </div>
        </div>

        {/* Divider and Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-6">
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              © 2024 DG - Đấu giá. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
