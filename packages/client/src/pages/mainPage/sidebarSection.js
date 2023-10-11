import './style.css'
import dayJS from '../../utilities/dayjs'

const SidebarSection = (props) => {
    const {
        loading,
        error,
        data,

        currentUserId,

        _joinRoom
    } = props

    const viewRoomChat = (d) => {
        const { nameFormat, lastMessageTs } = d
        
        return (
            <>
                <p>
                    {
                        nameFormat.uid1 == currentUserId
                        ?
                        nameFormat.uname2
                        :
                        nameFormat.uname1
                    }
                </p>
                <small className="text-muted">{ dayJS(lastMessageTs).format("MMM DD, YY -  HH.mm") }</small>
            </>
        )

    }

    const viewRoomGroup = (d) => {
        return (
            <>
                GROUP
            </>
        )

    }

    if (loading) {
        return (
            <>Loading...</>
        )
    }

    return (
        <>
            <div className="sidebar p-1">
            {
                data
                ?
                <table className="table table-hover table-striped">
                    <tbody>
                    {
                        data.rooms.map((d, i) => {
                            return (
                                <tr 
                                    key={i}
                                   
                                >
                                    <td>
                                        <div className="d-flex justify-content-between px-5">
                                            <div className="cursor-pointer"  onClick={() => _joinRoom(d.id)}>
                                                {
                                                    d.flagForum
                                                    ?
                                                    viewRoomGroup(d)
                                                    :
                                                    viewRoomChat(d)
                                                }
                                            </div>
                                            <strong className="cursor-pointer" onClick={() => console.debug("clicked")}>...</strong>
                                        </div>
                                    </td>
                                </tr> 
                            )
                        })
                    }
                    </tbody>
                </table>
                :
                <></>
            }
            </div>
        </>
    )
}

export default SidebarSection