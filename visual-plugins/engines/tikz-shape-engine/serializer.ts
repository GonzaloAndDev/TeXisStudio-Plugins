import type { TikzShape, Coordinate } from "./types.js";

function coordStr(c: Coordinate): string {
  const unit = c.unit ?? "cm";
  return `(${c.x}${unit}, ${c.y}${unit})`;
}

function optStr(shape: TikzShape): string {
  const parts: string[] = [];
  if (shape.lineStyle && shape.lineStyle !== "solid") parts.push(shape.lineStyle);
  if (shape.lineWidth) parts.push(`line width=${shape.lineWidth}`);
  if (shape.color && shape.color !== "black") parts.push(`draw=${shape.color}`);
  if (shape.fill) parts.push(`fill=${shape.fill}`);
  if (shape.arrowTip) parts.push(shape.arrowTip);
  if (shape.options) parts.push(shape.options);
  return parts.length > 0 ? `[${parts.join(", ")}]` : "";
}

export function serializeShape(shape: TikzShape): string {
  const opts = optStr(shape);
  const coords = shape.coords;

  switch (shape.type) {
    case "point":
      return `\\filldraw${opts} ${coordStr(coords[0] ?? { x: 0, y: 0 })} circle (1.5pt);`;

    case "line": {
      const pts = coords.map(coordStr).join(" -- ");
      return `\\draw${opts} ${pts};`;
    }

    case "arrow": {
      const from = coordStr(coords[0] ?? { x: 0, y: 0 });
      const to   = coordStr(coords[1] ?? { x: 1, y: 0 });
      const arrowOpts = opts || "[-stealth]";
      return `\\draw${arrowOpts} ${from} -- ${to};`;
    }

    case "rectangle": {
      const from = coordStr(coords[0] ?? { x: 0, y: 0 });
      const to   = coordStr(coords[1] ?? { x: 1, y: 1 });
      return `\\draw${opts} ${from} rectangle ${to};`;
    }

    case "circle": {
      const center = coordStr(coords[0] ?? { x: 0, y: 0 });
      const radius = coords[1]?.x ?? 1;
      return `\\draw${opts} ${center} circle (${radius}cm);`;
    }

    case "ellipse": {
      const center = coordStr(coords[0] ?? { x: 0, y: 0 });
      const rx = coords[1]?.x ?? 1;
      const ry = coords[1]?.y ?? 0.5;
      return `\\draw${opts} ${center} ellipse (${rx}cm and ${ry}cm);`;
    }

    case "label": {
      const pos = coordStr(coords[0] ?? { x: 0, y: 0 });
      const anchor = shape.options ?? "center";
      return `\\node[anchor=${anchor}] at ${pos} {${shape.label ?? ""}};`;
    }

    case "axis": {
      const x = coords[1]?.x ?? 4;
      const y = coords[1]?.y ?? 3;
      const o = coordStr(coords[0] ?? { x: 0, y: 0 });
      return [
        `\\draw[-stealth] ${o} -- (${x}cm, 0cm) node[right] {$x$};`,
        `\\draw[-stealth] ${o} -- (0cm, ${y}cm) node[above] {$y$};`,
      ].join("\n  ");
    }

    case "vector": {
      const from = coordStr(coords[0] ?? { x: 0, y: 0 });
      const to   = coordStr(coords[1] ?? { x: 1, y: 1 });
      const label = shape.label ? ` node[midway, above] {$${shape.label}$}` : "";
      return `\\draw[-stealth, thick] ${from} -- ${to}${label};`;
    }

    case "angle": {
      const vertex = coordStr(coords[0] ?? { x: 0, y: 0 });
      const a = coords[1]?.x ?? 0;
      const b = coords[1]?.y ?? 45;
      const r = coords[2]?.x ?? 0.5;
      const label = shape.label ?? "";
      return `\\draw ${vertex} ++(${a}:${r}cm) arc (${a}:${b}:${r}cm) node[midway] {$${label}$};`;
    }

    case "polygon": {
      const pts = coords.map(coordStr).join(" -- ");
      return `\\draw${opts} ${pts} -- cycle;`;
    }

    case "arc": {
      const center = coordStr(coords[0] ?? { x: 0, y: 0 });
      const start = coords[1]?.x ?? 0;
      const end   = coords[1]?.y ?? 90;
      const r     = coords[2]?.x ?? 1;
      return `\\draw${opts} ${center} ++(${start}:${r}cm) arc (${start}:${end}:${r}cm);`;
    }

    case "bezier": {
      const [p0, c1, c2, p1] = coords;
      if (!p0 || !c1 || !c2 || !p1) return "% bezier: insufficient control points";
      return `\\draw${opts} ${coordStr(p0)} .. controls ${coordStr(c1)} and ${coordStr(c2)} .. ${coordStr(p1)};`;
    }

    default:
      return `% unknown shape type: ${shape.type}`;
  }
}

export function wrapInTikzPicture(lines: string[], libraries: string[] = []): string {
  const libStr = libraries.length > 0 ? `\\usetikzlibrary{${libraries.join(",")}}\n` : "";
  return [
    `${libStr}\\begin{tikzpicture}`,
    ...lines.map(l => `  ${l}`),
    `\\end{tikzpicture}`,
  ].join("\n");
}
