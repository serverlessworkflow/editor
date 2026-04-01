import { ReferenceDictionary } from "@serverlessworkflow/i18n/dist/core";

interface SwdEditorDictionary extends ReferenceDictionary<{}> {}

export interface SwdEditorI18n extends SwdEditorDictionary {}

export interface SwdEditorI18n {
  hello: string;
}
