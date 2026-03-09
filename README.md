# editor
CNCF Serverless Workflow Specification Visual Editor

## Prerequisites

To build and run the editor locally, you will need:
- **Node.js 24** (current LTS version; see https://nodejs.org/)
- **pnpm 10.31.0**

## Building the Project

The project is structured as a monorepo to support multiple distribution targets (Web, VS Code, etc.) as defined in our architectural decisions.

```bash
# Clone the repository
git clone https://github.com/serverlessworkflow/editor.git
cd editor

# Install dependencies
pnpm install

# Build all packages in the monorepo
pnpm run build:[dev / prod]
```
