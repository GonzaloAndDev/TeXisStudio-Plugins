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

/**
 * Compute the best label placement for a vector/arrow given its direction.
 * - Horizontal edges  → label above/below (midway, above)
 * - Vertical edges    → label to the right (midway, right)
 * - Diagonal edges    → label above (midway, above, sloped)
 */
function vectorLabelPos(from: Coordinate, to: Coordinate): string {
  const dx = (to.x ?? 0) - (from.x ?? 0);
  const dy = (to.y ?? 0) - (from.y ?? 0);
  const adx = Math.abs(dx);
  const ady = Math.abs(dy);

  if (ady > adx * 2) {
    // Mostly vertical → place right
    return "midway, right, font=\\small";
  }
  if (adx > ady * 2) {
    // Mostly horizontal → place above
    return "midway, above, font=\\small";
  }
  // Diagonal → sloped is acceptable
  return "midway, above, sloped, font=\\small";
}

export function serializeShape(shape: TikzShape): string {
  const opts = optStr(shape);
  const coords = shape.coords;

  switch (shape.type) {
    case "point": {
      const pos = coordStr(coords[0] ?? { x: 0, y: 0 });
      const fillOpt = opts || "[fill=black]";
      const labelStr = shape.label
        ? ` node[above right, font=\\small] {${shape.label}}`
        : "";
      // filldraw the dot + optional label node
      return `\\filldraw${fillOpt} ${pos} circle (2pt)${labelStr};`;
    }

    case "line": {
      const pts = coords.map(coordStr).join(" -- ");
      return `\\draw${opts} ${pts};`;
    }

    case "arrow": {
      const from = coordStr(coords[0] ?? { x: 0, y: 0 });
      const to   = coordStr(coords[1] ?? { x: 1, y: 0 });
      const arrowOpts = opts || "[-stealth]";
      const labelStr = shape.label
        ? ` node[${vectorLabelPos(coords[0] ?? { x:0,y:0 }, coords[1] ?? { x:1,y:0 })}] {$${shape.label}$}`
        : "";
      return `\\draw${arrowOpts} ${from} -- ${to}${labelStr};`;
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
      const opt = shape.options ?? "center";
      // Positional shorthand words → anchor values (PGF math can't parse 'right' as anchor)
      const ANCHOR_MAP: Record<string, string> = {
        right: "west", left: "east", above: "south", below: "north",
        "above right": "south west", "above left": "south east",
        "below right": "north west", "below left": "north east",
      };
      const anchor = ANCHOR_MAP[opt] ?? opt;
      return `\\node[anchor=${anchor}, font=\\small] at ${pos} {${shape.label ?? ""}};`;
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
      const from = coords[0] ?? { x: 0, y: 0 };
      const to   = coords[1] ?? { x: 1, y: 1 };
      const labelPos = vectorLabelPos(from, to);
      const labelStr = shape.label ? ` node[${labelPos}] {$${shape.label}$}` : "";
      return `\\draw[-stealth, thick] ${coordStr(from)} -- ${coordStr(to)}${labelStr};`;
    }

    case "angle": {
      // Draw an arc at the vertex between angle a and b at radius r.
      // Uses \pic for a clean angle mark with optional label.
      const v   = coords[0] ?? { x: 0, y: 0 };
      const a   = coords[1]?.x ?? 0;
      const b   = coords[1]?.y ?? 45;
      const r   = coords[2]?.x ?? 0.5;
      const label = shape.label ?? "";
      // Generate two named helper coordinates, then use arc
      const vStr = coordStr(v);
      return [
        `\\draw ${vStr} ++(${a}:${r}cm) arc (${a}:${b}:${r}cm);`,
        ...(label ? [`\\node at ${coordStr({ x: v.x + r * 0.65 * Math.cos(((a + b) / 2) * Math.PI / 180), y: v.y + r * 0.65 * Math.sin(((a + b) / 2) * Math.PI / 180) })} {$${label}$};`] : []),
      ].join("\n  ");
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
      return `% unknown shape type: ${(shape as { type: string }).type}`;
  }
}

export function wrapInTikzPicture(lines: string[], libraries: string[] = []): string {
  // Always include calc for angle label positioning — added after user-supplied libs
  const allLibs = [...new Set([...libraries, "calc"])];
  const libStr = `\\usetikzlibrary{${allLibs.join(",")}}\n`;
  return [
    `${libStr}\\begin{tikzpicture}`,
    ...lines.map(l => `  ${l}`),
    `\\end{tikzpicture}`,
  ].join("\n");
}
