var AWS     = require('aws-sdk');
var fs      = require('fs');
var _       = require('underscore');
var log     = require('./logger');

var FileStore = function() {};

var s3 = new AWS.S3({
    signatureVersion: 'v4',
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    params: { Bucket: process.env.S3_BUCKET_NAME }
});

function createDirectoryIfNotExists(directory) {
  try {
    fs.mkdirSync(directory);
    log.debug('Creating a directory: ' + directory);
  } catch(e) {
    if ( e.code != 'EEXIST' ) {
        throw e;
    } else {
        log.debug('Skipping creation of a directory as it already exists: ' + directory);
    }
  }
}

/**
 * Get an object from S3 and save it as a file
 * 
 * @param {string} sourceObjectName Name of the object in S3 bucket - the saved file will have the same name
 * @param {string} destinationDirectory Location of the new file
 */
function saveBucketObject(sourceObjectName, destinationDirectory, done) {
    var params = {
        Key: sourceObjectName
    };

    s3.getObject(params, function(err, data) {
        if (err) {
            log.error(err, err.stack);
            done();
        } else { 
            var file = fs.createWriteStream(destinationDirectory + sourceObjectName);
            log.debug('Downloading file: ' + sourceObjectName);
            var stream = s3.getObject(params).createReadStream().pipe(file);
            stream.on('finish', function () { 
                log.debug('The file has been saved to: ' + destinationDirectory + sourceObjectName);
                done();
            });
        }
    });
}

/**
 * Downloads all files from the root directory of an S3 bucket
 * WARNING: The bucket can't contain subdirectories
 * 
 * @param {string} destinationDirectory Location for the downloaded files (may not exist)
 */
FileStore.downloadFiles = function (destinationDirectory, done) {
    s3.listObjects(null, function(err, data) {
        if (err) {
            log.error(err, err.stack);
            done();
        } else {
            createDirectoryIfNotExists(destinationDirectory);

            // needs to be called (data.Contents.length) times to call done()
            var finishIfAllSaved = _.after(data.Contents.length, done);

            data.Contents.forEach(function(file) {
                saveBucketObject(file.Key, destinationDirectory, function() {
                    finishIfAllSaved(); // will trigger done() after last object was saved
                });
            });
        }
    });
}

FileStore.uploadObjectAsJsonFile = function (keyName, objectToUpload) {
    var params = {
        Key: keyName + '.json',
        Body: JSON.stringify(objectToUpload)
    };

    s3.upload(params, function(err, data) {
        if(err) { log.error(err); }
        else {
            log.debug("Successfully uploaded data to: " + keyName);
            log.trace(data);
        }
    });
};

module.exports = FileStore;
