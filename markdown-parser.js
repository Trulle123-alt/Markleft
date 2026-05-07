export function parseMarkdown(markdown) {
  return markdown

    // line
    .replace(/^---(.*$)/gim, "<hr>")

    // headigs
    .replace(/^###### (.*$)/gim, "<h6>$1</h6>")
    .replace(/^##### (.*$)/gim, "<h5>$1</h5>")
    .replace(/^#### (.*$)/gim, "<h4>$1</h4>")
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")

    // emphasis
    .replace(/\*(.*?)\*/gim, "<strong>$1</strong>")
    .replace(/\/(.*?)\//gim, "<em>$1</em>")
    .replace(/_(.*?)_/gim, "<u>$1</u>")
    .replace(/\-(.*?)\-/gim, "<s>$1</s>")
    
    // blockquote
    .replace(/^(?:> .*(?:\r?\n|$))+/gm, (block) => {
      const content = block
        .trimEnd()
        .split(/\r?\n/)
        .map((line) => line.replace(/^> ?/, ""))
        .join("<br>");
      return `<blockquote>${content}</blockquote>`;})
      
    // orderd list
    .replace(/^(?:[0-999999]\. .*(?:\r?\n|$))+/gm, (block) => {
      const content = block
        .trimEnd()
        .split(/\r?\n/)
        .map((line) => line.replace(/^[0-999999]\. ?/, ""))
        .map((line) => `<li>${line}</li>`)
        .join("");
      return `<ol>${content}</ol>`;})
    
    // newline
    .split(/\r?\n/)
    .map((line) => {
      const isBlockElement = /^<(h[1-6]|hr)>/.test(line);
      return isBlockElement ? line : `${line}<br>`;
    }).join("");
}