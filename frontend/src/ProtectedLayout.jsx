import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "./components/header.jsx";
import SideBar from "./pages/SideBar.jsx";
import { useAuth } from "./AuthContext.jsx";
import { userData } from "./services/user.js";

export default function ProtectedLayout() {
    const [showSideBar, setShowSideBar] = useState(true);
	const [user, setUser] = useState();
	const data = useAuth();
	useEffect(() => {
		if(!data.user) return;
		const getData = async function(){
			try{
				const res = await userData(data.user.user_id);
				setUser(res);
			} catch (err) {
				console.log(err);
			}
		}
		getData();
	}, [data])

    return (
        <div className="flex h-screen w-full flex-col overflow-hidden bg-[#09090b]">
            <div className="shrink-0">
                <Header setShowSideBar={setShowSideBar} />
            </div>

            <div className="flex min-h-0 min-w-0 flex-1 overflow-hidden">
                {showSideBar && (
                    <aside className="h-full shrink-0 overflow-hidden">
                        <SideBar user={user}/>
                    </aside>
                )}

                <main className="min-h-0 min-w-0 flex-1 overflow-hidden">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}