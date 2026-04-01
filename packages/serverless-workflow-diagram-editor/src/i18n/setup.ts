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
