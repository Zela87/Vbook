load('config.js');
function execute(url) {
    // 1. Đảm bảo URL luôn có dấu gạch chéo ở cuối trước khi nối chuỗi
    if (!url.endsWith("/")) {
        url += "/";
    }

    // 2. Cấu trúc endpoint mới của theme Madara
    let ajaxUrl = url + "ajax/chapters/";
    Console.log("1. Bắt đầu gọi endpoint Ajax mới: " + ajaxUrl);
    
    // 3. Gửi POST request (thường không cần body truyền ID nữa)
    let response = fetch(ajaxUrl, {
        method: "POST",
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            "Referer": url,
            "X-Requested-With": "XMLHttpRequest"
        }
    });

    if (response.ok) {
        Console.log("2. Gọi Ajax THÀNH CÔNG.");
        let doc = response.html();
        let el = doc.select(".wp-manga-chapter a");
        
        Console.log("3. Số chương parse được: " + el.size());

        let data = [];
        for (let i = 0; i < el.size(); i++) {
            let e = el.get(i);
            let name = e.text().trim();
            let link = e.attr("href");

            if (link && name) {
                data.push({
                    name: name,
                    url: link,
                    host: BASE_URL
                });
            }
        }
        
        if (data.length > 0) {
            Console.log("4. Trả về mảng dữ liệu hoàn tất.");
            return Response.success(data.reverse());
        } else {
            Console.log("LỖI: Trả về 200 OK nhưng mảng dữ liệu trống.");
        }
    } else {
        Console.log("LỖI: Gọi Ajax thất bại. Mã HTTP: " + response.status);
    }

    return null;
}