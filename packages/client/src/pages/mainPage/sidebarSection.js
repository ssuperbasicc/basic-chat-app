import { GET_ROOMS } from '../../graphql/queries/rooms'
import { useQuery } from "@apollo/client"
import { parseJwt } from "../../utilities/parseJwt" 

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
                { lastMessageTs }
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
            <div style={{
                height: '70vh'
            }}>
            {
                data
                ?
                <table className="table table-hover">
                    <tbody>
                    {
                        data.rooms.map((d, i) => {
                            return (
                                <tr 
                                    key={i}
                                    onClick={() => _joinRoom(d.id)}
                                >
                                    <td>
                                    {
                                        d.flagForum
                                        ?
                                        viewRoomGroup(d)
                                        :
                                        viewRoomChat(d)
                                    }
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