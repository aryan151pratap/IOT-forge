import { useState } from "react";
import { loginUser, signupUser } from "../services/authService.js";
import { useNavigate  } from "react-router-dom";
import { useNotify } from "../components/Device-IDE/notify.jsx";

export default function AuthPage() {
	const [isLogin, setIsLogin] = useState(false);
	const navigate = useNavigate ();
	const [form, setForm] = useState({ name: "you", email: "you@gmail.com", password: "1234", confirmPassword: "1234" });
	const [loading, setLoading] = useState(false); 
	const [error, setError] = useState("");
	const notify = useNotify();

	const handleChange = (e) => { 
		setForm({ ...form, [e.target.name]: e.target.value, }); 
	};

	const handleSubmit = async (e) => { 
		e.preventDefault(); 
		setError(""); 
		setLoading(true); 
		try { 
			let data; 
			if (isLogin) { 
				data = await loginUser( form.email, form.password );
				notify({type: "status", message: `${data?.email} ${data?.message}`});
				navigate("/dashboard");
			} else {
				if (form.password !== form.confirmPassword) { 
					setError("Passwords do not match"); 
					return; 
				}
				navigate("/login");
				data = await signupUser( form.name, form.email, form.password ); 
			} 
			console.log("Server response:", data); 
		} catch (err) { 
			console.log(err);
			notify({type: "error", message: err.message});
		} finally { 
			setLoading(false); 
		} 
	};

	return (
		// scrollbar-thin scrollbar-track-zinc-900 scrollbar-thumb-zinc-700 hover:scrollbar-thumb-zinc-600
		<div className="w-full h-screen bg-black flex items-center justify-center px-4 overflow-auto thin-scrollbar scrollbar-thumb-zinc-700 hover:scrollbar-thumb-zinc-600">
			<div className="h-full w-full flex flex-col p-4 max-w-lg">
				{/* Logo / Brand */}
				<div className="text-center mb-8">
					<div className="inline-flex items-center justify-center w-fit px-4 h-12 rounded-xl bg-white text-black font-bold text-xl mb-4">
						ESP32 Manager
					</div>

					<h1 className="text-2xl font-semibold text-white">
						{isLogin ? "Welcome back" : "Create your account"}
					</h1>

					<p className="text-sm text-zinc-500 mt-2">
						{isLogin
						? "Sign in to continue to your account"
						: "Get started with your account today"}
					</p>
				</div>

				{/* Card */}
				<div className="bg-[#111113] flex flex-col border border-zinc-800 rounded-md shadow-2xl overflow-auto hover:scrollbar-thumb-zinc-700">
			
					<div className="px-6 mt-6">
						<button
							type="button"
							className="w-full p-3 rounded-lg border border-zinc-700 text-white text-sm font-medium bg-zinc-800 hover:bg-zinc-700 cursor-pointer transition"
						>
							Continue with Google
						</button>

						<div className="flex items-center gap-4 my-6">
							<div className="h-px bg-zinc-800 flex-1" />
							<span className="text-xs text-zinc-600">OR</span>
							<div className="h-px bg-zinc-800 flex-1" />
						</div>
					</div>

					<div className="h-full overflow-auto scrollbar-thin">
						<form onSubmit={handleSubmit} className="h-full px-6 flex flex-col gap-4">
							{!isLogin && (
							<div>
								<label className="block text-sm text-zinc-300 mb-2">
								Full name
								</label>

								<input
								type="text"
								name="name"
								placeholder="John Doe"
								className="w-full h-11 px-3 rounded-lg bg-[#18181b] border border-zinc-800 text-white placeholder:text-zinc-600 outline-none focus:border-zinc-500 transition"
								value={form.name}
								onChange={handleChange}
								/>
							</div>
							)}

							{/* Email */}
							<div>
								<label className="block text-sm text-zinc-300 mb-2">
									Email
								</label>

								<input
									type="email"
									name="email"
									placeholder="you@example.com"
									className="w-full h-11 px-3 rounded-lg bg-[#18181b] border border-zinc-800 text-white placeholder:text-zinc-600 outline-none focus:border-zinc-500 transition"
									value={form.email}
									onChange={handleChange}
								/>
							</div>

							{/* Password */}
							<div>
								<div className="flex justify-between items-center mb-2">
									<label className="text-sm text-zinc-300">
									Password
									</label>

									{isLogin && (
									<button
										type="button"
										className="text-xs text-zinc-500 hover:text-white transition"
									>
										Forgot password?
									</button>
									)}
								</div>

								<input
									type="password"
									name="password"
									placeholder="••••••••"
									className="w-full h-11 px-3 rounded-lg bg-[#18181b] border border-zinc-800 text-white placeholder:text-zinc-600 outline-none focus:border-zinc-500 transition"
									value={form.password}
									onChange={handleChange}
								/>
							</div>

							{/* Confirm password */}
							{!isLogin && (
								<div>
									<label className="block text-sm text-zinc-300 mb-2">
									Confirm password
									</label>

									<input
									type="password"
									name="confirmPassword"
									placeholder="••••••••"
									className="w-full h-11 px-3 rounded-lg bg-[#18181b] border border-zinc-800 text-white placeholder:text-zinc-600 outline-none focus:border-zinc-500 transition"
									value={form.confirmPassword}
									onChange={handleChange}
									/>
								</div>
							)}

							{/* Remember */}
							{isLogin && (
								<label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer">
									<input
									type="checkbox"
									name="remember"
									className="w-4 h-4 accent-white"
									/>
									Remember me
								</label>
							)}

							<button 
								type="submit" disabled={loading}
								className="p-3 w-full rounded-lg bg-white text-sm font-medium text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
							> 
								{loading ? "Please wait..." : isLogin ? "Sign in" : "Create account"} 
							</button>
						</form>
					</div>

					<div className="text-center mt-6 text-sm text-zinc-500 p-4">
						{isLogin
						? "Don't have an account?"
						: "Already have an account?"}{" "}
						<button
							type="button"
							onClick={() => {
								setIsLogin(!isLogin)
								setError("");
							}}
							className="text-white font-medium hover:underline"
						>
							{isLogin ? "Sign up" : "Sign in"}
						</button>
					</div>
				</div>

				<p className="text-center text-xs text-zinc-600 mt-6">
					By continuing, you agree to our Terms and Privacy Policy.
				</p>
			</div>
		</div>
	);
}