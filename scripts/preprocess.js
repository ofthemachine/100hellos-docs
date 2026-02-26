#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')

const HELLOS_DIR = process.env.HELLOS_DIR || '/mnt/100hellos'
const FRAGLET_DIR = process.env.FRAGLET_DIR || '/mnt/fraglet'
const OUTPUT_DIR = process.env.OUTPUT_DIR || path.join(__dirname, '..', 'src', 'content', 'languages')
const PAGES_DIR = process.env.PAGES_DIR || path.join(__dirname, '..', 'src', 'content', 'pages')
const METADATA_PATH = process.env.METADATA_PATH || path.join(__dirname, '..', 'languages-metadata.yml')

function loadYaml(filePath) {
  return yaml.load(fs.readFileSync(filePath, 'utf8'))
}

function tryRead(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8')
  } catch {
    return null
  }
}

function isDirectory(p) {
  try {
    return fs.statSync(p).isDirectory()
  } catch {
    return false
  }
}

function loadNoPublish() {
  const content = tryRead(path.join(HELLOS_DIR, '.no-publish'))
  if (!content) return new Set()
  return new Set(
    content.split('\n')
      .map(l => l.replace(/#.*/, '').trim())
      .filter(l => l.length > 0)
  )
}

function loadVeinsMap() {
  const veinsPath = path.join(FRAGLET_DIR, 'pkg', 'embed', 'veins.yml')
  const data = loadYaml(veinsPath)
  const map = new Map()
  for (const vein of data.veins) {
    map.set(vein.name, vein)
  }
  return map
}

function loadBuildSchedule() {
  const dayNames = {
    mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday',
    thu: 'Thursday', fri: 'Friday', sat: 'Saturday', sun: 'Sunday'
  }
  const schedule = new Map()
  for (const [abbr, dayName] of Object.entries(dayNames)) {
    const content = tryRead(path.join(HELLOS_DIR, `.build-batch-${abbr}`))
    if (!content) continue
    const langs = content.split('\n')
      .map(l => l.replace(/#.*/, '').trim())
      .filter(l => l.length > 0)
    for (const lang of langs) {
      schedule.set(lang, dayName)
    }
  }
  return schedule
}

function loadMetadata() {
  const entries = loadYaml(METADATA_PATH)
  const map = new Map()
  for (const entry of entries) {
    map.set(entry.slug, entry)
  }
  return map
}

function discoverLanguages() {
  const noPublish = loadNoPublish()
  const entries = fs.readdirSync(HELLOS_DIR)
  return entries.filter(name => {
    if (name.startsWith('.')) return false
    if (noPublish.has(name)) return false
    if (!isDirectory(path.join(HELLOS_DIR, name))) return false
    if (/^[A-Z]/.test(name)) return false
    if (/^[0-9]/.test(name)) return false
    if (name === 'batch-of-10.sh') return false
    return true
  }).sort()
}

function findHelloWorldFile(langDir) {
  const filesDir = path.join(langDir, 'files')
  if (!isDirectory(filesDir)) return null
  const files = fs.readdirSync(filesDir)
    .filter(f => f.startsWith('hello-world') || f.startsWith('hello_world') || f.startsWith('HelloWorld'))
    .filter(f => !isDirectory(path.join(filesDir, f)))
  return files[0] || null
}

function readHelloWorldSource(langDir) {
  const helloFile = findHelloWorldFile(langDir)
  if (!helloFile) return { file: null, content: null }
  const content = tryRead(path.join(langDir, 'files', helloFile))
  return { file: helloFile, content }
}

function extensionToLanguageHint(ext) {
  const map = {
    '.py': 'python', '.rb': 'ruby', '.js': 'javascript', '.ts': 'typescript',
    '.go': 'go', '.rs': 'rust', '.java': 'java', '.c': 'c', '.cpp': 'cpp',
    '.cs': 'csharp', '.fs': 'fsharp', '.hs': 'haskell', '.ml': 'ocaml',
    '.ex': 'elixir', '.exs': 'elixir', '.erl': 'erlang', '.clj': 'clojure',
    '.scala': 'scala', '.kt': 'kotlin', '.lua': 'lua', '.pl': 'perl',
    '.php': 'php', '.r': 'r', '.R': 'r', '.jl': 'julia', '.dart': 'dart',
    '.swift': 'swift', '.sh': 'bash', '.bash': 'bash', '.zsh': 'bash',
    '.zig': 'zig', '.nim': 'nim', '.d': 'd', '.v': 'v', '.cr': 'crystal',
    '.pas': 'pascal', '.f90': 'fortran', '.f': 'fortran', '.cob': 'cobol',
    '.adb': 'ada', '.ads': 'ada', '.vb': 'vbnet', '.groovy': 'groovy',
    '.coffee': 'coffeescript', '.rkt': 'racket', '.scm': 'scheme',
    '.lisp': 'lisp', '.lsp': 'lisp', '.tcl': 'tcl', '.awk': 'awk',
    '.sed': 'bash', '.sml': 'sml', '.st': 'smalltalk', '.fan': 'text',
    '.odin': 'text', '.gleam': 'text', '.wren': 'text', '.pony': 'text',
    '.ha': 'text', '.asm': 'nasm', '.s': 'nasm', '.wat': 'wasm',
    '.chpl': 'text', '.bal': 'text', '.nix': 'nix', '.idr': 'haskell',
    '.ceylon': 'text', '.m': 'objectivec', '.mm': 'objectivec',
    '.raku': 'perl6', '.zombie': 'text', '.bf': 'text', '.b93': 'text',
    '.lol': 'text', '.ws': 'text', '.alg': 'text', '.apl': 'text',
    '.bqn': 'text', '.dats': 'text', '.sats': 'text', '.io': 'text',
    '.janet': 'text', '.fnl': 'text', '.fth': 'text', '.sno': 'text',
    '.unl': 'text', '.l': 'text', '.arnoldc': 'text', '.factor': 'text',
    '.emojic': 'text', '.reb': 'text', '.mksh': 'bash', '.ash': 'bash',
    '.dash': 'bash', '.tcsh': 'bash', '.csh': 'bash', '.prolog': 'prolog',
  }
  return map[ext] || 'text'
}

function stripH1(markdown) {
  if (!markdown) return ''
  return markdown.replace(/^#\s+.*\n?/, '').trim()
}

function stripShebang(content) {
  if (!content) return ''
  const lines = content.split('\n')
  if (lines[0] && lines[0].startsWith('#!')) {
    return lines.slice(1).join('\n').trim()
  }
  return content.trim()
}

function generateReadme(meta) {
  const { displayName, year, category, paradigm } = meta

  if (category === 'esoteric') {
    return `# ${displayName}\n\nEsoteric programming language.\n`
  }

  const paradigmStr = paradigm ? paradigm.slice(0, 2).join(' and ') : 'programming'
  const categoryLabel = category === 'shell' ? 'shell'
    : category === 'jvm' ? 'JVM-based'
    : category === 'ml-family' ? 'ML-family'
    : category === 'web' ? 'web-focused'
    : category

  return `# ${displayName}\n\n${displayName} is a ${categoryLabel} ${paradigmStr} language first appearing in ${year}.\n`
}

function readVeinsTestFiles(veinName) {
  const testDir = path.join(FRAGLET_DIR, 'veins_test', veinName)
  if (!isDirectory(testDir)) return []
  const files = fs.readdirSync(testDir)
    .filter(f => !['act.sh', 'assert.txt', 'README.md', 'generate.sh', 'veins_test.go'].includes(f))
    .filter(f => !isDirectory(path.join(testDir, f)))
    .sort()
  return files.map(f => ({
    name: f,
    content: tryRead(path.join(testDir, f)),
  }))
}

function fileExists(p) {
  try {
    return fs.statSync(p).isFile()
  } catch {
    return false
  }
}

function detectCapabilities(langDir) {
  const fragletDir = path.join(HELLOS_DIR, langDir, 'fraglet')
  return {
    hasStdin: fileExists(path.join(fragletDir, 'verify_stdin.sh')),
    hasArgs: fileExists(path.join(fragletDir, 'verify_args.sh')),
  }
}

function generateInstallPage() {
  fs.mkdirSync(PAGES_DIR, { recursive: true })

  const installMd = tryRead(path.join(FRAGLET_DIR, 'INSTALL.md'))
  if (!installMd) {
    console.warn('    WARNING: INSTALL.md not found in fraglet repo — writing placeholder install page')
    const placeholder = `---\nslug: "install"\ntitle: "Install fragletc"\n---\n\nInstall instructions are being prepared. See the [fraglet repository](https://github.com/ofthemachine/fraglet) for the latest setup guide.\n`
    fs.writeFileSync(path.join(PAGES_DIR, 'install.md'), placeholder)
    return true
  }

  const body = stripH1(installMd)
  const content = `---\nslug: "install"\ntitle: "Install fragletc"\n---\n\n${body}`

  fs.writeFileSync(path.join(PAGES_DIR, 'install.md'), content)
  return true
}

function findVeinForLanguage(langSlug, veinsMap) {
  if (veinsMap.has(langSlug)) return veinsMap.get(langSlug)
  for (const [, vein] of veinsMap) {
    if (vein.container && vein.container.includes(`/${langSlug}:`)) return vein
  }
  return null
}

function buildLanguagePage(langDir, langSlug, meta, vein, schedule, veinsMap) {
  const langPath = path.join(HELLOS_DIR, langDir)

  const readme = tryRead(path.join(langPath, 'README.md'))
  const guide = tryRead(path.join(langPath, 'fraglet', 'guide.md'))
  const fragletYml = tryRead(path.join(langPath, 'fraglet', 'fraglet.yml'))
  const { file: helloFile, content: helloContent } = readHelloWorldSource(langPath)

  const fragletEnabled = vein != null
  const container = vein ? vein.container : `100hellos/${langDir}:latest`
  const extensions = vein ? vein.extensions : []
  const veinName = vein ? vein.name : null

  const veinsTestFiles = veinName ? readVeinsTestFiles(veinName) : []
  const capabilities = detectCapabilities(langDir)

  const description = readme ? stripH1(readme) : stripH1(generateReadme(meta))

  const ext = helloFile ? path.extname(helloFile) : ''
  const langHint = extensionToLanguageHint(ext)

  const buildDay = schedule.get(langDir) || ''

  const dockerhubSlug = langDir.length === 1 ? `${langDir}_` : langDir
  const dockerhubUrl = `https://hub.docker.com/r/100hellos/${dockerhubSlug}`
  const githubUrl = `https://github.com/ofthemachine/100hellos/tree/main/${langDir}/files`

  const frontmatter = {
    slug: langSlug,
    title: meta.displayName,
    displayName: meta.displayName,
    dirName: langDir,
    container,
    extensions,
    year: meta.year || null,
    paradigm: meta.paradigm || [],
    influencedBy: meta.influencedBy || [],
    influences: meta.influences || [],
    category: meta.category || 'general-purpose',
    dockerhubUrl,
    githubUrl,
    helloWorldFile: helloFile || '',
    hasGuide: guide != null,
    hasVeinsTest: veinsTestFiles.length > 0,
    fragletEnabled,
    hasStdin: fragletEnabled && capabilities.hasStdin,
    hasArgs: fragletEnabled && capabilities.hasArgs,
    buildDay,
  }

  let body = ''

  body += description + '\n\n'

  if (helloContent) {
    body += `## Hello World\n\n`
    body += '```' + langHint + '\n'
    body += helloContent.trim() + '\n'
    body += '```\n\n'
  }

  if (guide) {
    body += `## Coding Guide\n\n`
    body += stripH1(guide) + '\n\n'
  }

  if (veinsTestFiles.length > 0) {
    body += `## Fraglet Scripts\n\n`
    for (const file of veinsTestFiles) {
      const fileExt = path.extname(file.name)
      const fileLang = extensionToLanguageHint(fileExt)
      const content = (file.content || '').trim()
      const label = file.name.replace(/\.[^.]+$/, '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
      body += `### ${label}\n\n`
      body += '```' + fileLang + '\n'
      body += content + '\n'
      body += '```\n\n'
    }
  }

  const fm = Object.entries(frontmatter).map(([k, v]) => {
    if (Array.isArray(v)) {
      return `${k}: ${JSON.stringify(v)}`
    }
    if (typeof v === 'boolean') {
      return `${k}: ${v}`
    }
    if (v === null || v === undefined) {
      return `${k}: `
    }
    if (typeof v === 'number') {
      return `${k}: ${v}`
    }
    return `${k}: "${v.replace(/"/g, '\\"')}"`
  }).join('\n')

  return `---\n${fm}\n---\n\n${body}`
}

function main() {
  console.log('==> Preprocessing content...')
  console.log(`    100hellos: ${HELLOS_DIR}`)
  console.log(`    fraglet:   ${FRAGLET_DIR}`)
  console.log(`    output:    ${OUTPUT_DIR}`)

  fs.mkdirSync(OUTPUT_DIR, { recursive: true })

  if (generateInstallPage()) {
    console.log('    Generated install page from INSTALL.md')
  }

  const veinsMap = loadVeinsMap()
  const schedule = loadBuildSchedule()
  const metadata = loadMetadata()
  const languages = discoverLanguages()

  console.log(`    Found ${languages.length} languages`)
  console.log(`    ${veinsMap.size} fraglet-enabled veins`)

  let generated = 0
  let missingMeta = []

  for (const langDir of languages) {
    const meta = metadata.get(langDir)
    if (!meta) {
      missingMeta.push(langDir)
      continue
    }

    const vein = findVeinForLanguage(langDir, veinsMap)
    const slug = meta.slug || langDir
    const content = buildLanguagePage(langDir, slug, meta, vein, schedule, veinsMap)

    fs.writeFileSync(path.join(OUTPUT_DIR, `${slug}.md`), content)
    generated++
  }

  if (missingMeta.length > 0) {
    console.warn(`    WARNING: ${missingMeta.length} languages missing from languages-metadata.yml:`)
    console.warn(`    ${missingMeta.join(', ')}`)
  }

  console.log(`==> Generated ${generated} language pages`)
}

main()
