// This will prevent authenticated users from accessing this route
import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"

function OpenRoute({ children }) {
    const { token } = useSelector((state) => state.auth)
    const { user } = useSelector((state) => state.profile)

    console.log("OpenRoute; ", user)

    if (token === null) {
        return children
    } else if (user.accountType === "Student") {
        return <Navigate to="/dashboard/enrolled-courses" />
    } else if (user.accountType === "Instructor") {
        return <Navigate to="/dashboard/my-courses" />
    }
}

export default OpenRoute
