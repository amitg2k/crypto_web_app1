import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { AuthProvider } from "../context/AuthContext.jsx";
import Login from "../pages/Login.jsx";

const navigateMock = vi.fn();

vi.mock("react-router-dom", async () => {
	const actual = await vi.importActual("react-router-dom");
	return {
		...actual,
		useNavigate: () => navigateMock,
	};
});

describe("Login page", () => {
	beforeEach(() => {
		navigateMock.mockReset();
		localStorage.clear();
	});

	const renderLogin = () =>
		render(
			<AuthProvider>
				<Login />
			</AuthProvider>,
		);

	it("navigates to dashboard when valid credentials are provided", async () => {
		renderLogin();

		const emailField = screen.getByLabelText(/email address/i);
		const passwordField = screen.getByLabelText(/password/i, {
			selector: "input",
		});
		const submitButton = screen.getByRole("button", {
			name: /sign in to dashboard/i,
		});

		await userEvent.type(emailField, "investor@hnw.com");
		await userEvent.type(passwordField, "demo123");
		await userEvent.click(submitButton);

		expect(navigateMock).toHaveBeenCalledWith("/dashboard");
	});

	it("shows an error for invalid credentials", async () => {
		renderLogin();

		const emailField = screen.getByLabelText(/email address/i);
		const passwordField = screen.getByLabelText(/password/i, {
			selector: "input",
		});
		const submitButton = screen.getByRole("button", {
			name: /sign in to dashboard/i,
		});

		await userEvent.type(emailField, "wrong@example.com");
		await userEvent.type(passwordField, "badpass");
		await userEvent.click(submitButton);

		expect(
			await screen.findByText(/invalid email or password/i),
		).toBeInTheDocument();
		expect(navigateMock).not.toHaveBeenCalled();
	});
});
