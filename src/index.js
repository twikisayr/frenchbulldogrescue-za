export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    const xfp = request.headers.get("x-forwarded-proto");
    const cfVisitor = request.headers.get("cf-visitor");
    const visitorSaysHttps = cfVisitor && /"scheme"\s*:\s*"https"/i.test(cfVisitor);
    const isHttps = xfp === "https" || visitorSaysHttps || url.protocol === "https:";

    if (!isHttps) {
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
