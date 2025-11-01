import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
	Navigate,
	Route,
	BrowserRouter as Router,
	Routes,
} from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";

const theme = createTheme({
	palette: {
		mode: "light",
		primary: {
			main: "#5b21b6",
			light: "#8b5cf6",
		},
		secondary: {
			main: "#ec4899",
		},
		background: {
			default: "#f4f6f8",
			paper: "#ffffff",
		},
	},
	typography: {
		fontFamily: "'Inter', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
	},
	shape: {
		borderRadius: 16,
	},
});

function App() {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<AuthProvider>
				<Router>
					<Routes>
						<Route path="/" element={<Login />} />
						<Route
							path="/dashboard"
							element={
								<ProtectedRoute>
									<Dashboard />
								</ProtectedRoute>
							}
						/>
						<Route path="*" element={<Navigate to="/" replace />} />
					</Routes>
				</Router>
			</AuthProvider>
		</ThemeProvider>
	);
}

export default App;
