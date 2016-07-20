var request = require('request');
var fs = require('fs'); 
var path = require('path');
var Promise = require('bluebird');

var download = function(url, title, dir, callback){

    var p = new Promise(function(resolve, reject){
        
        var dest = path.join(dir, title);
        var writeStream = fs.createWriteStream(dest)

        writeStream.on('finish', function(){
            resolve(title);
        });

        writeStream.on('error', function(err){
            fs.unlink(dest, reject.bind(null, err));
        });

        var readStream = request.get(url);

        readStream.on('error', function(err){
            fs.unlink(dest, reject.bind(null, err));
        });

        readStream.pipe(writeStream);
    });

    if(!callback)
        return p;

    p.then(function(title){
        callback(null, title);
    }).catch(function(err){
        callback(err);
    });
};

module.exports = download;