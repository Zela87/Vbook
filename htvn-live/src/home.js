load("config.js");

function execute() {
    return Response.success([
        { title: "big-boobs",   input: BASE_URL + "/tim-truyen/big-boobs",     script: "gen.js" },
        { title: "full-color",  input: BASE_URL + "/tim-truyen/full-color",    script: "gen.js" },
        { title: "Ngực Lớn",    input: BASE_URL + "/tim-truyen/nguc-lon",   script: "gen.js" },
        { title: "Oneshot",     input: BASE_URL + "/tim-truyen/oneshot",    script: "gen.js" }
    ]);
}