export function makeResponse(response: any, data: any | any[] | undefined) {
  response['result'] = data;
  return response;
}
