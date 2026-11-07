# Công việc hiện tại · MooZ CVN 0.5.1 (repo test)

## Điểm tiếp tục
Mã nguồn được sao chép nguyên trạng từ `mktminhqpbga-glitch/App-MooZ-Workflow` nhánh `main`, commit `c922c8cde98eb42f006b44351829eae01a50e5f4`, sang repo `mktminhqpbga-glitch/test` ngày 2026-11-07. Repo nguồn giữ nguyên. File workflow build Mac được bổ sung riêng vì workflow permission của GitHub; toàn bộ file nguồn khác được đối chiếu SHA và giống bản gốc trước khi sửa tài liệu này.

**Bản đang làm: 0.5.1**, không phải 0.5.0 như ghi chú cũ. Xem `APP-AUDIT-0.5.0.md`, `APP-AUDIT-0.5.1.md`, `RELEASE-NOTES.md` và `USER-REQUEST-REVIEW.md`.

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
