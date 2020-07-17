const uuid = require('uuid');
const functions = require('firebase-functions');

const {DEFAULT_ENCODING, DEFAULT_GENDER, CACHE_BUCKET} = require('./constants');
const {TextToSpeechClient} = require('@google-cloud/text-to-speech');
const {Storage} = require('@google-cloud/storage');
const textToSpeechClient = new TextToSpeechClient();
const storageClient = new Storage();

async function checkCache(prefix) {
    const options = {
        directory: prefix,
    };
    const [files] = await storageClient.bucket(CACHE_BUCKET)
        .getFiles(options);
    if (files.length) {
        return files[0].name;
    } else {
        return false;
    }
}

const parsePath = (text, language) => `${language}/${text.split(' ').join('/')}`.toLowerCase();
const generateFilename = () => `${uuid.v4()}.${DEFAULT_ENCODING.toLowerCase()}`;

const uploadToCache = async (path, contents) => {
    const filename = `${path}/${generateFilename()}`;
    return await storageClient.bucket(CACHE_BUCKET)
        .file(filename)
        .save(contents)
        .then(() => filename)
};

const callSynthesize = async (targetLocal, data) => {
    const request = {
        input: {text: data},
        voice: {languageCode: targetLocal, ssmlGender: DEFAULT_GENDER},
        audioConfig: {audioEncoding: DEFAULT_ENCODING}
    };
    return await textToSpeechClient.synthesizeSpeech(request);
};

const callList = () => {
    const request = {};

    return textToSpeechClient.listVoices(request);
};

exports.synthesize = functions.https.onCall(
    async (data, context) => {

        try {
            const text = data.text;
            const language = data.languageCode;

            const path = await checkCache(parsePath(text, language));
            if (!path) {
                const newPath = parsePath(text, language);
                const [{audioContent}] = await callSynthesize(language, text);

                return await uploadToCache(newPath, audioContent);
            } else {
                return path;
            }
        } catch (e) {
            return e.message;
        }
    }
)

exports.voices = functions.https.onCall(
    async () => {

        try {
            return await callList();
        } catch (e) {
            return e.message;
        }
    }
)
