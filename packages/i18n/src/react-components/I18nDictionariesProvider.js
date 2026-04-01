import { jsx as _jsx } from "react/jsx-runtime";
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
import { useCallback, useMemo, useState } from "react";
import { I18n } from "../core";
export const I18nDictionariesProvider = (props) => {
  const [locale, setLocale] = useState(props.initialLocale ?? props.defaults.locale);
  const i18n = useMemo(
    () => new I18n(props.defaults, props.dictionaries, locale),
    [locale, props.defaults, props.dictionaries],
  );
  const setNewLocale = useCallback(
    (newLocale) => {
      i18n.setLocale(newLocale);
      setLocale(newLocale);
    },
    [i18n],
  );
  const value = useMemo(
    () => ({
      locale,
      setLocale: setNewLocale,
      i18n: i18n.getCurrent(),
    }),
    [i18n, locale, setNewLocale],
  );
  return _jsx(props.ctx.Provider, { value: value, children: props.children });
};
