import {useParams} from "react-router-dom";

const ResetPasswordPage = () => {
    const {accessCode, email} = useParams();

    return   (
        <>
            <div>{accessCode} and {email}</div>
        </>
    )
}

export default ResetPasswordPage;