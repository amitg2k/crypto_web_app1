import {
	Event,
	Insights,
	Logout,
	Search,
	Shield,
	ShowChart,
	TrendingUp,
	ArrowForward,
	CheckCircle,
} from "@mui/icons-material";
import {
	Alert,
	Box,
	Button,
	Chip,
	Collapse,
	Container,
	Grid,
	IconButton,
	InputAdornment,
	Paper,
	Slider,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
	Tooltip,
	Typography,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	LinearProgress,
	Stepper,
	Step,
	StepLabel,
	CircularProgress,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import neuralNetworksData from "../data/neuralNetworks.json";
import strategiesDataOriginal from "../data/strategies.json";

const sliderMarks = [
	{ value: 0, label: "0%" },
	{ value: 25, label: "25%" },
	{ value: 50, label: "50%" },
	{ value: 75, label: "75%" },
	{ value: 100, label: "100%" },
];

const metricCardStyles = {
	borderRadius: 3,
	border: "1px solid",
	borderColor: "divider",
	p: 3,
	background:
		"linear-gradient(135deg, rgba(93, 63, 211, 0.08) 0%, rgba(117, 196, 255, 0.12) 100%)",
};

const formatNumber = (value) => {
	if (Number.isNaN(value) || value === undefined || value === null) {
		return "0";
	}
	return value.toLocaleString();
};

const Dashboard = () => {
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedStrategy, setSelectedStrategy] = useState(null);
	const [searchError, setSearchError] = useState("");
	const [editableParams, setEditableParams] = useState([]);
	const [saveSuccess, setSaveSuccess] = useState(false);
	const [strategiesData, setStrategiesData] = useState(strategiesDataOriginal);
	const [optimizationIterations, setOptimizationIterations] = useState(10);

	// Neural Network state
	const [selectedNetwork, setSelectedNetwork] = useState("");
	const [isProcessing, setIsProcessing] = useState(false);
	const [currentStep, setCurrentStep] = useState(0);
	const [executionCount, setExecutionCount] = useState(0);

	useEffect(() => {
		const savedStrategies = localStorage.getItem("strategiesData");
		if (savedStrategies) {
			try {
				setStrategiesData(JSON.parse(savedStrategies));
			} catch (error) {
				console.error("Error parsing saved strategies:", error);
			}
		}
	}, []);

	const totalCombinations = useMemo(() => {
		if (!editableParams.length) {
			return 0;
		}
		return editableParams.reduce((total, param) => {
			const steps = Math.max(param.totalSteps || 0, 0);
			return total * steps;
		}, 1);
	}, [editableParams]);

	const totalOptimizationRuns = useMemo(() => {
		if (!totalCombinations) {
			return 0;
		}
		return Math.max(
			Math.round(totalCombinations * (optimizationIterations / 100)),
			0,
		);
	}, [totalCombinations, optimizationIterations]);

	const combinationBreakdown = useMemo(() => {
		if (!editableParams.length) {
			return "—";
		}
		return editableParams
			.map((param) => Math.max(param.totalSteps || 0, 0))
			.join(" × ");
	}, [editableParams]);

	const handleLogout = () => {
		logout();
		navigate("/");
	};

	const handleLoadStrategy = () => {
		setSearchError("");
		setSaveSuccess(false);

		if (!searchQuery.trim()) {
			setSearchError("Please enter a strategy name");
			return;
		}

		const strategy = strategiesData.strategies.find(
			(candidate) => candidate.name.toLowerCase() === searchQuery.toLowerCase(),
		);

		console.log("Searched Strategy:", searchQuery, "Found:", strategy);

		if (strategy) {
			const normalizedParams = (strategy.parameterGrid || []).map((param) => {
				const startValue = Math.max(
					0,
					Math.round(Number(param.startValue) || 0),
				);
				const endValue = Math.max(0, Math.round(Number(param.endValue) || 0));
				const increment = Math.max(1, Math.round(Number(param.increment) || 1));
				const totalSteps =
					increment > 0 && endValue >= startValue
						? Math.floor((endValue - startValue) / increment) + 1
						: 0;

				return {
					...param,
					parameterName: param.parameterName ?? param.parameter ?? "Parameter",
					optimizedTarget: param.optimizedTarget ?? "",
					notes: param.notes ?? "",
					startValue,
					endValue,
					increment,
					totalSteps,
				};
			});

			setSelectedStrategy(strategy);
			setEditableParams(normalizedParams);
			setOptimizationIterations(10);
		} else {
			setSelectedStrategy(null);
			setEditableParams([]);
			setSearchError("Strategy not found. Please try a different name.");
		}
	};

	const handleKeyPress = (event) => {
		if (event.key === "Enter") {
			handleLoadStrategy();
		}
	};

	const handleParamChange = (index, field, value) => {
		const updatedParams = [...editableParams];
		const parsedValue = Number.parseFloat(value);
		let sanitizedValue = Number.isNaN(parsedValue) ? 0 : parsedValue;

		if (["startValue", "endValue", "increment"].includes(field)) {
			sanitizedValue = Math.round(sanitizedValue);
			if (field === "increment") {
				sanitizedValue = Math.max(1, sanitizedValue);
			} else {
				sanitizedValue = Math.max(0, sanitizedValue);
			}
		}

		updatedParams[index][field] = sanitizedValue;

		if (["startValue", "endValue", "increment"].includes(field)) {
			const start = updatedParams[index].startValue;
			const end = updatedParams[index].endValue;
			const increment = updatedParams[index].increment;

			if (increment > 0 && end >= start) {
				updatedParams[index].totalSteps =
					Math.floor((end - start) / increment) + 1;
			} else {
				updatedParams[index].totalSteps = 0;
			}
		}

		setEditableParams(updatedParams);
	};

	const handleSaveParameters = () => {
		if (!selectedStrategy) {
			return;
		}

		const updatedStrategiesData = JSON.parse(JSON.stringify(strategiesData));
		const strategyIndex = updatedStrategiesData.strategies.findIndex(
			(strategy) => strategy.id === selectedStrategy.id,
		);

		if (strategyIndex !== -1) {
			updatedStrategiesData.strategies[strategyIndex].parameterGrid =
				editableParams;
			localStorage.setItem(
				"strategiesData",
				JSON.stringify(updatedStrategiesData),
			);
			setStrategiesData(updatedStrategiesData);
			setSelectedStrategy({
				...selectedStrategy,
				parameterGrid: editableParams,
			});
			setSaveSuccess(true);
			setTimeout(() => setSaveSuccess(false), 2800);
		}
	};

	const handleSliderChange = (_event, value) => {
		if (typeof value === "number") {
			setOptimizationIterations(value);
		}
	};

	const handleStartProcess = async () => {
		if (!selectedNetwork) return;

		setIsProcessing(true);
		setCurrentStep(0);
		setExecutionCount(0);

		// Step 1: Retrieving data (5 seconds)
		setCurrentStep(1);
		await new Promise((resolve) => setTimeout(resolve, 5000));

		// Step 2: Executing Strategies (10 sec, then repeat once after 5 sec)
		setCurrentStep(2);
		await new Promise((resolve) => setTimeout(resolve, 10000));
		setExecutionCount(1);
		await new Promise((resolve) => setTimeout(resolve, 5000));
		setExecutionCount(2);

		// Step 3: Building Neural Network (15-20 mins, simulated as 20 seconds for demo)
		setCurrentStep(3);
		await new Promise((resolve) => setTimeout(resolve, 20000));

		// Step 4: Finalising Shortlisted strategies
		setCurrentStep(4);
		await new Promise((resolve) => setTimeout(resolve, 3000));

		// Step 5: Complete
		setCurrentStep(5);
		await new Promise((resolve) => setTimeout(resolve, 2000));

		setIsProcessing(false);
	};

	return (
		<Box
			sx={{
				minHeight: "100vh",
				background: "linear-gradient(135deg, #f5f7ff 0%, #eef1f8 100%)",
				py: { xs: 4, md: 6 },
			}}
		>
			<Container maxWidth="xl">
				<Paper
					elevation={0}
					sx={{
						display: "flex",
						flexDirection: { xs: "column", md: "row" },
						alignItems: { xs: "flex-start", md: "center" },
						justifyContent: "space-between",
						gap: 3,
						p: { xs: 3, md: 4 },
						borderRadius: 3,
						border: "1px solid",
						borderColor: "divider",
						mb: 4,
					}}
				>
					<Stack direction="row" spacing={2} alignItems="center">
						<Box
							sx={{
								width: 52,
								height: 52,
								borderRadius: 2,
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
								color: "common.white",
							}}
						>
							<ShowChart fontSize="medium" />
						</Box>
						<Box>
							<Typography variant="h6" fontWeight={700} color="text.primary">
								AI Trading Strategies
							</Typography>
							<Typography variant="body2" color="text.secondary">
								Discover &amp; invest in AI-powered trading for HNW investors
							</Typography>
						</Box>
					</Stack>

					<Stack direction="row" spacing={3} alignItems="center">
						<Box textAlign="right">
							<Typography variant="body1" fontWeight={600} color="text.primary">
								{user?.name}
							</Typography>
							<Typography variant="body2" color="text.secondary">
								{user?.accountType} Account
							</Typography>
						</Box>
						<Tooltip title="Sign out">
							<IconButton
								onClick={handleLogout}
								color="primary"
								sx={{
									border: "1px solid",
									borderColor: "divider",
									borderRadius: 2,
									width: 48,
									height: 48,
								}}
							>
								<Logout />
							</IconButton>
						</Tooltip>
					</Stack>
				</Paper>

				<Paper
					elevation={0}
					sx={{
						p: { xs: 3, md: 4 },
						mb: 4,
						borderRadius: 3,
						border: "1px solid",
						borderColor: "divider",
					}}
				>
					<Stack spacing={3} alignItems="center" textAlign="center">
						<Box>
							<Typography
								variant="h4"
								fontWeight={700}
								color="text.primary"
								gutterBottom
							>
								Explore Institutional-Grade Strategies
							</Typography>
							<Typography
								variant="body1"
								color="text.secondary"
								maxWidth={640}
								mx="auto"
							>
								Search and evaluate proprietary AI strategies with transparent
								performance, risk, and optimization controls.
							</Typography>
						</Box>

						<Stack
							direction={{ xs: "column", sm: "row" }}
							spacing={2}
							alignItems={{ xs: "stretch", sm: "center" }}
							sx={{ width: "100%", maxWidth: 720 }}
						>
							<TextField
								fullWidth
								size="medium"
								label="Search strategies"
								placeholder="e.g. Momentum Alpha, Mean Reversion Pro"
								value={searchQuery}
								onChange={(event) => setSearchQuery(event.target.value)}
								onKeyPress={handleKeyPress}
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<Search color="action" />
										</InputAdornment>
									),
								}}
							/>
							<Button
								onClick={handleLoadStrategy}
								variant="contained"
								size="large"
								sx={{
									px: 4,
									minWidth: 180,
									fontWeight: 600,
									background:
										"linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
									"&:hover": {
										background:
											"linear-gradient(135deg, #5b0eb4 0%, #1e63d2 100%)",
									},
									height: { xs: "auto", sm: 56 },
								}}
							>
								Load Strategy
							</Button>
						</Stack>

						<Collapse
							in={Boolean(searchError)}
							sx={{ width: "100%", maxWidth: 720 }}
						>
							<Alert severity="error">{searchError}</Alert>
						</Collapse>
					</Stack>
				</Paper>

				{selectedStrategy ? (
					<Paper
						elevation={0}
						sx={{
							borderRadius: 3,
							border: "1px solid",
							borderColor: "divider",
							overflow: "hidden",
							mb: 4,
						}}
					>
						<Box
							sx={{
								background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
								color: "common.white",
								p: { xs: 3, md: 4 },
							}}
						>
							<Grid container spacing={3} alignItems="center">
								<Grid size={{ xs: 12, md: 8 }}>
									<Stack spacing={1.5}>
										<Typography variant="h4" fontWeight={700}>
											{selectedStrategy.name}
										</Typography>
										<Stack
											direction={{ xs: "column", sm: "row" }}
											spacing={1.5}
										>
											<Chip
												icon={<Insights sx={{ color: "inherit !important" }} />}
												label={selectedStrategy.strategyType}
												sx={{
													bgcolor: "rgba(255,255,255,0.18)",
													color: "common.white",
												}}
											/>
											<Chip
												icon={<Shield sx={{ color: "inherit !important" }} />}
												label={`Risk: ${selectedStrategy.riskLevel}`}
												sx={{
													bgcolor: "rgba(255,255,255,0.18)",
													color: "common.white",
												}}
											/>
											<Chip
												icon={<Event sx={{ color: "inherit !important" }} />}
												label={`Added ${new Date(
													selectedStrategy.dateAdded,
												).toLocaleDateString("en-US", {
													month: "short",
													day: "numeric",
													year: "numeric",
												})}`}
												sx={{
													bgcolor: "rgba(255,255,255,0.18)",
													color: "common.white",
												}}
											/>
										</Stack>
									</Stack>
								</Grid>
								<Box sx={{ flexGrow: 1 }} />
								<Stack
									spacing={1}
									alignItems={{ xs: "flex-start", md: "flex-end" }}
									sx={{ width: "100%", maxWidth: 320 }}
								>
									<Typography variant="subtitle2" sx={{ opacity: 0.85 }}>
										Net Performance (Annualized)
									</Typography>
									<Typography variant="h3" fontWeight={700}>
										{selectedStrategy.performance}
									</Typography>
									<Chip
										icon={<TrendingUp />}
										label="Monitored Daily"
										sx={{
											bgcolor: "rgba(255,255,255,0.18)",
											color: "common.white",
										}}
									/>
								</Stack>
							</Grid>
						</Box>

						<Box
							sx={{
								p: { xs: 3, md: 4 },
								display: "flex",
								flexDirection: "column",
								gap: 4,
							}}
						>
							<Grid container spacing={3}>
								<Grid size={{ xs: 12, md: 4 }}>
									<Paper elevation={0} sx={metricCardStyles}>
										<Stack direction="row" spacing={2} alignItems="center">
											<Box
												sx={{
													width: 44,
													height: 44,
													borderRadius: 2,
													backgroundColor: "rgba(58, 132, 255, 0.12)",
													color: "primary.main",
													display: "flex",
													alignItems: "center",
													justifyContent: "center",
												}}
											>
												<Insights />
											</Box>
											<Box>
												<Typography variant="subtitle2" color="text.secondary">
													Strategy Type
												</Typography>
												<Typography variant="h6" fontWeight={700}>
													{selectedStrategy.strategyType}
												</Typography>
											</Box>
										</Stack>
									</Paper>
								</Grid>
								<Grid size={{ xs: 12, md: 4 }}>
									<Paper elevation={0} sx={metricCardStyles}>
										<Stack direction="row" spacing={2} alignItems="center">
											<Box
												sx={{
													width: 44,
													height: 44,
													borderRadius: 2,
													backgroundColor: "rgba(46, 203, 112, 0.12)",
													color: "success.main",
													display: "flex",
													alignItems: "center",
													justifyContent: "center",
												}}
											>
												<TrendingUp />
											</Box>
											<Box>
												<Typography variant="subtitle2" color="text.secondary">
													Current Return
												</Typography>
												<Typography variant="h6" fontWeight={700}>
													{selectedStrategy.performance}
												</Typography>
											</Box>
										</Stack>
									</Paper>
								</Grid>
								<Grid size={{ xs: 12, md: 4 }}>
									<Paper elevation={0} sx={metricCardStyles}>
										<Stack direction="row" spacing={2} alignItems="center">
											<Box
												sx={{
													width: 44,
													height: 44,
													borderRadius: 2,
													backgroundColor: "rgba(255, 193, 43, 0.12)",
													color: "warning.main",
													display: "flex",
													alignItems: "center",
													justifyContent: "center",
												}}
											>
												<Shield />
											</Box>
											<Box>
												<Typography variant="subtitle2" color="text.secondary">
													Risk Classification
												</Typography>
												<Typography variant="h6" fontWeight={700}>
													{selectedStrategy.riskLevel}
												</Typography>
											</Box>
										</Stack>
									</Paper>
								</Grid>
							</Grid>

							<Box>
								<Typography variant="h6" fontWeight={700} gutterBottom>
									Strategy Overview
								</Typography>
								<Typography
									variant="body1"
									color="text.secondary"
									sx={{ maxWidth: 900 }}
								>
									{selectedStrategy.details}
								</Typography>
							</Box>

							{editableParams.length > 0 && (
								<Stack spacing={3}>
									<Stack
										direction={{ xs: "column", md: "row" }}
										justifyContent="space-between"
										alignItems={{ xs: "flex-start", md: "center" }}
										gap={2}
									>
										<Typography variant="h6" fontWeight={700}>
											Parameter Grid
										</Typography>
										<Stack
											direction={{ xs: "column", sm: "row" }}
											spacing={2}
											alignItems={{ xs: "stretch", sm: "center" }}
										>
											<Button
												variant="contained"
												size="large"
												onClick={handleSaveParameters}
												sx={{
													background:
														"linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
													"&:hover": {
														background:
															"linear-gradient(135deg, #5b0eb4 0%, #1e63d2 100%)",
													},
												}}
											>
												Save Parameters
											</Button>
											<Collapse in={saveSuccess} orientation="horizontal">
												<Alert
													severity="success"
													variant="outlined"
													sx={{ py: 0.5 }}
												>
													Saved to your workspace
												</Alert>
											</Collapse>
										</Stack>
									</Stack>

									<TableContainer
										component={Paper}
										elevation={0}
										sx={{
											borderRadius: 3,
											border: "1px solid",
											borderColor: "divider",
											p: { xs: 2, md: 3 },
										}}
									>
										<Table size="small">
											<TableHead>
												<TableRow>
													<TableCell sx={{ fontWeight: 700 }}>
														Parameter
													</TableCell>
													<TableCell align="right" sx={{ fontWeight: 700 }}>
														Start
													</TableCell>
													<TableCell align="right" sx={{ fontWeight: 700 }}>
														End
													</TableCell>
													<TableCell align="right" sx={{ fontWeight: 700 }}>
														Increment
													</TableCell>
													<TableCell align="right" sx={{ fontWeight: 700 }}>
														Total Steps
													</TableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												{editableParams.map((param, index) => (
													<TableRow
														key={
															param.parameterName ?? param.parameter ?? index
														}
														hover
													>
														<TableCell>
															<Typography fontWeight={600}>
																{param.parameterName ?? param.parameter}
															</Typography>
															{param.notes ? (
																<Typography
																	variant="caption"
																	color="text.secondary"
																>
																	{param.notes}
																</Typography>
															) : null}
														</TableCell>
														<TableCell align="right" sx={{ width: 140 }}>
															<TextField
																type="number"
																size="small"
																value={param.startValue}
																onChange={(event) =>
																	handleParamChange(
																		index,
																		"startValue",
																		event.target.value,
																	)
																}
																inputProps={{ step: 1, min: 0 }}
															/>
														</TableCell>
														<TableCell align="right" sx={{ width: 140 }}>
															<TextField
																type="number"
																size="small"
																value={param.endValue}
																onChange={(event) =>
																	handleParamChange(
																		index,
																		"endValue",
																		event.target.value,
																	)
																}
																inputProps={{ step: 1, min: 0 }}
															/>
														</TableCell>
														<TableCell align="right" sx={{ width: 140 }}>
															<TextField
																type="number"
																size="small"
																value={param.increment}
																onChange={(event) =>
																	handleParamChange(
																		index,
																		"increment",
																		event.target.value,
																	)
																}
																inputProps={{ step: 1, min: 1 }}
															/>
														</TableCell>
														<TableCell align="right" sx={{ width: 140 }}>
															<Typography fontWeight={700}>
																{param.totalSteps}
															</Typography>
														</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									</TableContainer>

									<Paper
										elevation={0}
										sx={{
											borderRadius: 3,
											border: "1px solid",
											borderColor: "divider",
											p: { xs: 3, md: 4 },
											background:
												"linear-gradient(135deg, rgba(106,17,203,0.08) 0%, rgba(37,117,252,0.12) 100%)",
										}}
									>
										<Stack
											direction={{ xs: "column", lg: "row" }}
											spacing={{ xs: 3, lg: 4 }}
											alignItems={{ xs: "stretch", lg: "flex-start" }}
										>
											<Stack spacing={1.5} sx={{ flex: 1 }}>
												<Typography variant="subtitle2" color="text.secondary">
													Total Parameter Combinations
												</Typography>
												<Typography variant="h3" fontWeight={700}>
													{formatNumber(totalCombinations)}
												</Typography>
												<Typography variant="body2" color="text.secondary">
													Steps per parameter: {combinationBreakdown}
												</Typography>
											</Stack>
											<Stack spacing={2} sx={{ flex: 1, minWidth: 0 }}>
												<Box sx={{ flexGrow: 1 }} />
												<Box display="flex" alignItems="center">
													<Typography
														variant="subtitle2"
														color="text.secondary"
													>
														Optimization Coverage
													</Typography>
													<Box sx={{ flexGrow: 1 }} />
													<Typography
														variant="body2"
														fontWeight={600}
														sx={{ ml: 2 }}
													>
														{optimizationIterations}%
													</Typography>
												</Box>

												<Slider
													value={optimizationIterations}
													onChange={handleSliderChange}
													step={5}
													marks={sliderMarks}
													min={0}
													max={100}
													valueLabelDisplay="auto"
												/>
											</Stack>
											<Stack
												spacing={1}
												alignItems={{ xs: "flex-start", lg: "flex-end" }}
												sx={{
													flex: 1,
													minWidth: { lg: 240 },
													textAlign: { xs: "left", lg: "right" },
												}}
											>
												<Typography variant="subtitle2" color="text.secondary">
													Estimated Optimization Runs
												</Typography>
												<Typography variant="h3" fontWeight={700}>
													{formatNumber(totalOptimizationRuns)}
												</Typography>
												<Typography variant="body2" color="text.secondary">
													combinations × optimization percentage
												</Typography>
											</Stack>
										</Stack>
									</Paper>
								</Stack>
							)}
						</Box>
					</Paper>
				) : (
					<Paper
						elevation={0}
						sx={{
							borderRadius: 3,
							border: "1px solid",
							borderColor: "divider",
							p: { xs: 4, md: 6 },
							textAlign: "center",
						}}
					>
						<Stack spacing={3} alignItems="center">
							<Box
								sx={{
									width: 88,
									height: 88,
									borderRadius: "50%",
									background:
										"linear-gradient(135deg, rgba(106,17,203,0.12) 0%, rgba(37,117,252,0.18) 100%)",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									color: "primary.main",
								}}
							>
								<ShowChart sx={{ fontSize: 40 }} />
							</Box>
							<Typography variant="h5" fontWeight={700}>
								Search for a Strategy to Begin
							</Typography>
							<Typography variant="body1" color="text.secondary" maxWidth={520}>
								Utilize the smart search above to load institutional-grade
								trading strategies, review their parameter controls, and tailor
								optimizations before allocation.
							</Typography>
						</Stack>
					</Paper>
				)}

				{/* Neural Network Training Section */}
				<Paper
					elevation={0}
					sx={{
						borderRadius: 3,
						border: "1px solid",
						borderColor: "divider",
						p: { xs: 3, md: 4 },
						mt: 4,
					}}
				>
					<Typography variant="h5" fontWeight={700} gutterBottom>
						Neural Network Training
					</Typography>
					<Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
						Select a neural network model and start the training process
					</Typography>

					<Stack spacing={3}>
						<FormControl fullWidth>
							<InputLabel>Select Neural Network</InputLabel>
							<Select
								value={selectedNetwork}
								onChange={(e) => setSelectedNetwork(e.target.value)}
								label="Select Neural Network"
								disabled={isProcessing}
							>
								{neuralNetworksData.map((network) => (
									<MenuItem key={network.model} value={network.model}>
										{network.model} ({network.parameters} parameters)
									</MenuItem>
								))}
							</Select>
						</FormControl>

						<Button
							variant="contained"
							size="large"
							onClick={handleStartProcess}
							disabled={!selectedNetwork || isProcessing}
							sx={{
								py: 1.5,
								background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
								"&:hover": {
									background:
										"linear-gradient(135deg, #5b0eb4 0%, #1e63d2 100%)",
								},
								"&:disabled": {
									background: "#ccc",
								},
							}}
						>
							{isProcessing ? "Processing..." : "Start Training"}
						</Button>

						{isProcessing && (
							<Paper
								elevation={0}
								sx={{
									p: 3,
									borderRadius: 2,
									border: "1px solid",
									borderColor: "divider",
									background:
										"linear-gradient(135deg, rgba(106,17,203,0.05) 0%, rgba(37,117,252,0.08) 100%)",
								}}
							>
								<Stepper activeStep={currentStep - 1} orientation="vertical">
									<Step>
										<StepLabel>
											<Stack direction="row" spacing={2} alignItems="center">
												<Typography>Retrieving data</Typography>
												{currentStep === 1 && <CircularProgress size={20} />}
												{currentStep > 1 && <CheckCircle color="success" />}
											</Stack>
										</StepLabel>
									</Step>

									<Step>
										<StepLabel>
											<Stack spacing={1}>
												<Stack direction="row" spacing={2} alignItems="center">
													<Typography>Executing Strategies</Typography>
													{currentStep === 2 && <CircularProgress size={20} />}
													{currentStep > 2 && <CheckCircle color="success" />}
												</Stack>
												{currentStep >= 2 && (
													<Typography variant="caption" color="text.secondary">
														Execution count: {executionCount}/2
													</Typography>
												)}
											</Stack>
										</StepLabel>
									</Step>

									<Step>
										<StepLabel>
											<Stack direction="row" spacing={2} alignItems="center">
												<Typography>Building Neural Network</Typography>
												{currentStep === 3 && <CircularProgress size={20} />}
												{currentStep > 3 && <CheckCircle color="success" />}
											</Stack>
											{currentStep === 3 && (
												<Box sx={{ mt: 1 }}>
													<LinearProgress />
													<Typography
														variant="caption"
														color="text.secondary"
														sx={{ mt: 0.5 }}
													>
														Training in progress... (This may take 15-20
														minutes)
													</Typography>
												</Box>
											)}
										</StepLabel>
									</Step>

									<Step>
										<StepLabel>
											<Stack direction="row" spacing={2} alignItems="center">
												<Typography>
													Finalising Shortlisted Strategies
												</Typography>
												{currentStep === 4 && <CircularProgress size={20} />}
												{currentStep > 4 && <CheckCircle color="success" />}
											</Stack>
										</StepLabel>
									</Step>

									<Step>
										<StepLabel>
											<Stack direction="row" spacing={2} alignItems="center">
												<Typography fontWeight={700} color="success.main">
													Complete
												</Typography>
												{currentStep === 5 && <CheckCircle color="success" />}
											</Stack>
										</StepLabel>
									</Step>
								</Stepper>

								{currentStep >= 2 && currentStep <= 3 && (
									<Box
										sx={{
											mt: 3,
											p: 2,
											borderRadius: 2,
											background: "rgba(37, 117, 252, 0.1)",
											border: "1px dashed",
											borderColor: "primary.main",
										}}
									>
										<Stack
											direction="row"
											spacing={2}
											alignItems="center"
											justifyContent="center"
										>
											<Typography variant="body2" fontWeight={600}>
												Executing Strategies
											</Typography>
											<ArrowForward color="primary" />
											<Typography variant="body2" fontWeight={600}>
												Building Neural Network
											</Typography>
											<ArrowForward
												color="primary"
												sx={{ transform: "rotate(180deg)" }}
											/>
										</Stack>
										<Typography
											variant="caption"
											color="text.secondary"
											sx={{ display: "block", textAlign: "center", mt: 1 }}
										>
											Iterative process: Data flows between strategy execution
											and neural network training
										</Typography>
									</Box>
								)}
							</Paper>
						)}
					</Stack>
				</Paper>
			</Container>
		</Box>
	);
};

export default Dashboard;
