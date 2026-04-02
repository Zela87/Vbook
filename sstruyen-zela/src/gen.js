load('config.js');
load('utils.js');

function execute(url, page) {
    // Nếu là lần đầu tiên gọi (page null), bắt đầu từ trang 1
    if (!page) page = '1';

    let fetchUrl = url;
    // Kiểm tra nếu url đã chứa tham số page (dùng cho các trang từ 2 trở đi)
    if (page !== '1' && !url.includes('page=')) {
        if (fetchUrl.endsWith('/')) fetchUrl = fetchUrl.slice(0, -1);
        fetchUrl += "?page=" + page;
    }

    let response = fetch(fetchUrl);
    if (response.ok) {
        let doc = response.html();
        let novelList = parseNovelList(doc);
        
        let next = "";
        // 1. Tìm element chứa nút "Trang sau"
        let nextEl = doc.select("div.paging a:has(span:contains(›)), div.phan-trang a:contains(❭)").first();
        
        if (nextEl) {
            let onclickAttr = nextEl.attr("onclick"); // Ví dụ: page(67390,3);
            
            if (onclickAttr && onclickAttr.includes("page(")) {
                // 2. Trích xuất ID và số trang tiếp theo từ onclick="page(ID, NEXT_PAGE)"
                let match = onclickAttr.match(/page\((\d+),\s*(\d+)\)/);
                if (match) {
                    let key = match[1];      // 67390
                    let nextPage = match[2]; // 3
                    
                    // 3. Tạo URL mới dựa trên key và page trích xuất được
                    next = "https://sstruyen.com.vn/get/listchap/" + key + "?page=" + nextPage;
                }
            } else {
                // Fallback: Nếu không có onclick (xử lý thể loại thông thường) thì tăng page như cũ
                next = String(parseInt(page) + 1);
            }
        }

        return Response.success(novelList, next);
    }
    return null;
}