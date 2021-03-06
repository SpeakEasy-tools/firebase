const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });

const adminEmails = ["jerameyatyler@gmail.com"];
const instructorEmails = ["jerameyatyler@gmail.com"];
const developerEmails = ["jerameyatyler@gmail.com"];

async function getUserRoles(uid) {
    let defaultRole = "user";
    let allowedRoles = ["anonymous", "user"];
    const email = await admin
        .auth()
        .getUser(uid)
        .then((user) => user.email.toLowerCase());

    if (email) {
        if (developerEmails.includes(email)) {
            allowedRoles.push("dev");
            defaultRole = "dev";
        }
        if (instructorEmails.includes(email)) {
            allowedRoles.push("instructor");
            defaultRole = "instructor";
        }
        if (adminEmails.includes(email)) {
            allowedRoles.push("admin");
            defaultRole = "admin";
        }

        return [defaultRole, allowedRoles];
    } else {
        return false;
    }
}

async function updateClaims(uid) {
    const roles = await getUserRoles(uid);
    if (roles) {
        const claim = {
            "https://hasura.io/jwt/claims": {
                "x-hasura-default-role": roles[0],
                "x-hasura-allowed-roles": roles[1],
                "x-hasura-user-id": uid,
            },
        };
        await admin.auth().setCustomUserClaims(uid, claim);
    }
}

exports.processSignUp = functions.auth
    .user()
    .onCreate((user) => updateClaims(user.uid));

exports.refreshToken = functions.https.onRequest((req, res) => {
    cors(req, res, async () => {
        await updateClaims(req.query.uid)
            .then(() => res.status(200).send("success"))
            .catch((error) => {
                res.status(400).send(error);
            });
    });
});
