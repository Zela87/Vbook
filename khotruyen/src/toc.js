function execute(url) {
    let list = [];
    let currentUrl = url;

    // Sử dụng vòng lặp while từ Code 2 để duyệt qua tất cả các trang
    while (currentUrl) {
        let response = Http.get(currentUrl).html();
        
        if (response) {
            // 1. Lấy danh sách chương ở trang hiện tại (Giữ logic Code 1)
            let chapters = response.select("article.entry-card");
            chapters.forEach(item => {
                let a = item.select("h2.entry-title a").first();
                if (a) {
                    list.push({
                        name: a.text().trim(),
                        url: a.attr("href"),
                        host: "https://khotruyenchu.sbs" // Cập nhật host tương ứng với trang mới
                    });
                }
            });

            // 2. Lấy link trang tiếp theo (Logic từ Code 2)
            let nextEl = response.select("a.next.page-numbers").first();
            if (nextEl) {
                let nextUrl = nextEl.attr("href");
                // Kiểm tra để tránh vòng lặp vô hạn nếu link không đổi
                currentUrl = (nextUrl && nextUrl !== currentUrl) ? nextUrl : null;
            } else {
                currentUrl = null;
            }
        } else {
            break;
        }
    }

    // Trả về kết quả sau khi đã duyệt hết các trang
    return list.length > 0 ? Response.success(list) : null;
}