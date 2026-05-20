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

import ELK, { ElkNode } from "elkjs/lib/elk.bundled.js";

const elk = new ELK();

export async function processElkLayout(graph: ElkNode): Promise<ElkNode | null> {
  try {
    // Attempt to layout the graph
    return await elk.layout(graph);
  } catch (error: unknown) {
    // Type-safe error handling
    if (error instanceof Error) {
      console.error("ELK Layout failed:", error.message);
    } else {
      console.error("An unexpected error occurred:", String(error));
    }
    // Return a fallback, null, or rethrow the error as needed
    return null;
  }
}
