# Spec Kit Docker Bootstrap

This folder isolates Spec Kit tooling in Docker so host Python/uv installs are unnecessary.

## Bootstrap

```powershell
# Codex (default) — generates .codex/prompts/
./docker/speckit/bootstrap.ps1

# Claude Code — generates .claude/commands/
./docker/speckit/bootstrap.ps1 -Ai claude
```

Default command executed inside container:

```text
specify init --here --force --ai <agent> --script ps --ai-skills
```

## Run any Specify command in container

```powershell
docker run --rm -v "${PWD}:/workspace" -w /workspace ghcr.io/astral-sh/uv:python3.12-bookworm \
  uvx --from git+https://github.com/github/spec-kit.git specify check
```

## Notes

- Generated files are written directly into this repository via bind mount.
- The `-Ai` parameter controls which agent folder receives slash commands:
  - `codex` → `.codex/prompts/`
  - `claude` → `.claude/commands/`
- The `.specify/` directory (templates, scripts, constitution) is shared across agents.
- If `.specify/memory/constitution.md` is customized, back it up before re-running init with `--force`.
