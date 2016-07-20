var cheerio = require('cheerio')
var fs = require('fs')
var request = require('request')
var http = require('http')
var URL = require('url');
var download = require('./download')

var util = {}

util.downloadVideo = function(title, url){
    console.log("Entering downloadVideo...")
    download(url, title, './downloads')
    .then(function(id){
        console.log('video %s has been downloaded.', title);
    })
    .catch(function(err){
        console.log(err.stack);
    });
}

util.getVideoList = function(body){
    console.log("Entering getVideoList...")
    $ = cheerio.load(body);
    var selector = 'a.J-media-item';
    var videoes = [];
    var xmlStr = '<?xml version="1.0" encoding="utf-8" ?><videoes>';
    var dict = {};
    var total = $(selector).length;
    var textStr = '';
    $(selector).each(function(i, e) {           
         var href = this.attribs.href;
         var vid = href.substring(href.lastIndexOf('/') + 1, href.length); // this.href.replace('http://www.imooc.com/video/', ''); 
         var name = this.children[0].data;
         var pattern = /\(\d{2}:\d{2}\)/;
         if (!pattern.test(name)) {
             total--;
             if (i == $(selector).length - 1 && !total) {
                 console.log('There is no video to download.');
             }
             return;
         };
         name = name.replace(/\(\d{2}:\d{2}\)/, '').replace(/\s/g, '');
         name += '.mp4';
         dict[vid] = name;

        var options = {
            url: "http://www.imooc.com/course/ajaxmediainfo/?mid=" + vid + "&mode=flash",
            method: 'GET'
        }
        // Start the request
        request(options, function (error, response, body) {         
            body = JSON.parse(body)
            if (!error && response.statusCode == 200) {
                 var url = body.data.result.mpath[0];
                 videoes.push({
                     url: url,
                     name: name
                 });
                 xmlStr += '<video><url>' + url + '</url><name>' + name + '</name></video>';
                 textStr += 'filename=' + name + '&fileurl=' + url + '\n';
                 if (videoes.length == total) {
                     console.log('There are ' + total + 'videos totally.');
                     xmlStr += '</videoes>';
                     util.downloadVideo(name, url);
                 };
            }
            else{
              console.log("ERROR: failed to getCoursePageContent:" + no);
            }
        })
    });
}


util.getCoursePageContent = function(no){
    console.log("Entering getCoursePageContent...")

    var options = {
        url: "http://www.imooc.com/learn/" + no,
        method: 'GET'
    }

    // Start the request
    request(options, function (error, response, body) {

        if (!error && response.statusCode == 200) {
            util.getVideoList(body)
        }
        else{
          console.log("ERROR: failed to getCoursePageContent:" + no);
        }
    })
}

    
module.exports = util