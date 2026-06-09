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
import * as sdk from "@serverlessworkflow/sdk";
import { fixNodesConnections } from "./graph";

export type ValidationError = {
  taskId: string;
  errorType: string;
  message: string;
  object: object;
};

export type SdkError = Error | ValidationError;

export type WorkflowParseResult = {
  model: sdk.Specification.Workflow | null;
  errors: SdkError[];
};

export function parseValidationErrorMessage(message: string): ValidationError[] {
  const errors: ValidationError[] = [];

  // Split message into lines
  const lines = message.split("\n");

  for (const line of lines) {
    // Only process lines that begin with "-"
    const trimmedLine = line.trim();
    if (!trimmedLine.startsWith("-")) {
      continue;
    }

    // Remove the leading "-" and trim
    const content = trimmedLine.substring(1).trim();

    // Split by "|" to get the fields
    const parts = content.split("|");

    // We expect 4 parts: taskId, errorType, message, object
    if (parts.length === 4 && parts[0] && parts[1] && parts[2] && parts[3]) {
      const taskId = parts[0].trim();
      const errorType = parts[1].trim();
      const errorMessage = parts[2].trim();
      const objectStr = parts[3].trim();

      // Parse the object field from JSON string
      let parsedObject: object = {};
      try {
        parsedObject = JSON.parse(objectStr);
      } catch {
        // If parsing fails, use empty object
        parsedObject = {};
      }

      errors.push({
        taskId,
        errorType,
        message: errorMessage,
        object: parsedObject,
      });
    }
  }

  return errors;
}

export function validateWorkflow(model: sdk.Specification.Workflow): SdkError[] {
  try {
    sdk.validate("Workflow", model);
    return [];
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const parsedErrors = parseValidationErrorMessage(message);

    // If parsing succeeded and returned errors, use them
    if (parsedErrors.length > 0) {
      return parsedErrors;
    }

    // Otherwise, return the original error as-is
    if (err instanceof Error) {
      return [err];
    }
    return [new Error(message)];
  }
}

export function parseWorkflow(text: string): WorkflowParseResult {
  let raw: Partial<sdk.Specification.Workflow>;

  try {
    raw = yaml.load(text, { schema: yaml.DEFAULT_SCHEMA }) as Partial<sdk.Specification.Workflow>;
  } catch (err) {
    return {
      model: null,
      errors: [err instanceof Error ? err : new Error(String(err))],
    };
  }

  if (raw == null || typeof raw !== "object") {
    return { model: null, errors: [new Error("Not a valid workflow")] };
  }

  const model = new sdk.Classes.Workflow(raw) as sdk.Specification.Workflow;
  const errors = validateWorkflow(model);

  return { model, errors };
}

export function buildFlatGraph(model: sdk.Specification.Workflow): sdk.FlatGraph {
  return fixNodesConnections(sdk.buildFlatGraph(model));
}
