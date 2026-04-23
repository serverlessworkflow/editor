/*
 * Copyright 2021-Present The Serverless Workflow Specification Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { render, type RenderOptions } from "@testing-library/react";
import { I18nProvider } from "@serverlessworkflow/i18n";
import {
  DiagramEditorContext,
  type DiagramEditorContextType,
} from "../../src/store/DiagramEditorContext";
import { en } from "../../src/i18n/locales/en";

const noop = () => {};

/**
 * Creates a mock DiagramEditorContext value with defaults.
 * Allows partial overrides for specific test scenarios.
 */
export const createMockContextValue = (
  overrides?: Partial<DiagramEditorContextType>,
): DiagramEditorContextType => ({
  isReadOnly: true,
  locale: "en",
  model: null,
  errors: [],
  updateIsReadOnly: noop,
  updateLocale: noop,
  ...overrides,
});

/**
 * Render function that wraps components with providers.
 * Includes DiagramEditorContext and I18nProvider with default English translations.
 * Example usage:
 * renderWithProviders(<MyComponent />, {
 *   errors: [new Error("Test error")],
 *   isReadOnly: false
 * });
 */
export const renderWithProviders = (
  ui: React.ReactElement,
  contextValue?: Partial<DiagramEditorContextType>,
  renderOptions?: Omit<RenderOptions, "wrapper">,
) => {
  const mockContext = createMockContextValue(contextValue);

  return render(
    <DiagramEditorContext.Provider value={mockContext}>
      <I18nProvider locale={mockContext.locale} dictionaries={{ en }}>
        {ui}
      </I18nProvider>
    </DiagramEditorContext.Provider>,
    renderOptions,
  );
};
