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
import {
  AlertTriangle,
  ArrowRightLeft,
  AudioLines,
  Clock,
  Megaphone,
  PenLine,
  Phone,
  Terminal,
} from "lucide-react";
import type { ComponentType } from "react";

export type LeafNodeType =
  | typeof GraphNodeType.Call
  | typeof GraphNodeType.Emit
  | typeof GraphNodeType.Listen
  | typeof GraphNodeType.Raise
  | typeof GraphNodeType.Run
  | typeof GraphNodeType.Set
  | typeof GraphNodeType.Switch
  | typeof GraphNodeType.Wait;

export interface TaskNodeConfig {
  color: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  typeLabel: string;
}

export const taskNodeConfigMap: Record<LeafNodeType, TaskNodeConfig> = {
  [GraphNodeType.Call]: {
    color: "#2563EB",
    icon: Phone,
    typeLabel: "CALL",
  },
  [GraphNodeType.Emit]: {
    color: "#8B5CF6",
    icon: Megaphone,
    typeLabel: "EMIT",
  },
  [GraphNodeType.Listen]: {
    color: "#CA8A04",
    icon: AudioLines,
    typeLabel: "LISTEN",
  },
  [GraphNodeType.Raise]: {
    color: "#DC2626",
    icon: AlertTriangle,
    typeLabel: "RAISE",
  },
  [GraphNodeType.Run]: {
    color: "#10B981",
    icon: Terminal,
    typeLabel: "RUN",
  },
  [GraphNodeType.Set]: {
    color: "#EA580C",
    icon: PenLine,
    typeLabel: "SET",
  },
  [GraphNodeType.Switch]: {
    color: "#BE185D",
    icon: ArrowRightLeft,
    typeLabel: "SWITCH",
  },
  [GraphNodeType.Wait]: {
    color: "#84CC16",
    icon: Clock,
    typeLabel: "WAIT",
  },
};
