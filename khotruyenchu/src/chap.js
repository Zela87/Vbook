// Định nghĩa URL cơ sở của trang web truyện
let BASE_URL = 'https://khotruyenchu.sbs';

// Thử lấy URL cấu hình từ CONFIG_URL nếu có
try {
    if (CONFIG_URL) {
        BASE_URL = CONFIG_URL;
    }
} catch (error) {
    // Bỏ qua lỗi nếu CONFIG_URL không tồn tại
}



function execute(url) {
    url = url.indexOf('http') === 0 ? url : BASE_URL + url;

    var response = Http.get(url);
    if (!response) return Response.error("Request null");

    var doc = response.html();
    if (!doc) return Response.error("Không lấy được HTML");

    doc = bypass(url, doc);
    if (!doc) return Response.error("Bypass thất bại");

    var content = doc.select(".entry-content").first();
    if (!content) return Response.error("Không tìm thấy nội dung");

    content.select(".story-navigation, .reading-tools-bar").remove();

    var paragraphs = content.select("p");
    var data = [];

    for (var i = 0; i < paragraphs.size(); i++) {
        var text = paragraphs.get(i).text().trim();
        if (text.length > 0) data.push(text);
    }

    if (data.length === 0) {
        var fallback = content.text().trim();
        if (!fallback) return Response.error("Chương rỗng");
        data = [fallback];
    }

    return Response.success(data);
}