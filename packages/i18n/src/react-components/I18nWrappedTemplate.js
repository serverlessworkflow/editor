import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
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
// component to replace placeholders in text with React components
export const I18nWrappedTemplate = ({ text, interpolationMap }) => {
  // Matches {key} where key is one of the placeholder keys
  const interpolationMapRegex = new RegExp(
    `\\{(${Object.keys(interpolationMap).join("|")})\\}`,
    "g",
  );
  return _jsx(_Fragment, {
    children: text
      .split(interpolationMapRegex)
      .map((value, i) =>
        value in interpolationMap
          ? _jsx(React.Fragment, { children: interpolationMap[value] }, i)
          : value,
      ),
  });
};
