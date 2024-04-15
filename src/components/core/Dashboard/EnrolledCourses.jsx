import { useEffect, useState } from "react"
import ProgressBar from "@ramonak/react-progress-bar"
import toast from "react-hot-toast"
import { IoMdDownload } from "react-icons/io"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { createCourseCertificate } from "../../../services/operations/courseDetailsAPI"
import { getUserEnrolledCourses } from "../../../services/operations/profileAPI"

export default function EnrolledCourses() {
    const { token } = useSelector((state) => state.auth)
    const { user } = useSelector((state) => state.profile)
    const navigate = useNavigate()

    const [enrolledCourses, setEnrolledCourses] = useState(null)

    useEffect(() => {
        ;(async () => {
            try {
                const res = await getUserEnrolledCourses(token) // Getting all the published and the drafted courses

                // Filtering the published course out
                const filterPublishCourse = res.filter(
                    (ele) => ele.status !== "Draft"
                )

                setEnrolledCourses(filterPublishCourse)
            } catch (error) {
                console.log("Could not fetch enrolled courses.")
            }
        })()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handlerCertificateDownload = async (course) => {
        if (course.progressPercentage < 90) {
            toast.error("You are not eligible")
            return
        }
        console.log(user, course)

        const res = await createCourseCertificate(
            { userId: user._id, courseId: course._id },
            token
        )

        if (res.status === 201) {
            toast.success("Certificate created")
            navigate(`/Certificate/${res.data.data._id}`)
        }

        console.log(res)
    }

    return (
        <>
            <div className="text-3xl text-richblack-50">Enrolled Courses</div>
            {!enrolledCourses ? (
                <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
                    <div className="spinner"></div>
                </div>
            ) : !enrolledCourses.length ? (
                <p className="grid h-[10vh] w-full place-content-center text-richblack-5">
                    You have not enrolled in any course yet.
                </p>
            ) : (
                <div className="my-8 text-richblack-5">
                    <table className="w-full border-collapse rounded-lg border border-richblack-700">
                        <thead>
                            <tr className="bg-richblack-500">
                                <th className="px-5 py-3 text-left align-middle">
                                    Course Name
                                </th>
                                <th className="px-2 py-3 text-center align-middle">
                                    Duration
                                </th>
                                <th className="px-2 py-3 text-left align-middle">
                                    Progress
                                </th>
                                <th className="px-5 py-3 text-center align-middle">
                                    Certificate
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {enrolledCourses.map((course, i, arr) => (
                                <tr
                                    key={i}
                                    className={`border border-richblack-700 ${
                                        i === arr.length - 1
                                            ? "rounded-b-lg"
                                            : "rounded-none"
                                    }`}
                                >
                                    <td
                                        className="flex cursor-pointer gap-4 px-5 py-3"
                                        onClick={() => {
                                            navigate(
                                                `/view-course/${course?._id}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.subSection?.[0]?._id}`
                                            )
                                        }}
                                    >
                                        <img
                                            src={course.thumbnail}
                                            alt="course_img"
                                            className="h-14 w-14 rounded-lg object-cover"
                                        />
                                        <div className="flex max-w-xs flex-col gap-2">
                                            <p className="font-semibold text-richblack-5">
                                                {course.courseName}
                                            </p>
                                            <p className="text-xs text-richblack-300">
                                                {course.courseDescription
                                                    .length > 50
                                                    ? `${course.courseDescription.slice(
                                                          0,
                                                          50
                                                      )}...`
                                                    : course.courseDescription}
                                            </p>
                                        </div>
                                    </td>
                                    <td
                                        className="px-2 py-3 text-center align-middle text-richblack-5"
                                        onClick={() => {
                                            navigate(
                                                `/view-course/${course?._id}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.subSection?.[0]?._id}`
                                            )
                                        }}
                                    >
                                        {course?.totalDuration}
                                    </td>
                                    <td
                                        className="px-2 py-3 text-center align-middle"
                                        onClick={() => {
                                            navigate(
                                                `/view-course/${course?._id}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.subSection?.[0]?._id}`
                                            )
                                        }}
                                    >
                                        <p className="text-left text-richblack-5">
                                            Progress:{" "}
                                            {course.progressPercentage || 0}%
                                        </p>
                                        <ProgressBar
                                            completed={
                                                course.progressPercentage || 0
                                            }
                                            height="8px"
                                            isLabelVisible={false}
                                        />
                                    </td>
                                    <td className="px-5 py-3 text-center align-middle text-richblack-5">
                                        <button
                                            onClick={() =>
                                                handlerCertificateDownload(
                                                    course
                                                )
                                            }
                                            className={`cursor-pointer rounded-md px-4 py-2 font-semibold text-richblack-900 ${
                                                course?.progressPercentage >= 90
                                                    ? "bg-yellow-50"
                                                    : "bg-yellow-500"
                                            }`}
                                            disabled={
                                                course?.progressPercentage >= 90
                                                    ? ""
                                                    : "disabled"
                                            }
                                        >
                                            <IoMdDownload />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    )
}
