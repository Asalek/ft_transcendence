"use client";
import { io } from "socket.io-client";

import Image from 'next/image'
import { useEffect, useState, createContext, useContext } from 'react';
import { Component } from 'react';
import Conversation from './components/conversation';
import RoomForm from './components/roomform';
import Search from './components/search';
import UserList from './components/ConvList';
import { Socket } from "dgram";
import { userDataContext } from "../layout";

export interface conversation {
	readonly name: string,
	readonly photo: string,
	readonly last_msg: string, 
	readonly id: number,
}

export const Context = createContext<any>(undefined)

export default function Chat() {

    const [convs, setConvs] = useState<conversation[]>([])

	const userData = useContext(userDataContext);

    
    useEffect ( () => {
        userData.chatSocket.on('list-rooms',(listOfRoomsOfUser: any) => {
            setConvs([])
            listOfRoomsOfUser.listOfRoomsOfUser.map( (room: any) => setConvs(old => [{name:room, photo:'', last_msg:'welcome to group chat', id:listOfRoomsOfUser.indexes}, ...old]))
        })
        userData.chatSocket.on('rooms',(room: string) => {
            setConvs(old => [{name:room, photo:'', last_msg:'welcome to group chat', id:0}, ...old])
        })
    }, [userData.chatSocket, convs])

	const [chatBoxMessages, setChatBoxMessages] = useState<any>([
		{user:'lmao', msg:'yo'},
		{user:'self', msg:'hello'}
	])


	const [showForm, setShowForm] = useState(false)
	
	const [showConv, setShowConv] = useState(false)

	const [activeUserConv, setActiveUserConv] = useState<conversation | undefined>(undefined)
	return (
		<main className='select-none h-full w-full overflow-y-auto'>
			<Context.Provider value={{showConv, setShowConv, activeUserConv, setActiveUserConv, convs, setConvs, chatBoxMessages, setChatBoxMessages,
				showForm, setShowForm}}>
				<RoomForm />
				<div id='main' className="flex items-center gap-[3vh] flex-grow h-full overflow-y-auto bg-darken-200 ">
					<div className="flex flex-col items-center justify-center w-[100%] text-sm lg:text-base md:relative md:w-[calc(90%/2)] h-[90vh] text-center">
						<div className=' flex items-center justify-center w-[100%]'>
							<Image  alt='search' src='/images/loupe.svg' width={20} height={20}/>
							<Search users={convs} />
						</div>

						<UserList items={convs} />

						<div className='flex justify-between items-center w-[50%] h-[8%]'>
							<div className='border-blue-500 border-[6px] bg-blue-500 rounded-full h-10 w-10 flex items-center justify-center'>
								<Image className='cursor-pointer w-auto h-auto' alt='new channel' title='CreateChannel' src='/images/channel.svg' onClick={ () => {
								setShowForm(true);
								var temp = document.getElementById('main')
								temp ? temp.style.filter = 'blur(1.5rem)' : ''
								}} width={30} height={30}/>
							</div>
							<div className='border-blue-500 border-[6px] bg-blue-500 rounded-full h-10 w-10 flex items-center justify-center'>
								<Image title='JoinChannel' className='w-auto h-auto' alt='new channel' src='/images/channel.svg' width={30} height={30}/>
							</div>
							<div className='border-blue-500 border-[6px] bg-blue-500 rounded-full h-10 w-10 flex items-center justify-center'>
								<Image className='w-auto h-auto' alt='new channel' src='/images/groupe.svg' width={25} height={25}/>
							</div>
						</div>
								</div>
					<Conversation />
				</div>
		</Context.Provider>
		</main>
	)
}



