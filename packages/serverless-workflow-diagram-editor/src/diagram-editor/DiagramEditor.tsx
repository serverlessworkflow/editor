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
import { Diagram, DiagramRef } from "../react-flow/diagram/Diagram";
import { DiagramEditorContextProvider } from "../store/DiagramEditorContextProvider";
import { I18nProvider, detectLocale } from "@serverlessworkflow/i18n";
import { dictionaries } from "../i18n/locales";
import { useDiagramEditorContext } from "../store/DiagramEditorContext";
import { ParsingErrorPage } from "./error-pages/ParsingErrorPage";
/**
 * DiagramEditor component API
 */
export type DiagramEditorRef = {
  doSomething: () => void; // TODO: to be implemented, it is just a placeholder
};

export type DiagramEditorProps = {
  content: string;
  isReadOnly: boolean;
  locale: string;
  ref?: React.Ref<DiagramEditorRef>;
};

const DiagramEditorContent = ({
  diagramRef,
  diagramDivRef,
}: {
  diagramRef: React.RefObject<DiagramRef | null>;
  diagramDivRef: React.RefObject<HTMLDivElement | null>;
}) => {
  const { model } = useDiagramEditorContext();
  return model === null ? (
    <ParsingErrorPage />
  ) : (
    <Diagram ref={diagramRef} divRef={diagramDivRef} />
  );
};

export const DiagramEditor = (props: DiagramEditorProps) => {
  // TODO: ErrorBoundary / fallback

  // Refs
  const diagramDivRef = React.useRef<HTMLDivElement | null>(null);
  const diagramRef = React.useRef<DiagramRef | null>(null);

  const locale = React.useMemo(() => {
    const supportedLocales = Object.keys(dictionaries);
    return props.locale ?? detectLocale(supportedLocales);
  }, [props.locale]);

  // Allow imperatively controlling the Editor
  React.useImperativeHandle(
    props.ref,
    () => ({
      doSomething: () => {
        // TODO: to be implemented, it is just a placeholder
      },
    }),
    [],
  );

  return (
    <>
      <DiagramEditorContextProvider
        content={props.content}
        isReadOnly={props.isReadOnly}
        locale={locale}
      >
        <I18nProvider locale={locale} dictionaries={dictionaries}>
          <DiagramEditorContent diagramRef={diagramRef} diagramDivRef={diagramDivRef} />
        </I18nProvider>
      </DiagramEditorContextProvider>
    </>
  );
};
