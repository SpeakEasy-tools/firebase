const { CACHE_BUCKET } = require("./constants");

const { Storage } = require("@google-cloud/storage");
const storageClient = new Storage();

async function checkCache(prefix) {
    const options = {
        directory: prefix,
    };
    const [files] = await storageClient.bucket(CACHE_BUCKET).getFiles(options);
    if (files.length) {
        return files[0].name;
    } else {
        return false;
    }
}

async function uploadToCache(filename, contents) {
    return await storageClient
        .bucket(CACHE_BUCKET)
        .file(filename)
        .save(contents)
        .then(() => filename);
}

exports.checkCache = checkCache;
exports.uploadToCache = uploadToCache;
