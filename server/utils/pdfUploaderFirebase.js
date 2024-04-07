const admin = require("../config/firebase")

const bucket = admin.storage().bucket()

exports.uploadPDFToFirebase = async (filePath, destination) => {
    try {
        // Upload PDF file
        const result = await bucket.upload(filePath, { destination })
        const file = result[0]

        // Get URL of uploaded PDF
        const url = await file.getSignedUrl({
            action: "read",
            expires: "03-09-2030",
        })

        console.log("PDF uploaded successfully!")
        return url[0]
    } catch (error) {
        console.error("Error uploading file:", error)
    }
}
