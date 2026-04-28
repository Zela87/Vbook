load("config.js");

function execute(url) {
  url = url.replace(
    /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/gim,
    BASE_URL,
  );

  let response = fetch(url, {
    headers: {
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      referer: BASE_URL,
    },
  });

  if (response.ok) {
    let doc = response.html();

    // 1. Lấy danh sách thể loại
    let genres = [];
    doc.select(".kind .col-xs-8 a").forEach((e) => {
      genres.push({
        title: e.text(),
        input: e.attr("href"),
        script: "gen.js",
      });
    });

    // 2. Lấy tên tác giả
    let author = doc.select(".author .col-xs-8").text().trim();
    if (!author || author === "") author = "Đang cập nhật";

    // 3. Lấy trạng thái
    let status = doc.select(".status .col-xs-8").text();
    let ongoing = status.includes("Đang tiến hành") || status.toLowerCase().includes("ongoing");

    // 4. Lấy mô tả truyện (Dựa trên HTML của bạn, không có thẻ summary, nên lấy ảnh preview làm mô tả hoặc để trống)
    let description = doc.select(".detail-content .row img").first().attr("src");
    if (!description) description = "Đang cập nhật nội dung...";

    // 5. Xử lý Cover (Sửa selector cho .col-image)
    let cover = doc.select(".col-image img").first().attr("src") || doc.select(".col-image img").first().attr("data-src");

    return Response.success({
      name: doc.select("h1.title-detail").text().trim(),
      cover: cover,
      author: author,
      description: description,
      host: BASE_URL,
      genres: genres,
      ongoing: ongoing,
      nsfw: true,
    });
  }

  return null;
}