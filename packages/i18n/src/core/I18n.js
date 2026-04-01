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
import { immutableDeepMerge } from "./immutableDeepMerge";
export class I18n {
  defaults;
  dictionaries;
  initialLocale;
  locale;
  dictionary;
  constructor(defaults, dictionaries, initialLocale = defaults.locale) {
    this.defaults = defaults;
    this.dictionaries = dictionaries;
    this.initialLocale = initialLocale;
    this.locale = initialLocale;
    this.updateDictionary();
  }
  setLocale(locale) {
    this.locale = locale;
    this.updateDictionary();
    return this;
  }
  updateDictionary() {
    const selectedDictionary =
      this.dictionaries.get(this.locale) ??
      this.dictionaries.get(this.locale.split("-").shift()) ??
      {};
    this.dictionary = immutableDeepMerge(this.defaults.dictionary, selectedDictionary);
    return this;
  }
  getCurrent() {
    return this.dictionary;
  }
  getLocale() {
    return this.locale;
  }
}
