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

import * as React from "react";
import { ErrorPage } from "./ErrorPage";

type State = {
  hasError: boolean;
  error?: unknown;
};

type DiagramEditorErrorBoundaryProps = {
  children: React.ReactNode;
  title?: string;
  message?: string;
  resetKey?: string;
};

export class DiagramEditorErrorBoundary extends React.Component<
  DiagramEditorErrorBoundaryProps,
  State
> {
  constructor(props: DiagramEditorErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: unknown): State {
    return { hasError: true, error };
  }

  componentDidUpdate(prevProps: DiagramEditorErrorBoundaryProps) {
    if (this.state.hasError && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false, error: undefined });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorPage
          title={this.props.title ?? "Something went wrong"}
          message={this.props.message ?? "An unexpected error occurred"}
          snippet={this.state.error instanceof Error ? this.state.error.message : undefined}
        />
      );
    }

    return this.props.children;
  }
}
