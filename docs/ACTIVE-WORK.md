# Công việc hiện tại · MooZ CVN 0.5.2 (repo test)

## Cập nhật 0.5.2 · Cài đặt, Kho và thao tác nút

- **Cài đặt:** thanh lựa chọn ngang riêng cho Chrome & tab, Relay máy ảo, API AI, API khác, Trợ lý AI, Ứng dụng và Chẩn đoán. Chuyển mục chỉ ẩn/hiện panel, không dựng lại form hoặc xóa nội dung đang nhập.
- **Khắc phục nút nháy:** nút đồng bộ không tự chuyển sang disabled sau mỗi click; các thao tác async được chặn trùng bằng cờ nội bộ thay vì làm mất focus. Nút Dùng kết quả chỉ đóng sau khi callback áp dụng thành công. Menu Thêm node giữ mở khi rê qua khe giữa trigger và bảng.
- **Sao chép:** desktop hỗ trợ clipboard qua IPC được xác thực; web có kiểm tra clipboard và fallback. Không tự báo sao chép thành công khi lệnh thất bại.
- **Kho:** thẻ ảnh/video/audio đồng nhất; MP3/âm thanh có biểu tượng nốt nhạc, audio vẫn phát được; nút Thêm tệp riêng; trái tim ở cuối thẻ và mục Yêu thích. Trạng thái thích và danh mục Kho được lưu qua tải lại.
- **Kiểm thử:** bổ sung `tests/settings-library.browser.cjs` chạy Chromium với máy chủ thật, kiểm click/clipboard, menu Cài đặt, video/ảnh/audio, yêu thích và thao tác file. CI Mac Intel phải qua toàn bộ `test:all`, kiểm app đã đóng gói, rồi mới publish. Kiểm thử tài khoản AI thật và máy Ventura của người dùng vẫn chưa được chứng nhận.

## Điểm tiếp tục
Mã nguồn được sao chép nguyên trạng từ `mktminhqpbga-glitch/App-MooZ-Workflow` nhánh `main`, commit `c922c8cde98eb42f006b44351829eae01a50e5f4`, sang repo `mktminhqpbga-glitch/test` ngày 2026-11-07. Repo nguồn giữ nguyên. File workflow build Mac được bổ sung riêng vì workflow permission của GitHub; toàn bộ file nguồn khác được đối chiếu SHA và giống bản gốc trước khi sửa tài liệu này.

**Bản gốc tham chiếu: 0.5.1; bản đang làm tại test: 0.5.2**, không phải 0.5.0 như ghi chú cũ. Xem `APP-AUDIT-0.5.0.md`, `APP-AUDIT-0.5.1.md`, `RELEASE-NOTES.md` và `USER-REQUEST-REVIEW.md`.

## Đã triển khai, nhưng chưa được chứng nhận bằng tài khoản AI thật
- Tạo ảnh/video hàng loạt, queue có checkpoint, Canvas và Kho, workflow đa cảnh, Phòng dựng/hậu kỳ, extension MooZ Connect 1.9.3.
- Cấu hình OpenAI/Gemini/fal, Google Veo và adapter media; kiểm thử fixture/protocol, không phải cam kết mọi model/tài khoản được hỗ trợ trực tiếp.
- Desktop Electron x64 cho macOS 13+, FFmpeg/ONNX đóng kèm, workflow macOS Intel chạy kiểm thử và đóng gói trước khi phát hành.
- Sửa lỗi ChatGPT: ghép tỷ lệ/độ phân giải vào yêu cầu, nhận ảnh trong turn chỉ có ảnh, khôi phục URL/tab binding và kết quả theo request ID.

## Việc tiếp theo, theo thứ tự
1. **Xác minh GitHub Actions tại repo test:** chạy `.github/workflows/release-mac.yml` trên `macos-15-intel`, kiểm `test:all`, `package:mac`, `test:packaged`, ZIP/DMG và artifact/release. Chỉ đánh dấu xong khi run có kết quả **success**. Không coi việc copy workflow là đã build thành công.
2. **Kiểm tra trên Mac Intel Ventura của người dùng:** cài DMG, mở app, kiểm extension từ Cài đặt; thử Canvas, hàng loạt, tạo ảnh và video, video chiều sâu, lưu/tải dự án, sleep/wake và chuột giữa. Chưa có thiết bị vật lý trong môi trường tự động.
3. **E2E AI thật:** cần phiên Chrome đã đăng nhập và quyền/tài khoản AI do người dùng cấu hình. Cài/nạp lại MooZ Connect 1.9.3 rồi tải lại tab AI. Gửi một lượt ảnh có tỷ lệ/độ phân giải, kiểm file nhận vào Canvas/Kho và không tạo lượt trùng. Tránh lệnh tạo AI tính phí tự động trong test.
4. **Relay/Chrome VM thật:** cần WSS endpoint và VM hợp lệ của người dùng; xác minh ghép, đúng tab, kết nối lại và đối chiếu request đang dở. Không nhúng relay admin key vào git.
5. **LibTV:** chờ một file export workflow thật để viết và thử adapter tương thích; parser JSON tổng quát chưa chứng minh hỗ trợ LibTV.
6. **Bảo mật/phân phối:** xem xét Keychain cho khóa (đang lưu file quyền 0600), Developer ID/notarization và kiểm tra Gatekeeper. Chưa có Apple Developer ID trong project.

## Quy tắc cập nhật
- Chỉ ghi “đã hoàn tất” khi có bằng chứng trên môi trường tương ứng. Phân biệt fixture/local Linux, macOS runner và máy thật.
- Không commit khóa API/relay, cookie hoặc token. Không gửi lại request AI có trạng thái chưa rõ.
- Sau mỗi thay đổi, cập nhật tài liệu, kiểm thử tương ứng và trạng thái workflow; giữ repo nguồn làm bản đối chiếu.
