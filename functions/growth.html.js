export function onRequestGet(context) {
  return Response.redirect(new URL("/", context.request.url), 301);
}
