// Nạp file cấu hình từ config.js
load('config.js');

/**
 * Hàm execute - Lấy danh sách các chương từ URL được cung cấp
 * @param {string} url - Đường dẫn tới trang chứa danh sách các chương
 * @returns {Response} - Danh sách các chương hoặc null nếu thất bại
 */
function execute(url) {
    // Gửi yêu cầu HTTP đến URL và nhận phản hồi
    let response = fetch(url);
    
    // Kiểm tra xem yêu cầu có thành công không (mã trạng thái 200-299)
    if (response.ok) {
        // Chuyển đổi phản hồi thành đối tượng HTML để có thể phân tích cú pháp
        let doc = response.html();
        
        // Khởi tạo mảng để lưu trữ danh sách các chương
        let chapters = [];
        
        // Cố gắng lấy tất cả các liên kết chương từ các thẻ liên kết trong danh sách (li > a)
        // Tìm các URL chứa '/chuong-' hoặc '/chuong/'
        let items = doc.select("li a[href*='/chuong-'], li a[href*='/chuong/']");
        
        // Nếu không tìm thấy kết quả, thử sử dụng các bộ chọn CSS khác (phương pháp dự phòng)
        if (items.isEmpty()) {
            items = doc.select(".list-chuong a, .entry-content a[href*='/chuong-'], article a[href*='/chuong-']");
        }

        // Đối tượng lưu trữ các URL đã xử lý để tránh trùng lặp
        let seenUrls = {};
        
        // Lặp qua tất cả các liên kết chương đã tìm thấy
        for (let i = 0; i < items.size(); i++) {
            let item = items.get(i);
            
            // Lấy tên chương từ văn bản của liên kết (loại bỏ khoảng trắng)
            let name = item.text().trim();
            
            // Lấy URL từ thuộc tính href của liên kết
            let href = item.attr("href");
            
            // Kiểm tra xem có tên, URL, có chứa '/chuong-' hoặc '/chuong/', và không có fragment (#)
            if (name && href && (href.indexOf('/chuong-') > 0 || href.indexOf('/chuong/') > 0) && href.indexOf('#') === -1) {
                
                // Loại bỏ tham số truy vấn (?) và fragment (#) khỏi URL
                let cleanUrl = href.split('?')[0].split('#')[0];
                
                // Loại bỏ dấu gạch chéo ở cuối URL nếu có
                if (cleanUrl.endsWith('/')) cleanUrl = cleanUrl.slice(0, -1);
                
                // Kiểm tra xem URL này đã được xử lý chưa (tránh trùng lặp)
                if (!seenUrls[cleanUrl]) {
                    // Đánh dấu URL này là đã xử lý
                    seenUrls[cleanUrl] = true;
                    
                    // Làm sạch tên chương:
                    // - Loại bỏ khoảng trắng thừa
                    // - Chuẩn hóa định dạng "Chương 1: Tên" (thay - hoặc khoảng trắng bằng :)
                    let cleanName = name.replace(/\s+/g, ' ')
                        .replace(/^(Chương\s+\d+)\s*[:\-\s]\s*/i, "$1: ")
                        .trim();
                    
                    // Thêm chương vào danh sách với tên, URL, và host
                    chapters.push({
                        name: cleanName,
                        url: cleanUrl + "/",
                        host: BASE_URL
                    });
                }
            }
        }
        
        // Trả về kết quả thành công với danh sách các chương
        return Response.success(chapters);
    }
    
    // Nếu yêu cầu thất bại, trả về null
    return null;
}
