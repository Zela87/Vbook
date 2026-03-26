load("config.js");

function execute(url) {
    // Chuẩn hóa URL
    url = url.indexOf('http') === 0 ? url : BASE_URL + url;

    var doc = bypass(url, Http.get(url).html());
    if (!doc) return Response.error("Không tải được dữ liệu");

    // Lấy container nội dung chương
    var content = doc.select(".entry-content").first();
    if (!content) return Response.error("Không tìm thấy nội dung chương");

    // Xóa các thành phần thừa
    content.select(".story-navigation, .reading-tools-bar").remove();
    content.select("span[style*='overflow:hidden']").remove();

    // Lấy toàn bộ text từ các đoạn <p>
    var paragraphs = content.select("p");
    var data = [];

    for (var i = 0; i < paragraphs.size(); i++) {
        var text = paragraphs.get(i).text().trim();
        if (text.length > 0) {
            data.push(text);
        }
    }

    if (data.length === 0) {
        // Fallback: lấy toàn bộ text nếu không có thẻ <p>
        var fallback = content.text().trim();
        if (fallback.length === 0) return Response.error("Chương không có nội dung");
        
        // Thay vì join, ta đưa vào mảng để đồng nhất kiểu dữ liệu
        data = [fallback];
    }

    // SỬA TẠI ĐÂY: Trả về mảng data trực tiếp, không dùng .join()
    return Response.success(data);
}