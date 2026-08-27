import React from "react";

const MonitorDash = () => {
    const devices = [
        {
            name: "ESP32 Rover",
            id: "esp32_10061c6759e4",
            status: "Online",
            firmware: "1.24.1",
            battery: "87%",
            location: "Lab",
        },
        {
            name: "ESP32 Sensor",
            id: "esp32_a82f91bc11",
            status: "Offline",
            firmware: "1.22.0",
            battery: "64%",
            location: "Workshop",
        },
        {
            name: "ESP32 Camera",
            id: "esp32_72ac91de42",
            status: "Online",
            firmware: "1.24.1",
            battery: "92%",
            location: "Lab",
        },
    ];

    return (
        <div className="h-full overflow-auto hide-scrollbar bg-[#09090b] text-zinc-100">
            {/* Header */}
            <header className="border-b border-white/10 bg-[#09090b]/90">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
                    <div>
                        <div className="mb-1 flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-orange-500" />
                            <span className="text-xs font-medium uppercase tracking-[0.2em] text-orange-400">
                                IoT Workspace
                            </span>
                        </div>

                        <h1 className="text-2xl font-semibold tracking-tight">
                            Device Overview
                        </h1>

                        <p className="mt-1 text-sm text-zinc-500">
                            Monitor and control your connected devices.
                        </p>
                    </div>

                    <button className="rounded-lg border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm font-medium text-orange-400 transition hover:bg-orange-500/20">
                        + Add device
                    </button>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-6 py-8">
                {/* Stats */}
                <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Stat
                        label="Total devices"
                        value="12"
                        description="Registered"
                    />

                    <Stat
                        label="Online"
                        value="9"
                        description="75% availability"
                        positive
                    />

                    <Stat
                        label="Commands"
                        value="284"
                        description="Today"
                    />

                    <Stat
                        label="Avg. latency"
                        value="42 ms"
                        description="Excellent"
                        positive
                    />
                </section>

                {/* Devices */}
                <section className="mt-8">
                    <div className="mb-4 flex items-end justify-between">
                        <div>
                            <h2 className="text-lg font-semibold">
                                Connected devices
                            </h2>

                            <p className="mt-1 text-sm text-zinc-500">
                                Your registered ESP32 devices.
                            </p>
                        </div>

                        <button className="text-sm text-zinc-500 transition hover:text-orange-400">
                            View all →
                        </button>
                    </div>

                    <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]">
                        {devices.map((device, index) => (
                            <Device
                                key={device.id}
                                device={device}
                                last={index === devices.length - 1}
                            />
                        ))}
                    </div>
                </section>

                {/* Bottom section */}
                <section className="mt-8 grid gap-4 lg:grid-cols-3">
                    {/* Activity */}
                    <div className="lg:col-span-2 rounded-xl border border-white/10 bg-white/[0.02]">
                        <div className="border-b border-white/10 px-5 py-4">
                            <h2 className="text-sm font-semibold">
                                Recent activity
                            </h2>
                        </div>

                        <div className="divide-y divide-white/5">
                            <Activity
                                title="ESP32 Rover connected"
                                detail="WebSocket connection established"
                                time="2 min ago"
                                type="online"
                            />

                            <Activity
                                title="Motor command executed"
                                detail="Forward · 320 RPM"
                                time="8 min ago"
                                type="command"
                            />

                            <Activity
                                title="ESP32 Sensor disconnected"
                                detail="Connection timeout"
                                time="24 min ago"
                                type="offline"
                            />

                            <Activity
                                title="Firmware information updated"
                                detail="ESP32 Rover · v1.24.1"
                                time="1 hour ago"
                                type="update"
                            />
                        </div>
                    </div>

                    {/* System */}
                    <div className="rounded-xl border border-white/10 bg-white/[0.02]">
                        <div className="border-b border-white/10 px-5 py-4">
                            <h2 className="text-sm font-semibold">
                                System status
                            </h2>
                        </div>

                        <div className="space-y-5 p-5">
                            <SystemItem
                                name="WebSocket"
                                status="Operational"
                            />

                            <SystemItem
                                name="Device Manager"
                                status="Operational"
                            />

                            <SystemItem
                                name="Database"
                                status="Operational"
                            />

                            <SystemItem
                                name="API"
                                status="Operational"
                            />
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

function Stat({ label, value, description, positive }) {
    return (
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 transition hover:border-white/15 hover:bg-white/[0.035]">
            <p className="text-xs font-medium text-zinc-500">
                {label}
            </p>

            <p className="mt-3 text-3xl font-semibold tracking-tight">
                {value}
            </p>

            <p
                className={`mt-2 text-xs ${
                    positive
                        ? "text-emerald-400"
                        : "text-zinc-600"
                }`}
            >
                {description}
            </p>
        </div>
    );
}

function Device({ device, last }) {
    const online = device.status === "Online";

    return (
        <div
            className={`group flex flex-col gap-4 px-5 py-5 transition hover:bg-white/[0.035] sm:flex-row sm:items-center sm:justify-between ${
                !last ? "border-b border-white/5" : ""
            }`}
        >
            <div className="flex items-center gap-4">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-white/10 bg-zinc-900 text-xs font-bold text-orange-400">
                    ESP
                </div>

                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="text-sm font-medium text-zinc-200">
                            {device.name}
                        </h3>

                        <span
                            className={`h-1.5 w-1.5 rounded-full ${
                                online
                                    ? "bg-emerald-400"
                                    : "bg-zinc-600"
                            }`}
                        />
                    </div>

                    <p className="mt-1 font-mono text-xs text-zinc-600">
                        {device.id}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-8 text-right">
                <div>
                    <p className="text-[10px] uppercase tracking-wide text-zinc-600">
                        Location
                    </p>
                    <p className="mt-1 text-xs text-zinc-400">
                        {device.location}
                    </p>
                </div>

                <div>
                    <p className="text-[10px] uppercase tracking-wide text-zinc-600">
                        Firmware
                    </p>
                    <p className="mt-1 text-xs text-zinc-400">
                        {device.firmware}
                    </p>
                </div>

                <div>
                    <p className="text-[10px] uppercase tracking-wide text-zinc-600">
                        Battery
                    </p>
                    <p className="mt-1 text-xs text-zinc-400">
                        {device.battery}
                    </p>
                </div>
            </div>
        </div>
    );
}

function Activity({ title, detail, time, type }) {
    const dot = {
        online: "bg-emerald-400",
        command: "bg-orange-400",
        offline: "bg-rose-400",
        update: "bg-blue-400",
    };

    return (
        <div className="flex items-center justify-between gap-4 px-5 py-4">
            <div className="flex items-start gap-3">
                <span
                    className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${dot[type]}`}
                />

                <div>
                    <p className="text-sm text-zinc-300">
                        {title}
                    </p>

                    <p className="mt-1 text-xs text-zinc-600">
                        {detail}
                    </p>
                </div>
            </div>

            <time className="shrink-0 text-xs text-zinc-600">
                {time}
            </time>
        </div>
    );
}

function SystemItem({ name, status }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-400">
                {name}
            </span>

            <span className="flex items-center gap-2 text-xs text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                {status}
            </span>
        </div>
    );
}

export default MonitorDash;