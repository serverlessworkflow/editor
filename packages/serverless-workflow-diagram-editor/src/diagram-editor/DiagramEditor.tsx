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

import type { CSSProperties } from "react";
import "../i18n";
import { useTranslation } from "react-i18next";

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
};

export const DiagramEditor = (props: DiagramEditorProps) => {
  //TODO: Implement the actual component this is just a placeholder
  const { t } = useTranslation();

  return (
    <>
      <h1>Hello from DiagramEditor component!</h1>
      <p>Read-only: {props.isReadOnly ? "true" : "false"}</p>
      <p>Content: {props.content}</p>
      <button style={clickmeBtnStyle} onClick={() => alert("Hello from Diagram!")}>
        Click me!
      </button>
      <div>
        {t("welcome")} {t("start")} {t("setup")}{" "}
      </div>
    </>
  );
};
