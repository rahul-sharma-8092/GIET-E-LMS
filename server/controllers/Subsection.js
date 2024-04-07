const dotenv = require("dotenv")
dotenv.config()

// Import necessary modules
const Section = require("../models/Section")
const SubSection = require("../models/Subsection")
const { uploadImageToCloudinary } = require("../utils/imageUploader")
const { uploadPDFToFirebase } = require("../utils/pdfUploaderFirebase")

// Create a new sub-section for a given section
exports.createSubSection = async (req, res) => {
    try {
        // Extract necessary information from the request body
        const { sectionId, title, description } = req.body
        const video = req.files.video
        const notes = req.files.notes

        // Check if all necessary fields are provided
        if (!sectionId || !title || !description || !video) {
            return res
                .status(404)
                .json({ success: false, message: "All Fields are Required" })
        }
        console.log("Video upload data: ", video)
        console.log("Notes Upload data: ", notes)

        // Upload the video file to Cloudinary
        const uploadDetails = await uploadImageToCloudinary(
            video,
            process.env.FOLDER_NAME_VIDEO
        )
        console.log("Video URL: ", uploadDetails)

        let uploadNotesURL = ""
        if (notes !== undefined) {
            //Upload Notes Pdf to Firebase
            uploadNotesURL = await uploadPDFToFirebase(
                notes.tempFilePath,
                `Notes/notes-${Date.now()}.pdf`
            )
            console.log("PDF Notes URL: ", uploadNotesURL)
        }

        // Create a new sub-section with the necessary information
        const SubSectionDetails = await SubSection.create({
            title: title,
            timeDuration: `${uploadDetails.duration}`,
            description: description,
            videoUrl: uploadDetails.secure_url,
            notesUrl: uploadNotesURL,
        })

        // Update the corresponding section with the newly created sub-section
        const updatedSection = await Section.findByIdAndUpdate(
            { _id: sectionId },
            { $push: { subSection: SubSectionDetails._id } },
            { new: true }
        ).populate("subSection")

        // Return the updated section in the response
        return res.status(200).json({ success: true, data: updatedSection })
    } catch (error) {
        // Handle any errors that may occur during the process
        console.error("Error creating new sub-section:", error)
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        })
    }
}

exports.updateSubSection = async (req, res) => {
    try {
        const { sectionId, subSectionId, title, description } = req.body
        const subSection = await SubSection.findById(subSectionId)

        if (!subSection) {
            return res.status(404).json({
                success: false,
                message: "SubSection not found",
            })
        }

        if (title !== undefined) {
            subSection.title = title
        }

        if (description !== undefined) {
            subSection.description = description
        }
        if (req.files && req.files.video !== undefined) {
            const video = req.files.video
            const uploadDetails = await uploadImageToCloudinary(
                video,
                process.env.FOLDER_NAME_VIDEO
            )
            subSection.videoUrl = uploadDetails.secure_url
            subSection.timeDuration = `${uploadDetails.duration}`
        }

        if (
            req.files &&
            req.files.notes !== undefined &&
            req.files.notes !== "h"
        ) {
            const notes = req.files.notes
            console.log("Notes Updating value", notes)
            //Upload Notes Pdf to Firebase
            const uploadNotesURL = await uploadPDFToFirebase(
                notes.tempFilePath,
                `Notes/notes-${Date.now()}.pdf`
            )

            subSection.notesUrl = uploadNotesURL
            console.log("Updated PDF Notes URL: ", uploadNotesURL)
        }
        await subSection.save()

        // find updated section and return it
        const updatedSection = await Section.findById(sectionId).populate(
            "subSection"
        )

        console.log("updated section", updatedSection)

        return res.json({
            success: true,
            message: "Section updated successfully",
            data: updatedSection,
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: "An error occurred while updating the section",
        })
    }
}

exports.deleteSubSection = async (req, res) => {
    try {
        const { subSectionId, sectionId } = req.body
        await Section.findByIdAndUpdate(
            { _id: sectionId },
            {
                $pull: {
                    subSection: subSectionId,
                },
            }
        )
        const subSection = await SubSection.findByIdAndDelete({
            _id: subSectionId,
        })

        if (!subSection) {
            return res
                .status(404)
                .json({ success: false, message: "SubSection not found" })
        }

        // find updated section and return it
        const updatedSection = await Section.findById(sectionId).populate(
            "subSection"
        )

        return res.json({
            success: true,
            message: "SubSection deleted successfully",
            data: updatedSection,
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success: false,
            message: "An error occurred while deleting the SubSection",
        })
    }
}
