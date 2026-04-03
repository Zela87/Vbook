load('config.js');
load('utils.js');

function execute(url, page) {
    if (!page) page = '1';
    
    let fetchUrl = url;
    // Nếu website hỗ trợ query param hoặc bạn muốn giữ logic URL cũ:
    if (page !== '1') {
        if (fetchUrl.endsWith('/')) fetchUrl = fetchUrl.slice(0, -1);
        fetchUrl += "?page=" + page; 
    }

    let response = fetch(fetchUrl);
    if (response.ok) {
        let doc = response.html();
        let novelList = parseNovelList(doc);
        
        let next = "";
        let nextEl = doc.select("div.paging a:has(span:contains(›)), div.phan-trang a:contains(❭)").first();
        if (nextEl) {
            next = String(parseInt(page) + 1);
        }

        return Response.success(novelList, next);
    }
    return null;
}