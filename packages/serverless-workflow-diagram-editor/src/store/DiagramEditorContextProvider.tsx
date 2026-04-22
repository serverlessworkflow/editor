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

import * as React from "react";
import { parseWorkflow } from "../core";
import { DiagramEditorProps } from "../diagram-editor/DiagramEditor";
import { DiagramEditorContext, DiagramEditorContextType } from "./DiagramEditorContext";

export type ContextProviderProps = Omit<DiagramEditorProps, "ref">;

export const DiagramEditorContextProvider = (
  props: React.PropsWithChildren<ContextProviderProps>,
) => {
  // Initialize states with props values
  const [isReadOnly, setIsReadOnly] = React.useState<boolean>(props.isReadOnly);
  const [locale, setLocale] = React.useState<string>(props.locale);

  const { model, errors } = React.useMemo(() => parseWorkflow(props.content), [props.content]);

  const updateIsReadOnly = React.useCallback((isReadOnly: boolean) => {
    setIsReadOnly(isReadOnly);
  }, []);

  const updateLocale = React.useCallback((locale: string) => {
    setLocale(locale);
  }, []);

  // Update states on props changes
  React.useEffect(() => {
    updateIsReadOnly(props.isReadOnly);
    updateLocale(props.locale);
  }, [props.isReadOnly, props.locale, updateIsReadOnly, updateLocale]);

  // Memoize context value to prevent unnecessary re-renders of consumers
  const context = React.useMemo<DiagramEditorContextType>(
    () => ({
      isReadOnly,
      locale,
      model,
      errors,
      updateIsReadOnly,
      updateLocale,
    }),
    [isReadOnly, locale, model, errors, updateIsReadOnly, updateLocale],
  );

  return (
    <DiagramEditorContext.Provider value={context}>{props.children}</DiagramEditorContext.Provider>
  );
};
