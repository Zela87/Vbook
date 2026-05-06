load('config.js');
function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    let response = fetch(url, {
        headers: {
            "referer": BASE_URL
        }
    });

    if (response.ok) {
        let doc = response.html();
        let data = [];
        doc.select(".page-chapter img").forEach(e => {
            let imgUrl = e.attr("data-src") || e.attr("src");
            if (imgUrl) {
                data.push(imgUrl);
            }
        });
        return Response.success(data);
    }

    return null;

}