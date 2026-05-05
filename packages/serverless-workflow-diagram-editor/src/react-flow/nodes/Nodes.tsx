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

import type React from "react";
import { GraphNodeType, type Specification } from "@serverlessworkflow/sdk";
import * as RF from "@xyflow/react";
import { type LeafNodeType, taskNodeConfigMap } from "./taskNodeConfig";

// Node types must match sdk GraphNodeType enum
export const ReactFlowNodeTypes: RF.NodeTypes = {
  [GraphNodeType.Start]: StartNode,
  [GraphNodeType.End]: EndNode,
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

export type BaseNodeData<T = Specification.Task | void> = {
  label: string;
  task?: T;
};

interface NodeContentProps {
  id: string;
  data: BaseNodeData;
  selected: boolean;
  type: string;
}

function TaskNodeContent({ id, data, selected, type }: NodeContentProps) {
  const config = taskNodeConfigMap[type as LeafNodeType];
  const Icon = config.icon;
  return (
    <div
      className={`dec-task-node-container ${selected ? "selected" : ""}`}
      style={{ "--task-node-color": config.color } as React.CSSProperties}
      data-testid={`${type}-node-${id}`}
    >
      <RF.Handle type="target" position={RF.Position.Top} />
      <div className="dec-task-node-content">
        <Icon size={20} className="dec-task-node-icon" />
        <div className="dec-task-node-label">
          <span className="dec-task-node-name">{data.label}</span>
          <span className="dec-task-node-type">{config.typeLabel}</span>
        </div>
      </div>
      <RF.Handle type="source" position={RF.Position.Bottom} />
    </div>
  );
}

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
      className={`custom-node-container ${selected ? "selected" : ""}`}
      data-testid={`${type}-node-${id}`}
    >
      <RF.Handle type="target" position={RF.Position.Top} />
      <div className="node-label-container" data-testid={`${type}-label-${id}`}>
        {`${type}\n${data.label}`}
      </div>
      <RF.Handle type="source" position={RF.Position.Bottom} />
    </div>
  );
}

/* start node */
export type StartNodeType = RF.Node<BaseNodeData, typeof GraphNodeType.Start>;
export function StartNode({ id, data, selected, type }: RF.NodeProps<StartNodeType>) {
  // TODO: This component is just a placeholder
  return <PlaceholderContent id={id} data={data} selected={selected} type={type} />;
}

/* end node */
export type EndNodeType = RF.Node<BaseNodeData, typeof GraphNodeType.End>;
export function EndNode({ id, data, selected, type }: RF.NodeProps<EndNodeType>) {
  // TODO: This component is just a placeholder
  return <PlaceholderContent id={id} data={data} selected={selected} type={type} />;
}

/* call node */
export type CallNodeType = RF.Node<BaseNodeData<Specification.CallTask>, typeof GraphNodeType.Call>;
export function CallNode({ id, data, selected, type }: RF.NodeProps<CallNodeType>) {
  return <TaskNodeContent id={id} data={data} selected={selected} type={type} />;
}

/* do node */
export type DoNodeType = RF.Node<BaseNodeData<Specification.DoTask>, typeof GraphNodeType.Do>;
export function DoNode({ id, data, selected, type }: RF.NodeProps<DoNodeType>) {
  // TODO: This component is just a placeholder
  return <PlaceholderContent id={id} data={data} selected={selected} type={type} />;
}

/* emit node */
export type EmitNodeType = RF.Node<BaseNodeData<Specification.EmitTask>, typeof GraphNodeType.Emit>;
export function EmitNode({ id, data, selected, type }: RF.NodeProps<EmitNodeType>) {
  return <TaskNodeContent id={id} data={data} selected={selected} type={type} />;
}

/* for node */
export type ForNodeType = RF.Node<BaseNodeData<Specification.ForTask>, typeof GraphNodeType.For>;
export function ForNode({ id, data, selected, type }: RF.NodeProps<ForNodeType>) {
  // TODO: This component is just a placeholder
  return <PlaceholderContent id={id} data={data} selected={selected} type={type} />;
}

/* fork node */
export type ForkNodeType = RF.Node<BaseNodeData<Specification.ForkTask>, typeof GraphNodeType.Fork>;
export function ForkNode({ id, data, selected, type }: RF.NodeProps<ForkNodeType>) {
  // TODO: This component is just a placeholder
  return <PlaceholderContent id={id} data={data} selected={selected} type={type} />;
}

/* listen node */
export type ListenNodeType = RF.Node<
  BaseNodeData<Specification.ListenTask>,
  typeof GraphNodeType.Listen
>;
export function ListenNode({ id, data, selected, type }: RF.NodeProps<ListenNodeType>) {
  return <TaskNodeContent id={id} data={data} selected={selected} type={type} />;
}

/* raise node */
export type RaiseNodeType = RF.Node<
  BaseNodeData<Specification.RaiseTask>,
  typeof GraphNodeType.Raise
>;
export function RaiseNode({ id, data, selected, type }: RF.NodeProps<RaiseNodeType>) {
  return <TaskNodeContent id={id} data={data} selected={selected} type={type} />;
}

/* run node */
export type RunNodeType = RF.Node<BaseNodeData<Specification.RunTask>, typeof GraphNodeType.Run>;
export function RunNode({ id, data, selected, type }: RF.NodeProps<RunNodeType>) {
  return <TaskNodeContent id={id} data={data} selected={selected} type={type} />;
}

/* set node */
export type SetNodeType = RF.Node<BaseNodeData<Specification.SetTask>, typeof GraphNodeType.Set>;
export function SetNode({ id, data, selected, type }: RF.NodeProps<SetNodeType>) {
  return <TaskNodeContent id={id} data={data} selected={selected} type={type} />;
}

/* switch node */
export type SwitchNodeType = RF.Node<
  BaseNodeData<Specification.SwitchTask>,
  typeof GraphNodeType.Switch
>;
export function SwitchNode({ id, data, selected, type }: RF.NodeProps<SwitchNodeType>) {
  return <TaskNodeContent id={id} data={data} selected={selected} type={type} />;
}

/* try node */
export type TryNodeType = RF.Node<BaseNodeData<Specification.TryTask>, typeof GraphNodeType.Try>;
export function TryNode({ id, data, selected, type }: RF.NodeProps<TryNodeType>) {
  // TODO: This component is just a placeholder
  return <PlaceholderContent id={id} data={data} selected={selected} type={type} />;
}

/* wait node */
export type WaitNodeType = RF.Node<BaseNodeData<Specification.WaitTask>, typeof GraphNodeType.Wait>;
export function WaitNode({ id, data, selected, type }: RF.NodeProps<WaitNodeType>) {
  return <TaskNodeContent id={id} data={data} selected={selected} type={type} />;
}
