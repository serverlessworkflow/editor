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
import { I18nProvider, useI18n, detectLocale } from "@serverlessworkflow/i18n";
import { dictionaries } from "../i18n/locales";
import "./DiagramEditor.css";
import { ColorMode } from "../types/colorMode";

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
  colorMode?: ColorMode;
};

const Content = () => {
  const { t } = useI18n();
  return <p>{t("helloMessage")}</p>;
};

export const DiagramEditor = (props: DiagramEditorProps) => {
  // TODO: i18n
  // TODO: store, context
  // TODO: ErrorBoundary / fallback

  // Refs
  const diagramDivRef = React.useRef<HTMLDivElement | null>(null);
  const diagramRef = React.useRef<DiagramRef | null>(null);
  const locale = React.useMemo(() => {
    const supportedLocales = Object.keys(dictionaries);
    return props.locale ?? detectLocale(supportedLocales);
  }, [props.locale]);
  const colorMode = props.colorMode ?? "system";

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
            <div className={`headingContent colorMode-${colorMode}`}>
              <Content />
            </div>
            <Diagram ref={diagramRef} divRef={diagramDivRef} colorMode={colorMode} />
        </I18nProvider>
      </DiagramEditorContextProvider>
    </>
  );
};
