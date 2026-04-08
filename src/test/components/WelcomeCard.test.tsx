import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({
    user: { id: "test-user", email: "test@example.com" },
    profile: { name: "Test User", avatar_url: null },
    loading: false,
  }),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "fr", changeLanguage: vi.fn() },
  }),
}));

vi.mock("react-router-dom", () => ({
  useNavigate: () => vi.fn(),
  Link: ({ children, to }: any) => <a href={to}>{children}</a>,
}));

describe("WelcomeCard", () => {
  it("should render without crashing", async () => {
    const { WelcomeCard } = await import("@/components/home/WelcomeCard");
    const { container } = render(<WelcomeCard />);
    expect(container).toBeTruthy();
  });
});
