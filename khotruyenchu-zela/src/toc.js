load('config.js');

function execute(url) {
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        let chapters = [];
        
        // Selector chính xác cho danh sách chương dựa trên dữ liệu HTML bạn gửi
        // Các chương nằm trong div có class grid-cols-2
        let items = doc.select("div.grid.grid-cols-2 a[href*='/chuong-']");
        
        let seenUrls = new Set();

        for (let i = 0; i < items.size(); i++) {
            let item = items.get(i);
            let name = item.text().trim();
            let href = item.attr("href");

            if (href) {
                // Đảm bảo URL đầy đủ và sạch
                let fullUrl = href.startsWith("http") ? href : BASE_URL + href;
                let cleanUrl = fullUrl.split('?')[0].split('#')[0];
                if (cleanUrl.endsWith('/')) cleanUrl = cleanUrl.slice(0, -1);
                
                if (!seenUrls.has(cleanUrl)) {
                    seenUrls.add(cleanUrl);
                    
                    // Làm đẹp tên chương (Loại bỏ các ký tự đặc biệt như dấu chấm đầu dòng)
                    let cleanName = name.replace(/^[\s•]+/, "").trim();
                    
                    chapters.push({
                        name: cleanName,
                        url: cleanUrl + "/",
                        host: BASE_URL
                    });
                }
            }
        }

        // Nếu danh sách chương bị ngược (Chương 1 ở cuối), bạn có thể thêm:
        // chapters.reverse();

        return Response.success(chapters);
    }
    return null;
}