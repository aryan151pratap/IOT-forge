import { useEffect, useState } from "react";
import { VscArrowLeft, VscArrowRight } from "react-icons/vsc";
import { get_user_details } from "../../services/authService";
import { AddedDevice } from "../../services/iotService";
import { Link } from "react-router-dom";
import image from "../../../public/esp32.png";
const Profile = () => {
    const [user, setUser] = useState(null);
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentOption, setCurrentOption] = useState("devices");

    const option = [
        { name: "devices", color: "purple" },
        { name: "online", color: "green" },
        { name: "offline", color: "red" },
        { name: "live", color: "orange" }
    ];

    useEffect(() => {
        const loadProfile = async () => {
            setLoading(true);

            try {
                const [userData, deviceData] = await Promise.all([
                    get_user_details(),
                    AddedDevice()
                ]);

                if (userData) {
                    setUser(userData.user);
                }
                console.log(deviceData);
                setDevices(deviceData || []);

            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, []);

    const filteredDevices = devices.filter((device) => {
        if (currentOption === "devices") return true;
        return device.status === currentOption;
    });

    return (
        <div className="fixed h-full w-full inset-0 bg-zinc-900/50 text-white flex items-center justify-center p-4 font-inter">
            <div className="md:w-[600px] sm:w-[500px] w-full bg-black flex flex-col items-center border border-zinc-800 overflow-auto hide-scrollbar">
                <div className="w-full flex flex-row gap-2 p-2">
                    <div className="p-2 bg-zinc-500/20 hover:bg-purple-500/80 cursor-pointer"
						onClick={() => window.history.back()}
					>
                        <VscArrowLeft />
                    </div>

                    <span className="text-sm px-2 p-1.5 capitalize text-black bg-white">
                        profile
                    </span>
                </div>

                <div className="w-full p-2 border-t border-zinc-800">
                    <div className="h-full flex flex-row gap-2">

                        <div className="shrink-0 h-40 w-40 border border-zinc-800 flex items-center justify-center bg-orange-500/60 cursor-not-allowed text-xs">
                            <span className="capitalize text-lg font-semibold">
                                {user?.name?.[0]?.toUpperCase()}
                            </span>
                        </div>

                        <div className="w-full h-full flex flex-col gap-4 text-sm text-zinc-300">
                            {user ? (
                                <div className="flex flex-col gap-3">
                                    <div className="flex flex-col gap-1 capitalize">
                                        <span>name</span>
                                        <span className="px-2 p-1 text-sm border border-zinc-500/40">
                                            {user.name}
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="capitalize">email</span>
                                        <span className="px-2 p-1 text-sm border border-zinc-500/40">
                                            {user.email}
                                        </span>
                                    </div>

                                </div>
                            ) : (
                                <div />
                            )}

                            <div className="flex flex-row justify-between text-xs">
                                <button className="px-2 p-1 bg-zinc-500/30 hover:bg-purple-500/70 capitalize">
                                    logout
                                </button>

                                <button className="px-2 p-1 bg-zinc-500/30 hover:bg-red-600/60 capitalize">
                                    delete
                                </button>
                            </div>

                        </div>
                    </div>
                </div>

                <div className="text-sm w-full border-t border-zinc-800 p-2">
                    <div className="border border-zinc-800">

                        <div className="border-b border-zinc-800 flex flex-row">

                            {option.map((item) => (
                                <div
                                    key={item.name}
                                    className={`
                                        w-fit px-2 p-1 border-r border-zinc-800 cursor-pointer
                                        ${
                                            currentOption === item.name
                                                ? "bg-purple-500/60"
                                                : "hover:bg-white hover:text-black"
                                        }
                                    `}
                                    onClick={() => setCurrentOption(item.name)}
                                >
                                    <span className="md:text-sm text-xs capitalize">
                                        {item.name}
                                    </span>
                                </div>
                            ))}

                        </div>

                        <div className="min-h-40 max-h-60 overflow-auto hide-scrollbar p-2 text-sm text-zinc-400">
                            {loading ? (
                                <Load />
                            ) : filteredDevices.length > 0 ? (
                                <div className="flex flex-col gap-1 rounded-md">
                                    {filteredDevices.map((device) => (
                                        <div
                                            key={device.id}
                                            className="bg-zinc-500/10 flex flex-col gap-2 border border-zinc-900"
                                        >
                                            <div className="w-fit flex items-center p-1 text-white capitalize">
                                                <span className="bg-purple-500/60 px-2 p-1">{device.name}</span>
                                            </div>
                                            <div className="text-xs px-2 truncate flex flex-row gap-4 justify-center">
                                                <div className="flex flex-col">
                                                    <div className="flex flex-col text-zinc-500">
                                                        <span className="text-zinc-300">{device.platform}</span>
                                                        <span className="text-[11px] mb-1 text-zinc-500 hover:text-white/60">
                                                            [{device.device_id}]
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-row gap-2 text-zinc-500 capitalize">
                                                        <span>location:</span>
                                                        <span className="text-zinc-400 capitalize">{device.location}</span>
                                                    </div>
                                                    <div className="flex flex-row gap-2 text-zinc-500 capitalize">
                                                        <span>firmware:</span>
                                                        <span className="text-zinc-400 capitalize">{device?.firmware}</span>
                                                    </div>
                                                    <div className="flex flex-row gap-2 text-zinc-500 capitalize">
                                                        <span>mac_address:</span>
                                                        <span className="text-zinc-400 capitalize">{device?.mac_address}</span>
                                                    </div>
                                                    <div className="flex flex-row gap-2 text-zinc-500 capitalize">
                                                        <span>Date:</span>
                                                        <span className="text-zinc-400 capitalize">{device?.created_at.split("T")[0]}</span>
                                                    </div>
                                                    <div className="flex flex-row gap-2 text-zinc-500 capitalize">
                                                        <span>Time:</span>
                                                        <span className="text-zinc-400 capitalize">{device?.created_at.split("T")[1]}</span>
                                                    </div>
                                                    <div className="flex flex-row gap-2 text-zinc-500 capitalize">
                                                        <span>status:</span>
                                                        <span className="text-zinc-400 capitalize">{device?.status}</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <img src={image} alt="Device" className="w-full h-[140px] object-cover rounded-md" />
                                                </div>
                                            </div>
                                            <div className="ml-auto p-1 text-xs">
                                                {device.status === "online" ? (
                                                    <div className="bg-green-500/60 text-white p-1 px-2">
                                                        online
                                                    </div>
                                                ) : (
                                                    <div className="bg-red-500/60 text-white p-1 px-2">
                                                        offline
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
									
                                </div>
                            ) : (
                                <div className="h-36 flex items-center justify-center">
                                    <span>
                                        No {currentOption === "devices"
                                            ? "available devices"
                                            : `${currentOption} devices`}
                                    </span>
                                </div>
                            )}
                        </div>
						<div className="h-full flex mt-auto text-white p-2 text-xs">
							<Link to={"/devices"} className="px-2 p-1 bg-purple-500/60 hover:bg-purple-500/70 ml-auto flex flex-row gap-2 items-center">
								<span>Details</span>
								<VscArrowRight/>
							</Link>
						</div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Profile;

const Load = () => {
    return (
        <div className="h-36 flex justify-center items-center gap-2 text-white">
            <div className="relative w-6 h-6 flex items-center rounded-full border border-zinc-800">
                <div className="absolute inset-0 rounded-full border border-t-transparent animate-spin" />
            </div>

            <span className="capitalize">
                loading...
            </span>
        </div>
    );
};