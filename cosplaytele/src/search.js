load('config.js');

function execute(key, page) {
    if (!page) page = '1';
    const doc = Http.get(BASE_URL + "/page/" + page + '/').params({ "s": key }).html();

    var next = doc.select("ul.page-numbers.nav-pagination.links.text-center")
        .select("li:has(span.page-number.current) + li a")
        .text()
        .replace("Page", "");

    const el = doc.select("#post-list .col.post-item");

    const data = [];
    for (var i = 0; i < el.size(); i++) {
        var e = el.get(i);
        var imgCv = e.select(".image-cover > a > img").attr("src");
        data.push({
            name: e.select("h5 a").first().text(),
            link: e.select("h5 a").first().attr("href"),
            cover: imgCv,
            description: e.select(".from_the_blog_excerpt").text(),
            host: BASE_URL
        })
    }

    return Response.success(data, next)
}