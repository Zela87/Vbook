function execute(url) {
    // url chính là link: https://wnacg.com/photos-index-aid-xxxxx.html
    // Chúng ta tạo ra một mục duy nhất để người dùng bấm vào đọc
    return Response.success([{
        name: "Đọc ngay (Full Chapter)",
        url: url
    }]);
}