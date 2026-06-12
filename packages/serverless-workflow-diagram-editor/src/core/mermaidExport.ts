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

import { convertToMermaidCode } from "@serverlessworkflow/sdk";
import type { Specification } from "@serverlessworkflow/sdk";

/**
 * Converts a workflow model to Mermaid diagram code
 * @param workflow - The workflow object (parsed from JSON/YAML)
 * @returns Mermaid diagram code as a string
 */
export function exportToMermaid(workflow: Specification.Workflow): string {
  return convertToMermaidCode(workflow);
}

export function copyMermaidToClipboard(mermaidCode: string): Promise<void> {
  if (typeof navigator === "undefined" || !navigator.clipboard) {
    return Promise.reject(new Error("Clipboard API is not available in this environment"));
  }
  return navigator.clipboard.writeText(mermaidCode);
}

export function downloadMermaidFile(mermaidCode: string, filename: string = "mermaid.mmd"): void {
  if (typeof document === "undefined") {
    throw new Error("Document API is not available in this environment");
  }

  const blob = new Blob([mermaidCode], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 100);
}
