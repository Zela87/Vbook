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
                input: "https://sstruyen.com.vn" + genre.attr("href"),
                script: "gen.js"
            });
        });

        // Lấy mô tả (nội dung giới thiệu truyện)
        let description = response.select(".truyen-desc").html();

        // Lấy ảnh bìa (nối host vì src là link tương đối)
        let cover = response.select(".truyen-cover img").attr("src");
        if (cover && !cover.startsWith("http")) cover = "https://sstruyen.com.vn" + cover;

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
            host: "https://sstruyen.com.vn"
        });
    }
    return null;
}