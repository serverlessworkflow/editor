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
  object: Record<string, unknown>;
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

    // Find all pipe positions
    const pipePositions: number[] = [];
    let pos = -1;
    while ((pos = content.indexOf("|", pos + 1)) !== -1) {
      pipePositions.push(pos);
    }

    // We need at least 3 pipes to have 4 fields
    if (pipePositions.length < 3) {
      continue;
    }

    // Extract first two fields using first two pipes
    const firstPipe = pipePositions[0]!;
    const secondPipe = pipePositions[1]!;

    const taskId = content.substring(0, firstPipe).trim();
    const errorType = content.substring(firstPipe + 1, secondPipe).trim();

    // Try to find the last pipe that separates valid JSON
    // Work backwards from the last pipe to find where valid JSON starts
    let errorMessage = "";
    let objectStr = "";
    let parsedObject: Record<string, unknown> = {};
    let foundValidSplit = false;

    // Try each remaining pipe position as the separator before the JSON field
    for (let i = pipePositions.length - 1; i >= 2; i--) {
      const candidatePipe = pipePositions[i]!;
      const candidateMessage = content.substring(secondPipe + 1, candidatePipe).trim();
      const candidateObjectStr = content.substring(candidatePipe + 1).trim();

      if (!candidateMessage || !candidateObjectStr) {
        continue;
      }

      // Try to parse the JSON
      try {
        const parsed = JSON.parse(candidateObjectStr);
        // Validate that parsed result is a non-null plain object
        if (parsed !== null && typeof parsed === "object" && !Array.isArray(parsed)) {
          // Found valid split
          errorMessage = candidateMessage;
          objectStr = candidateObjectStr;
          parsedObject = parsed;
          foundValidSplit = true;
          break;
        }
      } catch {
        // Not valid JSON, try next pipe position
        continue;
      }
    }

    // If no valid JSON found, fall back to using the 3rd pipe and empty object
    if (!foundValidSplit) {
      const thirdPipe = pipePositions[2]!;
      errorMessage = content.substring(secondPipe + 1, thirdPipe).trim();
      objectStr = content.substring(thirdPipe + 1).trim();
      parsedObject = {};
    }

    // Validate all required fields are non-empty
    if (!taskId || !errorType || !errorMessage || !objectStr) {
      continue;
    }

    errors.push({
      taskId,
      errorType,
      message: errorMessage,
      object: parsedObject,
    });
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
