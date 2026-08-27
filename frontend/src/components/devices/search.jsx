import { FaTimes } from "react-icons/fa";

const DeviceSearch = ({ value, onChange }) => {
	return (
		<div className="relative p-2 max-w-sm">
			<svg className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
				<circle cx="11" cy="11" r="7" />
				<path strokeLinecap="round" d="M21 21l-4.3-4.3" />
			</svg>
			<input
				type="text"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder="Search by name or device ID"
				className="w-full border-b-2 border-zinc-800 focus:border-orange-500 bg-zinc-900/60 hover:border-orange-500 py-2.5 pl-9 pr-9 text-sm text-zinc-200 placeholder-zinc-600 outline-none transition-colors"
			/>
			{value && (
				<button
					onClick={() => onChange("")}
					aria-label="Clear search"
					className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 cursor-pointer"
				>
					<FaTimes/>
				</button>
			)}
		</div>
	);
};

export default DeviceSearch;