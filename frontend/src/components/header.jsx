import { CiMenuBurger, CiMicrochip } from "react-icons/ci";

const Header = function({setShowSideBar}){
	return(
		<div className="w-full bg-black flex border-b border-zinc-800">

			<button
				onClick={() => setShowSideBar(e => !e)}
				className="h-full p-3 text-zinc-500 border-r border-zinc-800 transition hover:bg-zinc-800 hover:text-white cursor-pointer"
				title="Open Explorer"
			>
				<CiMenuBurger size={17} />
			</button>
			<div className="px-4 w-full flex flex-row items-center justify-between">
				<div className="flex h-10 items-center ">
					<div className="flex h-7 w-7 items-center justify-center rounded-md bg-orange-400 font-bold text-black">
						<CiMicrochip className="h-5 w-5"/>
					</div>

					<span className="ml-3 font-semibold text-white">
						ESP Control
					</span>
				</div>
				<div className="text-white text-lg font-bold">IoT Dashboard</div>
				<div className="flex items-center gap-4">
					<button className="text-white">Profile</button>
					<button className="text-white">Logout</button>
				</div>
			</div>
			<div className=""></div>
		</div>
	)
}

export default Header;