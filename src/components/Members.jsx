import Member from "./Member";

export default function Members({members, me}){

    return (
        <div>
            <div>
Currently {members.length} user {members.length === 1 ? "" : "s"} online.
            </div>
            {/* displaying how many members are online */}
            <div>
                {members.map((member) => <Member member={member} id={me.id}/>)}
            </div>
        </div>
    )
}