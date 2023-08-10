'use client'

import { useRouter } from "next/navigation";
import { UniversalData, userDataContext } from "./layout";
import { useContext, useEffect, useState } from "react";

import { MatchHistory, GameStats } from "./components/MatchesNStats";
import { Missions, Achievements } from "./components/MissionsNAchievements";
import ProfileInfo from "./components/ProfileInfo";
import FriendsCarouselBar from "./components/friendsCarouselBar";
import axios from "axios";
import NotFound from "../not-found";

export default function Profile(props) {
	const [completed, setCompleted] = useState(false);
	const [err, setErr] = useState(false);
	const router = useRouter();
	const loggedUser = useContext(userDataContext)
	const [userData, setUserData] = useState<UniversalData>(loggedUser);

	useEffect(() => {
		if (loggedUser.nickname !== props.params.nickname) {
			axios.get('http://127.0.0.1:3000/users/profile', {
				params: {
					nickname: props.params.nickname
				},
				withCredentials: true
			})
			.then(res => {
				setUserData(res.data);
			})
			.catch((err) => setErr(true))
			.finally(() => setCompleted(true));
		}
		else 
			setCompleted(true);
	}, [])
	return (
		<main className='h-full w-full bg-darken-200 overflow-y-auto'>
			<div className="flex flex-col items-center gap-[2vh] flex-grow h-full overflow-y-auto relative">
				{
					completed && !err ?
					<>
						<ProfileInfo data={userData}/>
						{
							loggedUser.nickname === props.params.nickname && <FriendsCarouselBar />
						}
						<div className=" playerGameInfo grid grid-cols-1 gap-5 mb-10 w-[90%]">
							<MatchHistory />
							<GameStats />
							<Missions />
							<Achievements />
						</div>
					</> : <NotFound nickname={loggedUser.nickname}/>
				}
			</div>
		</main>
	);
}