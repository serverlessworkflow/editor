/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React, { useState } from "react";
import { Alert, AlertActionCloseButton, AlertGroup, Button, Content } from "@patternfly/react-core";
import "@patternfly/react-core/dist/styles/base.css";

export type DiagramEditorProps = {
  content: string;
  isReadOnly: boolean;
};

export const DiagramEditor = (props: DiagramEditorProps) => {
  //TODO: Implement the actual compoment this is just a placeholder

  const [alerts, setAlerts] = useState<{ title: string; variant: "success" | "danger"; key: number }[]>([]);

  const addAlert = (title: string, variant: "success" | "danger") => {
    setAlerts((prev) => [...prev, { title, variant, key: Date.now() }]);
  };

  const removeAlert = (key: number) => {
    setAlerts((prev) => prev.filter((alert) => alert.key !== key));
  };

  return (
    <>
      <Content>
        <h1>Hello from DiagramEditor component!</h1>
        <p>Read-only: {props.isReadOnly ? "true" : "false"}</p>
        <p>Content: {props.content}</p>
        <Button onClick={() => addAlert("Hello from Patternfly!", "success")}>Click me!</Button>
        <AlertGroup isToast>
          {alerts.map(({ title, variant, key }) => (
            <Alert
              variant={variant}
              title={title}
              key={key}
              timeout={3000}
              actionClose={<AlertActionCloseButton onClose={() => removeAlert(key)} />}
            >
              Patternfly is alive.
            </Alert>
          ))}
        </AlertGroup>
      </Content>
    </>
  );
};
