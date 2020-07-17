const functions = require('firebase-functions');

const {Translate} = require('@google-cloud/translate').v2;
const translate = new Translate();

const callDetectLanguage = text => {
    return translate.detect(text);
};

const callListLanguages = () => {
    return translate.getLanguages();
}

const callTranslate = (text, target) => {
    return translate.translate(text, target);
}

exports.detectLanguage = functions.https.onCall(
    async (data, context) => {

        try {
            const text = data.text;
            return await callDetectLanguage(text);
        } catch (e) {
            console.error(e);
            return e.message;
        }
    }
)

exports.listLanguages = functions.https.onCall(
    async () => {
        try {
            return await callListLanguages();
        } catch (e) {
            return e.message;

        }
    }
)

exports.translate = functions.https.onCall(
    async (data, context) => {

        try {
            const text = data.text;
            const target = data.target;
            return await callTranslate(text, target);
        } catch (e) {
            return e.message;
        }
    }
)