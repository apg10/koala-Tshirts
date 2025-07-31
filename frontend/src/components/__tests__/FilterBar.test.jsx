// src/components/__tests__/FilterBar.test.jsx
import { render, screen, fireEvent } from "@testing-library/react";
import FilterBar from "../FilterBar";

describe("FilterBar component", () => {
  let mockOnFilter;

  beforeEach(() => {
    mockOnFilter = jest.fn();
  });

  test("renders the category dropdown with expected options", () => {
    render(<FilterBar onFilter={mockOnFilter} />);
    const select = screen.getByRole("combobox");
    expect(select).toHaveValue("All");
    expect(screen.getByRole("option", { name: /All Categories/i })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /T-Shirts/i })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /Hoodies/i })).toBeInTheDocument();
  });

  test("calls onFilter with correct values when selection and input change", () => {
    render(<FilterBar onFilter={mockOnFilter} />);
    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "Hoodies" } });
    expect(mockOnFilter).toHaveBeenCalledWith({ category: "Hoodies", term: "" });

    const input = screen.getByPlaceholderText("Search products...");
    fireEvent.change(input, { target: { value: "koala" } });
    expect(mockOnFilter).toHaveBeenCalledWith({ category: "Hoodies", term: "koala" });
  });
});
