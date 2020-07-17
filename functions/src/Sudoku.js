const functions = require('firebase-functions')

const getSudoku = () => {
    const request = {};

    return {};
};

exports.sudoku = functions.https.onCall(
    async (data, context) => {

        try {
            return await getSudoku();
        }catch (e) {
            return e.message;
        }
    }
)