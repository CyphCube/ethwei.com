---
title: "Testnet sắp ra mắt — xây dựng trên Cosmos SDK"
date: 2026-06-10
category: "Kỹ Thuật"
summary: "Testnet công khai của chúng tôi đang đến gần. Đây là những gì các nhà phát triển có thể mong đợi khi xây dựng trên testnet của Ethwei."
description: "Testnet công khai đang đến gần. Đây là những gì nhà phát triển có thể mong đợi trên testnet Ethwei."
image: "/blog/testnet-on-the-way.jpg"
---

Testnet của Ethwei đang đến gần. Bài viết này nói về nền tảng nó được xây dựng trên, và những gì bạn có thể mong đợi khi nó ra mắt.

## Xây dựng trên Cosmos SDK

Ethwei chạy trên Cosmos SDK, trên nền đồng thuận CometBFT. Đó là một lựa chọn có chủ đích, không phải mặc định. Chúng tôi không tự xây dựng công cụ đồng thuận riêng hay phát minh lại máy ảo — đó chính xác là loại phức tạp không cần thiết đi ngược lại mục tiêu về một blockchain nhàm chán, đáng tin cậy. Cosmos mang đến cho chúng tôi một nền tảng mô-đun đã được kiểm chứng qua thực tế, để công sức kỹ thuật của chúng tôi tập trung vào những phần thực sự đặc thù cho việc token hóa tài sản thực.

Đối với nhà phát triển, điều này có nghĩa là testnet sẽ không cảm thấy xa lạ. Nếu bạn từng làm việc với một blockchain Cosmos SDK trước đây, bạn đã hiểu phần lớn cách Ethwei được xây dựng.

## Testnet dùng để làm gì

Nhiệm vụ của một testnet là phát hiện vấn đề trước khi chúng thực sự quan trọng. Chúng tôi thà phát hiện một giả định sai, một trường hợp biên bị bỏ sót, hay một lỗi trong module ngay bây giờ — trên một mạng lưới nơi không có gì thực sự bị đe dọa — còn hơn là phát hiện sau này, trên mainnet, với giá trị thực đứng sau nó. Hãy kỳ vọng chúng tôi sẽ thực sự kiểm chứng những gì mình tuyên bố ở đây thay vì mặc định cho là đúng: hành vi có thể dự đoán, đồng thuận đáng tin cậy, và các module làm ít hơn thay vì nhiều hơn.

## Nhà phát triển có thể mong đợi gì

Trong những tuần tới, chúng tôi sẽ chia sẻ:

- **Thông tin tham gia làm validator** — cách tham gia với vai trò validator và yêu cầu để vận hành một node.
- **Quyền truy cập faucet** — cách nhận token testnet để phát triển và kiểm thử.
- **Tài liệu SDK** — các tài liệu tham khảo bạn cần để bắt đầu xây dựng trên Ethwei.

## Hãy tiếp tục đón chờ

Chúng tôi sẽ chia sẻ chi tiết ngày ra mắt chính xác khi mọi thứ sẵn sàng. Nếu bạn muốn xây dựng trên hạ tầng tài sản thực coi trọng sự nhàm chán và đơn giản, đây chính là nơi bắt đầu.
