/*
 * This file is part of justoverclock/flarum-ext-keywords.
 *
 * Copyright (c) 2021 Marco Colia.
 * Special thanks to Askvortsov
 * https://flarum.it
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

import app from 'flarum/app';


export default function () {
  const post = this.attrs.post;

  const mappings = {
    "image.capomod.87rc.net": "!webp"
  }

  if (mappings === {}) return;
  if (Object.keys(mappings).length === 0) return;

  this.attrs.post.data.attributes.contentHtml = post.contentHtml().replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function (match, capture) {
    // console.log(match);
    // console.log(capture);
    var domain = capture.split('/');
    if (domain[2]) {
        domain = domain[2];
        let fixKey = mappings[domain.toLowerCase()];
          if (fixKey) {
            let newImg = match.replace(capture,capture+fixKey)
            return newImg;
          } else {
            return match
          }
    }else{
        return match
    }
  });
  
}
