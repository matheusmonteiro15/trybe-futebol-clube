export default function translateStatusToHTTPCode(status: string): number {
  switch (status) {
    case 'SUCCESSFUL': return 200;
    case 'CREATED': return 201;
    case 'BAD_REQUEST': return 400;
    case 'UNAUTHORIZED': return 401;
    case 'NOT_FOUND': return 404;
    case 'UNPROCESSABLE': return 422;
    case 'INTERNAL_ERROR': return 500;
    default: return 500;
  }
}
