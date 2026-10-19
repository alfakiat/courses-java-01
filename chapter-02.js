'use strict';
const byId = id => document.getElementById(id);
const escapeHTML = text => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
// Tokenize source before escaping so strings and comments remain intact.
function highlightJava(source) {
  const tokens = /\/\*[\s\S]*?\*\/|\/\/[^\n]*|"(?:\\.|[^"\\])*"|\b(?:public|class|static|void)\b|\b(?:HelloWorld|String|System)\b|\b(?:main|println)(?=\s*\()|\bout\b/g;
  let result = '', position = 0;
  for (const match of source.matchAll(tokens)) {
    result += escapeHTML(source.slice(position, match.index));
    const token = match[0];
    const kind = token.startsWith('/') ? 'comment' : token.startsWith('"') ? 'string' : /^(public|class|static|void)$/.test(token) ? 'keyword' : /^(HelloWorld|String|System)$/.test(token) ? 'type' : token === 'out' ? 'field' : 'method';
    result += `<span class="java-${kind}">${escapeHTML(token)}</span>`;
    position = match.index + token.length;
  }
  return result + escapeHTML(source.slice(position));
}
if (byId('syntax-code')) {
  const lines = ['public class HelloWorld {', '    public static void main(String[] args) {', '        System.out.println("Hello, Java!");', '    }', '}'];
  const descriptions = {class:'The public class HelloWorld belongs in HelloWorld.java. Capitalization must match.',main:'The standard course entry point is public static void main(String[] args). The JVM launches the program here.',print:'System.out.println sends text to the standard output stream, then adds a line terminator.'};
  function showSyntax(kind) {
    const selected = {class:0,main:1,print:2}[kind];
    byId('syntax-code').innerHTML = lines.map((line,i) => i === selected ? `<mark>${highlightJava(line)}</mark>` : highlightJava(line)).join('\n');
    byId('syntax-description').textContent = descriptions[kind];
    document.querySelectorAll('[data-syntax]').forEach(button => button.setAttribute('aria-pressed',String(button.dataset.syntax === kind)));
  }
  document.querySelectorAll('[data-syntax]').forEach(button => button.addEventListener('click',() => showSyntax(button.dataset.syntax)));
  showSyntax('class');
  function showComment() {
    const kind = byId('comment-style').value;
    const statement = 'System.out.println("Hidden message");';
    byId('comment-code').innerHTML = highlightJava((kind === 'line' ? '// ' + statement : kind === 'block' ? '/*\n' + statement + '\n*/' : statement) + '\nSystem.out.println("Hello, Java!");');
    byId('comment-output').textContent = (kind === 'none' ? 'Hidden message\n' : '') + 'Hello, Java!\n';
  }
  byId('comment-style').addEventListener('change', showComment); showComment();
}
const reserved = new Set(('abstract assert boolean break byte case catch char class const continue default do double else enum extends final finally float for goto if implements import instanceof int interface long native new package private protected public return short static strictfp super switch synchronized this throw throws transient try void volatile while _ true false null').split(' '));
if (byId('identifier')) {
  function checkName() {
    const name=byId('identifier').value;
    const valid=/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(name) && !reserved.has(name);
    byId('identifier-result').textContent=valid ? '✓ Valid ASCII identifier. Use clear, descriptive names.' : !name ? 'Enter an identifier to check.' : reserved.has(name) ? '✕ This name is reserved. Choose another name.' : '✕ Start with a letter, $ or _. Use only letters, digits, $ and _ in this checker.';
    byId('identifier-result').className='result '+(valid?'valid':'invalid');
  }
  byId('identifier').addEventListener('input',checkName);checkName();
}
if (byId('print-output')) {
  const examples = {"newline": ["Hello\\nJava", "A newline moves the next text to a new line."], "tab": ["Item\\tPrice", "A tab advances to the next tab stop."], "quote": ["Say \\\"Java\\\"", "Escape double quotes to include them inside a Java string."], "slash": ["C:\\\\Java", "Two backslashes in source produce one in the output."], "single": ["It\\'s Java", "Escaping single quotes is optional inside double-quoted Java strings."], "mixed": ["Item\\tPrice\\n\\\"Monitor\\\"\\t$150", "Combine tabs, newlines, and quotes in one string."]};
  const choices = document.querySelectorAll('[data-escape]');
  function decodeString(source) {
    const escapes = {"n": "\n", "t": "\t", "\"": "\"", "'": "'", "\\": "\\"};
    let output='';
    for (let i=0;i<source.length;i++) {
      if (source[i] === "\\") {
        const next=source[++i];
        if (!Object.hasOwn(escapes,next)) throw new Error(next === undefined ? 'Finish the escape sequence after the final backslash.' : 'Unsupported escape sequence. Choose one of the options above.');
        output+=escapes[next];
      } else {
        if (source[i] === '"') throw new Error("Escape double quotes as \\\" inside a Java string.");
        output+=source[i];
      }
    }
    return output;
  }
  function simulate() {
    const source=byId('escape-input').value;
    const method=byId('print-method').value;
    byId('print-code').textContent=`System.out.${method}("${source}");\nSystem.out.println("Next");`;
    try {
      let output=decodeString(source)+(method==='println'?'\n':'')+'Next\n';
      if (byId('show-whitespace').checked) output=output.replaceAll(' ','·').replaceAll('\t','→\t').replaceAll('\n','↵\n');
      byId('print-output').textContent=output;
      byId('escape-error').textContent='';
      byId('escape-input').setAttribute('aria-invalid','false');
    } catch (error) {
      byId('escape-error').textContent=error.message;
      byId('escape-input').setAttribute('aria-invalid','true');
      byId('print-output').textContent='Fix the string above to preview its output.';
    }
  }
  function selectExample(key) {
    byId('escape-input').value=examples[key][0];
    byId('escape-description').textContent=examples[key][1];
    choices.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.escape===key)));
    simulate();
  }
  function customInput() {
    choices.forEach(button=>button.setAttribute('aria-pressed','false'));
    byId('escape-description').textContent='Custom string — combine supported escapes and watch the output update.';
    simulate();
  }
  choices.forEach(button=>button.addEventListener('click',()=>selectExample(button.dataset.escape)));
  document.querySelectorAll('[data-insert]').forEach(button=>button.addEventListener('click',()=>{
    const input=byId('escape-input');
    input.setRangeText(button.dataset.insert,input.selectionStart,input.selectionEnd,'end');
    input.focus();customInput();
  }));
  byId('escape-input').addEventListener('input',customInput);
  byId('print-method').addEventListener('change',simulate);
  byId('show-whitespace').addEventListener('change',simulate);
  selectExample('newline');
}
