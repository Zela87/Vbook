load("config.js");

function execute(url) {
    let chapters = [];
    let seenUrls = {};
    let nextUrl = url;
    let currentPage = 1;

    while (nextUrl) {
        let response = fetch(nextUrl);
        if (!response.ok) break;

        let doc;
        // Kiểm tra nếu là request AJAX (trang 2 trở đi)
        if (nextUrl.includes("/get/listchap/")) {
            let json = response.json();
            // Dựa trên response bạn gửi, nội dung nằm trong key "data"
            if (json && json.data) {
                doc = Html.parse(json.data);
            } else {
                break;
            }
        } else {
            // Trang đầu tiên (URL gốc)
            doc = response.html();
        }

        // 1. Lấy danh sách chương
        let items = doc.select("li a[href*='/chuong-']");
        for (let i = 0; i < items.size(); i++) {
            let item = items.get(i);
            let name = item.text().trim();
            let href = item.attr("href");

            if (href && !href.includes('#')) {
                let cleanUrl = href.split('?')[0].split('#')[0];
                if (cleanUrl.endsWith('/')) cleanUrl = cleanUrl.slice(0, -1);

                if (!seenUrls[cleanUrl]) {
                    seenUrls[cleanUrl] = true;
                    chapters.push({
                        name: name.replace(/\s+/g, ' ').trim(),
                        url: cleanUrl + "/",
                        host: BASE_URL
                    });
                }
            }
        }

        // 2. Phân tích phân trang để tìm trang kế tiếp
        let currentNext = "";
        // Tìm tất cả các nút có hàm page(id, page)
        let pagingLinks = doc.select(".paging a[onclick*='page(']");
        
        for (let j = 0; j < pagingLinks.size(); j++) {
            let link = pagingLinks.get(j);
            let onclick = link.attr("onclick");
            let match = onclick.match(/page\((\d+),\s*(\d+)\)/);

            if (match) {
                let storyId = match[1];
                let pageNum = parseInt(match[2]);

                // Chỉ đi tiếp nếu số trang trong onclick lớn hơn trang hiện tại
                if (pageNum > currentPage) {
                    currentPage = pageNum;
                    currentNext = BASE_URL + "/get/listchap/" + storyId + "?page=" + pageNum;
                    break; // Tìm thấy trang kế tiếp rồi thì dừng vòng lặp for này
                }
            }
        }

        nextUrl = currentNext; // Nếu không tìm thấy trang lớn hơn, nextUrl sẽ rỗng và dừng while
    }

    return Response.success(chapters);
}