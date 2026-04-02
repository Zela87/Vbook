// Nạp file cấu hình từ config.js
load('config.js');
// Nạp file tiện ích từ utils.js (chứa hàm parseNovelList)
load('utils.js');

/**
 * Hàm execute - Lấy danh sách truyện từ trang thể loại theo trang
 * @param {string} url - Đường dẫn URL trang thể loại
 * @param {string} page - Số trang cần lấy (mặc định là '1')
 * @returns {Response} - Danh sách truyện và số trang tiếp theo, hoặc null nếu thất bại
 */
function execute(url, page) {
    // Nếu không truyền tham số page, mặc định là trang đầu tiên ('1')
    if (!page) page = '1';
    
    // Sao chép URL gốc để xây dựng URL final
    let fetchUrl = url;
    
    // Nếu không phải trang đầu, thêm đường dẫn phân trang vào URL
    if (page !== '1') {
        // Loại bỏ dấu gạch chéo ở cuối nếu có
        if (fetchUrl.endsWith('/')) fetchUrl = fetchUrl.slice(0, -1);
        
        // Xây dựng URL với định dạng: /page/số_trang/
        fetchUrl += "/page/" + page + "/";
    }

    // Gửi yêu cầu HTTP đến URL và nhận phản hồi
    let response = fetch(fetchUrl);
    
    // Kiểm tra xem yêu cầu có thành công không (mã trạng thái 200-299)
    if (response.ok) {
        // Chuyển đổi phản hồi thành đối tượng HTML để phân tích cú pháp
        let doc = response.html();
        
        // Gọi hàm từ utils.js để lấy danh sách truyện từ trang HTML
        let novelList = parseNovelList(doc);
        
        // Khởi tạo biến lưu số trang tiếp theo (mặc định là chuỗi rỗng)
        let next = "";
        
        // Tìm liên kết "trang tiếp theo" (phần tử với class 'next' và 'page-numbers')
        let nextEl = doc.select("a.next.page-numbers").first();
        
        // Nếu tồn tại liên kết trang tiếp theo, tăng số trang lên 1
        if (nextEl) {
            next = String(parseInt(page) + 1);
        }

        // Trả về kết quả thành công với danh sách truyện và số trang tiếp theo
        return Response.success(novelList, next);
    }
    
    // Nếu yêu cầu thất bại, trả về null
    return null;
}
