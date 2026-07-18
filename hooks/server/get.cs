import { markdownHtmlFromGetContext } from '@relay/md';
import { ssrClientHookFromGetContext } from '@relay/ssr';

function wantsSiteShell(ctx) {
  try { if (ctx.embedMarkdownRequest === true) return true; } catch (e) {}
  try { if (ctx.siteShellRequest === true) return true; } catch (e) {}
  return false;
}

export default function run(ctx, next) {
  if (wantsSiteShell(ctx)) {
    var ssr = ssrClientHookFromGetContext(ctx, { clientHookPath: "hooks/client/get.jsx" });
    if (ssr !== null) { return ssr; }
  }
  var html = markdownHtmlFromGetContext(ctx);
  if (html !== null) { return html; }
  return next();
}
