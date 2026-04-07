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

import yaml from "js-yaml";
import { Classes, Specification, validate } from "@serverlessworkflow/sdk";

export type WorkflowParseResult = {
  model: Specification.Workflow | null;
  errors: Error[];
};

export function validateWorkflow(model: Specification.Workflow): Error[] {
  try {
    validate("Workflow", model);
    return [];
  } catch (err) {
    // TODO: Parse individual validation errors from the SDK into separate Error objects when we are ready to render them.
    return [err instanceof Error ? err : new Error(String(err))];
  }
}

export function parseWorkflow(text: string): WorkflowParseResult {
  let raw: Partial<Specification.Workflow>;

  try {
    raw = yaml.load(text, { schema: yaml.DEFAULT_SCHEMA }) as Partial<Specification.Workflow>;
  } catch (err) {
    return {
      model: null,
      errors: [err instanceof Error ? err : new Error(String(err))],
    };
  }

  if (raw == null || typeof raw !== "object") {
    return { model: null, errors: [new Error("Not a valid workflow object")] };
  }

  const model = new Classes.Workflow(raw) as Specification.Workflow;
  const errors = validateWorkflow(model);

  return { model, errors };
}
