import {
    Card,
    Form, 
    Button,
    Row,
    Col,
    Badge
} from 'react-bootstrap'

const MessageSection = (props) => {
    const {
        message,
        setMessage,

        activeRoomId,
        offset,
        limit,

        loading,
        error,

        messages,
        havingNext,

        currentUserId,

        _handleSubmit,
        _getChatMessages
    } = props

    const formView = () => {
        return (
            <div className="container py-2">
                <hr />
                <Form onSubmit={_handleSubmit}>
                    <div className="d-flex">
                        <Form.Control 
                            type="text"
                            placeholder="Type your message..."
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                        />
                        {
                            message !== ""
                            &&
                            <>
                             &nbsp;
                             <Button
                                variant="primary"
                                type="submit"
                            >
                                Send
                            </Button>
                            </>
                        }
                    </div>
                </Form>
            </div>
        )
    }

    return (
        <>
            <Card>
                <Card.Body 
                    style={{
                        height: '70vh', 
                        overflowY: 'scroll'
                    }}
                >
                    {
                        havingNext
                        &&
                        <Row>
                            <Col>
                                <p 
                                    onClick={() => {
                                        _getChatMessages({
                                            variables: {
                                                roomId: parseInt(activeRoomId),
                                                offset,
                                                limit
                                            }
                                        })
                                    }}
                                    className="text-center cursor-pointer ">Load more...</p>
                            </Col>
                        </Row>
                    }
                    {
                        messages.map((d,i) => {
                            const flagSender = d.sender == currentUserId
                            return (
                                <Row key={i}>
                                    <Col>
                                        <div className={`py-1 d-flex justify-content-${flagSender ? 'end' : 'start'}`} >
                                            <Badge bg={flagSender ? 'primary' : 'secondary'}>
                                                {d.text}
                                            </Badge>
                                        </div>
                                    </Col>
                                </Row>
                            )
                        })
                    }
                </Card.Body>
                { formView() }
            </Card>
        </>
    )
}

export default MessageSection