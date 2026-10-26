# Trung Béo Luxury — CMS

Website Next.js và Payload CMS, dùng PostgreSQL Neon và Vercel Blob riêng tư. Giao diện cửa hàng được chuyển từ bản HTML hiện có, giữ các nhãn minh họa của sản phẩm.

## Trạng thái triển khai

- `main`: bản HTML hiện đang phục vụ trên website.
- `cms/payload`: bản CMS đang phát triển và kiểm thử; không phải toàn bộ lộ trình đã hoàn tất.
- `/admin`: quản trị có đăng nhập khi chạy ứng dụng Next.js.
- `dist/admin/`: bản HTML duyệt giao diện trước đây, không phải hệ thống lưu dữ liệu.

## Phát triển trên máy

Cần Node >=24.22.1 và pnpm. Cài thư viện bằng `pnpm install`.

1. Đăng nhập Vercel CLI và liên kết `formelico/trungbeoluxury`.
2. `vercel env pull .env.local --environment=development --yes`.
3. Thiết lập `PAYLOAD_SECRET` ngẫu nhiên riêng tư, `NEXT_PUBLIC_SERVER_URL=http://localhost:3000` và email chủ cửa hàng trong `CMS_BOOTSTRAP_EMAIL` ở `.env.local`. Không commit tệp này.
4. `pnpm db:migrate` chỉ với cơ sở dữ liệu CMS mới/đúng môi trường. Không dùng push schema trên production.
5. `pnpm seed` nhập nội dung HTML hiện tại nếu chưa có danh mục. Không nhập lặp để ghi đè nội dung đang biên tập. Nếu seed bị ngắt giữa chừng cần kiểm tra dữ liệu, không chạy lại mù quáng.
6. `pnpm dev`; mở `http://localhost:3000/admin/create-first-user` và tự tạo tài khoản đầu tiên. Email phải trùng `CMS_BOOTSTRAP_EMAIL`. Luồng này chỉ hoạt động trong development, trên localhost và khi chưa có tài khoản.

Không chia sẻ mật khẩu, database URL, token hoặc tệp `.env.local`. Mật khẩu do chủ cửa hàng tự đặt, không lưu trong Git.

## Quyền và dữ liệu

- Chủ cửa hàng: quản lý tài khoản, nội dung, duyệt đăng và xóa.
- Biên tập viên: soạn nháp; không nâng quyền hoặc đăng nội dung.
- Khách: chỉ đọc bản đã xuất bản. Bản nháp và nguồn xác minh nội bộ không được đưa ra giao diện công khai.
- Sản phẩm/danh mục cần tên Việt và Anh trước khi đăng. Sản phẩm thật cần ảnh đại diện; mẫu minh họa giữ nhãn rõ ràng.
- Ảnh/video được lưu trong Blob riêng tư. Tệp mặc định không công khai; chỉ chủ cửa hàng bật quyền hiển thị trên website. API tệp vẫn kiểm tra quyền trước khi đọc Blob.
- Giới hạn tải tệp hiện tại: 4 MB mỗi tệp, JPEG/PNG/WebP/MP4. Video lớn hơn cần bổ sung upload trực tiếp có kiểm tra quyền trước khi hỗ trợ.
- Tìm kiếm, chọn cỡ, lưu mẫu yêu thích hoạt động trên website. Chưa có đơn hàng hoặc thanh toán.

## Kiểm tra

- `pnpm typecheck`
- `pnpm test`
- `node --env-file=.env.local --import tsx scripts/integration.ts`: kiểm tra DB, đăng nhập, quyền, nháp, lịch sử, Blob và tải tệp qua máy chủ localhost:3000. Tạo và dọn dữ liệu kiểm thử riêng; không chạy trong lúc chủ cửa hàng khởi tạo tài khoản đầu tiên.
- `pnpm build`

Không chạy kiểm thử tích hợp trên dữ liệu khách hàng. Không đưa log hoặc dữ liệu sao lưu có thông tin riêng tư lên GitHub.

## Phát hành

Trước khi phát hành phải kiểm tra team, project, commit, môi trường và tài khoản chủ cửa hàng đã tồn tại. Production không cho khách tự đăng ký tài khoản đầu tiên. Migrations chạy riêng có kiểm tra; không tự thay đổi schema mỗi lần một request tới website.

Ứng dụng Next.js cần Framework `nextjs`, bỏ Output Directory `dist` và dùng build script trong package.json. Các thay đổi cài đặt chỉ áp dụng vào deployment mới.

Trước khi lên production: kiểm tra Preview, migration, dữ liệu nguồn, tệp media và quyền truy cập; lưu phiên bản Git và bản sao dữ liệu phù hợp để có thể quay lại. Không chỉ rollback mã khi đã có migration không tương thích.

## Các phần tiếp theo trong lộ trình

- Chọn/kết nối nhà cung cấp email và xác minh người gửi để gửi email khôi phục mật khẩu thật. Hiện adapter email chủ động báo chưa cấu hình, không ghi token khôi phục ra log.
- Thiết lập lịch sao lưu DB + Blob và thực hành khôi phục. Lịch sử phiên bản CMS không thay thế sao lưu hệ thống.
- Nâng upload video lớn, theo dõi dung lượng và ngân sách.
- Hoàn thiện chỉnh bố cục khối/ẩn hiện, lịch sử người thao tác chi tiết, kiểm thử UX với chủ cửa hàng.
- SEO/metadata động đầy đủ, sitemap/hreflang, quản lý chuyển hướng đường dẫn cũ.
- Bộ sưu tập tuyển chọn nhiều danh mục, thao tác sắp xếp trực quan.
- Tách database development riêng với production sau khi hoàn tất khởi tạo; Preview dùng nhánh DB riêng theo tích hợp Neon.
- Dùng gói Vercel phù hợp mục đích kinh doanh; không tự nâng gói hoặc phát sinh chi phí khi chưa được duyệt.

Chỉ báo hoàn thành toàn bộ CMS sau khi các phần còn lại được xây, kiểm thử và nghiệm thu. Không coi bản HTML hay chỉ build thành công là CMS hoàn chỉnh.
