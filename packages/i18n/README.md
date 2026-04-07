<!--
   Copyright 2021-Present The Serverless Workflow Specification Authors

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
-->

# i18n Usage Guide

This guide explains how to use the `@serverlessworkflow/i18n` package inside your project (e.g., in the `DiagramEditor`).

---

## What this package provides

- `I18nProvider` → React context provider for translations
- `useI18n()` → Hook to access translations
- `detectLocale()` → Automatically detect user language
- `createI18n()` → Core translation logic (used internally)

---

## Step 1: Define your dictionaries

Create a file like:

```ts
// i18n/locales.ts

export const dictionaries = {
  en: {
    save: "Save",
  },
  fr: {
    save: "Enregistrer",
  },
};
```

- Keys (`save`) must be consistent across languages.

---

## Step 2: Detect or pass locale

You can either:

- Pass `locale` manually via props
- Or auto-detect using `detectLocale`

Example:

```ts
const supportedLocales = Object.keys(dictionaries);

const locale = props.locale ?? detectLocale(supportedLocales);
```

---

## Step 3: Wrap your app with `I18nProvider`

```tsx
import { I18nProvider } from "@serverlessworkflow/i18n";
import { dictionaries } from "../i18n/locales";

<I18nProvider locale={locale} dictionaries={dictionaries}>
  {/* your app */}
</I18nProvider>;
```

---

## Step 4: Use translations with `useI18n`

Inside any child component:

```tsx
import { useI18n } from "@serverlessworkflow/i18n";

const Content = () => {
  const { t } = useI18n();

  return <p>{t("save")}</p>;
};
```

- If the key is missing, it will return the key itself:

```ts
t("unknown") → "unknown"
```

---
