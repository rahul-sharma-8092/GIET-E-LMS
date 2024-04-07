const admin = require("firebase-admin")
const serviceAccount = require("../serviceAccount.json")

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "giet-elms.appspot.com",
})

module.exports = admin
