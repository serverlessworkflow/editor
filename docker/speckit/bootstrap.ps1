param(
  [ValidateSet('codex','claude')]
  [string]$Ai = "codex",
  [string]$ArgsForSpecify = "init --here --force --ai $Ai --script ps --ai-skills"
)

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "../..")

$cmd = "docker run --rm -v `"$($repoRoot.Path):/workspace`" -w /workspace ghcr.io/astral-sh/uv:python3.12-bookworm uvx --from git+https://github.com/github/spec-kit.git specify $ArgsForSpecify"

Write-Host "Running: $cmd"
Invoke-Expression $cmd
