import { Link } from "react-router-dom";

const FailedRoute = () => {
	return (
		<div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center px-6">
			<div className="text-center">
				<p className="text-sm font-medium text-red-400 mb-3">
					404 — Route Not Found
				</p>

				<h1 className="text-6xl font-bold tracking-tight text-white">
					Oops!
				</h1>

				<p className="mt-4 text-zinc-400 max-w-md">
					The page you're looking for doesn't exist or the route
					may have been changed.
				</p>

				<div className="mt-8 flex justify-center gap-3">
					<Link
						to="/"
						className="rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-zinc-950 transition hover:bg-zinc-200"
					>
						Go Home
					</Link>

					<button
						onClick={() => window.history.back()}
						className="rounded-lg border border-zinc-700 px-5 py-2.5 text-sm font-medium text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
					>
						Go Back
					</button>
				</div>
			</div>
		</div>
	);
};

export default FailedRoute;