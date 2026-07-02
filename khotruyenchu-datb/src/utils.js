/**
 * Tác dụng của file:
 * File này chứa các hàm tiện ích (utility functions) dùng chung cho extension VBook,
 * bao gồm việc phân tích cú pháp (parse) danh sách truyện từ mã nguồn HTML và
 * chuẩn hóa đường dẫn URL (tương đối sang tuyệt đối).
 */

/**
 * Phân tích cú pháp và trích xuất danh sách truyện từ đối tượng tài liệu HTML (Jsoup Document)
 * @param {Document} doc - Đối tượng Document chứa nội dung HTML của trang web
 * @returns {Array} Danh sách các đối tượng truyện đã được trích xuất
 */
function parseNovelList(doc) {
    let novelList = [];
    let seenLinks = {}; // Bộ nhớ tạm để kiểm tra và loại bỏ các đường dẫn truyện trùng lặp
    
    // Tìm các thẻ HTML chứa thông tin từng truyện bằng các CSS selector phổ biến
    let items = doc.select("a.story-list-item, .home-story-card, .entry-card, article.post");
    // Nếu không tìm thấy bằng các selector trên, thử selector dự phòng (fallback)
    if (items.isEmpty()) {
        items = doc.select(".ct-container-fluid .entries article");
    }

    // Lặp qua từng phần tử truyện tìm thấy để lấy thông tin chi tiết
    for (let i = 0; i < items.size(); i++) {
        let item = items.get(i);
        
        // Chọn thẻ chứa tiêu đề của truyện
        let titleEl = item.select("h3.story-list-title, .hs-title a, .entry-title a").first();
        // Nếu không tìm thấy thẻ tiêu đề nhưng bản thân thẻ item có href, lấy chính item làm thẻ tiêu đề
        if (!titleEl && (item.attr("href") + "").length > 0) titleEl = item;
        
        // Lấy nội dung văn bản làm tên truyện và xóa khoảng trắng thừa ở 2 đầu
        let name = titleEl ? titleEl.text().trim() : "";
        
        // Lấy đường dẫn (link) dẫn tới trang chi tiết của truyện
        let link = "";
        if ((item.attr("href") + "").length > 0) {
            link = item.attr("href");
        } else {
            link = titleEl ? titleEl.attr("href") : "";
        }
        
        // Tìm và lấy địa chỉ ảnh bìa (hỗ trợ lazy load với data-src/data-lazy-src hoặc thuộc tính src thông thường)
        let coverEl = item.select("img.story-thumb-img, .hs-thumb img, img").first();
        let cover = "";
        if (coverEl) {
            cover = coverEl.attr("data-src") || coverEl.attr("data-lazy-src") || coverEl.attr("src");
        }
        
        // Tìm và lấy thông tin tác giả, loại bỏ ký tự emoji cây bút (✍️) nếu có
        let authorEl = item.select(".story-list-author, .entry-meta a[href*='tac-gia']").first();
        let author = authorEl ? authorEl.text().trim().replace(/✍️\s*/, "") : "";
        
        // Chỉ thêm vào danh sách nếu trích xuất thành công cả tên truyện và đường dẫn
        if (name && link) {
            // Chuẩn hóa đường dẫn thành URL tuyệt đối (có đầy đủ giao thức và tên miền)
            link = normalizeUrl(link);
            
            // Nếu đường dẫn này đã xử lý trước đó, bỏ qua để tránh trùng lặp truyện
            if (seenLinks[link]) continue;
            seenLinks[link] = true;

            // Làm sạch tên truyện nếu tên truyện bị lẫn thông tin tác giả hoặc các emoji đặc biệt
            if (author && name.indexOf(author) > 0) {
                name = name.split(/✍️|⏱️/)[0].trim();
            }

            // Đưa thông tin truyện đã chuẩn hóa vào mảng kết quả
            novelList.push({
                name: name,
                link: link,
                cover: cover,
                description: author ? "Tác giả: " + author : "",
                host: BASE_URL // BASE_URL được cấu hình toàn cục từ file config.js hoặc môi trường chạy
            });
        }
    }
    return novelList;
}

/**
 * Chuẩn hóa một đường dẫn URL (tương đối hoặc khuyết thiếu giao thức) thành URL tuyệt đối
 * @param {string} url - Đường dẫn URL cần chuẩn hóa
 * @returns {string} URL tuyệt đối hoàn chỉnh
 */
function normalizeUrl(url) {
    url = (url || "") + "";
    // Nếu URL bắt đầu bằng '//' (thiếu giao thức http/https), tự động thêm 'https:' vào trước
    if (url.indexOf("//") === 0) return "https:" + url;
    // Nếu URL đã là tuyệt đối (bắt đầu bằng http:// hoặc https://), giữ nguyên và trả về
    if (url.indexOf("http://") === 0 || url.indexOf("https://") === 0) return url;
    // Nếu đường dẫn tương đối không bắt đầu bằng dấu '/', tự động thêm dấu '/' vào đầu
    if (url.charAt(0) !== "/") url = "/" + url;
    // Ghép đường dẫn tương đối với tên miền gốc BASE_URL để tạo URL tuyệt đối
    return BASE_URL + url;
}
