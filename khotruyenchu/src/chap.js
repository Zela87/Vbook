load('config.js');

function execute(url) {
    // Chuẩn hóa URL
    url = url.indexOf('http') === 0 ? url : BASE_URL + url;

    var doc = bypass(url, Http.get(url).html());
    if (!doc) return Response.error("Không tải được dữ liệu");

    // Lấy container nội dung chương
    var content = doc.select(".entry-content").first();
    if (!content) return Response.error("Không tìm thấy nội dung chương");

    // Xóa các phần tử không phải nội dung truyện:
    // - .story-navigation: thanh điều hướng chương trước/sau
    // - .reading-tools-bar: thanh công cụ cỡ chữ/giao diện
    // - .gmqhbpr, span[style*="overflow:hidden"]: watermark ẩn chống copy
    content.select(".story-navigation, .reading-tools-bar").remove();
    content.select("span[style*='overflow:hidden']").remove();

    // Lấy toàn bộ text từ các đoạn <p>
    var paragraphs = content.select("p");
    var lines = [];

    for (var i = 0; i < paragraphs.size(); i++) {
        var text = paragraphs.get(i).text().trim();
        if (text.length > 0) {
            lines.push(text);
        }
    }

    if (lines.length === 0) {
        // Fallback: lấy toàn bộ text nếu không có thẻ <p>
        var fallback = content.text().trim();
        if (fallback.length === 0) return Response.error("Chương không có nội dung");
        lines.push(fallback);
    }

    return Response.success(lines.join("\n\n"));
}