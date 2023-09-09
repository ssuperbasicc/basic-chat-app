const {
    REACT_APP_SERVICE_TOKEN_KEY
} = process.env

export const parseJwt = () => {
    const token = window.sessionStorage.getItem(REACT_APP_SERVICE_TOKEN_KEY)
    
    let result = undefined

    if (token) {
        const serviceTokenBody = JSON.parse(atob(token.split(".")[1]))

        result = serviceTokenBody
    }

    return result
}