load('config.js');

function execute(key, page) {
    if (!page) page = '1';
    var url = BASE_URL + '/tim-kiem?sort=-updated_at&filter%5Bname%5D=' + encodeURIComponent(key) + '&filter%5Bstatus%5D=2,1&page=' + page;
    var doc = bypass(url, Http.get(url).html());

    if (!doc) return Response.error("Không tải được dữ liệu");

    var list = [];

    doc.select('.grid .w-full').forEach(function(e) {
        var cover = e.select('.cover-frame img').attr('src');
        if (cover.startsWith('//')) cover = 'https:' + cover;

        var name = e.select('h3 a').text().trim();
        var link = e.select('h3 a').attr('href');
        var chap = e.select('.flex-shrink-0 a').text().trim();
        var time = e.select('span.whitespace-nowrap').text().trim();

        if (name) {
            list.push({
                name: name,
                link: link,
                description: chap + ' - ' + time,
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