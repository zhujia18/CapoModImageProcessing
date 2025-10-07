import app from 'flarum/app';

export default function () {
  const post = this.attrs.post;

  const domainReplaceMappings = {
    "cdn.jsdelivr.net": "testingcf.jsdelivr.net"
  }

  const imageStyleMappings = {
    "oss-capomod.zasper.net": "!webp"
  }

  const httpsMappings = {
    "oss-capomod.zasper.net": "https://"
  }

  this.attrs.post.data.attributes.contentHtml = post.contentHtml()
    .replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function (match, capture) {
      console.log(match);
      console.log(capture);

      //解析域名
      let url = parseURL(capture)
      var hostname = url.hostname
      //处理图片域名
      if (domainReplaceMappings.hasOwnProperty(hostname)) {
        let newHostname = domainReplaceMappings[hostname.toLowerCase()];
        let newCapture = capture.replace(hostname, newHostname)
        match = match.replace(capture, newCapture)
        capture = newCapture
        hostname = newHostname
      }

      //处理图片样式
      if (imageStyleMappings.hasOwnProperty(hostname)) {
        let style = imageStyleMappings[hostname.toLowerCase()];
        if (!confirmEnding(capture, style) && !confirmEnding(capture, ".gif")) {
          let newCapture = capture + style
          match = match.replace(capture, capture + style)
          capture = newCapture
          console.log("newCapture");
          console.log(newCapture);
        }
      }

      //处理图片SSL
      if (httpsMappings.hasOwnProperty(hostname)) {
        let protocol = httpsMappings[hostname.toLowerCase()];
        if (!confirmBeginning(capture, protocol)) {
          match = match.replace("http://" + hostname, protocol + hostname)
        }
      }

      return match
    });
}

function parseURL(href) {
  let url = new URL(href)
  let params = new URLSearchParams(url.searchParams)
  let obj = new Object()
  Object.fromEntries(params)
  obj.protocol = url.protocol
  obj.hostname = url.hostname
  obj.port = url.port
  obj.pathname = url.pathname
  obj.search = params
  obj.hash = url.hash
  return obj;
}

function confirmBeginning(string, target) {
  return string.startsWith(target)
}

function confirmEnding(string, target) {
  return string.endsWith(target);
}
