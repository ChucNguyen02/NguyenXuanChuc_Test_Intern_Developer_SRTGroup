# 📝 Ứng Dụng Quản Lý Công Việc (ToDo List Application)

Dự án ToDo List full-stack được xây dựng hoàn chỉnh với đầy đủ các tiêu chuẩn nghiệp vụ, giao diện người dùng đẹp mắt, chế độ hoạt động kép thông minh, phân trang tối ưu và bộ mã nguồn được phủ Unit Test toàn diện.

---

## 🚀 Tính Năng Nổi Bật

1. **Giao Diện Hiện Đại**: Giao diện thiết kế theo phong cách tối giản, chuyển động mượt mà, hỗ trợ giao diện tương thích tốt trên cả máy tính (Desktop) và điện thoại di động (Mobile).
2. **Chế Độ Hoạt Động Kép (Hybrid Offline/Online Mode)**:
   - **Chế độ Ngoại tuyến**: Khi chưa đăng nhập, người dùng vẫn có thể tạo, sửa, xóa và sắp xếp công việc lưu trực tiếp dưới trình duyệt (Local Storage).
   - **Chế độ Đồng bộ trực tuyến**: Khi đăng nhập, toàn bộ dữ liệu tự động đồng bộ lên Database đám mây để quản lý tập trung.
3. **Lịch Tương Tác Cận Cảnh (Calendar & Timeline)**
4. **Phân Trang Giao Diện Mượt Mà**: Phân trang tối đa **10 công việc/trang** tại cả tab "Tất cả công việc" lẫn màn hình Dashboard để tối ưu hóa hiệu suất hiển thị.
5. **Bảo Mật An Toàn**: Đăng ký, đăng nhập và bảo mật các API bằng cơ chế mã hóa JWT cùng mật khẩu được mã hóa an toàn (BCrypt).

---

## 🛠️ Công Nghệ Sử Dụng

### Backend
- **Ngôn ngữ**: Java 21
- **Framework**: Spring Boot 3.x
- **Bảo mật**: Spring Security & JWT Token
- **Cơ sở dữ liệu**: PostgreSQL
- **Kiểm thử**: JUnit 5 & Mockito (Unit Test Service Layer)

### Frontend
- **Thư viện chính**: React 19 & TypeScript
- **Công cụ build**: Vite
- **CSS Utility**: Tailwind CSS 4.x
- **Biểu tượng**: Lucide React
- **HTTP Client**: Axios

---

## ⚙️ Hướng Dẫn Cài Đặt và Chạy Dự Án

### Yêu Cầu Hệ Thống
- Đã cài đặt **Docker** & **Docker Compose**
- Đã cài đặt **Node.js (phiên bản 18 trở lên)**

---

### 🐳 1. Chạy Backend & Cơ Sở Dữ Liệu bằng Docker (Khuyên Dùng)

Backend (Spring Boot) và Database (PostgreSQL) đã được đóng gói sẵn Dockerfile và Docker Compose giúp triển khai nhanh chóng.

#### Bước 1: Khởi chạy các Container
Mở terminal tại thư mục gốc của dự án hoặc thư mục `ToDoList_Backend` (nơi chứa file `docker-compose.yml`) và chạy:
```bash
cd ToDoList_Backend
docker compose up -d --build
```
Lệnh trên sẽ tự động:
1. Tải về và khởi động database **PostgreSQL 16** tại cổng `5432`.
2. Kiểm tra sức khỏe (health check) của PostgreSQL, khi cơ sở dữ liệu sẵn sàng sẽ tiến hành xây dựng (Build) và chạy container **Spring Boot backend** tại cổng `8080`.

#### Bước 2: Kiểm tra trạng thái và logs (Nếu cần)
Để xem log đang hoạt động của backend:
```bash
docker compose logs -f backend
```

#### Bước 3: Dừng các dịch vụ
Để tắt và dọn dẹp các container:
```bash
docker compose down
```

---

### 💻 2. Chạy Frontend (React)

Vì giao diện React thay đổi liên tục trong quá trình phát triển (Fast Hot Reload), bạn nên chạy frontend trực tiếp bằng Node.js trên máy cục bộ để tối ưu hiệu suất.

#### Bước 1: Di chuyển vào thư mục frontend và cài đặt thư viện
```bash
cd ToDoList_Frontend
npm install
```

#### Bước 2: Khởi chạy môi trường phát triển (Development)
```bash
npm run dev
```
Giao diện người dùng sẽ được khởi chạy tại địa chỉ: **`http://localhost:5173`**

---

### 🧪 Chạy Bộ Unit Test (Backend)

Bộ unit test đã được viết hoàn chỉnh phủ toàn bộ các luồng nghiệp vụ quan trọng (đăng ký, đăng nhập, phân quyền dữ liệu cá nhân, thêm, sửa, xóa, tìm kiếm và phân trang công việc).

Để chạy bộ test kiểm thử:
1. Mở terminal tại thư mục `ToDoList_Backend`.
2. Chạy lệnh:
   ```bash
   mvn test
   ```
Toàn bộ 12 ca kiểm thử sẽ được Mockito giả lập thực thi tự động và xuất báo cáo kết quả thành công (`BUILD SUCCESS`).

---

### 🛠️ Cách Chạy Backend Thủ Công (Không dùng Docker)
Nếu không muốn dùng Docker cho backend, bạn có thể chạy thủ công:
1. Đảm bảo bạn đã cài PostgreSQL trên máy và tạo cơ sở dữ liệu `todolist_db`.
2. Cập nhật thông tin tài khoản kết nối trong `ToDoList_Backend/src/main/resources/application.properties`.
3. Chạy lệnh:
   ```bash
   cd ToDoList_Backend
   mvn spring-boot:run
   ```