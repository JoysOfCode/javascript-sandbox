import { transform } from 'https://cdn.skypack.dev/@babel/standalone'
import { createEl, getEl } from './utility.js'

const iframeEl = getEl('iframe')
const errorsEl = getEl('errors')

const editorEl = getEl('editor')
const sourceEl = getEl('source')

const importsMatchRegex = /import(?:["'\s]*([\w*{}\n\r\t, ]+)from\s*)?["'\s].*([@\w/_-]+)["'\s].*/g
const stringMatchRegex = /\/\*#__PURE__\*\//g

function getCode() {
  return editorEl.value
}

function format(string, regex, replacement = '') {
  return string.replace(regex, replacement).trim()
}

function transpileCode(code) {
  const codeToTranspile = format(code, importsMatchRegex)

  const options = { presets: ['es2015-loose', 'react'] }
  const { code: babelCode } = transform(codeToTranspile, options)

  const transpiledCode = format(babelCode, stringMatchRegex)

  sourceEl.innerHTML = ''

  const titleEl = createEl('h3', '📜 Source')
  const preEl = createEl('pre', transpiledCode)

  sourceEl.append(titleEl, preEl)
}

function setIframeContent(code) {
  const source = `
    <html>
    <head>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');

        body {
          font-family: 'Inter', sans-serif;
          overflow: hidden;
        }

        .app {
          padding: 0 2rem;
          color: snow;
        }

        .app a {
          color: wheat;
        }
      </style>
    </head>
    <body>
      <div id="app"></div>

      <script src="https://cdn.skypack.dev/@babel/standalone" type="module"></script>
      <script type="text/babel" data-type="module">
        ${code}
      </script>
    </body>
    </html>
  `

  iframeEl.srcdoc = source
}

function updateUI() {
  const code = getCode()

  setIframeContent(code)
  transpileCode(code)
}

function handleKeyUp() {
  updateUI()
}

editorEl.addEventListener('keyup', handleKeyUp)

updateUI()
