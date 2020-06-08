const admin = require("firebase-admin");

const serviceAccount = require("./gCloud.json");
const HasuraClaims = require("./src/HasuraClaims");
const TextToSpeech = require("./src/TextToSpeech");
const SpeechToText = require("./src/SpeechToText");
const Translate = require("./src/Translate");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "speakeasy-263714.appspot.com",
});

exports.processSignUp = HasuraClaims.processSignUp;
exports.refreshToken = HasuraClaims.refreshToken;

exports.synthesize = TextToSpeech.synthesize;
exports.voices = TextToSpeech.voices;

exports.listLanguages = Translate.listLanguages;
exports.detectLanguage = Translate.detectLanguage;
exports.translate = Translate.translate;

exports.recognize = SpeechToText.recognize;
