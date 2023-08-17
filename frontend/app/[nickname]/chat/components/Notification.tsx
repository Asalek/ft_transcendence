import React, { useState } from 'react'
import { gimmeRandom } from '../page'
import {ImCheckmark} from 'react-icons/Im'
import { GiCrossMark } from 'react-icons/Gi'

interface NotificationProps {
  notifications: string[]
  type: string
  notify: boolean
  setNotify: any
}

const Notification:React.FC<NotificationProps> = ( { notifications, type, notify, setNotify } ) => {

  // const [bgColor, setBgColor] = useState(type === 'good' ? 'bg-green-600' : 'bg-red-600')


  return (
    <div>
      <button id="notification_button" onClick={() => { setNotify(old => !old) }}>
				<svg viewBox="0 0 448 512" id="bell"><path d="M224 0c-17.7 0-32 14.3-32 32V49.9C119.5 61.4 64 124.2 64 200v33.4c0 45.4-15.5 89.5-43.8 124.9L5.3 377c-5.8 7.2-6.9 17.1-2.9 25.4S14.8 416 24 416H424c9.2 0 17.6-5.3 21.6-13.6s2.9-18.2-2.9-25.4l-14.9-18.6C399.5 322.9 384 278.8 384 233.4V200c0-75.8-55.5-138.6-128-150.1V32c0-17.7-14.3-32-32-32zm0 96h8c57.4 0 104 46.6 104 104v33.4c0 47.9 13.9 94.6 39.7 134.6H72.3C98.1 328 112 281.3 112 233.4V200c0-57.4 46.6-104 104-104h8zm64 352H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7s18.7-28.3 18.7-45.3z"></path></svg>
			</button>
      {notify && <div className='rounded-xl gap-1 absolute z-50 right-[4%] top-[6%] flex flex-col items-center justify-center' onBlur={ () => {
          setNotify(false)
        }}>
        {
          notifications.map(notif =>
             <ul className={'bg-darken-300 hover:bg-slate-600 border-2 rounded-xl p-5 flex items-center h-10 text-white'} key={gimmeRandom()}>
              {type === 'good' ? <ImCheckmark color='green' className='m-2'/> : <GiCrossMark color='red' className='m-2'/>}
              {notif}
            </ul>
          )
        }
      </div>
      }    
    </div>
  )
}

export default Notification