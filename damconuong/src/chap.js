load('config.js');

function execute(url) {
    // 1. Chuẩn hóa URL
    url = url.indexOf('http') === 0 ? url : BASE_URL + url;

    // 2. Request lần đầu với đầy đủ Header
    var response = fetch(url, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            "Referer": BASE_URL,
            "X-Requested-With": "XMLHttpRequest"
        }
    });

    if (!response.ok) return Response.error("HTTP Error: " + response.status);

    // 3. Lấy nội dung HTML và gọi hàm bypass
    var doc = response.html();
    doc = bypass(url, doc); 

    // 4. Bóc tách danh sách ảnh
    // Lưu ý: damconuong thường dùng thẻ img có class 'chapter-img'
    var imgs = doc.select("#chapter-content img.chapter-img, #chapter-content img");
    var data = [];

    for (var i = 0; i < imgs.size(); i++) {
        var e = imgs.get(i);
        
        // Thử lấy link từ nhiều thuộc tính khác nhau để tránh lazy-load
        var link = e.attr("data-src").trim() || e.attr("data-original-src").trim() || e.attr("src").trim();

        if (link && !link.startsWith("data:")) {
            // Xử lý link tương đối
            if (link.indexOf("//") === 0) link = "https:" + link;
            else if (link.indexOf("http") !== 0) link = BASE_URL + (link.startsWith("/") ? "" : "/") + link;

            data.push({
                link: link,
                Referer: url // Dùng chính URL chương làm Referer để tránh chặn ảnh
            });
        }
    }

    if (data.length === 0) return Response.error("Không tìm thấy ảnh. Có thể trang web đã đổi cấu trúc.");

    return Response.success(data);
}