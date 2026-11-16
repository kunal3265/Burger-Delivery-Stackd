// Folds the `offline` build into one Stackd.html: CSS, JS, favicon and every
// image embedded, with the script at the end of <body> (inline scripts ignore
// `defer`, so it has to run after #root exists). The result opens from file://.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

// fileURLToPath, because this project path contains a space (%20 in a URL path).
const root = fileURLToPath(new URL('..', import.meta.url))
const out = join(root, 'offline')
const dataUri = (file, mime) => `data:${mime};base64,` + readFileSync(join(out, file)).toString('base64')
const byExt = (ext) => readdirSync(join(out, 'assets')).find((f) => f.endsWith(ext))

let html = readFileSync(join(out, 'index.html'), 'utf8')
let js = readFileSync(join(out, 'assets', byExt('.js')), 'utf8')
const css = readFileSync(join(out, 'assets', byExt('.css')), 'utf8')

// asset() minifies to e=>`./images/${e}`: make it the identity, then embed each file.
const before = js
js = js.replace(/`\.\/images\/\$\{(\w+)\}`/, '$1')
if (js === before) throw new Error('image URL construction not found')

// Every replacement below is a function: the bundle is full of $ sequences
// ($&, $`, $') that a string replacement would expand and duplicate the page.
const images = readdirSync(join(out, 'images')).filter((f) => f.endsWith('.webp'))
for (const name of images) {
  const literal = '`' + name + '`'
  if (!js.includes(literal)) throw new Error(`no literal for ${name}`)
  js = js.replace(literal, () => '"' + dataUri(join('images', name), 'image/webp') + '"')
}

html = html.replace(/<link rel="stylesheet" href="[^"]*">/, () => '<style>\n' + css + '\n</style>')
html = html.replace(/<link rel="icon"[^>]*>/, () => `<link rel="icon" href="${dataUri('favicon.svg', 'image/svg+xml')}">`)
html = html.replace(/\s*<script defer src="[^"]*"><\/script>/, '')
html = html.replace('</body>', () => '<script>\n' + js + '\n</script>\n  </body>')

writeFileSync(join(root, 'Stackd.html'), html)
console.log(`Stackd.html written (${(html.length / 1048576).toFixed(2)} MB, ${images.length} images embedded)`)
