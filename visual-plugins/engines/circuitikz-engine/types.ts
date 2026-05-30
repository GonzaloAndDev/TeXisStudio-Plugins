export type ComponentType =
  | "resistor" | "capacitor" | "inductor"
  | "voltage-source" | "current-source" | "battery"
  | "ground" | "node" | "wire"
  | "switch" | "diode" | "zener"
  | "npn" | "pnp" | "nmos" | "pmos"
  | "op-amp" | "transformer"
  | "ammeter" | "voltmeter" | "ohmmeter"
  | "lamp" | "antenna";

export type Direction = "right" | "left" | "up" | "down";

export interface CircuitNode {
  id: string;
  x: number;
  y: number;
  label?: string;
}

export interface CircuitComponent {
  id: string;
  type: ComponentType;
  from: string;
  to: string;
  direction: Direction;
  label?: string;
  value?: string;
  options?: string;
}

export interface CircuitConnection {
  from: string;
  to: string;
}

export interface CircuiTikZDocument {
  engineId: "circuitikz-engine";
  version: string;
  nodes: CircuitNode[];
  components: CircuitComponent[];
  connections: CircuitConnection[];
  americanStyle: boolean;
}
