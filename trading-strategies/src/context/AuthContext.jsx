import { createContext, useContext, useEffect, useState } from "react";
import usersData from "../data/users.json";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Check if user is already logged in (from localStorage)
		const storedUser = localStorage.getItem("user");
		if (storedUser) {
			setUser(JSON.parse(storedUser));
		}
		setLoading(false);
	}, []);

	const login = (email, password) => {
		const foundUser = usersData.users.find(
			(u) => u.email === email && u.password === password,
		);

		if (foundUser) {
			const { password: _password, ...userWithoutPassword } = foundUser;
			setUser(userWithoutPassword);
			localStorage.setItem("user", JSON.stringify(userWithoutPassword));
			return { success: true };
		}
		return { success: false, error: "Invalid email or password" };
	};

	const logout = () => {
		setUser(null);
		localStorage.removeItem("user");
	};

	return (
		<AuthContext.Provider value={{ user, login, logout, loading }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
