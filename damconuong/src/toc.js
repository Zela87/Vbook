load('config.js');


// Hàm chính để lấy danh sách chương truyện
function execute(url) {
    // Chuẩn hóa URL bằng cách thay thế domain bằng BASE_URL
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);

    // Gọi hàm bypass để lấy HTML với cookie
    var doc = bypass(url, Http.get(url).html());
    if(doc) {
        // Khởi tạo mảng danh sách chương
        var list = [];
        // Lấy tất cả các liên kết chương
        var el = doc.select("#chapterList a");
        // Duyệt từ cuối danh sách lên đầu (để có thứ tự chương mới nhất trước)
        for (var i = el.size() - 1; i >= 0; i--) {
            // Lấy phần tử tại vị trí i
            var e = el.get(i);
            // Thêm thông tin chương vào mảng
            list.push({
                name: e.select("span.text-ellipsis").text(), // Tên chương
                url: e.attr("href"), // URL chương
                host: BASE_URL, // Host URL
            });
        }
        // Trả về danh sách chương thành công
        return Response.success(list);
    }

    // Trả về lỗi nếu không tải được dữ liệu
    return Response.error("Không tải được dữ liệu");
}