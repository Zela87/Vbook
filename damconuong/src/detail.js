load('config.js');

// Hàm chính để lấy thông tin chi tiết truyện
function execute(url) {
    // Chuẩn hóa URL bằng cách thay thế domain bằng BASE_URL
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    // Gọi hàm bypass để lấy HTML với cookie
    var doc = bypass(url, Http.get(url).html());
    if (doc) {
        // Lấy URL ảnh bìa truyện
        var cover = doc.select(".cover-frame img").first().attr("src");
        // Nếu URL bìa bắt đầu bằng // thì thêm https:
        if (cover.startsWith("//")) {
            cover = "https:" + cover;
        }

        // Khởi tạo mảng thể loại truyện
        let genres = []
        // Duyệt qua các liên kết thể loại và thêm vào mảng
        doc.select(".dark\:text-green-300:is(.dark *) a").forEach(e => {
            genres.push({
                title: e.text(), // Tên thể loại
                input: e.attr('href').replace(/^https?:\/\/[^\/]+/, ''), // URL tương đối
                script: "gen.js" // Script xử lý thể loại
            });
        });

        // Trả về thông tin truyện thành công
        return Response.success({
            name: doc.select(".text-xl").text(), // Tên truyện
            cover: cover, // Ảnh bìa
            host: BASE_URL, // Host URL
            author: doc.select("span.result").text(), // Tác giả
            // description: doc.select("#gioithieu.showmore").text(), // Mô tả (đã comment)
            // Chi tiết truyện với các thông tin khác
            // detail: 'Tên khác: ' + doc.select(".book_info .list-info .othername h2").text() +
            // '<br>Tác giả: ' + doc.select(".book_info .list-info .author a.org").text() +
            // '<br>Tình trạng: ' + doc.select(".book_info .list-info .status .col-xs-9").text() +
            // '<br>Lượt thích: ' + doc.select(".book_info .list-info .row .number-like").text() +
            // '<br>Lượt theo dõi: ' + doc.select(".book_info .list-info .row:nth-last-child(2) .col-xs-9").text() +
            // '<br>Lượt xem: ' + doc.select(".book_info .list-info .row:nth-last-child(1) .col-xs-9").text(),
            ongoing: doc.select(".text-gray-700 dark:text-gray-300 mr-2 font-bold text-base md:text-lg").html().indexOf("Đang Cập Nhật") >= 0, // Truyện đang cập nhật
            genres: genres // Danh sách thể loại
        });
    }

    // Trả về lỗi nếu không tải được dữ liệu
    return Response.error("Không tải được dữ liệu");
}