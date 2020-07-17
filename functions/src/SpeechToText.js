<<<<<<< HEAD
const functions = require('firebase-functions');
const {DEFAULT_ENCODING, DEFAULT_SAMPLE_RATE_HERTZ} = require('./constants');
const {SpeechClient} = require('@google-cloud/speech');
const speechToTextClient = new SpeechClient();

const callRecognize = (audioContent, languageCode) => {
    const request = {
        config: {
            encoding: DEFAULT_ENCODING,
            sampleRateHertz: DEFAULT_SAMPLE_RATE_HERTZ,
            languageCode: languageCode
        },
        audio: {content: audioContent}
    };

    return speechToTextClient.recognize(request);
}

exports.recognize = functions.https.onCall(
    async (data, context) => {

        try {
            const languageCode = data.languageCode;
            const audioContent = data.audioContent;

            return await callRecognize(audioContent, languageCode);
        } catch (e) {
            return e.message;
        }
    }
)
=======
const functions = require("firebase-functions");
const { DEFAULT_ENCODING, DEFAULT_SAMPLE_RATE_HERTZ } = require("./constants");
const { SpeechClient } = require("@google-cloud/speech");
const speechToTextClient = new SpeechClient();

const callRecognize = (audioContent, languageCode) => {
    const request = {
        config: {
            encoding: DEFAULT_ENCODING,
            sampleRateHertz: DEFAULT_SAMPLE_RATE_HERTZ,
            languageCode: languageCode,
        },
        audio: { content: audioContent },
    };

    return speechToTextClient.recognize(request);
};

exports.recognize = functions.https.onCall(async (data) => {
    console.log("Recognizing speech");

    try {
        const languageCode = data.languageCode;
        const audioContent = data.audioContent;

        return await callRecognize(audioContent, languageCode);
    } catch (e) {
        console.error(e);
        return e.message;
    }
});
>>>>>>> 8a8376b3f5ce931b8324eeeb6bb85fc69c4d224a
