import { useEffect, useRef, useState } from "react"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import toast from "react-hot-toast"
import { useParams } from "react-router-dom"

import logo from "../assets/Logo/Logo.jpg"
import { getCourseCertificate } from "../services/operations/courseDetailsAPI"

export default function ViewCertificate() {
    const { certificateId } = useParams()
    const [response, setResponse] = useState(null)
    const contentRef = useRef(null)

    useEffect(() => {
        ;(async () => {
            const res = await getCourseCertificate({ certificateId })
            toast.success("Certificate fetched successfully")
            console.log("Certificate Response", res)

            setResponse(res)
        })()
    }, [])

    const handlerDownloadPDF = async () => {
        try {
            // Capture the content div to a canvas
            const canvas = await html2canvas(contentRef.current, {
                scrollY: -window.scrollY,
                allowTaint: true,
            })

            // Initialize jsPDF in landscape mode
            const pdf = new jsPDF({
                orientation: "landscape",
                unit: "mm",
                format: "a4",
            })

            // Actual dimensions of the target element in pixels
            const actualWidth = contentRef.current.offsetWidth
            const actualHeight = contentRef.current.offsetHeight

            console.log(actualWidth, actualHeight)

            // Calculate the scale factor based on the actual dimensions
            const scaleFactorWidth = 297 / actualWidth // A4 width in mm / actual width in px
            const scaleFactorHeight = 210 / actualHeight // A4 height in mm / actual height in px

            // Use the smaller scale factor to ensure the content fits both width and height
            const scaleFactor = Math.min(scaleFactorWidth, scaleFactorHeight)

            // Calculate the new canvas dimensions
            const canvasWidth = actualWidth * scaleFactor
            const canvasHeight = actualHeight * scaleFactor

            console.log(canvasWidth, canvasHeight)

            // Add image to the PDF
            const imgData = canvas.toDataURL("image/png")
            pdf.addImage(
                imgData,
                "PNG",
                0,
                0,
                canvasWidth,
                canvasHeight,
                "",
                "FAST"
            )

            // Download the PDF
            pdf.save("certificate.pdf")
            toast.success("Certificate downloaded")
        } catch (error) {
            console.error("Error converting to PDF: ", error)
        }
    }

    return (
        <>
            <div>
                <button
                    onClick={handlerDownloadPDF}
                    className="bg-yellow-50 px-3 py-2 text-white"
                >
                    Download PDF
                </button>
            </div>
            <div
                ref={contentRef}
                className="border-gray-300 mx-auto h-[714px] w-[1010px]  rounded-lg border-2 bg-white p-8 shadow-lg"
            >
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4"></div>
                    <div className="text-center">
                        <img
                            alt="LearnSmasher logo"
                            height="60"
                            src={logo}
                            style={{
                                aspectRatio: "200/60",
                                objectFit: "cover",
                            }}
                            width="200"
                        />
                        <p className="text-sm font-light">
                            learn. grow. succeed.
                        </p>
                        <p className="text-xs font-light">
                            www.learnsmasher.in
                        </p>
                    </div>
                    <div>
                        <p className="text-xs font-medium">C.ID.: dac717e</p>
                        <img
                            alt="QR Code"
                            className="mt-1"
                            height="100"
                            src="/placeholder.svg"
                            style={{
                                aspectRatio: "100/100",
                                objectFit: "cover",
                            }}
                            width="100"
                        />
                    </div>
                </div>
                <div className="my-6 text-center">
                    <h1 className="text-3xl font-bold uppercase">
                        Course Completion Certificate
                    </h1>
                    <p className="mt-2 text-lg font-semibold">
                        This is to certify that
                    </p>
                </div>
                <div className="my-4 text-center">
                    <p className="text-red-600 text-4xl font-bold">
                        {response?.student?.firstName +
                            " " +
                            response?.student?.lastName}
                    </p>
                </div>
                <p className="my-6 text-center text-lg">
                    has successfully completed the course -{" "}
                    <span className="font-semibold">
                        {response?.course?.courseName}.
                    </span>
                </p>
                <p className="text-center text-lg"></p>
                <div className="mt-8 flex items-center justify-between">
                    <div className="flex flex-col items-center">
                        <img
                            alt="Signature"
                            height="50"
                            src="/placeholder.svg"
                            style={{
                                aspectRatio: "150/50",
                                objectFit: "cover",
                            }}
                            width="150"
                        />
                        <p className="mt-1 text-sm font-medium">Founder</p>
                        <p className="text-sm font-medium">LearnSmasher</p>
                    </div>
                    <div className="text-center">
                        <p className="text-lg font-semibold">Date</p>
                        <p className="text-green-600 text-lg font-semibold">
                            11/06/2023
                        </p>
                    </div>
                </div>
                <div className="mt-6 flex items-center justify-between">
                    <p className="text-xs">
                        contact.learnsmasher@gmail.com | +917083448246 |
                        www.learnsmasher.in
                    </p>
                    <p className="text-xs">
                        verify at: - https://verify.learnsmasher.in
                    </p>
                </div>
            </div>
        </>
    )
}
