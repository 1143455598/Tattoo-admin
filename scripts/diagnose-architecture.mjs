import { readFile } from "node:fs/promises"
import path from "node:path"

const root = process.cwd()
const filePath = path.join(root, "index.html")
const source = await readFile(filePath, "utf8")

const lineOf = (index) => source.slice(0, index).split("\n").length
const unique = (values) => [...new Set(values)].sort()
const matches = (regex, mapper = (match) => match[0]) => [...source.matchAll(regex)].map(mapper)
const section = (start, end) => source.slice(start, end)

const styleStart = source.indexOf("<style")
const styleEnd = source.indexOf("</style>")
const scriptStart = source.indexOf("<script", source.indexOf("</style>") + 8)
const scriptEnd = source.indexOf("</script>", scriptStart)
const htmlSource = section(0, styleStart === -1 ? source.length : styleStart)
const cssSource = styleStart === -1 || styleEnd === -1 ? "" : section(styleStart, styleEnd + 8)
const jsSource = scriptStart === -1 || scriptEnd === -1 ? "" : section(scriptStart, scriptEnd + 9)

const ids = matches(/\bid=["']([^"']+)["']/g, (match) => match[1])
const classes = matches(/\bclass=["']([^"']+)["']/g, (match) => match[1].split(/\s+/)).flat()
const functions = matches(/(?:async\s+)?function\s+([A-Za-z_$][\w$]*)\s*\(/g, (match) => match[1])
const arrowFunctions = matches(/(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?\([^)]*\)\s*=>/g, (match) => match[1])
const inlineHandlers = matches(/\b(?:onclick|onchange|onsubmit|oninput|onkeydown|onkeyup|onfocus|onblur)=["'][^"']+["']/gi, (match) => match[0])
const tables = matches(/\.from\(\s*["']([^"']+)["']\s*\)/g, (match) => match[1])
const storageKeys = matches(/(?:localStorage|sessionStorage)\.(?:getItem|setItem|removeItem)\(\s*["']([^"']+)["']/g, (match) => match[1])
const externalResources = matches(/(?:src|href)=["'](https?:\/\/[^"']+)["']/gi, (match) => match[1])
const globals = matches(/\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=/g, (match) => match[1])
const eventListeners = matches(/addEventListener\(\s*["']([^"']+)["']/g, (match) => match[1])
const navigationTargets = matches(/(?:goPage|openPanel|openModal)\(\s*["']([^"']+)["']/g, (match) => match[1])
const supabaseOperations = matches(/\.([a-z]+)\(/g, (match) => match[1]).filter((name) => ["select", "insert", "update", "delete", "upsert", "eq", "order", "single", "maybeSingle"].includes(name))
const featureMarkers = matches(/(?:id|class)=["']([^"']*(?:dashboard|agenda|cliente|artist|invent|finan|galer|cotiz|tienda|sorte|admin|login|carrito|modal)[^"']*)["']/gi, (match) => match[1])

const result = {
  generatedAt: new Date().toISOString(),
  source: {
    file: "index.html",
    bytes: Buffer.byteLength(source),
    lines: source.split("\n").length,
    sections: {
      html: { lines: htmlSource.split("\n").length, startLine: 1 },
      css: { lines: cssSource.split("\n").length, startLine: styleStart === -1 ? null : lineOf(styleStart) },
      javascript: { lines: jsSource.split("\n").length, startLine: scriptStart === -1 ? null : lineOf(scriptStart) },
    },
  },
  structure: {
    uniqueIds: unique(ids),
    duplicateIds: unique(ids.filter((id, index) => ids.indexOf(id) !== index)),
    uniqueClasses: unique(classes),
    inlineHandlers: inlineHandlers.length,
    inlineHandlerSamples: inlineHandlers.slice(0, 20),
  },
  javascript: {
    namedFunctions: unique(functions),
    arrowFunctions: unique(arrowFunctions),
    globalDeclarations: unique(globals),
    eventTypes: unique(eventListeners),
    navigationTargets: unique(navigationTargets),
  },
  dataAndIntegrations: {
    supabaseTables: unique(tables),
    supabaseOperations: unique(supabaseOperations),
    browserStorageKeys: unique(storageKeys),
    externalResources: unique(externalResources),
  },
  featureMarkers: unique(featureMarkers),
  riskSignals: {
    innerHTMLUsages: (source.match(/\.innerHTML\s*=/g) || []).length,
    documentWriteUsages: (source.match(/document\.write\s*\(/g) || []).length,
    evalUsages: (source.match(/\beval\s*\(/g) || []).length,
    base64References: (source.match(/base64|data:image\//gi) || []).length,
    localStorageReferences: (source.match(/localStorage/gi) || []).length,
    passwordReferences: (source.match(/password|contraseña/gi) || []).length,
    directSupabaseReferences: (source.match(/\bdb\s*\.from\s*\(/g) || []).length,
  },
}

console.log(JSON.stringify(result, null, 2))
