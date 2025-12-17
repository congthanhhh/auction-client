# 🎯 Hướng dẫn Flow "Đăng bán sản phẩm"

## 📋 Tổng quan

Flow đăng bán sản phẩm được chia thành **3 bước**:

1. **Check đăng nhập** - User phải đăng nhập mới được truy cập
2. **Bước 1: Tạo sản phẩm** - POST /products
3. **Bước 2: Tạo phiên đấu giá** - POST /auction-sessions

## 🏗️ Cấu trúc đã implement

### 1. Types (`src/types/`)

#### `product.ts`
```typescript
export interface CreateProductRequest {
    name: string;
    description: string;
    startPrice: number;
    categoryId: number;
    attributes: string[];  // Array: ["key1", "value1", "key2", "value2"]
    imageIds?: number[] | null;
}

export interface CreateProductResponse {
    id: number;
    name: string;
    description: string;
    startPrice: number;
    createdAt: string;
    category: Category;
    seller: Seller;
    attributes: string[];
    images: ProductImage[];
}
```

#### `auction.ts`
```typescript
export interface CreateAuctionSessionRequest {
    productId: number;
    startTime: string;  // ISO 8601: "2025-12-17T22:48:00"
    endTime: string;
    reservePrice: number;  // Giá dự sản
    buyNowPrice: number;   // Giá mua ngay
}

export interface CreateAuctionSessionResponse {
    id: number;
    startTime: string;
    endTime: string;
    startingPrice: number;
    currentPrice: number;
    buyNowPrice: number;
    status: 'SCHEDULED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
    product: Product;
    highestBidder: HighestBidder | null;
    reservePriceMet: boolean;
    myMaxBid: number | null;
}
```

### 2. Services (`src/services/`)

#### `productService.ts`
```typescript
export const productService = {
    getProduct(productId: number)
    getProducts(params: { page?, size?, categoryId? })
    createProduct(data: CreateProductRequest)
    updateProduct(productId: number, data: Partial<CreateProductRequest>)
    deleteProduct(productId: number)
    getCategories()
}
```

#### `auctionService.ts` (đã update)
```typescript
export const auctionService = {
    getDetail(id: number)
    getAuctionSessions(params?)
    createAuctionSession(data: CreateAuctionSessionRequest)  // ✨ NEW
    updateAuctionSession(sessionId: number, data)             // ✨ NEW
    deleteAuctionSession(sessionId: number)                   // ✨ NEW
}
```

### 3. Zustand Store (`src/stores/useCreateAuctionStore.ts`)

#### State
```typescript
{
    currentStep: 1 | 2,              // Step hiện tại
    createdProduct: CreateProductResponse | null,
    categories: Category[],
    isCreatingProduct: boolean,
    isCreatingSession: boolean,
    isFetchingCategories: boolean,
    error: string | null,
    createdSession: CreateAuctionSessionResponse | null
}
```

#### Actions
```typescript
fetchCategories()               // Lấy danh sách categories
createProduct(data)            // Tạo sản phẩm → auto chuyển step 2
createAuctionSession(data)     // Tạo phiên đấu giá (auto lấy productId)
goToNextStep()
goToPreviousStep()
clearError()
reset()                        // Reset store khi unmount
```

### 4. UI Component (`src/components/layout/create-auction.tsx`)

#### Flow hoạt động:

**Khi component mount:**
1. Check `isAuthenticated` từ `useAuthStore`
2. Nếu chưa đăng nhập → Toast error → Redirect về `/`
3. Nếu đã đăng nhập → `fetchCategories()`

**Step 1: Tạo sản phẩm**
- Form fields:
  - Hình ảnh (tối đa 9 ảnh)
  - Tên sản phẩm *
  - Danh mục * (dropdown từ API)
  - Mô tả *
  - Giá khởi điểm *
  - Thuộc tính (key-value pairs, có thể thêm nhiều)

- Submit → `createProduct()`:
  ```typescript
  const success = await createProduct({
      name: productForm.name,
      description: productForm.description,
      startPrice: parseInt(productForm.startPrice.replace(/\./g, '')),
      categoryId: parseInt(productForm.categoryId),
      attributes: productForm.attributes,  // ["Màu sắc", "Đen", "Dung lượng", "256GB"]
      imageIds: null
  });
  ```
  
- Success → Toast → Auto chuyển sang Step 2

**Step 2: Tạo phiên đấu giá**
- Form fields:
  - Thời gian bắt đầu * (datetime-local)
  - Thời gian kết thúc * (datetime-local)
  - Giá dự sản (Reserve Price) *
  - Giá mua ngay (Buy Now Price) *
  
- Hiển thị preview sản phẩm đã tạo

- Submit → `createAuctionSession()`:
  ```typescript
  const success = await createAuctionSession({
      // productId tự động lấy từ createdProduct.id
      startTime: sessionForm.startTime,
      endTime: sessionForm.endTime,
      reservePrice: parseInt(sessionForm.reservePrice.replace(/\./g, '')),
      buyNowPrice: parseInt(sessionForm.buyNowPrice.replace(/\./g, ''))
  });
  ```

- Success → Toast → Redirect về `/` sau 1.5s

## 🎨 UI Features

### Progress Indicator
- Step 1: Orange circle với số "1"
- Step 2: Orange circle với số "2"
- Khi hoàn thành Step 1 → Green circle với CheckCircle icon

### Loading States
- Button "Đang tạo..." với Loader2 spinner
- Disabled button khi đang submit
- Disabled category dropdown khi đang fetch

### Error Handling
- Toast error từ store (tự động clear sau hiển thị)
- Redirect về home nếu chưa đăng nhập
- Validation required fields

### Price Formatting
- Auto format với dấu chấm: `1000000` → `1.000.000`
- Input: "1000000₫"
- Submit: Remove dots → Parse int

### Attributes Management
- Dynamic add/remove key-value pairs
- Display: "Màu sắc: Đen" với nút X để xóa
- Input: 2 fields (key + value) + button Add

## 🚀 Cách sử dụng

### 1. Đăng nhập trước
```typescript
const { isAuthenticated } = useAuthStore();
// Nếu false → redirect về home
```

### 2. Navigate đến trang
```typescript
navigate('/create-auction')
```

### 3. Điền form Step 1 → Submit
- Tự động chuyển sang Step 2

### 4. Điền form Step 2 → Submit
- Success → Redirect về home

### 5. Có thể quay lại Step 1
- Click "← Quay lại" ở Step 2

## 📝 Postman Response Mapping

### POST /products Request
```json
{
    "name": "test product 99",
    "description": "tình trạng 100%",
    "startPrice": 90000,
    "categoryId": 1,
    "attributes": ["Hãng sản xuất", "Canon", "Dòng sản phẩm", "Camera", ...],
    "imageIds": null
}
```

### POST /products Response (200 OK)
```json
{
    "id": 10,
    "name": "test product 99",
    "description": "tình trạng 100%",
    "startPrice": 90000.00,
    "createdAt": "2025-12-17T21:42:90290906",
    "category": { "id": 1, "name": "thời trang", "description": "áo khoác, áo thun, quần bò..." },
    "seller": { ... },
    "attributes": [...],
    "images": []
}
```

### POST /auction-sessions Request
```json
{
    "productId": 10,
    "startTime": "2025-12-17T22:48:00",
    "endTime": "2025-12-20T16:55:00",
    "reservePrice": 9000000,
    "buyNowPrice": 10000000
}
```

### POST /auction-sessions Response (200 OK)
```json
{
    "id": 10,
    "startTime": "2025-12-17T22:48:00",
    "endTime": "2025-12-20T16:55:00",
    "startingPrice": 90000.00,
    "currentPrice": 90000.00,
    "buyNowPrice": 10000000,
    "status": "SCHEDULED",
    "product": { ... full product object ... },
    "highestBidder": null,
    "reservePriceMet": false,
    "myMaxBid": null
}
```

## ✅ Checklist Implementation

- [x] Types cho Product & Auction
- [x] productService.ts với CRUD
- [x] Update auctionService.ts
- [x] useCreateAuctionStore.ts với state management
- [x] Multi-step form UI
- [x] Authentication check
- [x] Loading states
- [x] Error handling
- [x] Toast notifications
- [x] Price formatting
- [x] Attributes management
- [x] Category dropdown từ API
- [x] Product preview ở Step 2
- [x] Navigation between steps
- [x] Auto redirect sau success

## 🔧 Troubleshooting

### Lỗi "Vui lòng đăng nhập"
→ Check `useAuthStore.isAuthenticated`

### Categories không hiển thị
→ Check API endpoint `/categories`
→ Check `fetchCategories()` trong useEffect

### Không chuyển sang Step 2
→ Check `createProduct()` return true
→ Check response từ POST /products

### Time format sai
→ Đảm bảo datetime-local input format: "YYYY-MM-DDTHH:mm"
→ Backend expect: "YYYY-MM-DDTHH:mm:ss"

## 🎯 Next Steps

1. **Upload images**: Implement image upload service trước khi createProduct
2. **Validation**: Thêm validation cho datetime (startTime < endTime)
3. **Draft save**: Lưu draft để user có thể quay lại
4. **Success page**: Tạo trang success với thông tin phiên đấu giá
5. **Preview modal**: Preview sản phẩm trước khi submit

---

**Hoàn thành!** 🎉 Flow đăng bán đã sẵn sàng sử dụng theo đúng structure hiện tại với Zustand.
