load('config.js');

function execute(url) {
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        
        // Lấy tên truyện từ thẻ h1
        let name = doc.select("h1").text().trim();
        
        // Lấy ảnh bìa
        let cover = doc.select("img.rounded.shadow").attr("src");
        
        // Lấy tác giả (tìm text sau icon user hoặc chứa cụm 'Tác giả')
        let author = "";
        doc.select("p").forEach(function(el) {
            if (el.text().includes("Tác giả:")) {
                author = el.text().replace("Tác giả:", "").trim();
            }
        });

        // Lấy mô tả truyện
        let description = doc.select(".mt-10 p.text-gray-700").first().html();

        // Kiểm tra trạng thái truyện (Ongoing/Completed)
        let ongoing = doc.html().indexOf("Đang cập nhật") >= 0;

        // Lấy danh sách thể loại
        let genres = [];
        // Dựa vào HTML, thể loại nằm trong span cạnh icon chart-bar-stacked
        doc.select("span").forEach(function(el) {
            let text = el.text();
            if (text.includes("Thể loại:")) {
                let gTitle = text.replace("Thể loại:", "").trim();
                genres.push({
                    title: gTitle,
                    input: BASE_URL + "/the-loai/" + gTitle.toLowerCase().replace(/\s+/g, '-'), // Tạo slug tạm thời nếu không có href trực tiếp
                    script: "gen.js"
                });
            }
        });

        return Response.success({
            name: name,
            cover: cover,
            host: BASE_URL,
            author: author,
            description: description,
            ongoing: ongoing,
            genres: genres
        });
    }
    return null;
}