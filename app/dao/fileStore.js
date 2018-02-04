var AWS = require('aws-sdk');
var fs = require('fs');
var _ = require('underscore');
var log = require('../logger');

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
    } catch (e) {
        if (e.code != 'EEXIST') {
            throw e;
        } else {
            log.debug('Skipping creation of a directory as it already exists: ' + directory);
        }
    }
}

/**
 * Downloads all files and returns them as JSON list
 * WARNING: The bucket can't contain subdirectories
 * 
 * @param {function} done Callback 
 */
FileStore.getAllProjects = function(done) {
    s3.listObjects(null, function(err, data) {
        if (err) {
            log.error(err, err.stack);
            done(err, data);
        } else {
            var errors = [];
            var projects = [];
            // needs to be called (data.Contents.length) times to call done()
            var downloadFinished = _.after(data.Contents.length, function() {
                done(errors, projects);
            });

            data.Contents.forEach(function(file) {
                if (file.Key.endsWith('.json')) {
                    getS3FileContents(file, function(err, data) {
                        if (err) {
                            log.error(err, err.stack);
                            errors.push(err);
                        } else {
                            var jsonData = JSON.parse(data);
                            if(typeof jsonData.health === 'string') {
                                jsonData.health = {
                                    overall: {type: "overall", status: jsonData.health.toLowerCase() }
                                }
                            }

                            projects.push(jsonData);
                        }

                        downloadFinished();
                    });
                } else {
                    downloadFinished();
                }
            });
        }
    });
};

/**
 * Downloads a specific project
 *
 * @param {string} projectId
 * @param {function} done Callback
 */
FileStore.getProjectById = function(projectId, done) {
    getS3FileContents({Key: projectId + '.json'}, function(err, data) {
        if (err) {
            done(err);
        } else {
            var jsonData = JSON.parse(data);
            if(typeof jsonData.health === 'string') {
                jsonData.health = {
                    overall: {type: "overall", status: jsonData.health.toLowerCase() }
                }
            }

            done(null, jsonData);
        }
    });
};

function getS3FileContents(file, callback) {
    s3.getObject({ Key: file.Key }, function(err, data) {
        if (err) {
            log.error(err, err.stack);
            callback(err);
        } else {
            callback(null, data.Body.toString());
        }
    });
}

FileStore.uploadObjectAsJsonFile = function(keyName, objectToUpload, callback) {
    var params = {
        Key: keyName + '.json',
        Body: JSON.stringify(objectToUpload)
    };

    s3.upload(params, function(err, data) {
        if (err) { log.error(err); } else {
            log.debug("Successfully uploaded data to: " + keyName);
            log.trace(data);
        }
        callback(err, data);
    });
};

module.exports = FileStore;
