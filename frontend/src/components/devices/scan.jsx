const ScanningCard = ({ scanning = true, onRescan }) => {
	return (
		<div className="h-fit flex flex-col items-center justify-center gap-4 bg-zinc-900/40 p-10 text-center">
			<div className="relative flex h-20 w-20 items-center justify-center">
				{scanning && (
					<>
						<span className="absolute h-20 w-20 animate-ping rounded-full bg-cyan-500/15"></span>
						<span className="absolute h-14 w-14 animate-ping rounded-full bg-cyan-500/25 [animation-delay:0.3s]"></span>
					</>
				)}
				<span className="relative flex h-10 w-10 items-center justify-center rounded-full border border-cyan-500/40 bg-cyan-500/10">
					<svg className="h-5 w-5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
						<circle cx="12" cy="19" r="1.4" fill="currentColor" stroke="none" />
						<path strokeLinecap="round" d="M8.8 15.8a4.5 4.5 0 0 1 6.4 0M5.8 12.8a8.7 8.7 0 0 1 12.4 0M2.8 9.8a12.9 12.9 0 0 1 18.4 0" />
					</svg>
				</span>
			</div>

			<div>
				<p className="text-sm font-medium text-zinc-100">
					{scanning ? "Scanning for devices…" : "No devices found nearby"}
				</p>
				<p className="mt-1 text-xs text-zinc-500">Make sure your device is powered on and connected to the network</p>
			</div>

			<button
				onClick={onRescan}
				disabled={scanning}
				className="rounded-lg border border-zinc-700 bg-zinc-800/60 px-4 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-zinc-800 disabled:opacity-40"
			>
				{scanning ? "Scanning…" : "Scan again"}
			</button>
		</div>
	);
};

export default ScanningCard;