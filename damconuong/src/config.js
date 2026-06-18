let BASE_URL = 'https://damconuong.mom';

try {
    if (CONFIG_URL) BASE_URL = CONFIG_URL;
} catch (e) { }


function bypass(url, doc) {
    var htmlContent = doc.html();
    var cookieMatch = htmlContent.match(/document.cookie="(.*?)"/);

    if (cookieMatch) {
        var cookie = cookieMatch[1].split(';')[0];
        Console.log("Bypass Cookie: " + cookie);
        var response = fetch(url, {
            headers: {
                "Cookie": cookie,
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Referer": url
            }
        });
        return response.html();
    }
    return doc;
}