import { useEffect, useRef, useState } from "react"
import { Watermark } from "@hirohe/react-watermark"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import toast from "react-hot-toast"
import QRCode from "react-qr-code"
import { useParams } from "react-router-dom"

import elmslogo from "../assets/Logo/Logo.jpg"
import gietlogo from "../assets/Logo/giet-logo.png"
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

    const formatDate = (dateTimeString) => {
        const date = new Date(dateTimeString)
        const day = String(date.getUTCDate()).padStart(2, "0")
        const month = String(date.getUTCMonth() + 1).padStart(2, "0") // Months are 0-based
        const year = date.getUTCFullYear()

        return `${day}-${month}-${year}`
    }

    const handlerDownloadPDF = async () => {
        try {
            // Capture the content div to a canvas
            const canvas = await html2canvas(contentRef.current, {
                width: 842,
                height: 595,
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
            pdf.addImage(imgData, "JPEG", 0, 0, canvasWidth, canvasHeight)

            // Download the PDF
            pdf.save("certificate.pdf")
            toast.success("Certificate downloaded")
        } catch (error) {
            console.error("Error converting to PDF: ", error)
        }
    }

    return (
        <>
            {response && (
                <div className="relative my-auto">
                    <div className="absolute right-2">
                        <button
                            onClick={handlerDownloadPDF}
                            className="rounded bg-yellow-50 px-4 py-2 text-center text-[13px] font-bold text-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] transition-all  duration-200 hover:scale-95 hover:shadow-none sm:text-[16px]"
                        >
                            Download PDF
                        </button>
                    </div>
                    <div
                        ref={contentRef}
                        className="mx-auto h-[595px] w-[842px] bg-[url('assets/Template/CertificateTemplate.png')] bg-cover p-2"
                    >
                        <div className="h-full w-full rounded bg-gradient-to-br from-yellow-5 via-yellow-400 to-yellow-500 p-1">
                            <div className="h-full w-full bg-white p-1">
                                <div className="h-full w-full rounded bg-gradient-to-br from-yellow-5 via-yellow-400 to-yellow-500 p-[5px]">
                                    <div className="flex h-full w-full flex-col justify-between bg-[#f4f5f7] p-3">
                                        <Watermark
                                            text="GIET-Elms"
                                            opacity="0.3"
                                            fontFamily="poppins"
                                            textSize="50"
                                        >
                                            <div className="mt-[15px] text-center font-yatra text-6xl text-[#1d2830]">
                                                Certificate of Completion
                                            </div>

                                            <div className="mt-5 flex items-center justify-evenly ">
                                                <div className="w-[150px]">
                                                    <img
                                                        width="100"
                                                        src={gietlogo}
                                                        alt="Logo"
                                                    />
                                                </div>
                                                <div className="">
                                                    <span className="text-center font-belleza text-3xl">
                                                        This is awarded to
                                                    </span>
                                                </div>
                                                <div className="w-[150px]">
                                                    <img
                                                        className="align-middle"
                                                        width="150"
                                                        src={elmslogo}
                                                        alt="Logo"
                                                    />
                                                </div>
                                            </div>

                                            <div className="text-center">
                                                <h2 className="inline-block  text-center font-alexBrush text-7xl">
                                                    {response?.student
                                                        ?.firstName +
                                                        " " +
                                                        response?.student
                                                            ?.lastName}
                                                </h2>
                                            </div>

                                            <div className="text-center">
                                                <p className="inline-block w-4/5 pt-2 text-center font-belleza text-xl">
                                                    for successfully completing
                                                    the&nbsp;
                                                    <b>
                                                        {
                                                            response.course
                                                                .courseName
                                                        }
                                                    </b>
                                                    &nbsp;course. Acknowledges
                                                    dedication, skills, and
                                                    commitment to continuous
                                                    learning.
                                                </p>
                                            </div>

                                            <div className="flex items-end justify-between px-5 font-poppins">
                                                <div className="flex  flex-col items-center justify-center pb-5">
                                                    <span>
                                                        {`Prof. ${response.course.instructor.firstName} ${response.course.instructor.lastName}`}
                                                    </span>
                                                    <span className="font-poppins font-bold">
                                                        Instructor
                                                    </span>
                                                </div>
                                                <div className="m-2 max-w-[120px] text-center">
                                                    <QRCode
                                                        size={256}
                                                        style={{
                                                            height: "auto",
                                                            maxWidth: "100%",
                                                            width: "100%",
                                                        }}
                                                        value={`https://giet-elms.vercel.app/Certificate/${response._id}`}
                                                        viewBox={`0 0 256 256`}
                                                    />
                                                    <span>Scan for Verify</span>
                                                </div>
                                                <div className="flex  flex-col items-center justify-center pb-5">
                                                    <span>
                                                        Prof Dr. Jibanananda
                                                        Jena
                                                    </span>
                                                    <span className="font-poppins font-bold">
                                                        Principal
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between px-5 font-poppins">
                                                <div>
                                                    <span className="font-bold">
                                                        Certificate Id:&nbsp;
                                                    </span>
                                                    <span>{response._id}</span>
                                                </div>
                                                <div>
                                                    <span className="font-bold">
                                                        Date:&nbsp;
                                                    </span>
                                                    <span>
                                                        {formatDate(
                                                            response.createdAt
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </Watermark>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
