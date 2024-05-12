export interface Tool {
  toolGroupID: number;
  toolId: number;
  name: string;
}

export interface IconTool extends Tool {
  icon: string;
}
