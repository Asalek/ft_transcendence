import React, { useContext, useEffect } from 'react'
import { Socket } from 'socket.io-client'
import { Context, Room } from '../page'

interface SocketComponentProps {
  rooms: Room[],
  socket: Socket
  setRooms: any
  setInfoUpdate: any
  setConvs?: any
  _notification: any
}

const SocketComponent:React.FC<SocketComponentProps> = ( { socket, rooms, setRooms, setInfoUpdate, _notification, setConvs } ) => {
  
  const { userData, setShowConv, setChatBoxMessages } = useContext(Context)

  const promoteUser = (res) => {
    console.log('promote')
    var _promotedUser = rooms.find(o => o.name === res.roomId.room_name).users.find(o => o.id === res.newAdmin.userId)
    setRooms((_rooms: Room[]) => {
      _promotedUser.type = 'ADMIN'
      return _rooms
    })
    if (res.newAdmin.userId === userData.id)
      _notification(`You are now admin at '${res.roomId.room_name}'`, "good")
    else
      _notification(`"${_promotedUser.nickName}" promoted at '${res.roomId.room_name}'`, "good")
    setInfoUpdate(old => !old)
  }
  
  const demoteUser = (res) => {
    console.log('demote')
    var _demotedUser = rooms.find(o => o.name === res.roomId.room_name).users.find(o => o.id === res.domotedAdmin.userId)
    setRooms((_rooms: Room[]) => {
      _demotedUser.type = 'USER'
      return _rooms
    })
    if (res.domotedAdmin.userId === userData.id)
      _notification(`You have been demoted at '${res.roomId.room_name}'`, "bad")
    else
      _notification(`"${_demotedUser.nickName}" demoted at '${res.roomId.room_name}'`, "good")
    setInfoUpdate(old => !old)
  }
  
  const kickUser = (res) => {
    console.log('kick')
    setRooms((_rooms: Room[]) => {
    var current_room = _rooms.find(o => o.name === res.roomId.room_name)
    var userToBeKicked = current_room.users.find(o => o.id === res.kickedUser.userId)
    if (res.kickedUser.userId != userData.id)
      _notification(`"${userToBeKicked.nickName}" has been kicked from '${res.roomId.room_name}'`, "good")
    var currentRoomUsers = _rooms.find(o => o.name === res.roomId.room_name).users
    currentRoomUsers.splice(currentRoomUsers.indexOf(userToBeKicked), 1)
    if (res.kickedUser.userId === userData.id) {
      _notification(`You have been kicked from '${res.roomId.room_name}'`, "bad")
      _rooms.splice(_rooms.indexOf(current_room), 1)
      setShowConv(false)
    }
    setConvs((_convs) => {
        _convs = [...rooms]
        return _convs
      })
      return _rooms
    })
    setInfoUpdate(old => !old)
  }

  const banUser = (res) => {
    console.log('ban')
    setRooms((_rooms: Room[]) => {
    var current_room = _rooms.find(o => o.name === res.roomId.room_name)
    var userToBeKicked = current_room.users.find(o => o.id === res.bannedUser.userId)
    if (res.bannedUser.userId != userData.id)
      _notification(`"${userToBeKicked.nickName}" has been banned from '${res.roomId.room_name}'`, "good")
    var currentRoomUsers = _rooms.find(o => o.name === res.roomId.room_name).users
    currentRoomUsers.splice(currentRoomUsers.indexOf(userToBeKicked), 1)
    if (res.bannedUser.userId === userData.id) {
      _notification(`You have been banned from '${res.roomId.room_name}'`, "bad")
      _rooms.splice(_rooms.indexOf(current_room), 1)
      setShowConv(false)
    }
    setConvs([...rooms])
      return _rooms
    })
    setInfoUpdate(old => !old)
  }

  const leaveUser = (res) => {
    console.log("leave", res)
  }

  const changeRoomName = (res) => {
    console.log('change name')
    setRooms( (_rooms: Room[]) => {
      _rooms.find(o => o.name === res.oldRoomName).name = res.newRoomName
      setConvs([...rooms])
      return _rooms
    })
    setInfoUpdate(old => !old)
    _notification(`Name of room changed from '${res.oldRoomName}' to '${res.newRoomName}'`, "good")
  }

  const changeRoomPass = (res) => {
    console.log("change pass")
    _notification(`'${res.room_name}' password changed !`, "good")
  }

  useEffect (() => {
    socket.on('onPromote', promoteUser)
    socket.on('onDemote', demoteUser)
    socket.on('onKick', kickUser)
    socket.on('onBan', banUser)
    socket.on('onLeave', leaveUser)
    socket.on('change-room-name', changeRoomName)
    socket.on('change-room-password', changeRoomPass)
}, []) 

  return (
    <div className='absolute w-0 h-0'></div>
  )
}

export default SocketComponent