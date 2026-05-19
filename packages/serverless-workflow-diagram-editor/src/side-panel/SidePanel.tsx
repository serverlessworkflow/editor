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

import { useI18n } from "@serverlessworkflow/i18n";
import { Workflow, Info } from "lucide-react";
import { Sidebar, SidebarContent, SidebarHeader } from "@/components/ui/sidebar";
import { useDiagramEditorContext } from "@/store/DiagramEditorContext";
import { WorkflowInfoView } from "@/side-panel/WorkflowInfoView";
import "./SidePanel.css";

export function SidePanel() {
  const { model } = useDiagramEditorContext();
  const { t } = useI18n();

  return (
    <Sidebar side="right">
      <SidebarHeader>
        <div className="dec-sidebar-header-title">
          <Workflow className="dec-sidebar-header-icon" />
          <div className="dec-sidebar-header-labels">
            <span className="dec-sidebar-header-name">{t("sidebar.workflow")}</span>
            <span className="dec-sidebar-header-subtitle">{t("sidebar.document")}</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <div className="dec-sidebar-hint">
          <Info className="dec-sidebar-hint-icon" />
          <span className="dec-sidebar-hint-text">{t("sidebar.selectNode")}</span>
        </div>
        {model !== null ? <WorkflowInfoView document={model.document} /> : null}
      </SidebarContent>
    </Sidebar>
  );
}
