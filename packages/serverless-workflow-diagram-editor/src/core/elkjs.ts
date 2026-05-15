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

import ELK from "elkjs";

const elk = new ELK();
const graph = {
  id: "root",
  children: [
    { id: "n1", width: 100, height: 50 },
    { id: "n2", width: 100, height: 50 },
  ],
  edges: [{ id: "e1", sources: ["n1"], targets: ["n2"] }],
};

elk.layout(graph).then((layoutedGraph) => {
  console.log(layoutedGraph);
});
