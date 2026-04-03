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

import { describe, it, expect } from "vitest";
import { parseWorkflow, validateWorkflow } from "../../src/core";
import {
  BASIC_VALID_WORKFLOW_YAML,
  BASIC_VALID_WORKFLOW_JSON,
  BASIC_INVALID_WORKFLOW_YAML,
  BASIC_INVALID_WORKFLOW_JSON,
} from "../fixtures/workflows";
import { Classes, Specification } from "@serverlessworkflow/sdk";

describe("parseWorkflow", () => {
  it.each([
    { format: "YAML", input: BASIC_VALID_WORKFLOW_YAML, expectedName: "valid-workflow-yaml" },
    { format: "JSON", input: BASIC_VALID_WORKFLOW_JSON, expectedName: "valid-workflow-json" },
  ])("parses valid $format and returns model with no errors", ({ input, expectedName }) => {
    const result = parseWorkflow(input);
    expect(result.errors).toHaveLength(0);
    expect(result.model?.document?.name).toBe(expectedName);
    expect(result).toMatchSnapshot();
  });

  it.each([
    { format: "YAML", input: BASIC_INVALID_WORKFLOW_YAML },
    { format: "JSON", input: BASIC_INVALID_WORKFLOW_JSON },
  ])("returns model and errors for invalid but parseable $format", ({ input }) => {
    const result = parseWorkflow(input);
    expect(result.model).not.toBeNull();
    expect(result.errors).toHaveLength(1);
    expect(result).toMatchSnapshot();
  });

  it.each([
    { description: "empty string", input: "" },
    { description: "non-object YAML", input: "just a string" },
    { description: "numeric YAML", input: "42" },
  ])("returns null model with error for $description", ({ input }) => {
    const result = parseWorkflow(input);
    expect(result.model).toBeNull();
    expect(result.errors[0].message).toBe("Not a valid workflow object");
  });

  it("returns null model with errors for unparseable text", () => {
    const result = parseWorkflow("}{not yaml or json}{");
    expect(result.model).toBeNull();
    expect(result.errors).toHaveLength(1);
  });
});

describe("validateWorkflow", () => {
  it("returns empty array for a valid workflow", () => {
    const valid = new Classes.Workflow({
      document: { dsl: "1.0.0", name: "valid-workflow", version: "1.0.0", namespace: "default" },
      do: [{ step1: { set: { variable: "value" } } }],
    }) as Specification.Workflow;
    const errors = validateWorkflow(valid);
    expect(errors).toHaveLength(0);
  });

  it("returns errors for an invalid workflow", () => {
    const invalid = new Classes.Workflow({
      do: [{ step1: { set: { variable: "value" } } }],
    }) as Specification.Workflow;
    const errors = validateWorkflow(invalid);
    expect(errors).toHaveLength(1);
    expect(errors).toMatchSnapshot();
  });
});
