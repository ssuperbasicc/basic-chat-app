import { useEffect, useState } from "react"
import {
    Card,
    Form,
    Button,
    Row,
    Col
} from 'react-bootstrap'
import { useMutation } from "@apollo/client"
import { LOGIN } from "../../graphql/mutations/authentication"
import { Link } from 'react-router-dom'
import { parseJwt } from '../../utilities/parseJwt'
import { useNavigate } from "react-router-dom"
const {
    REACT_APP_SERVICE_TOKEN_KEY
} = process.env

const LoginPage = () => {
    const nav = useNavigate()

    const [state, setState] = useState({
        email: "",
        password: ""
    })

    const [login, { loading }] = useMutation(LOGIN, {
        onCompleted: (data) => {
            console.debug(data)

            const token = data.login.token

            window.sessionStorage.setItem(REACT_APP_SERVICE_TOKEN_KEY, token)
            window.location = '/'
        },
        onError: (error) => {
            console.debug(error)
            window.alert(error.message)
        }
    })

    const _handleChange = (e) => {
        const { name, value } = e.target

        setState({
            ...state, 
            [name]: value 
        })
    }

    const _handleSubmit = (e) => {
        e.preventDefault()
        const { email, password } = state

        if (email === "" || password === "") {
            window.alert("Please fill all field.")
            return false
        }

        login({ variables: { email, password } })
    }

    useEffect(() => {
        const user = parseJwt()?.aud

        if (user) {
            nav('/')
        }

    }, [])

    return (
        <>
            <div className="container my-3 mt-5">
                <Row className="d-flex justify-content-center">
                    <Col
                        xl={6}
                        lg={6}
                        md={10}
                        sm={10}
                    >
                        <Card>
                            <Card.Body>
                                <Card.Header>
                                    <strong>Login</strong>
                                    <br />
                                    <p>Not having an account? <Link to="/register">Register</Link></p>
                                </Card.Header>
                            </Card.Body>
                            <Card.Body>
                                <Form onSubmit={_handleSubmit}>
                                    <Form.Group>
                                        <Form.Label>
                                            Email
                                        </Form.Label>
                                        <Form.Control 
                                            type="email"
                                            name="email"
                                            placeholder="Enter email"
                                            value={state.email}
                                            onChange={_handleChange}
                                        />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>
                                            Password
                                        </Form.Label>
                                        <Form.Control 
                                            type="password"
                                            name="password"
                                            placeholder="Enter password"
                                            autoComplete="off"
                                            value={state.password}
                                            onChange={_handleChange}
                                        />
                                    </Form.Group>
                                    <hr />
                                    <div className="d-flex justify-content-end">
                                        <Button
                                            type="submit"
                                            variant="primary"
                                            disabled={loading}
                                        >
                                            Login
                                        </Button>
                                    </div>
                                </Form>                                
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>    
        </>
    )
}

export default LoginPage