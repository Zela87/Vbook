function execute(url) {
    var response = fetch(url, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
    });

    if (response.ok) {
        var doc = response.html();
        var name = doc.select("h2").text();
        var cover = doc.select(".uwthumb img").attr("src");
        if (cover && cover.indexOf("//") === 0) cover = "https:" + cover;

        return Response.success({
            name: name,
            cover: cover,
            author: doc.select(".uwuinfo p").first().text() || "Unknown",
            description: doc.select(".uwconn").text(),
            detail: "Nguồn: Wnacg",
            host: "https://wnacg.com"
        });
    }
    return null;
}