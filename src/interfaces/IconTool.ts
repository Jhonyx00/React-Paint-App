export interface CurrentTool {
  toolGroupID: number;
  toolId: number;
  name: string;
}

export interface IconTool extends CurrentTool {
  icon: string;
}
