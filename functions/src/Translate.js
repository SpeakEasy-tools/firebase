<<<<<<< HEAD
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
=======
const functions = require("firebase-functions");

const { Translate } = require("@google-cloud/translate").v2;
const translate = new Translate();

const callDetectLanguage = (text) => {
    console.log(`Detecting language: ${text}`);
    return translate.detect(text);
};

const callListLanguages = () => {
    console.log("Languages:");
    return translate.getLanguages();
};

const callTranslate = (text, target) => {
    console.log(`Translating text to ${target}: ${text}`);
    return translate.translate(text, target);
};

exports.detectLanguage = functions.https.onCall(async (data) => {
    console.log("Fetching languages detected");

    try {
        const text = data.text;
        return await callDetectLanguage(text);
    } catch (e) {
        console.error(e);
        return e.message;
    }
});

exports.listLanguages = functions.https.onCall(async () => {
    console.log("Fetching available languages");
    try {
        return await callListLanguages();
    } catch (e) {
        console.error(e);
        return e.message;
    }
});

exports.translate = functions.https.onCall(async (data) => {
    console.log("Requesting translation");

    try {
        const text = data.text;
        const target = data.target;
        return await callTranslate(text, target);
    } catch (e) {
        console.error(e);
        return e.message;
    }
});
>>>>>>> 8a8376b3f5ce931b8324eeeb6bb85fc69c4d224a
