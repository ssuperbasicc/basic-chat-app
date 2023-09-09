import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { parseJwt } from "../../utilities/parseJwt"

const MainPage = () => {
    const nav = useNavigate()

    useEffect(() => {
        const user = parseJwt()?.aud

        if (user === undefined) {
            nav('/login')
        }
    }, [])

    return (
        <> 
            Main Page
        </>
    )
}

export default MainPage