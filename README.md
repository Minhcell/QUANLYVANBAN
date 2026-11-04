# Tìm Kiếm Văn Bản – build EXE + APK + HTML

Ứng dụng lưu trữ và tìm kiếm văn bản (Word, PDF, ảnh scan) chạy **offline hoàn toàn** (OCR tiếng Việt đã gói sẵn).

## Cấu trúc
```
web/TimKiemVanBan.html      ← mã nguồn giao diện (dùng chung cho cả 3 bản)
desktop/                    ← bản Windows (.exe, Electron)
mobile/                     ← bản Android (.apk, Capacitor)
.github/workflows/build.yml ← GitHub Actions tự build
```

## Cách build trên GitHub
1. Tạo repo mới trên GitHub (VD `TIMKIEMVANBAN`), để Private cũng được.
2. Upload **toàn bộ** nội dung thư mục này lên nhánh `main` (nhớ có cả thư mục `.github`).
3. Vào tab **Actions** → workflow *Build Tim Kiem Van Ban* tự chạy (hoặc bấm **Run workflow**).
4. Chờ khoảng 6–10 phút, mở lần chạy → mục **Artifacts** tải về:
   - `TimKiemVanBan-EXE` → `TimKiemVanBan.exe` (chạy luôn, không cần cài)
   - `TimKiemVanBan-APK` → `TimKiemVanBan.apk` (cài trên Android, cho phép "Cài từ nguồn không xác định")
   - `TimKiemVanBan-HTML` → `TimKiemVanBan.html` (mở bằng Chrome/Edge)

Muốn sửa giao diện: chỉ cần thay file `web/TimKiemVanBan.html`, push lên là build lại cả 3 bản.

## Dữ liệu
- **EXE**: lần đầu chạy chọn nơi lưu (cạnh file exe, hoặc thư mục khác). App tạo `VanBanLuu\` gồm
  `du_lieu.json`, `noidung\`, `files\`. Chuyển máy: chép file exe + thư mục `VanBanLuu`.
- **APK**: chọn `Documents/VanBanLuu` (xem/chép bằng app Quản lý file) hoặc bộ nhớ riêng của app.
- **HTML**: chọn thư mục trên máy (Chrome/Edge) hoặc lưu trong trình duyệt.
Cấu trúc thư mục `VanBanLuu` giống nhau ở cả 3 bản, nên chép qua lại được.
