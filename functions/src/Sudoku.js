const functions = require("firebase-functions");
const fetch = require("node-fetch");

const { API_URL } = require("./constants");

const getSudoku = async (req, difficulty) => {
    const apiReq = await fetch(API_URL + `/sudoku/${difficulty}`, {
        headers: {
            Authorization: req.headers.authorization,
        },
    });
    const json = await apiReq.json();
    return json;
};

exports.sudoku = functions.https.onCall(async (data, context) => {
    try {
        return await getSudoku(context.rawRequest, data.difficulty);
    } catch (e) {
        return e.message;
    }
});
