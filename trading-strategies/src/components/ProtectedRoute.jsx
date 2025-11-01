import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
	const { user, loading } = useAuth();

	if (loading) {
		return (
			<Box
				sx={{
					minHeight: "100vh",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					background:
						"linear-gradient(135deg, #0f172a 0%, #312e81 60%, #111827 100%)",
				}}
			>
				<Stack spacing={2} alignItems="center">
					<CircularProgress color="primary" size={56} thickness={4} />
					<Typography variant="body1" color="common.white">
						Loading your personalized dashboard…
					</Typography>
				</Stack>
			</Box>
		);
	}

	if (!user) {
		return <Navigate to="/" replace />;
	}

	return children;
};

export default ProtectedRoute;
