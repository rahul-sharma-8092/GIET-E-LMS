const mongoose = require("mongoose")

const certificateSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "user",
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Course",
    },
    createdAt: { type: Date, default: Date.now },
})

// Export the Courses model
module.exports = mongoose.model("Certificate", certificateSchema)
