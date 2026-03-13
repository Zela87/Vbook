load('config.js');

// Hàm chính để lấy nội dung chương truyện (danh sách ảnh)
function execute(url) {
    // Chuẩn hóa URL bằng cách thay thế domain bằng BASE_URL
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    // Gọi hàm bypass để lấy HTML với cookie
    var doc = bypass(url, fetch(url).html());
    if (doc) {
        // Lấy tất cả các thẻ img có class lazy trong nội dung chương
        var imgs = doc.select("#chapter-content img.chapter-img");
        // Khởi tạo mảng dữ liệu ảnh
        var data = [];
        // Duyệt qua từng ảnh
        for (var i = 0; i < imgs.size(); i++) {
            // Lấy phần tử ảnh tại vị trí i
            let e = imgs.get(i);
            // Lấy URL ảnh từ thuộc tính data-original
            let link = e.attr("data-original-src").trim();
            // Nếu có URL ảnh dự phòng
            if (link !== undefined) {
                // Thay thế domain mangaqq.net hoặc cdnqq.xyz bằng i200.truyenvua.com
                if (link.indexOf("mangaqq.net") > -1 || link.indexOf("cdnqq.xyz") > -1) {
                    link = link.replace("mangaqq.net", "i200.truyenvua.com");
                    link = link.replace("cdnqq.xyz", "i200.truyenvua.com");
                // Thay thế domain mangaqq.com bằng i216.truyenvua.com
                } else if (link.indexOf("mangaqq.com") > -1) {
                    link = link.replace("mangaqq.com", "i216.truyenvua.com");
                // Thay thế các domain trangshop.net, photruyen.com, tintruyen.com bằng i109.truyenvua.com
                } else if (link.indexOf("trangshop.net") > -1 || link.indexOf("photruyen.com") > -1 || link.indexOf("tintruyen.com") > -1) {
                    link = link.replace("photruyen.com", "i109.truyenvua.com");
                    link = link.replace("tintruyen.com", "i109.truyenvua.com");
                    link = link.replace("trangshop.net", "i109.truyenvua.com");
                // Thay thế domain tintruyen.net bằng i138.truyenvua.com
                } else if (link.indexOf("tintruyen.net") > -1) {
                    link = link.replace("//tintruyen.net", "//i138.truyenvua.com");
                    link = link.replace("//i125.tintruyen.net", "//i125.truyenvua.com");
                // Thay thế domain qqtaku.com bằng i125.truyenvua.com
                } else if (link.indexOf("qqtaku.com") > -1) {
                    link = link.replace("qqtaku.com", "i125.truyenvua.com");
                }
            }
            // Thêm thông tin ảnh vào mảng dữ liệu
            data.push({
                link: link, // URL ảnh chính
                fallback: [link], // URL ảnh dự phòng
                Referer: BASE_URL // Header Referer
            });
        }
        // Trả về danh sách ảnh thành công
        return Response.success(data);
    }
    // Trả về lỗi nếu không tải được dữ liệu
    return Response.error("Không tải được dữ liệu");
}
