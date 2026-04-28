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

import { GraphNodeType } from "@serverlessworkflow/sdk";
import * as RF from "@xyflow/react";

// Node types must match sdk GraphNodeType enum
export const NodeTypes: RF.NodeTypes = {
  [GraphNodeType.Call]: CallNode,
  [GraphNodeType.Do]: DoNode,
  [GraphNodeType.Emit]: EmitNode,
  [GraphNodeType.For]: ForNode,
  [GraphNodeType.Fork]: ForkNode,
  [GraphNodeType.Listen]: ListenNode,
  [GraphNodeType.Raise]: RaiseNode,
  [GraphNodeType.Run]: RunNode,
  [GraphNodeType.Set]: SetNode,
  [GraphNodeType.Switch]: SwitchNode,
  [GraphNodeType.Try]: TryNode,
  [GraphNodeType.Wait]: WaitNode,
};

export type BaseNodeData = {
  // TODO: It is a placeholder, add properties to be consumed internally by node components
  label: string;
};

// TODO: These props are just a placeholder
interface PlaceholderProps {
  id: string;
  data: BaseNodeData;
  selected: boolean;
  type: string;
}

// TODO: This content is just a placeholder
function PlaceholderContent({ id, data, selected, type }: PlaceholderProps) {
  return (
    <div
      className={`dec:rounded dec:border dec:border-gray-300 dec:dark:border-gray-600 dec:bg-white dec:dark:bg-gray-800  dec:text-gray-900 dec:dark:text-gray-100${selected ? " dec:ring-2 dec:ring-blue-400" : ""}`}
      data-testid={`${type}-node-${id}`}
    >
      <RF.Handle type="target" position={RF.Position.Top} />
      <div className="dec:whitespace-pre dec:p-[7px]" data-testid={`${type}-label-${id}`}>
        {`${type}\n${data.label}`}
      </div>
      <RF.Handle type="source" position={RF.Position.Bottom} />
    </div>
  );
}

/* call node */
export type CallNodeType = RF.Node<BaseNodeData, typeof GraphNodeType.Call>;
export function CallNode({ id, data, selected, type }: RF.NodeProps<CallNodeType>) {
  // TODO: This component is just a placeholder
  return <PlaceholderContent id={id} data={data} selected={selected} type={type} />;
}

/* do node */
export type DoNodeType = RF.Node<BaseNodeData, typeof GraphNodeType.Do>;
export function DoNode({ id, data, selected, type }: RF.NodeProps<DoNodeType>) {
  // TODO: This component is just a placeholder
  return <PlaceholderContent id={id} data={data} selected={selected} type={type} />;
}

/* emit node */
export type EmitNodeType = RF.Node<BaseNodeData, typeof GraphNodeType.Emit>;
export function EmitNode({ id, data, selected, type }: RF.NodeProps<EmitNodeType>) {
  // TODO: This component is just a placeholder
  return <PlaceholderContent id={id} data={data} selected={selected} type={type} />;
}

/* for node */
export type ForNodeType = RF.Node<BaseNodeData, typeof GraphNodeType.For>;
export function ForNode({ id, data, selected, type }: RF.NodeProps<ForNodeType>) {
  // TODO: This component is just a placeholder
  return <PlaceholderContent id={id} data={data} selected={selected} type={type} />;
}

/* fork node */
export type ForkNodeType = RF.Node<BaseNodeData, typeof GraphNodeType.Fork>;
export function ForkNode({ id, data, selected, type }: RF.NodeProps<ForkNodeType>) {
  // TODO: This component is just a placeholder
  return <PlaceholderContent id={id} data={data} selected={selected} type={type} />;
}

/* listen node */
export type ListenNodeType = RF.Node<BaseNodeData, typeof GraphNodeType.Listen>;
export function ListenNode({ id, data, selected, type }: RF.NodeProps<ListenNodeType>) {
  // TODO: This component is just a placeholder
  return <PlaceholderContent id={id} data={data} selected={selected} type={type} />;
}

/* raise node */
export type RaiseNodeType = RF.Node<BaseNodeData, typeof GraphNodeType.Raise>;
export function RaiseNode({ id, data, selected, type }: RF.NodeProps<RaiseNodeType>) {
  // TODO: This component is just a placeholder
  return <PlaceholderContent id={id} data={data} selected={selected} type={type} />;
}

/* run node */
export type RunNodeType = RF.Node<BaseNodeData, typeof GraphNodeType.Run>;
export function RunNode({ id, data, selected, type }: RF.NodeProps<RunNodeType>) {
  // TODO: This component is just a placeholder
  return <PlaceholderContent id={id} data={data} selected={selected} type={type} />;
}

/* set node */
export type SetNodeType = RF.Node<BaseNodeData, typeof GraphNodeType.Set>;
export function SetNode({ id, data, selected, type }: RF.NodeProps<SetNodeType>) {
  // TODO: This component is just a placeholder
  return <PlaceholderContent id={id} data={data} selected={selected} type={type} />;
}

/* switch node */
export type SwitchNodeType = RF.Node<BaseNodeData, typeof GraphNodeType.Switch>;
export function SwitchNode({ id, data, selected, type }: RF.NodeProps<SwitchNodeType>) {
  // TODO: This component is just a placeholder
  return <PlaceholderContent id={id} data={data} selected={selected} type={type} />;
}

/* try node */
export type TryNodeType = RF.Node<BaseNodeData, typeof GraphNodeType.Try>;
export function TryNode({ id, data, selected, type }: RF.NodeProps<TryNodeType>) {
  // TODO: This component is just a placeholder
  return <PlaceholderContent id={id} data={data} selected={selected} type={type} />;
}

/* wait node */
export type WaitNodeType = RF.Node<BaseNodeData, typeof GraphNodeType.Wait>;
export function WaitNode({ id, data, selected, type }: RF.NodeProps<WaitNodeType>) {
  // TODO: This component is just a placeholder
  return <PlaceholderContent id={id} data={data} selected={selected} type={type} />;
}
