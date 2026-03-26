load("config.js");

function execute(key, page) {
    if (!page) page = '1';
    // Giả sử key = "da-vo-cuong"
var url = BASE_URL + '/truyen/' + key + '/';
    var doc = bypass(url, Http.get(url).html());

    if (!doc) return Response.error("Không tải được dữ liệu");

    var list = [];

    doc.select('.home-story-card').forEach(function(e) {
        var img = e.select('.hs-thumb img').first();
        var cover = img ? (img.attr('data-src') || img.attr('src')) : '';
        if (cover && cover.startsWith('//')) cover = 'https:' + cover;

        var a = e.select('.hs-title a').first();

        if (a) {
            list.push({
                name: a.text().trim(),
                link: a.attr('href'),
                description: '',
                cover: cover,
                host: BASE_URL,
            }); // Đóng ngoặc của list.push
        } // Đóng ngoặc của if (a)
    }); // Đóng ngoặc của forEach

    var nextHref = doc.select('a[aria-label=Next]').attr('href');
    var nextPage = null;
    if (nextHref) {
        var match = nextHref.match(/[?&]page=(\d+)/);
        if (match) nextPage = match[1];
    }

    return Response.success(list, nextPage);
}