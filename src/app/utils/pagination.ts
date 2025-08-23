/* eslint-disable @typescript-eslint/no-explicit-any */
export const getPagination = (q: any) => {
  const page = Math.max(parseInt(q.page as string) || 1, 1);
  const limit = Math.min(Math.max(parseInt(q.limit as string) || 10, 1), 100);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};
