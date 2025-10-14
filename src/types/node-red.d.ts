declare module '@node-red/registry' {
  export interface NodeAPI {
    nodes: {
      createNode(node: any, props: any): void;
      registerType(type: string, constructor: any): void;
    };
  }
}

declare module '@node-red/nodes' {
  export interface Node {
    id: string;
    type: string;
    name?: string;
    wires: string[][];
    log(msg: any): void;
    error(logMessage: string, msg?: any): void;
    warn(logMessage: string): void;
    debug(logMessage: string): void;
    trace(logMessage: string): void;
    send(msg: any | any[]): void;
    on(event: string, callback: (msg: any) => void): void;
    status(status: { fill: string; shape: string; text: string }): void;
    context(): any;
  }

  export interface NodeDef {
    id: string;
    type: string;
    name: string;
    wires: string[][];
  }

  export interface EditorNodeProperties {
    category: string;
    color: string;
    icon: string;
    paletteLabel: string;
    inputs: number;
    outputs: number;
    align: string;
  }
}

declare module '@node-red/runtime' {
  export interface Red {
    nodes: {
      registerType(type: string, constructor: any): void;
    };
  }
}
