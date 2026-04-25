import { Button } from "@heroui/react";
import { useNavigate, useParams } from "react-router";

function DetailPage(){
    const {slug} = useParams();
    const navigate = useNavigate();
    return (
        <div>
            <h1>Detail Page</h1>
            <h2>{slug}</h2>

            <Button onClick={()=>navigate(-1)}>Back</Button>
        </div>
    )
}

export default DetailPage;