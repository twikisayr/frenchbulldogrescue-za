export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.protocol !== "https:") {
      url.protocol = "https:";
      return Response.redirect(url.toString(), 301);
    }

    if (url.hostname === "www.frenchbulldogrescue.co.za") {
      url.hostname = "frenchbulldogrescue.co.za";
      return Response.redirect(url.toString(), 301);
    }

    return env.ASSETS.fetch(request);
  },
};
