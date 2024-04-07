// Import the Mongoose library
const mongoose = require("mongoose")

// Define the user schema using the Mongoose Schema constructor
const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
        },
        accountType: {
            type: String,
            enum: ["Admin", "Student", "Instructor"],
            required: true,
        },
        active: {
            type: Boolean,
            default: true,
        },
        approved: {
            type: Boolean,
            default: true,
        },
        additionalDetails: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Profile",
        },
        courses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Course",
            },
        ],
        token: {
            type: String,
        },
        resetPasswordExpires: {
            type: Date,
        },
        image: {
            type: String,
        },
        courseProgress: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "courseProgress",
            },
        ],
    },
    { timestamps: true }
)

//Delete User All rating
userSchema.pre("remove", async function (next) {
    console.log("IN Remove user pre called: ", this._id)
    await mongoose.model("RatingAndReview").deleteMany({ user: this._id })
    console.log("Out")
    next()
})

module.exports = mongoose.model("user", userSchema)
