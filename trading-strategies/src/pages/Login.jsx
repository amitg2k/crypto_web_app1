import {
	CheckCircleOutline,
	TrendingUp,
	Visibility,
	VisibilityOff,
} from "@mui/icons-material";
import {
	Alert,
	Box,
	Button,
	Checkbox,
	FormControl,
	FormControlLabel,
	Grid,
	IconButton,
	InputAdornment,
	InputLabel,
	Link,
	OutlinedInput,
	Paper,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const featureHighlights = [
	{
		title: "Data-Driven Insights",
		description:
			"Real-time market analysis and predictive modeling across asset classes.",
	},
	{
		title: "Institutional Risk Controls",
		description:
			"Dynamic hedging and drawdown protection tailored for HNW investors.",
	},
	{
		title: "Exclusive Access",
		description:
			"Curated AI-powered strategies with transparent performance metrics.",
	},
];

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState("");
	const navigate = useNavigate();
	const { login } = useAuth();

	const handleSubmit = (event) => {
		event.preventDefault();
		setError("");

		const result = login(email, password);
		if (result.success) {
			navigate("/dashboard");
		} else {
			setError(result.error);
		}
	};

	return (
		<Box
			sx={{
				minHeight: "100vh",
				background:
					"linear-gradient(135deg, #0f172a 0%, #1e1b4b 45%, #111827 100%)",
			}}
		>
			<Grid
				container
				sx={{
					minHeight: "100vh",
					flexDirection: { xs: "column", md: "row" },
					flexWrap: { xs: "wrap", md: "nowrap" },
				}}
			>
				<Grid
					size={{ xs: 12, md: 6 }}
					sx={{
						display: { xs: "none", md: "flex" },
						position: "relative",
						flexGrow: 1,
						backgroundImage:
							"linear-gradient(120deg, rgba(76,29,149,0.85), rgba(219,39,119,0.65)), url('https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1600&q=80')",
						backgroundSize: "cover",
						backgroundPosition: "center",
						color: "#fff",
					}}
				>
					<Box
						sx={{
							position: "relative",
							zIndex: 1,
							p: { md: 8 },
							display: "flex",
							flexDirection: "column",
							justifyContent: "center",
							gap: 4,
						}}
					>
						<Box sx={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
							<Box
								sx={{
									width: 64,
									height: 64,
									borderRadius: 3,
									background: "rgba(255,255,255,0.15)",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									boxShadow: "0 18px 40px rgba(15,23,42,0.35)",
								}}
							>
								<TrendingUp sx={{ fontSize: 36, color: "#f9fafb" }} />
							</Box>
							<Box>
								<Typography
									variant="h5"
									fontWeight={600}
									sx={{ letterSpacing: 1 }}
								>
									AI Trading Strategies
								</Typography>
								<Typography
									variant="body2"
									sx={{ color: "rgba(226,232,240,0.9)" }}
								>
									Built for High Net Worth Investors
								</Typography>
							</Box>
						</Box>

						<Box>
							<Typography
								variant="h3"
								component="h1"
								fontWeight={700}
								sx={{ mb: 2, lineHeight: 1.2 }}
							>
								Discover & invest in AI-powered alpha
							</Typography>
							<Typography
								variant="body1"
								sx={{ color: "rgba(226,232,240,0.9)", maxWidth: 420 }}
							>
								Gain early access to institutional-grade quantitative strategies
								engineered to protect and compound wealth in any market regime.
							</Typography>
						</Box>

						<Stack spacing={3} sx={{ maxWidth: 420 }}>
							{featureHighlights.map((feature) => (
								<Stack
									key={feature.title}
									direction="row"
									spacing={2}
									alignItems="flex-start"
								>
									<Box
										sx={{
											width: 36,
											height: 36,
											borderRadius: 2,
											backgroundColor: "rgba(255,255,255,0.12)",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
										}}
									>
										<CheckCircleOutline sx={{ color: "#c4b5fd" }} />
									</Box>
									<Box>
										<Typography
											variant="subtitle1"
											fontWeight={600}
											gutterBottom
										>
											{feature.title}
										</Typography>
										<Typography
											variant="body2"
											sx={{ color: "rgba(226,232,240,0.85)" }}
										>
											{feature.description}
										</Typography>
									</Box>
								</Stack>
							))}
						</Stack>
					</Box>
				</Grid>

				<Grid
					size={{ xs: 12, md: 6 }}
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						py: { xs: 6, md: 0 },
						px: { xs: 3, sm: 6, md: 10 },
						flexGrow: 1,
					}}
				>
					<Box sx={{ width: "100%", maxWidth: 420 }}>
						<Box
							sx={{
								display: { xs: "flex", md: "none" },
								alignItems: "center",
								gap: 2,
								color: "rgba(255,255,255,0.9)",
								mb: 5,
							}}
						>
							<Box
								sx={{
									width: 54,
									height: 54,
									borderRadius: 3,
									background: "rgba(255,255,255,0.18)",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
								}}
							>
								<TrendingUp sx={{ fontSize: 30 }} />
							</Box>
							<Box>
								<Typography variant="h6" fontWeight={600}>
									AI Trading Strategies
								</Typography>
								<Typography
									variant="caption"
									sx={{ color: "rgba(226,232,240,0.75)" }}
								>
									For High Net Worth Investors
								</Typography>
							</Box>
						</Box>

						<Paper
							elevation={12}
							sx={{
								p: { xs: 3, sm: 4 },
								borderRadius: 4,
								backgroundColor: "rgba(255,255,255,0.96)",
								backdropFilter: "blur(18px)",
								boxShadow: "0 32px 64px rgba(15,23,42,0.18)",
							}}
						>
							<Stack spacing={3}>
								<Box>
									<Typography
										variant="h4"
										component="h2"
										fontWeight={700}
										gutterBottom
									>
										Welcome back
									</Typography>
									<Typography variant="body2" color="text.secondary">
										Sign in with your investor credentials to access your
										personalised dashboard.
									</Typography>
								</Box>

								{error && (
									<Alert
										severity="error"
										variant="outlined"
										sx={{ borderRadius: 2 }}
									>
										{error}
									</Alert>
								)}

								<Box component="form" onSubmit={handleSubmit} noValidate>
									<Stack spacing={3}>
										<TextField
											label="Email Address"
											type="email"
											value={email}
											onChange={(event) => setEmail(event.target.value)}
											placeholder="investor@hnw.com"
											fullWidth
											required
										/>

										<FormControl variant="outlined" fullWidth required>
											<InputLabel htmlFor="password-field">Password</InputLabel>
											<OutlinedInput
												id="password-field"
												type={showPassword ? "text" : "password"}
												value={password}
												onChange={(event) => setPassword(event.target.value)}
												placeholder="Enter your password"
												endAdornment={
													<InputAdornment position="end">
														<IconButton
															onClick={() => setShowPassword((prev) => !prev)}
															edge="end"
															aria-label={
																showPassword ? "Hide password" : "Show password"
															}
														>
															{showPassword ? (
																<VisibilityOff />
															) : (
																<Visibility />
															)}
														</IconButton>
													</InputAdornment>
												}
												label="Password"
											/>
										</FormControl>

										<Stack
											direction="row"
											alignItems="center"
											justifyContent="space-between"
										>
											<FormControlLabel
												control={<Checkbox />}
												label="Remember me"
											/>
											<Link href="#" underline="hover" variant="body2">
												Forgot password?
											</Link>
										</Stack>

										<Button
											type="submit"
											variant="contained"
											size="large"
											fullWidth
										>
											Sign In to Dashboard
										</Button>
									</Stack>
								</Box>

								<Box textAlign="center">
									<Typography variant="body2" color="text.secondary">
										Don&apos;t have an account?{" "}
										<Link href="#" underline="hover">
											Contact our investment team
										</Link>
									</Typography>
								</Box>
							</Stack>
						</Paper>

						<Typography
							variant="caption"
							color="rgba(255,255,255,0.6)"
							sx={{ display: "block", textAlign: "center", mt: 4 }}
						>
							© 2025 AI Trading Strategies. All rights reserved.
						</Typography>
					</Box>
				</Grid>
			</Grid>
		</Box>
	);
};

export default Login;
