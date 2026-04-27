import { render, screen } from "@testing-library/react";
import { DiagramEditorErrorBoundary } from "../../../src/diagram-editor/error-pages/DiagramEditorErrorBoundary";
import { describe, expect, it } from "vitest";

const ThrowError = ({ message = "Test error" }: { message?: string }) => {
  throw new Error(message);
};

const SafeComponent = () => <div>Safe Content</div>;

describe("DiagramEditorErrorBoundary", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders children when no error occurs", () => {
    render(
      <DiagramEditorErrorBoundary>
        <SafeComponent />
      </DiagramEditorErrorBoundary>,
    );

    expect(screen.getByText("Safe Content")).toBeInTheDocument();
  });

  it("renders fallback UI when child throws", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <DiagramEditorErrorBoundary title="Error Title" message="Error Message">
        <ThrowError />
      </DiagramEditorErrorBoundary>,
    );

    expect(screen.getByText("Error Title")).toBeInTheDocument();
    expect(screen.getByText("Error Message")).toBeInTheDocument();
    expect(screen.getByText("Test error")).toBeInTheDocument();

    spy.mockRestore();
  });

  it("uses default fallback values when props not provided", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <DiagramEditorErrorBoundary>
        <ThrowError />
      </DiagramEditorErrorBoundary>,
    );

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();

    expect(screen.getByText("An unexpected error occurred")).toBeInTheDocument();

    spy.mockRestore();
  });

  it("shows error message in snippet", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <DiagramEditorErrorBoundary>
        <ThrowError message="Custom crash message" />
      </DiagramEditorErrorBoundary>,
    );

    expect(screen.getByText("Custom crash message")).toBeInTheDocument();

    spy.mockRestore();
  });

  it("resets error boundary when children change", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    const { rerender } = render(
      <DiagramEditorErrorBoundary>
        <ThrowError />
      </DiagramEditorErrorBoundary>,
    );

    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();

    rerender(
      <DiagramEditorErrorBoundary>
        <SafeComponent />
      </DiagramEditorErrorBoundary>,
    );

    expect(screen.getByText("Safe Content")).toBeInTheDocument();

    spy.mockRestore();
  });
});
