import { useEffect, useState } from "react"
import { 
    Card,
    Form,
    Row,
    Col,
    Button
} from 'react-bootstrap'
import RequiredField from "../../components/requiredField"
import { REGISTER } from "../../graphql/mutations/register"
import { useMutation } from "@apollo/client"
import { useNavigate } from "react-router-dom"
import { parseJwt } from "../../utilities/parseJwt"

const RegisterPage = () => {
    const nav = useNavigate()

    const [state, setState] = useState({
        email: "",
        username: "",
        firstName: undefined,
        lastName: undefined,
        password: "",
        confirmPassword: ""
    })

    const [register, { loading }] = useMutation(REGISTER, {
        onCompleted: (data) => {
            console.debug(data)
            window.alert("Successfully")
            nav('/login')
        },
        onError: (error) => {
            console.debug(error)
            window.alert(error.message)
        }
    })

    const _handleSubmit = (e) => {
        e.preventDefault()

        const {
            email,
            username,
            firstName,
            lastName,
            password,
            confirmPassword
        } = state

        if (
            email === ""
            || username === ""
            || password === ""
            || confirmPassword === ""
        ) {
            window.alert("Please fill all field.")
            return false
        }

        if (password !== confirmPassword) {
            window.alert("Invalid validation. Make sure password and confirmation password are the same.")
            return false
        }

        register({
            variables: {
                firstName,
                lastName,
                email,
                username,
                password
            }
        })
    }

    const _handleChange = (e) => {
        const { name, value } = e.target

        setState({
            ...state,
            [name]: value
        })
    }

    useEffect(() => {
        const user = parseJwt()?.aud

        if (user) {
            nav('/')
        }

    }, [])

    return (
        <>
            <div className="container my-3">
                <Card>
                    <Card.Body>
                        <Card.Header>
                            <strong>Register</strong>
                        </Card.Header>
                        <Card.Body>
                            <Form onSubmit={_handleSubmit}>
                                <Row>
                                    <Col
                                        xl={10}
                                        lg={10}
                                    >
                                        <Row>
                                            <Col>
                                                <Form.Group>
                                                    <Form.Label>First Name</Form.Label>
                                                    <Form.Control 
                                                        type="text"
                                                        name="firstName"
                                                        placeholder="Enter first name"
                                                        value={state.firstName}
                                                        onChange={_handleChange}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col>
                                                <Form.Group>
                                                    <Form.Label>Last Name</Form.Label>
                                                    <Form.Control 
                                                        type="text"
                                                        name="lastName"
                                                        placeholder="Enter last name"
                                                        value={state.lastName}
                                                        onChange={_handleChange}
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Form.Group>
                                            <Form.Label>
                                                Username
                                                <RequiredField />
                                            </Form.Label>
                                            <Form.Control 
                                                type="text"
                                                name="username"
                                                placeholder="Enter username"
                                                value={state.username}
                                                onChange={_handleChange}
                                            />
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>
                                                Email
                                                <RequiredField />
                                            </Form.Label>
                                            <Form.Control 
                                                type="email"
                                                name="email"
                                                placeholder="Enter email"
                                                value={state.email}
                                                onChange={_handleChange}
                                            />
                                        </Form.Group>
                                        <br />
                                        <small><i>Please provide strong password</i></small>
                                        <Form.Group>
                                            <Form.Label>
                                                Password
                                                <RequiredField />
                                            </Form.Label>
                                            <Form.Control 
                                                type="password"
                                                name="password"
                                                placeholder="Enter password"
                                                autoComplete="false"
                                                value={state.password}
                                                onChange={_handleChange}
                                            />
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>
                                                Confirm Password
                                                <RequiredField />
                                            </Form.Label>
                                            <Form.Control 
                                                type="password"
                                                name="confirmPassword"
                                                placeholder="Enter confirm password"
                                                autoComplete="false"
                                                value={state.confirmPassword}
                                                onChange={_handleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <hr />
                                <div className="d-flex justify-content-end">
                                    <Button
                                        type="submit"
                                        variant="primary"
                                    >
                                        Submit
                                    </Button>
                                    &nbsp;
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={() => window.history.go(-1)}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card.Body>
                </Card>
            </div>
        </>
    )
}

export default RegisterPage