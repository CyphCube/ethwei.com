---
title: "Tổng kết Testnet Giai đoạn 1: Những lỗi chúng tôi tìm ra trước khi mainnet làm điều đó"
date: 2026-08-04
category: "Kỹ Thuật"
image: "/blog/testnet-phase-1-retrospective.jpg"
summary: "Testnet đầu tiên của Ethwei chạy suốt năm tuần mà không có sự cố ngừng hoạt động ngoài kế hoạch nào. Đó không phải là điều đáng nói. Điều đáng nói là bốn vấn đề mà nó phơi bày — một lỗ hổng vượt qua quản trị, một khoảng hở trong giới hạn cung, và một sự cố slashing — và vì sao chúng tôi chọn loại bỏ mã nguồn thay vì thêm nhiều mã hơn để sửa chúng."
description: "Testnet của Ethwei chạy 5 tuần không gián đoạn — nhưng câu chuyện thật sự là 4 lỗi chúng tôi tìm ra: vượt quản trị, hở giới hạn cung, và sự cố slashing."
---

Testnet đầu tiên của Ethwei, `ethwei-testnet-1`, đã chạy khoảng năm tuần — từ 29 tháng 6 đến 4 tháng 8 năm 2026 — và đạt độ cao cuối cùng là 621.526 block với thời gian khoảng 5 giây mỗi block, không có sự cố ngừng hoạt động ngoài kế hoạch nào. Tổng cung cuối cùng khép lại ở mức 6.999.827.484 ETE.

Con số thời gian hoạt động đó thực ra không phải là trọng tâm của bài viết này. Bất kỳ ai cũng có thể vận hành một blockchain trong năm tuần mà không bị sập. Câu hỏi hữu ích hơn là điều gì sẽ hỏng khi bạn thực sự cố gắng sử dụng nó theo đúng cách nó được thiết kế để sử dụng — và liệu bạn phát hiện ra điều đó ngay bây giờ, trên testnet, hay sau này, trên mainnet, với giá trị thực đang bị đặt cược.

Chúng tôi đã tìm thấy bốn vấn đề thực sự. Cả bốn đều đã được khắc phục. Đây là những gì đã xảy ra.

## Những gì đã được chứng minh

Trước khi đi vào những gì đã hỏng, cần phải làm rõ testnet này thực sự đang kiểm tra điều gì:

- **Mô hình kinh tế Proof-of-Stake với phát hành cố định** đã chạy liên tục trong năm tuần mà không có sai lệch, dưới các thông số tokenomics được thử nghiệm cho Giai đoạn 1: nguồn cung genesis 7 tỷ, giới hạn cứng 10 tỷ, phát hành cố định 100 triệu ETE/năm (~15,84 ETE mỗi block) được lên lịch trong 30 năm, và thuế cộng đồng 0% — mọi phần thưởng staking đều thuộc về người staking, không có phần nào bị giữ lại.
- **Đồng thuận đa validator** — validator thứ hai, CyphCube-2, đã tham gia vào chuỗi đang hoạt động từ block 0, đồng bộ khoảng 138.000 block, và sau đó được ngừng hoạt động và loại bỏ một cách an toàn.
- **Quản trị đầu-cuối** — sáu đề xuất đã được gửi lên, cả sáu đều được thông qua, và các thay đổi tham số kết quả đã tự động thực thi trên chuỗi mà không cần can thiệp thủ công.
- **Slashing, jailing, và đốt token** đã được xác minh bằng thực nghiệm, không chỉ là lý thuyết trên giấy (chi tiết bên dưới).
- **Toàn bộ hạ tầng công khai hoạt động ổn định** — RPC/API qua HTTPS, block explorer có thương hiệu riêng, tích hợp ví Keplr.
- **Sự tách biệt hạ tầng là có chủ đích** — máy chủ validator chỉ chạy node. Explorer, tài liệu, và trang web này đều được lưu trữ riêng biệt.

Đó là nền tảng cơ bản. Đây mới là phần thực sự quan trọng.

## 1. Lỗ hổng vượt qua quản trị (mức độ nghiêm trọng: cao)

Ban đầu, testnet của Ethwei áp dụng hai quy tắc quản trị tùy chỉnh: chỉ validator mới có thể gửi đề xuất, và tùy chọn bỏ phiếu "Phản đối mạnh mẽ" (NoWithVeto) bị vô hiệu hóa.

Một cuộc rà soát bảo mật phát hiện ra rằng cả hai giới hạn này đều có thể bị vượt qua hoàn toàn — thông qua API quản trị cũ (legacy) của Cosmos và bỏ phiếu có trọng số (weighted votes), cả hai đều không tuân theo quy tắc tùy chỉnh. Đây không phải là lý thuyết. Nó đã được xác nhận có thể khai thác được trên testnet đang hoạt động, và sau đó đã được khắc phục.

Các quy tắc tùy chỉnh được gắn thêm vào một framework đã được kiểm chứng qua thực chiến chính là loại vấn đề trông có vẻ ổn cho đến khi ai đó thực sự kiểm tra các đường nối.

## 2. Quyết định được đưa ra sau đó

Bản sửa lỗi không phải là một bản vá. Ethwei đã loại bỏ hoàn toàn mã quản trị tùy chỉnh của mình và quay trở lại quản trị Cosmos tiêu chuẩn, chưa sửa đổi — với việc ngăn chặn spam theo cách tiêu chuẩn, thông qua biện pháp kinh tế bằng khoản đặt cọc đề xuất (proposal deposit), thay vì kiểm tra quyền tùy chỉnh.

Bề mặt tấn công của quản trị tùy chỉnh đã giảm từ "hai quy tắc có thể bị vượt qua" xuống còn con số không, bởi vì không còn logic tùy chỉnh nào để vượt qua nữa. Việc vá lỗi liên tục và duy trì một quy tắc tùy chỉnh mong manh mãi mãi có thể là lựa chọn "khôn ngoan" hơn. Loại bỏ nó hoàn toàn là lựa chọn đơn giản hơn. Chúng tôi đã chọn sự đơn giản.

## 3. Giới hạn cung có thể đã bị phá vỡ (mức độ nghiêm trọng: cao)

Module phát hành theo dõi lượng đã đúc thông qua một bộ đếm nội bộ. Bộ đếm đó không được bảo toàn qua quá trình export/import genesis — cơ chế đứng sau nhiều lần nâng cấp blockchain.

Một lần nâng cấp có thể đã âm thầm đặt lại bộ đếm đó và đúc lại toàn bộ quỹ dự trữ staking từ đầu, phá vỡ giới hạn cứng 10 tỷ mà không có bất kỳ giao dịch đơn lẻ nào trông có vẻ bất thường. Cách khắc phục là ngừng tin tưởng vào bộ đếm này: giới hạn hiện được thực thi dựa trên tổng cung *thực tế* trên chuỗi, vì vậy nó vẫn được duy trì bất kể bộ đếm nội bộ ghi nhận điều gì.

## 4. Sự cố slashing (câu chuyện đáng kể nhất)

Khi CyphCube-2 bị ngừng hoạt động, nó đã offline — và bị jailed cùng với việc bị slashing 1% chỉ sau khoảng 4 phút downtime. Đó là 10.020.000 ETE, ảnh hưởng theo tỷ lệ đến mọi delegator của validator đó.

Cuộc điều tra cho thấy nguyên nhân đơn giản hơn một lỗi phần mềm: Ethwei đang chạy các tham số slashing mặc định thô của Cosmos SDK — một cửa sổ ký (signing window) 100 block (khoảng 4 phút ân hạn) với mức phạt downtime 1%. Trên mainnet, cấu hình đó có nghĩa là một lần khởi động lại máy chủ thông thường hoặc một lần nâng cấp phần mềm chậm — không phải một cuộc tấn công, chỉ là hoạt động vận hành bình thường — sẽ khiến mọi delegator đứng sau validator đó bị slashing.

Bản sửa lỗi gồm hai phần. Đầu tiên, cửa sổ ký được mở rộng từ 100 block lên 10.000 block, và mức phạt downtime giảm từ 1% xuống còn 0,01%. Sau đó, qua rà soát thêm, chính sách này được nới lỏng thêm lần nữa để khớp với thiết lập của chính Cosmos Hub — chỉ cần 5% số block trong cửa sổ được ký — đưa thời gian ân hạn từ khoảng 4 phút lên khoảng 13 giờ.

Mức phạt slashing cho double-sign vẫn giữ nguyên ở 5%. Downtime là một tai nạn. Ký hai block khác nhau ở cùng một độ cao là một cuộc tấn công. Chúng không nên bị trừng phạt theo cùng một cách, và giờ đây thì không còn như vậy nữa.

## Một khoảnh khắc xác minh nguồn cung, như một hệ quả phụ

Chính lần slashing đó cũng cho chúng tôi một cách rõ ràng để xác nhận một điều dễ tuyên bố nhưng khó chứng minh hơn: ETE bị đốt thực sự bị tiêu hủy, chứ không được phân phối lại cho bất kỳ ai.

Tổng cung đã giảm chính xác 10.020.000 ETE — khớp với lượng bị slashing đến từng token. Nhờ đó, testnet thực sự kết thúc với *ít* ETE tồn tại hơn so với lúc bắt đầu: tổng lượng đốt tích lũy đã vượt qua tất cả những gì phát hành đã tạo ra trong suốt năm tuần. Không ai thu được giá trị từ một lần slashing. Giá trị đơn giản là biến mất.

## Các lựa chọn thiết kế đã được xác nhận

Một vài quyết định kiến trúc đã đứng vững qua cùng năm tuần sử dụng đó:

- **Không có IBC, không có cầu nối.** Sự độc lập có chủ đích, và giảm bớt một loại bề mặt tấn công cần lo lắng.
- **Mười sáu module tinh gọn**, với năm module bị loại bỏ khỏi bộ tiêu chuẩn (`nft`, `group`, `authz`, `feegrant`, `mint`) — cũng vì lý do tương tự, giảm bề mặt tấn công.
- **Các hằng số phát hành được mã hóa cứng**, không thể điều chỉnh bởi quản trị, vì vậy dù kết quả bỏ phiếu quản trị là gì, cũng không thể làm tăng nguồn cung vượt quá những gì đã được cố định sẵn trong mã nguồn.
- **Thuế cộng đồng 0%.** Mọi phần thưởng staking đều thuộc về người staking, không có ngoại lệ.

## Trung thực về những giới hạn của testnet này

Đây là một lần vận hành testnet có kiểm soát, không phải một bài kiểm tra chịu tải (stress test), và cần phải nói rõ ràng về sự khác biệt đó. Nó không bao gồm các validator bên thứ ba bên ngoài, người dùng thực hoặc giá trị thực bị đặt cược, các điều kiện đối kháng ở quy mô thực sự, hay một cuộc kiểm toán bảo mật chuyên nghiệp độc lập. Những điều đó vẫn là những điều kiện tiên quyết trước khi lên mainnet — bài tổng kết này không thể thay thế cho bất kỳ điều nào trong số đó.

## Tiếp theo là gì: Giai đoạn 2

Giai đoạn 2 sẽ chạy trên một testnet hoàn toàn mới với tokenomics đã được sửa đổi, được xây dựng xoay quanh nguyên tắc ra mắt công bằng (fair-launch) thay vì một lượng lớn được đúc trước.

Nguồn cung genesis giảm từ 70% tổng cung tối đa xuống còn 10% — 1 tỷ ETE — với 90% còn lại (9 tỷ ETE) được người tham gia kiếm được thông qua staking trong 30 năm, ở mức cố định 300 triệu ETE/năm. Tổng cung tối đa vẫn giữ nguyên ở mức 10 tỷ.

Lý do rất đơn giản: dù tokenomics được trình bày như thế nào, việc đúc trước 70% tổng cung của một token vào một địa chỉ duy nhất là một câu chuyện ra mắt công bằng yếu ớt. Việc để 90% nguồn cung được kiếm được thông qua sự tham gia, thay vì được phân bổ trước khi bất kỳ ai khác xuất hiện, gần với các nguyên tắc mà Ethwei thực sự được xây dựng dựa trên đó hơn.

Một blockchain nhàm chán và đơn giản mới là một blockchain tốt — nhưng nhàm chán không có nghĩa là chưa được kiểm thử. Nó có nghĩa là được kiểm thử đủ kỹ lưỡng, đủ sớm, để không có điều gì "thú vị" xảy ra vào lúc thực sự quan trọng.
