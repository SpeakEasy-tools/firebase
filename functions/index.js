const uuid = require('uuid');
const functions = require('firebase-functions');
const admin = require('firebase-admin');

const serviceAccount = require('./gCloud.json');
const jwt = require('./src/hasuraJWT');

const DEFAULT_ENCODING = 'MP3';
const DEFAULT_GENDER = 'NEUTRAL';

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "speakeasy-263714.appspot.com"
});

const {SpeechClient} = require('@google-cloud/speech');
const {TextToSpeechClient} = require('@google-cloud/text-to-speech');

const speechToTextClient = new SpeechClient();
const textToSpeechClient = new TextToSpeechClient();

const bucket = admin.storage().bucket();

const callVoices = () => {
    const request = {

    }
    return  textToSpeechClient.listVoices(request);

}

const callTextToSpeech = (targetLocal, data) => {
    const request = {
        input: {text: data},
        voice: {languageCode: targetLocal, ssmlGender: DEFAULT_GENDER},
        audioConfig: {audioEncoding: DEFAULT_ENCODING}
    };

    return textToSpeechClient.synthesizeSpeech(request);
}

const callSpeechToText = (audioContent, encoding, sampleRateHertz, languageCode) => {
    const request = {
        config: {
            encoding: encoding,
            sampleRateHertz: sampleRateHertz,
            languageCode: languageCode
        },
        audio: {content: audioContent}
    };

    return speechToTextClient.recognize(request);
}

const uploadToCloudStorage = (path, contents) => {
    console.log(`Uploading file: ${path}`);
    return bucket.file(path).save(contents).then(() => {
        return {
            filename: path,
            audioContent: `data:audio/mp3;base64,${contents}`
        }
    });
}

exports.getVoices = functions.https.onCall(
    async () => {
        console.log(`Fetching voices`);

        try {
            return await callVoices();
        }catch (e) {
            console.error(e);
            return e.message;
        }
    }
)

exports.tts = functions.https.onCall(
    async (data, context) => {
        console.log(`Executing tts: ${data}`);

        try {

            const text = data.text;
            const language = data.language;
            const [{audioContent}] = await callTextToSpeech(language, text);
            const filename = `${uuid.v4()}.${DEFAULT_ENCODING.toLowerCase()}`;
            const path = `${language}/${filename}`;

            return await uploadToCloudStorage(path, audioContent);
        } catch (e) {
            console.error(e);
            return e.message;
        }
    }
);

exports.stt = functions.https.onCall(
    async (data, context) => {
        console.log(`Executing stt: ${data}`);

        try {
            const encoding = data.encoding;
            const sampleRateHertz = data.sampleRateHertz;
            const languageCode = data.languageCode;
            const audioContent = data.audioContent;

            const [{results}] = await callSpeechToText(audioContent, encoding, sampleRateHertz, languageCode);
            return results;
        } catch (e) {
            console.error(e);
            return e.message;
        }
    }
);

exports.processSignUp = jwt.processSignUp;
exports.refreshToken = jwt.refreshToken;