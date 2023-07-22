import Image from "next/image"
import { user } from "../page"
import UserBox from "./UserBox"
import { data } from "autoprefixer"

interface UserListProps {
  items: user[]
};

const UserList: React.FC<UserListProps> = ({items}) => {
    return (
      <div className='group left-[10%] flex-col bg-transparent w-100% h-[70vh] mt-8 overflow-hidden overflow-y-scroll'>
          {items.map ((item:user) => (<UserBox key={item.id} data={item} />))}
      </div>
    )
  }

  export default UserList