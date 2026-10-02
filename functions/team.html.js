export function onRequestGet(context) {
  return Response.redirect(new URL("/about", context.request.url), 301);
}
