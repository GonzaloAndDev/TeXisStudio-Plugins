# Plugin Quality Standard

## Quality levels

### `official-core`
Reliable output. Recommended for theses and journal articles.
All 10 acceptance criteria must pass.

### `official-extended`
Acceptable output with documented limits.
Useful for typical cases; not a substitute for specialized professional tools.
Criteria 1–7 must pass. Criteria 8–10 may have documented exceptions.

### `experimental`
Optional, exploratory, or limited-scope.
Clearly marked in the UI. Must not be mistaken for professional output.
Criteria 1–4 must pass.

## Acceptance criteria (all official-core plugins)

1. Create a figure from scratch.
2. Save editable source (`source.json`).
3. Generate primary vector output (`.tex`, `.pdf`, or `.svg`).
4. Insert correct LaTeX block with ID markers.
5. Detect all required LaTeX packages.
6. Re-open the figure from the document by ID.
7. Modify the figure and regenerate output.
8. Compile successfully in a minimal LaTeX document.
9. Compile successfully inside a real thesis document.
10. All output paths are relative; no absolute paths.

## What disqualifies a plugin from official-core

- Outputs only PNG (not vector).
- Cannot re-open and edit existing figures.
- Requires undeclared external dependencies.
- Produces LaTeX that fails to compile without manual fixes.
- Does not store a `manifest.json`.
- Uses absolute file paths.
- Scope exceeds what LaTeX can represent well, without clear warnings.

## Scope warnings (required for extended and experimental)

Every plugin with limited scope must expose a `scopeWarning` string:

```typescript
scopeWarning: "Suitable for simplified metabolic schemes in theses or reports. Not a substitute for professional metabolic modeling or complex biological visualization tools."
```

This warning is displayed in the plugin selector UI.
