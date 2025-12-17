# 🚀 Hướng dẫn Test API "Đăng bán"

## ✅ Code đã sẵn sàng gọi API thật!

### 📋 Flow hoạt động:

```
1. Đăng nhập → Có accessToken
2. Navigate /create-auction → Check auth
3. Auto fetch categories → GET /categories
4. Fill form Step 1 → Submit → POST /products
5. Auto chuyển Step 2 → Fill form → Submit → POST /auction-sessions
6. Success → Navigate home
```

---

## 🔧 Cấu hình Backend

### 1. Đảm bảo Backend đang chạy
- Spring Boot server: `http://localhost:8080`
- Database connection OK
- JWT authentication working

### 2. CORS Configuration
Backend phải allow origin từ frontend:
```java
@CrossOrigin(origins = "http://localhost:5174")
```

---

## 📝 Test Case 1: Tạo sản phẩm

### Input Data (Bước 1):
```json
{
  "name": "iPhone 15 Pro Max",
  "description": "Tình trạng 100%, còn nguyên seal",
  "startPrice": 25000000,
  "categoryId": 1,
  "attributes": "Màu sắc,Titan Đen,Dung lượng,256GB,Bảo hành,12 tháng",
  "imageIds": null
}
```

### Expected Response (200 OK):
```json
{
  "id": 10,
  "name": "iPhone 15 Pro Max",
  "description": "Tình trạng 100%, còn nguyên seal",
  "startPrice": 25000000.00,
  "createdAt": "2025-12-17T21:42:02.909906",
  "category": {
    "id": 1,
    "name": "Điện tử",
    "description": "Điện thoại, laptop, máy tính bảng..."
  },
  "seller": {
    "username": "seller01",
    "firstName": "Nguyễn",
    "lastName": "Văn A",
    "email": "seller@gmail.com"
  },
  "attributes": "Màu sắc,Titan Đen,Dung lượng,256GB,Bảo hành,12 tháng",
  "images": []
}
```

---

## 📝 Test Case 2: Tạo phiên đấu giá

### Input Data (Bước 2):
```json
{
  "productId": 10,
  "startTime": "2025-12-18T10:00:00",
  "endTime": "2025-12-25T10:00:00",
  "reservePrice": 30000000,
  "buyNowPrice": 35000000
}
```

### Expected Response (200 OK):
```json
{
  "id": 15,
  "startTime": "2025-12-18T10:00:00",
  "endTime": "2025-12-25T10:00:00",
  "startingPrice": 25000000.00,
  "currentPrice": 25000000.00,
  "buyNowPrice": 35000000,
  "status": "SCHEDULED",
  "product": {
    "id": 10,
    "name": "iPhone 15 Pro Max",
    ...full product object...
  },
  "highestBidder": null,
  "reservePriceMet": false,
  "myMaxBid": null
}
```

---

## 🎯 Các bước test trên UI:

### Bước 1: Đăng nhập
1. Truy cập `http://localhost:5174/`
2. Click "Đăng nhập"
3. Nhập credentials và đăng nhập thành công
4. Check `localStorage` có `auth-storage` chứa `accessToken`

### Bước 2: Truy cập trang Đăng bán
1. Navigate đến `/create-auction`
2. Nếu chưa login → Toast "Vui lòng đăng nhập" → Redirect home
3. Nếu đã login → Hiển thị Step 1

### Bước 3: Kiểm tra Categories Load
1. Mở DevTools → Network tab
2. Check request `GET /categories`
3. Dropdown "Danh mục" phải có dữ liệu từ API

### Bước 4: Điền form Step 1
```
- Tên sản phẩm: "iPhone 15 Pro Max"
- Danh mục: Chọn từ dropdown (vd: "Điện tử")
- Mô tả: "Tình trạng 100%, còn nguyên seal"
- Giá khởi điểm: "25.000.000"
- Thuộc tính: 
  + Màu sắc: Titan Đen
  + Dung lượng: 256GB
  + Bảo hành: 12 tháng
```

### Bước 5: Submit Step 1
1. Click "Tiếp tục →"
2. Check Network tab → `POST /products`
3. Request payload đúng format
4. Response 200 OK → Toast success
5. Auto chuyển sang Step 2
6. Progress indicator: Step 1 → Green checkmark

### Bước 6: Điền form Step 2
```
- Thời gian bắt đầu: 2025-12-18T10:00
- Thời gian kết thúc: 2025-12-25T10:00
- Giá dự sản: "30.000.000"
- Giá mua ngay: "35.000.000"
```

### Bước 7: Submit Step 2
1. Click "Hoàn tất đăng bán"
2. Check Network tab → `POST /auction-sessions`
3. Request payload:
   - `productId`: Lấy từ Step 1 response
   - Các fields khác từ form
4. Response 200 OK → Toast success
5. Sau 1.5s → Navigate về home

---

## 🐛 Troubleshooting

### Lỗi 401 Unauthorized
**Nguyên nhân:** Token hết hạn hoặc không có token
**Giải pháp:**
1. Đăng xuất và đăng nhập lại
2. Check `localStorage` có `accessToken`
3. Check Axios interceptor đã set header `Authorization`

### Lỗi 400 Bad Request
**Nguyên nhân:** Data validation failed
**Giải pháp:**
1. Check request payload format
2. Check required fields không để trống
3. Check `startPrice` phải là số (đã remove dấu chấm)
4. Check `categoryId` phải là số
5. Check `attributes` là string (không phải array)

### Lỗi 404 Not Found
**Nguyên nhân:** Endpoint sai hoặc backend chưa chạy
**Giải pháp:**
1. Check backend đang chạy port 8080
2. Check axios baseURL: `http://localhost:8080/api/v1`
3. Check endpoint: `/products`, `/auction-sessions`

### Lỗi CORS
**Nguyên nhân:** Backend chưa allow origin
**Giải pháp:**
```java
@CrossOrigin(origins = "http://localhost:5174")
```

### Categories không load
**Nguyên nhân:** API `/categories` chưa có hoặc response sai format
**Giải pháp:**
1. Test endpoint trong Postman trước
2. Check response có `result` array không
3. Update store nếu response structure khác

### Attributes hiển thị sai
**Nguyên nhân:** Backend trả về String, không phải array
**Giải pháp:**
- Frontend đã convert array → string khi submit
- Display attributes as-is trong Step 2

---

## 📊 Expected Network Calls

### 1. Component Mount (đã login)
```
GET /categories
Status: 200 OK
Response: { result: [...categories] }
```

### 2. Submit Step 1
```
POST /products
Status: 200 OK
Request: { name, description, startPrice, categoryId, attributes, imageIds }
Response: { id, name, ..., category, seller, attributes, images }
```

### 3. Submit Step 2
```
POST /auction-sessions
Status: 200 OK
Request: { productId, startTime, endTime, reservePrice, buyNowPrice }
Response: { id, startTime, endTime, ..., product, highestBidder, status }
```

---

## ✅ Success Indicators

- [x] Toast "Tạo sản phẩm thành công!"
- [x] Auto chuyển Step 2
- [x] Product preview hiển thị đúng data
- [x] Toast "Tạo phiên đấu giá thành công!"
- [x] Navigate về home sau 1.5s
- [x] Console không có error

---

## 🎉 Flow hoàn chỉnh

```
User Story:
1. Seller đăng nhập
2. Click "Đăng bán" → /create-auction
3. Nhập thông tin sản phẩm (Step 1)
4. Click "Tiếp tục" → POST /products → Success
5. Nhập thông tin đấu giá (Step 2)
6. Click "Hoàn tất" → POST /auction-sessions → Success
7. Redirect home
8. Có thể thấy sản phẩm mới trong danh sách
```

Chúc bạn test thành công! 🚀
