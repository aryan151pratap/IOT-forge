import { useEffect, useState } from "react";
import { AddedDevice } from "../../services/iotService";
import { connect_iot_Device_to_agent, disconnect_iot_Device_from_agent } from "../../hooks/agentHandle";

const ConnectDevice = ({ details }) => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connectedDevice, setConnectedDevice] = useState(details?.current_device ?? null);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await AddedDevice();
        if (active && data) setDevices(data);
      } catch (err) {
        if (active) setError("Failed to load devices.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    setConnectedDevice(details?.current_device ?? null);
  }, [details?.current_device]);

  const connectDevice = async (device) => {
    setError(null);
    setBusyId(device.device_id);
    try {
      if (await connect_iot_Device_to_agent(device.device_id)) {
        setConnectedDevice(device.device_id);
      }
    } catch (err) {
      setError("Couldn't connect device.");
    } finally {
      setBusyId(null);
    }
  };

  const disconnectDevice = async () => {
    setError(null);
    setBusyId(connectedDevice);
    try {
      if (await disconnect_iot_Device_from_agent()) {
        setConnectedDevice(null);
      }
    } catch (err) {
      setError("Couldn't disconnect.");
    } finally {
      setBusyId(null);
    }
  };

  const activeDeviceObj = devices.find((d) => d.device_id === connectedDevice);

  return (
    <div className="fixed z-50 top-20 right-10 w-80 rounded-2xl border border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl shadow-2xl shadow-black/50 text-xs text-zinc-300 overflow-hidden">
      {/* Header Bar */}
      <div className="px-4 py-3 bg-zinc-900/40 border-b border-zinc-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            {connectedDevice && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />}
            <span className={`relative inline-flex rounded-full h-2 w-2 ${connectedDevice ? "bg-emerald-500" : "bg-zinc-600"}`} />
          </span>
          <span className="font-semibold text-zinc-100">Agent Device Controller</span>
        </div>
        <span className="text-[10px] text-zinc-500 font-mono">{devices.length} Online</span>
      </div>

      {/* Active Device Highlight Card */}
      {connectedDevice && (
        <div className="m-3 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider block">Active Target</span>
            <p className="text-xs font-semibold text-zinc-100 truncate">{activeDeviceObj?.name || connectedDevice}</p>
          </div>
          <button
            onClick={disconnectDevice}
            disabled={busyId === connectedDevice}
            className="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[11px] font-medium transition disabled:opacity-50"
          >
            {busyId === connectedDevice ? "..." : "Disconnect"}
          </button>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="mx-3 mt-2 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-zinc-500 hover:text-zinc-300">×</button>
        </div>
      )}

      {/* Device List */}
      <div className="p-3 space-y-2 max-h-60 overflow-y-auto">
        {loading && <p className="py-6 text-center text-zinc-500 animate-pulse">Scanning IoT mesh...</p>}
        {!loading && devices.length === 0 && <p className="py-6 text-center text-zinc-500">No IoT devices registered</p>}

        {!loading && devices.map((d) => {
          const isConnected = connectedDevice === d.device_id;
          const isOnline = d.status === "online";
          const isBusy = busyId === d.device_id;

          return (
            <div
              key={d.id || d.device_id}
              className={`p-2.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                isConnected
                  ? "border-emerald-500/40 bg-emerald-500/5 shadow-sm"
                  : "border-zinc-800/80 bg-zinc-900/40 hover:bg-zinc-900/90 hover:border-zinc-700/80"
              }`}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? "bg-emerald-400" : "bg-zinc-600"}`} />
                  <p className="font-medium text-zinc-200 truncate">{d.name}</p>
                </div>
                <p className="text-[10px] text-zinc-500 font-mono truncate mt-0.5">{d.device_id}</p>
              </div>

              {isConnected ? (
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Linked
                </span>
              ) : (
                <button
                  disabled={!isOnline || isBusy}
                  onClick={() => connectDevice(d)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-medium transition ${
                    isOnline
                      ? "bg-zinc-100 hover:bg-white text-zinc-900 shadow-sm"
                      : "bg-zinc-800/80 text-zinc-600 cursor-not-allowed"
                  }`}
                >
                  {isBusy ? "Linking..." : isOnline ? "Pair" : "Offline"}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 bg-zinc-900/40 border-t border-zinc-800/60 text-[10px] text-zinc-500 text-center">
        Commands automatically stream to the active device.
      </div>
    </div>
  );
};

export default ConnectDevice;