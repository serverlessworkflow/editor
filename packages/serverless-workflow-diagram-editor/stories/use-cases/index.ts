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

export { default as accumulateRoomReadings } from "./workflows/accumulate-room-readings.yaml?raw";
export { default as authenticationOAuth2 } from "./workflows/authentication-oauth2.yaml?raw";
export { default as authenticationReusable } from "./workflows/authentication-reusable.yaml?raw";
export { default as callAsyncAPIPublish } from "./workflows/call-asyncapi-publish.yaml?raw";
export { default as callAsyncAPISubscribe } from "./workflows/call-asyncapi-subscribe-consume-forever-foreach.yaml?raw";
export { default as callCustomFunctionCataloged } from "./workflows/call-custom-function-cataloged.yaml?raw";
export { default as callCustomFunctionInline } from "./workflows/call-custom-function-inline.yaml?raw";
export { default as callGrpc } from "./workflows/call-grpc.yaml?raw";
export { default as callHttpQueryHeadersExpressions } from "./workflows/call-http-query-headers-expressions.yaml?raw";
export { default as callMCP } from "./workflows/call-mcp.yaml?raw";
export { default as callOpenApi } from "./workflows/call-openapi.yaml?raw";
export { default as conditionalTask } from "./workflows/conditional-task.yaml?raw";
export { default as doMultiple } from "./workflows/do-multiple.yaml?raw";
export { default as doSingle } from "./workflows/do-single.yaml?raw";
