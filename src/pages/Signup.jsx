import { useParams } from "react-router-dom"

import signupImg from "../assets/Images/signup.webp"
import Template from "../components/core/Auth/Template"

function Signup() {
    const { id } = useParams()
    return (
        <Template
            title="Join the millions learning to code with Giet E-LMS for free"
            description1="Build skills for today, tomorrow, and beyond."
            description2="Education to future-proof your career."
            image={signupImg}
            formType="signup"
            actor={id}
        />
    )
}

export default Signup
