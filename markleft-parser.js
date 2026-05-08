// ps: i konw this code is awfull but if it works it works? ;-;

function escapeHtml(text) {
  return text.replace(/[&<>]/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;"
    }[char]));
}

export function parseMarkdown(markdown) {
  return markdown

    // code
    .replace(/%<(.*?)>%/gims, (_, code) => {
      return `<pre><code>${escapeHtml(code)}</code></pre>`;})  
      
    // escaping
    .replace(/\\([\\*\/_\-=~^#[\]()!>%])/gim, (_, char) => {
      return `\uE000${char}\uE001`;})

    // line
    .replace(/^---(.*$)/gim, "<hr>")

    // image
    .replace(/\#\[([^\]]+)\]\(([^)]+)\)/gim, '<img src="$1" alt="$2">')

    // link
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$1">$2</a>')

    // headigs
    .replace(/^###### (.*?) \{#(.*?)\}$/gim, '<h6 id="$2">$1</h6>')
    .replace(/^##### (.*?) \{#(.*?)\}$/gim, '<h5 id="$2">$1</h5>')
    .replace(/^#### (.*?) \{#(.*?)\}$/gim, '<h4 id="$2">$1</h4>')
    .replace(/^### (.*?) \{#(.*?)\}$/gim, '<h3 id="$2">$1</h3>')
    .replace(/^## (.*?) \{#(.*?)\}$/gim, '<h2 id="$2">$1</h2>')
    .replace(/^# (.*?) \{#(.*?)\}$/gim, '<h1 id="$2">$1</h1>')

    .replace(/^###### (.*$)/gim, "<h6>$1</h6>")
    .replace(/^##### (.*$)/gim, "<h5>$1</h5>")
    .replace(/^#### (.*$)/gim, "<h4>$1</h4>")
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    
    // emphasis
    .replace(/[\s\S]*/, (text) => {
      let previous;
      do {
        previous = text;
        text = text
          .replace(/(^|[\s>])\*([^*\n]+?)\*(?=\s|$|[<.,!?;:])/gim, "$1<strong>$2</strong>")
          .replace(/(^|[\s>])\/([^/\n]+?)\/(?=\s|$|[<.,!?;:])/gim, "$1<em>$2</em>")
          .replace(/(^|[\s>])_([^_\n]+?)_(?=\s|$|[<.,!?;:])/gim, "$1<u>$2</u>")
          .replace(/(^|[\s>])\-([^- \n][^-\n]*?)\-(?=\s|$|[<.,!?;:])/gim, "$1<s>$2</s>")

          .replace(/(^|[\s>])=([^=\n]+?)=(?=\s|$|[<.,!?;:])/gim, "$1<mark>$2</mark>")

          .replace(/(^|[\s>])~([^~\s\n][^~\n]*?)~(?=\s|$|[<.,!?;:])/gim, "$1<sub>$2</sub>")
          .replace(/(^|[\s>])\^([^^\s\n][^^\n]*?)\^(?=\s|$|[<.,!?;:])/gim, "$1<sup>$2</sup>")

          .replace(/(^|[\s>])%([^%\s\n][^%\n]*?)%(?=\s|$|[<.,!?;:])/gim, "$1<code>$2</code>");
      } while (text !== previous);

      return text;})

    // blockquote
    .replace(/^(?:> .*(?:\r?\n|$))+/gm, (block) => {
      const content = block
        .trimEnd()
        .split(/\r?\n/)
        .map((line) => line.replace(/^> ?/, ""))
        .join("<br>");
      return `<blockquote>${content}</blockquote>`;})
      
    // lists
    .replace(/^(?:[0-999999]\. .*(?:\r?\n|$))+/gm, (block) => {
      const content = block
        .trimEnd()
        .split(/\r?\n/)
        .map((line) => line.replace(/^[0-999999]\. ?/, ""))
        .map((line) => `<li>${line}</li>`)
        .join("");
      return `<ol>${content}</ol>`;})

    .replace(/^(?:- .*(?:\r?\n|$))+/gm, (block) => {
      const content = block
        .trimEnd()
        .split(/\r?\n/)
        .map((line) => line.replace(/^- ?/, ""))
        .map((line) => `<li>${line}</li>`)
        .join("");
      return `<ul>${content}</ul>`;})
    
    // unescape
    .replace(/\uE000(.?)\uE001/gim, "$1")
    
    // newline
    .split(/\r?\n/)
    .map((line) => {
      const isBlockElement = /^<(h[1-6]|hr)(\s[^>]*)?>/.test(line);
      return isBlockElement ? line : `${line}<br>`;
    }).join("");
}