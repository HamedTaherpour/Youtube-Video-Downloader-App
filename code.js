const express = require("express");
const ytdl = require("ytdl-core");
const app = express();

app.use(express.json());
app.use(express.static("public"));

app.get("/", function (request, response) {
    response.sendFile(__dirname + "public/index.html");
});

app.get("/videoInfo", async function (request, response) {
    const videoURL = request.query.videoURL;
    const info = await ytdl.getInfo(videoURL);
    let video = {
        title: '',
        description: '',
        thumbnails: '',
        urls: []
    }
    let urls = info.formats.filter((item) => item.qualityLabel !== null && item.container === 'mp4')
    urls = urls.sort((a,b) => b.bitrate - a.bitrate)
    video.thumbnails = info?.videoDetails?.thumbnails[info?.videoDetails?.thumbnails.length - 1].url
    video.title = info?.videoDetails?.title
    video.description = info?.videoDetails?.description
    video.urls = urls
    response.status(200).json(video);
});

app.get("/download", function (request, response) {
    const videoURL = request.query.videoURL;
    const itag = request.query.itag;
    const format = request.query.fotmat;
    response.header("Content-Disposition", 'attachment;\ filename="video.' + format + '"');
    ytdl(videoURL, {
        filter: format => format.itag == itag
    }).pipe(response);
});

app.listen(5000);
