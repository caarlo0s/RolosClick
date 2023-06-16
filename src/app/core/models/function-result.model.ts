export interface FunctionResult {
  code: FnCode;
  message: string;
  result?: any;
}

export enum FnCode {
  OK,
  NOK
};
