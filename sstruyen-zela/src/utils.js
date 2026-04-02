/**
 * Hàm parseNovelList - Phân tích và trích xuất danh sách truyện từ trang HTML
 * @param {Document} doc - Đối tượng HTML của trang web
 * @returns {Array} - Mảng các truyện với thông tin (tên, liên kết, ảnh, tác giả)
 */
function parseNovelList(doc) {
    // Khởi tạo mảng để lưu trữ danh sách truyện
    let novelList = [];
    
    // Cố gắng lấy tất cả các phần tử truyện bằng bộ chọn chính
    let items = doc.select("div.item");
    
    // Nếu không tìm thấy, thử các bộ chọn khác (phương pháp dự phòng)
    if (items.isEmpty()) {
        items = doc.select("a.story-list-item, .home-story-card, .entry-card, article.post");
    }
    
    // Nếu vẫn không tìm thấy, thử bộ chọn khác
    if (items.isEmpty()) {
        items = doc.select(".ct-container-fluid .entries article");
    }

    // Lặp qua tất cả các phần tử truyện tìm thấy
    for (let i = 0; i < items.size(); i++) {
        let item = items.get(i);
        
        // Tìm phần tử tiêu đề (tên truyện) bằng tag h3 hoặc class title
        let titleEl = item.select("h3 a").first();
        
        // Nếu không tìm thấy, thử các bộ chọn khác
        if (!titleEl) titleEl = item.select("h3.story-list-title, .hs-title a, .entry-title a").first();
        
        // Nếu phần tử là liên kết (tag 'a'), dùng chính nó làm tiêu đề
        if (!titleEl && item.tagName() === "a") titleEl = item;
        
        // Lấy tên truyện từ văn bản của phần tử tiêu đề (loại bỏ khoảng trắng)
        let name = titleEl ? titleEl.text().trim() : "";
        
        // Khởi tạo biến lưu đường dẫn truyện
        let link = "";
        
        // Nếu phần tử là liên kết, lấy href trực tiếp; ngược lại lấy từ tiêu đề
        if (item.tagName() === "a") {
            link = item.attr("href");
        } else {
            link = titleEl ? titleEl.attr("href") : "";
        }
        
        // Tìm phần tử ảnh bìa truyện
        let coverEl = item.select("a.cover img, img").first();
        
        // Khởi tạo biến lưu URL ảnh bìa
        let cover = "";
        
        // Lấy URL ảnh từ các thuộc tính có thể (data-src, data-lazy-src, hoặc src)
        if (coverEl) {
            cover = coverEl.attr("data-src") || coverEl.attr("data-lazy-src") || coverEl.attr("src");
        }
        
        // Tìm phần tử tác giả (liên kết chứa '/tac-gia/' trong href)
        let authorEl = item.select("a[href*='/tac-gia/']").first();
        
        // Lấy tên tác giả và loại bỏ biểu tượng ✍️ nếu có
        let author = authorEl ? authorEl.text().trim().replace(/✍️\s*/, "") : "";
        
        // Kiểm tra xem truyện có tên và liên kết hợp lệ
        if (name && link) {
            // Nếu tên chứa tác giả và tác giả có trong tên, lấy phần trước biểu tượng
            if (author && name.indexOf(author) > 0) {
                name = name.split(/✍️|⏱️/)[0].trim();
            }

            // Thêm truyện vào danh sách với các thông tin
            novelList.push({
                name: name,           // Tên truyện
                link: link,           // Đường dẫn tới trang chi tiết truyện
                cover: cover,         // URL ảnh bìa truyện
                description: author ? "Tác giả: " + author : "",  // Mô tả chứa tác giả
                host: BASE_URL        // Host của trang web (từ config.js)
            });
        }
    }
    
    // Trả về danh sách truyện đã trích xuất
    return novelList;
}
