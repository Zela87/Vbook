load("config.js");

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
        
        data = [fallback];
    }

    // Trả về mảng data trực tiếp
    return Response.success(data);
}