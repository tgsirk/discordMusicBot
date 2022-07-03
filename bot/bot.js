const fs = require('fs');
const ytdl = require('ytdl-core');

var link = "https://www.youtube.com/watch?v=-TdBCs7E0yE";


function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

ytdl.getInfo(link).then(info => {
    const titleName = info.videoDetails.title;

})
const info = ytdl.getBasicInfo(link).then(info => {return info.videoDetails.title});
console.log(Promise.resolve(info));
await sleep(10)
console.log(info)
