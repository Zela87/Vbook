load ('config.js');

function execute(url, page) {
    if (!page) page = '1';
    
    let fetchUrl = url.includes('?') ? url + "&page=" + page : url + "?page=" + page;
    let response = fetch(fetchUrl);

    if (response.ok) {
        let doc = response.html();
        let List = [];
        
        let items = doc.select("div.flex.gap-4.group");
        
        items.forEach(item => {
            let titleEl = item.select("h3").first();
            let linkEl = item.select("a").first();
            
            // Xử lý Cover
            let coverEl = item.select("img").first();
            let cover = "";
            if (coverEl) {
                let src = coverEl.attr("src");
                if (src && src.includes("url=")) {
                    cover = decodeURIComponent(src.split("url=")[1].split("&")[0]);
                } else {
                    cover = src;
                }
            }

            // --- SỬA LỖI TẠI ĐÂY ---
            // Thay vì dùng .parents().first(), ta nhắm vào div chứa icon
            // Lấy div là cha của icon lucide-user
            let author = "";
            let authorEl = item.select("div.flex.items-center.gap-1.5").first(); 
            if (authorEl) {
                author = authorEl.text().trim();
            }

            // Lấy thông tin chi tiết (Số chương + Trạng thái)
            let detail = "";
            let detailEl = item.select("div.flex.items-center.gap-1.5.whitespace-nowrap").first();
            if (detailEl) {
                detail = detailEl.text().trim();
            }
            // -----------------------

            if (titleEl && linkEl) {
                let link = linkEl.attr("href");
                List.push({
                    name: titleEl.text().trim(),
                    link: link.startsWith("http") ? link : BASE_URL + link,
                    cover: cover,
                    description: author + (detail ? " | " + detail : ""),
                    host: BASE_URL
                });
            }
        });

        // Phân trang
        let nextHref = doc.select("a:contains(›)").attr("href");
        let nextPage = null;
        if (nextHref) {
            let match = nextHref.match(/page=(\d+)/);
            if (match) nextPage = match[1];
        }

        return Response.success(List, nextPage);
    }
    return null;
}