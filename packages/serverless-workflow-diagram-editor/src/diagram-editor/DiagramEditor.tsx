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

import { CSSProperties } from "react";
import {
  swdEditorDictionaries,
  SwdEditorI18nContext,
  swdEditorI18nDefaults,
  useSwdEditorI18n,
} from "../i18n";
import { I18nDictionariesProvider } from "@serverlessworkflow/i18n/dist/react-components";
import * as React from "react";
import { Diagram, DiagramRef } from "../react-flow/diagram/Diagram";

/**
 * DiagramEditor component API
 */
export type DiagramEditorRef = {
  doSomething: () => void; // TODO: to be implemented, it is just a placeholder
};

export type DiagramEditorProps = {
  isReadOnly: boolean;
  locale: string;
};

export const DiagramEditor = (props: DiagramEditorProps) => {
  return (
    <I18nDictionariesProvider
      defaults={swdEditorI18nDefaults}
      dictionaries={swdEditorDictionaries}
      initialLocale={props.locale}
      ctx={SwdEditorI18nContext}
    >
      <DiagramEditorInner {...props} />
    </I18nDictionariesProvider>
  );
};

export const DiagramEditorInner = (props: DiagramEditorProps) => {
  // TODO: i18n
  // TODO: store, context
  // TODO: ErrorBoundary / fallback

  // Refs
  const diagramDivRef = React.useRef<HTMLDivElement | null>(null);
  const diagramRef = React.useRef<DiagramRef | null>(null);
  const { i18n } = useSwdEditorI18n();

  // Allow imperatively controlling the Editor
  // React.useImperativeHandle(
  //   ref,
  //   () => ({
  //     doSomething: () => {
  //       TODO: to be implemented, it is just a placeholder
  //     },
  //   }),
  //   [],
  // );

  return (
    <>
      <Diagram ref={diagramRef} divRef={diagramDivRef} />
      <p>{i18n.hello}</p>
    </>
  );
};
