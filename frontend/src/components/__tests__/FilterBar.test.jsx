// src/components/__tests__/FilterBar.test.jsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import FilterBar from "../FilterBar";

describe("FilterBar component", () => {
  let mockOnFilter;
  const defaultFilter = {
    category: "All",
    term: "",
    priceRange: "all",
    size: "all",
    color: "all",
    sort: "default",
  };

  beforeEach(() => {
    mockOnFilter = jest.fn();
  });

  test("renders the category dropdown with expected options", () => {
    render(<FilterBar filter={defaultFilter} onFilter={mockOnFilter} />);
    const [select] = screen.getAllByRole("combobox");
    expect(select).toHaveValue("All");
    expect(screen.getByRole("option", { name: /All Categories/i })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /T-Shirts/i })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /Hoodies/i })).toBeInTheDocument();
  });

  test("calls onFilter with correct values when selection and input change", () => {
    render(<FilterBar filter={defaultFilter} onFilter={mockOnFilter} />);
    const [select] = screen.getAllByRole("combobox");
    fireEvent.change(select, { target: { value: "Hoodies" } });
    expect(mockOnFilter).toHaveBeenCalledWith({
      category: "Hoodies",
      term: "",
      priceRange: "all",
      size: "all",
      color: "all",
      sort: "default",
    });

    const input = screen.getByPlaceholderText("Search products...");
    fireEvent.change(input, { target: { value: "koala" } });
    expect(mockOnFilter).toHaveBeenCalledWith({
      category: "Hoodies",
      term: "koala",
      priceRange: "all",
      size: "all",
      color: "all",
      sort: "default",
    });
  });
});
