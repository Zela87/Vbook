function execute(url) {
    // SSTruyen đôi khi cần User-Agent để tránh bị chặn
    let response = Http.get(url).html();
    
    if (response) {
        // Lấy tên truyện
        let name = response.select(".truyen-title").text();
        
        // Lấy tác giả (tìm trong thẻ <b>Tác giả:</b> rồi lấy text của thẻ <a> sau nó)
        let author = response.select(".truyen-meta span:first-child a").text();
        
        // Lấy thể loại (duyệt qua các thẻ a trong li có class li--genres)
        let genres = [];
        response.select(".truyen-meta span:nth-child(2) a").forEach(genre => {
            genres.push({
                title: genre.text(),
                input: "https://kho-truyen-chu.sbs" + genre.attr("href"),
                script: "gen.js"
            });
        });

        // Lấy mô tả (nội dung giới thiệu truyện)
        let description = response.select(".truyen-desc").html();

        // Lấy thẻ img đầu tiên trong div .truyen-cover
let img = response.select(".truyen-cover img").first();

// Ưu tiên lấy data-src (do trang dùng lazy load), nếu không có thì lấy src
let cover = img ? (img.attr("data-src") || img.attr("src")) : "";

// Kiểm tra và nối host nếu link ảnh là link tương đối (bắt đầu bằng /)
if (cover && cover.startsWith("/")) {
    cover = "https://khotruyenchu.sbs" + cover;
}

        // Kiểm tra trạng thái Full hay Đang ra
        let status = response.select(".truyen-meta").text();
        let ongoing = status.toLowerCase().indexOf("full") === -1;

        return Response.success({
            name: name,
            author: author,
            description: description,
            cover: cover,
            genres: genres,
            ongoing: ongoing,
            host: "https://khotruyenchu.sbs"
        });
    }
    return null;
}