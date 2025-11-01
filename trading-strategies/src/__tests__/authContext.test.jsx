import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthProvider, useAuth } from "../context/AuthContext.jsx";

const TestHarness = () => {
	const { login, user } = useAuth();

	return (
		<div>
			<div data-testid="current-user">{user?.email ?? "none"}</div>
			<button
				type="button"
				onClick={() => login("investor@hnw.com", "demo123")}
			>
				login-success
			</button>
			<button
				type="button"
				onClick={() => login("wrong@example.com", "invalid")}
			>
				login-fail
			</button>
		</div>
	);
};

describe("AuthContext", () => {
	beforeEach(() => {
		localStorage.clear();
	});

	it("stores the logged in user and updates subscribers on success", async () => {
		render(
			<AuthProvider>
				<TestHarness />
			</AuthProvider>,
		);

		expect(screen.getByTestId("current-user")).toHaveTextContent("none");

		await userEvent.click(
			screen.getByRole("button", { name: "login-success" }),
		);

		expect(screen.getByTestId("current-user")).toHaveTextContent(
			"investor@hnw.com",
		);

		const storedUser = JSON.parse(localStorage.getItem("user"));
		expect(storedUser).toMatchObject({ email: "investor@hnw.com" });
	});

	it("keeps the user unchanged for invalid credentials", async () => {
		render(
			<AuthProvider>
				<TestHarness />
			</AuthProvider>,
		);

		await userEvent.click(screen.getByRole("button", { name: "login-fail" }));

		expect(screen.getByTestId("current-user")).toHaveTextContent("none");
		expect(localStorage.getItem("user")).toBeNull();
	});
});
