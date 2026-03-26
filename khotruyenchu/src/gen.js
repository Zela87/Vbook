load('config.js');

function execute(url, page) {
    if (!page) page = '1';

    // Nối tên miền nếu là link tương đối
    var fullUrl = url.indexOf('http') === 0 ? url : BASE_URL + url;

    // Xử lý phân trang
    fullUrl = fullUrl.replace(/[?&]page=\d+/, '');
    fullUrl += (fullUrl.indexOf('?') >= 0 ? '&' : '?') + 'page=' + page;

    var doc = bypass(fullUrl, Http.get(fullUrl).html());

    if (!doc) return Response.error("Không tải được dữ liệu");

    var list = [];

    doc.select('.home-story-card').forEach(function(e) {
        var img = e.select('.hs-thumb img').first();
        var cover = img ? (img.attr('data-src') || img.attr('src')) : '';
        if (cover.startsWith('//')) cover = 'https:' + cover;

        var a = e.select('.hs-title a').first();

        if (a) {
            list.push({
                name: a.text().trim(),
                link: a.attr('href'),
                description: '',
                cover: cover,
                host: BASE_URL,
            });
        }
    });

    var nextHref = doc.select('a[aria-label=Next]').attr('href');
    var nextPage = null;
    if (nextHref) {
        var match = nextHref.match(/[?&]page=(\d+)/);
        if (match) nextPage = match[1];
    }

    return Response.success(list, nextPage);
}