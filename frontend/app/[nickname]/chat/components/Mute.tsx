import React, { useContext, useState } from 'react'
import { Context } from '../page'
import { BiVolumeFull, BiVolumeMute } from 'react-icons/bi'

interface MuteProps {
    muteUser: any,
    unMuteUser: any,
    user: any,
    _state: string,
}

const Mute:React.FC<MuteProps> = ( { muteUser, unMuteUser, user, _state } ) => {

    const [showDuration, setShowDuration] = useState(false)
    const [muteDuration, setMuteDuration] = useState('')

    const {socket} = useContext(Context)

  return (
     _state === 'UNMUTED' ? <>
    <BiVolumeMute aria-label='mute' cursor="pointer" size={25} onClick={ () => { setShowDuration(old => !old) }}/>
    {showDuration && 
        <div>
            <select name="banDuration" id="banDuration" onChange={(e) => { setMuteDuration(e.target.value) }}>
                <option>select duration</option>
                <option value={"2"}>2 mins</option>
                <option value={"1"}>1 hour</option>
                <option value={"8"}>8 hour</option>
                <option value={"permanent"}>permanent</option>
            </select>
            <button type="button" className="w-auto text-white bg-red-900 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center" onClick={() => {
                muteUser(user.id, muteDuration)
                setMuteDuration('')
                setShowDuration(old => !old)
            }}>confirm</button>
        </div>
    }
    </> :
    <BiVolumeFull title='unmute' aria-label='unmute' cursor="pointer" size={25} onClick={() =>{ unMuteUser(user.id) }}/>
  )
}

export default Mute