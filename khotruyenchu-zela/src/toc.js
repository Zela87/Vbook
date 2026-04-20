var BASE_URL = "https://khotruyenchu.me";

function execute(url) {
    // Đảm bảo URL không kết thúc bằng dấu / để dễ dàng nối thêm tham số trang
    if (url.endsWith('/')) url = url.slice(0, -1);

    let chapters = [];
    let seenUrls = new Set();
    let currentPage = 1;
    let nextUrl = url;

    while (nextUrl) {
        let response = fetch(nextUrl);
        if (!response.ok) break;

        let doc = response.html();
        
        // 1. Lấy danh sách chương ở trang hiện tại
        let items = doc.select("div.grid.grid-cols-2 a[href*='/chuong-']");
        if (items.isEmpty()) break; // Nếu không thấy chương nào nữa thì dừng

        for (let i = 0; i < items.size(); i++) {
            let item = items.get(i);
            let name = item.text().trim();
            let href = item.attr("href");

            if (href) {
                let fullUrl = href.startsWith("http") ? href : BASE_URL + href;
                let cleanUrl = fullUrl.split('?')[0].split('#')[0];
                if (cleanUrl.endsWith('/')) cleanUrl = cleanUrl.slice(0, -1);
                
                if (!seenUrls.has(cleanUrl)) {
                    seenUrls.add(cleanUrl);
                    let cleanName = name.replace(/^[\s•]+/, "").trim();
                    
                    chapters.push({
                        name: cleanName,
                        url: cleanUrl + "/",
                        host: BASE_URL
                    });
                }
            }
        }

        // 2. Tìm URL của trang kế tiếp
        // Dựa vào cấu trúc bạn gửi, nút "Trang sau" là nút có icon lucide-chevron-right
        // Chúng ta sẽ tìm nút số trang tiếp theo (currentPage + 1)
        currentPage++;
        let foundNextPage = false;
        let paginationButtons = doc.select("div.flex.flex-wrap.gap-3 button");
        
        for (let j = 0; j < paginationButtons.size(); j++) {
            let btn = paginationButtons.get(j);
            if (btn.text().trim() === currentPage.toString()) {
                // Giả sử hệ thống trang web sử dụng query param ?page= hoặc tương tự
                // Nếu trang web đổi URL theo dạng /truyen/ten-truyen?page=2
                nextUrl = url + "?page=" + currentPage;
                foundNextPage = true;
                break;
            }
        }

        if (!foundNextPage) {
            nextUrl = null; // Không tìm thấy trang tiếp theo thì dừng vòng lặp
        }
        
        // Giới hạn an toàn để tránh vòng lặp vô tận nếu logic sai (tùy chọn)
        if (currentPage > 500) break; 
    }

    return Response.success(chapters);
}