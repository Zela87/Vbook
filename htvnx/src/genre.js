load('config.js');

function execute() {
    // Gọi trực tiếp đến trang danh sách thể loại
    let response = fetch(BASE_URL + "/tim-truyen/");
    
    if (response.ok) {
        let doc = response.html();
        let genres = [];
        
        // Các thể loại được bọc trong .clearfix > .col-sm-3 > .nav > li > a
        doc.select(".clearfix .col-sm-3 .nav li a").forEach(function(el) {
            // Lấy title từ thuộc tính data-title hoặc text content
            let title = el.attr("data-title") || el.text().trim();
            let link = el.attr("href");

            if (title && link) {
                genres.push({
                    title: title,
                    input: link,
                    script: "gen.js"
                });
            }
        });

        return Response.success(genres);
    }
    
    return null;
}