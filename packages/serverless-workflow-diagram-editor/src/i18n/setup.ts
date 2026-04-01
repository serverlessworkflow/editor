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
import { useContext } from "react";
import { en } from "./locales";
import { I18nContextType } from "@serverlessworkflow/i18n/dist/react-components";
import { SwdEditorI18n } from "./SwdEditorI18n";
import { I18nDefaults, I18nDictionaries } from "@serverlessworkflow/i18n/dist/core";

export const swdEditorI18nDefaults: I18nDefaults<SwdEditorI18n> = {
  locale: "en",
  dictionary: en,
};
export const swdEditorDictionaries: I18nDictionaries<SwdEditorI18n> = new Map([["en", en]]);
export const SwdEditorI18nContext = React.createContext<I18nContextType<SwdEditorI18n>>(
  {} as never,
);

export function useSwdEditorI18n(): I18nContextType<SwdEditorI18n> {
  return useContext(SwdEditorI18nContext);
}
