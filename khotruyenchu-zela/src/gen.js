load ('config.js');

function execute(url, page) {
    if (!page) page = '1';
    
    // Xử lý URL để hỗ trợ phân trang nếu cần (ví dụ: ?page=1)
    let response = fetch(url + "?page=" + page);

    if (response.ok) {
        let doc = response.html();
        let novelList = [];
        
        // Chọn các khối div chứa thông tin truyện
        // Dựa trên class: "flex gap-4 py-4 group hover:bg-gray-50..."
        let items = doc.select("div.grid > div.flex.gap-4");
        
        items.forEach(item => {
            let name = item.select("h3").text().trim();
            let link = item.select("a").first().attr("href");
            
            // Lấy ảnh bìa từ thuộc tính src hoặc srcset
            let coverEl = item.select("img").first();
            let cover = "";
            if (coverEl) {
                // Ưu tiên lấy link ảnh gốc từ tham số url trong src của Next.js
                let src = coverEl.attr("src");
                if (src && src.includes("url=")) {
                    cover = decodeURIComponent(src.split("url=")[1].split("&")[0]);
                } else {
                    cover = src;
                }
            }

            // Lấy tên tác giả (nằm cạnh icon lucide-user)
            let author = item.select(".lucide-user").parents().first().text().trim();
            
            // Lấy thông tin số chương và trạng thái
            let detail = item.select(".lucide-book-open").parents().first().text().trim();

            if (name && link) {
                novelList.push({
                    name: name,
                    link: link.startsWith("http") ? link : BASE_URL + link,
                    cover: cover,
                    description: author + " | " + detail,
                    host: BASE_URL
                });
            }
        });

        // Kiểm tra phân trang (nếu có các nút chuyển trang ở cuối)
        // Đây là logic giả định dựa trên cấu trúc thông thường, bạn có thể điều chỉnh sau
        let next = parseInt(page) + 1;
        
        return Response.success(novelList, next.toString());
    }
    return null;
}