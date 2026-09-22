# 🛡️ ScamGuard VN - Nền Tảng Phòng Chống & Nhận Diện Lừa Đảo Trực Tuyến

Hệ thống huấn luyện, kiểm tra và phát hiện thủ đoạn lừa đảo trực tuyến tại Việt Nam ứng dụng Trí tuệ Nhân tạo Gemini và Bộ mô hình Đánh giá Rủi ro Đa chiều.

---

## 🚀 1-Click Cloud Deployment (Triển khai 1 Click lên Render)

Bấm vào nút bên dưới để tự động tạo Web Service trên Render hoàn toàn miễn phí từ cấu hình `render.yaml`:

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/synxisthebest/scamguard-vn)

### Biến môi trường cần thiết (Environment Variables):
- `NODE_ENV`: `production`
- `GEMINI_API_KEY`: *(Dán API Key Google Gemini của bạn)*
- `PORT`: Tự động nhận diện qua Render (mặc định 3000)

---

## ⏰ Cronjob Giữ Máy Chủ Hoạt Động 24/7 (Anti-Sleep Keep-Alive)

Các gói dịch vụ miễn phí (Render, Koyeb) sẽ tạm dừng sau 15 phút không có lượt truy cập. Dự án đã được cấu hình sẵn 2 giải pháp:

### Cách 1: Tự động qua GitHub Actions
File workflow [.github/workflows/keep-alive.yml](.github/workflows/keep-alive.yml) đã được nạp sẵn:
1. Vào mục **Settings** -> **Secrets and variables** -> **Actions** trong repository này.
2. Thêm Repository Secret:
   - Tên: `LIVE_APP_URL`
   - Giá trị: Link website đã deploy (ví dụ `https://scamguard-vn.onrender.com`)
3. GitHub Actions sẽ tự động kích hoạt mỗi 14 phút một lần để ping `/health`.

### Cách 2: Dùng cron-job.org (Khuyên dùng song song - Rất ổn định)
1. Đăng nhập [cron-job.org](https://cron-job.org).
2. Tạo Job mới:
   - URL: `https://<ten-app-cua-ban>.onrender.com/health`
   - Tần suất: Mỗi 10 phút (Every 10 minutes)

---

## 💻 Chạy cục bộ (Local Development)

```bash
# 1. Cài đặt thư viện
npm install

# 2. Cấu hình biến môi trường trong .env
GEMINI_API_KEY=your_gemini_api_key_here

# 3. Chạy môi trường phát triển
npm run dev

# 4. Build bản Production và chạy
npm run build
npm run start
```
