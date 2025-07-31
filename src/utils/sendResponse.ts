import { Response } from "express";

interface IResponse<T = null> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}
export const sendResponse = (res: Response, data: IResponse) => {
  res.status(data.statusCode).json(data);
};
export default sendResponse;
