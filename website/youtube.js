module.exports = function enableYoutube(md) {
  const linkOpenRenderer = md.renderer.rules.link_open;
  const linkCloseRenderer = md.renderer.rules.link_close;

  md.renderer.rules.link_open = function(tokens, idx, options, env) {
    const href = tokens[idx].href;
    const id = getYoutubeId(href);

    if (!id) return linkOpenRenderer(tokens, idx, options, env);

    env.youtube = true;
    env.youtubeHasTitle = false;

    let html = `<div class="embed-yt">
      <div class="embed-yt-iframe"><iframe width="560" height="315" src="https://www.youtube.com/embed/${id}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;

    const nextNode = tokens[idx + 1];
    if (!!getYoutubeId(nextNode.content)) {
      nextNode.content = "";
    } else {
      env.youtubeHasTitle = true;
      html += `<div class="embed-yt-title">`;
    }

    return html;
  };

  md.renderer.rules.link_close = function(tokens, idx, options, env) {
    if (!env.youtube) return linkCloseRenderer(tokens, idx, options, env);

    env.youtube = false;
    if (env.youtubeHasTitle) {
      env.youtubeHasTitle = false;
      return "</div></div>";
    }

    return "</div>";
  };
};

function getYoutubeId(href) {
  let id = null;
  if (!href) return id;

  if (href.startsWith("https://www.youtube.com/watch?v=")) {
    id = href.substring("https://www.youtube.com/watch?v=".length);
    if (id.indexOf("&") > 0) {
      id = id.substring(0, id.indexOf("&"));
    }
  }
  if (href.startsWith("https://youtu.be/")) {
    id = href.substring("https://youtu.be/".length);
    if (id.indexOf("?") > 0) {
      id = id.substring(0, id.indexOf("?"));
    }
  }

  return id && id.length ? id : null;
}
