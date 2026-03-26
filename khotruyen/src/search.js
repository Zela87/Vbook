function execute(key, page) {
    if (!page) page = '1';
    
    // SSTruyen dùng query string ?s=keyword&page=n
    let url = "https://khotruyenchu.sbs/truyen";
    
    let response = Http.get(url).params({
        "s": key,
        "page": page
    }).html();

    if (response) {
        let list = [];
        // Sử dụng selector .item giống như bạn đã cung cấp ở các turn trước
        let items = response.select(".home-story-card");

        items.forEach(item => {
            let a = item.select(".hs-title a").first();
            if (a) {
                let img = item.select(".hs-thumb img").first();
                let cover = img ? (img.attr("data-src") || img.attr("src")) : "";
                
                // Chuẩn hóa link ảnh nếu thiếu https:
                if (cover && cover.startsWith("//")) cover = "https:" + cover;

                list.push({
                    name: a.text().trim(),
                    link: a.attr("href"),
                    cover: cover,
                    description: "", // Trang mới không để mô tả ở danh sách ngoài
                    host: "https://sstruyen.com.vn"
                });
            }
        });

        // Xử lý phân trang bằng cách tìm số trang trong link "Next"
        let nextHref = response.select("a[aria-label=Next]").attr("href");
        let next = null;
        if (nextHref) {
            let match = nextHref.match(/[?&]page=(\d+)/);
            if (match) next = match[1];
        }

        return Response.success(list, next);
    }
    return null;
}