const functions = require("firebase-functions");

const getSudoku = () => {
    return {};
};

exports.sudoku = functions.https.onCall(async () => {
    try {
        return await getSudoku();
    } catch (e) {
        return e.message;
    }
});
