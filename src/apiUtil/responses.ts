import { NextApiResponse } from 'next';

interface ApiResponse {
  message: string;
  data?: any;
}

export const response = (
  res: NextApiResponse,
  statusCode: number,
  message: string,
  data?: any
) => {
  return res.status(statusCode).json({
    message,
    data: data || [],
  } as ApiResponse);
};

export default response;
