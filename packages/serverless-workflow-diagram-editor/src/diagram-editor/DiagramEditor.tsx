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

const clickmeBtnStyle: CSSProperties = {
  border: "2px solid blue",
  borderRadius: "10px",
  fontSize: "large",
  fontWeight: "500",
  background: "blue",
  color: "white",
};

export type DiagramEditorProps = {
  content: string;
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

const DiagramEditorInner = (props: DiagramEditorProps) => {
  const { i18n } = useSwdEditorI18n();

  return (
    <>
      <h1>Hello from DiagramEditor component!</h1>
      <p>Read-only: {props.isReadOnly ? "true" : "false"}</p>
      <p>Content: {props.content}</p>

      <button style={clickmeBtnStyle} onClick={() => alert("Hello from Diagram!")}>
        Click me!
      </button>

      <p>{i18n.hello}</p>
    </>
  );
};
