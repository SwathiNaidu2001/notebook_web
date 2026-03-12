
// let sheets = []
// let current = null
// let searchQuery = ""

// const editor = document.getElementById("editor")

// // ── Track expanded state across re-renders ────────────────────────────────
// const expandedIds = new Set()

// // ── New root sheet ────────────────────────────────────────────────────────
// function newSheet() {
//   saveEditorSilent()
//   const sheet = { id: crypto.randomUUID(), parent: "root", title: "Untitled", content: "" }
//   sheets.push(sheet)
//   persistAll()
//   current = sheet.id
//   editor.innerHTML = ""
//   renderSheets()
//   editor.focus()
//   updateWordCount()
// }

// // ── New sub-sheet under any parent ────────────────────────────────────────
// function newSubSheet(parentId) {
//   saveEditorSilent()

//   const sheet = { id: crypto.randomUUID(), parent: parentId, title: "Untitled", content: "" }
//   sheets.push(sheet)

//   // Expand all ancestors so the new page is immediately visible
//   let pid = parentId
//   while (pid && pid !== "root") {
//     expandedIds.add(pid)
//     const p = sheets.find(s => s.id === pid)
//     pid = p ? p.parent : null
//   }

//   persistAll()
//   current = sheet.id
//   editor.innerHTML = ""
//   renderSheets()
//   editor.focus()
//   updateWordCount()
// }

// // ── Build sidebar tree ────────────────────────────────────────────────────
// function hasDescendantMatch(id, q) {
//   return sheets
//     .filter(s => s.parent === id)
//     .some(c => c.title.toLowerCase().includes(q) || hasDescendantMatch(c.id, q))
// }

// function renderSheets() {
//   const container = document.getElementById("sheetList")
//   container.innerHTML = ""
//   const q = searchQuery.trim().toLowerCase()
//   sheets
//     .filter(s => s.parent === "root")
//     .forEach(root => {
//       const node = buildNode(root, q, 0)
//       if (node) container.appendChild(node)
//     })
// }

// function buildNode(sheet, q, depth) {
//   const children = sheets.filter(s => s.parent === sheet.id)
//   const matchesSelf = !q || sheet.title.toLowerCase().includes(q)
//   const matchingChildren = q
//     ? children.filter(c => c.title.toLowerCase().includes(q) || hasDescendantMatch(c.id, q))
//     : children

//   if (!matchesSelf && matchingChildren.length === 0) return null

//   const wrapper = document.createElement("div")
//   wrapper.className = "sheet-group"

//   // Row
//   const row = document.createElement("div")
//   row.className = "sheet-item" + (depth === 0 ? " parent-sheet" : " sub-sheet") + (current === sheet.id ? " active" : "")
//   row.style.paddingLeft = (12 + depth * 16) + "px"

//   // Arrow toggle
//   const arrow = document.createElement("span")
//   arrow.className = "arrow"
//   arrow.style.visibility = children.length === 0 ? "hidden" : "visible"
//   arrow.innerHTML = `<svg width="10" height="10" viewBox="0 0 10 10"><path d="M3 2l4 3-4 3" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`

//   const titleSpan = document.createElement("span")
//   titleSpan.className = "sheet-title"
//   titleSpan.innerText = sheet.title

//   const left = document.createElement("div")
//   left.className = "sheet-item-left"
//   left.appendChild(arrow)
//   left.appendChild(titleSpan)

//   // + button
//   const addBtn = document.createElement("button")
//   addBtn.className = "icon-btn"
//   addBtn.title = "Add sub-page"
//   addBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 12 12"><path d="M6 1v10M1 6h10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`
//   addBtn.onclick = e => { e.stopPropagation(); newSubSheet(sheet.id) }

//   // delete button
//   const delBtn = document.createElement("button")
//   delBtn.className = "icon-btn danger"
//   delBtn.title = "Delete"
//   delBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 3h8M5 3V2h2v1M4.5 9.5l-.5-5M7.5 9.5l.5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><rect x="2.5" y="3" width="7" height="7" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>`
//   delBtn.onclick = e => { e.stopPropagation(); deleteSheetById(sheet.id) }

//   const actions = document.createElement("div")
//   actions.className = "sheet-actions"
//   actions.appendChild(addBtn)
//   actions.appendChild(delBtn)

//   row.appendChild(left)
//   row.appendChild(actions)

//   // Children container
//   const childContainer = document.createElement("div")
//   childContainer.className = "sub-container"

//   const forceOpen = q && matchingChildren.length > 0
//   let isExpanded = forceOpen || expandedIds.has(sheet.id)

//   const applyExpand = () => {
//     childContainer.style.display = isExpanded ? "block" : "none"
//     arrow.style.transform = isExpanded ? "rotate(90deg)" : ""
//   }
//   applyExpand()

//   const toggleExpand = () => {
//     isExpanded = !isExpanded
//     if (isExpanded) expandedIds.add(sheet.id)
//     else expandedIds.delete(sheet.id)
//     applyExpand()
//   }

//   // Click arrow = just toggle
//   arrow.onclick = e => {
//     if (children.length === 0) return
//     e.stopPropagation()
//     toggleExpand()
//   }

//   // Click row = open sheet; also expand if has children
//   row.onclick = () => {
//     if (children.length > 0 && !isExpanded) toggleExpand()
//     openSheet(sheet.id)
//   }

//   // Recurse children
//   ;(q ? matchingChildren : children).forEach(child => {
//     const childNode = buildNode(child, q, depth + 1)
//     if (childNode) childContainer.appendChild(childNode)
//   })

//   wrapper.appendChild(row)
//   wrapper.appendChild(childContainer)
//   return wrapper
// }

// // ── Open a sheet into the editor ──────────────────────────────────────────
// function openSheet(id) {
//   if (current === id) return   // already open, don't re-render unnecessarily
//   saveEditorSilent()
//   current = id
//   const sheet = sheets.find(s => s.id === id)
//   editor.innerHTML = sheet ? (sheet.content || "") : ""
//   attachDeleteButtons()
//   renderSheets()
//   updateWordCount()
//   editor.focus()
// }

// // ── Save editor content into the sheet object (no fetch) ──────────────────
// function saveEditorSilent() {
//   if (!current) return
//   const sheet = sheets.find(s => s.id === current)
//   if (!sheet) return

//   const clone = editor.cloneNode(true)
//   clone.querySelectorAll(".delete-overlay").forEach(el => el.remove())
//   sheet.content = clone.innerHTML

//   const firstLine = editor.innerText.split("\n")[0].trim()
//   if (firstLine !== "") sheet.title = firstLine.slice(0, 30)

//   renderSheets()
// }

// // ── Save + persist to server ──────────────────────────────────────────────
// function saveEditor() {
//   saveEditorSilent()
// }

// function persistAll() {
//   return fetch("/save", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(sheets)
//   })
// }

// function manualSave() {
//   saveEditorSilent()
//   persistAll()
//   showSaveToast("Saved ✓")
// }

// // Auto-save every 5 seconds
// setInterval(() => {
//   saveEditorSilent()
//   persistAll()
//   showSaveToast("Auto-saved")
// }, 5000)

// // ── Delete sheet + all descendants ───────────────────────────────────────
// function deleteSheetById(id) {
//   if (!confirm("Delete this page and all its sub-pages?")) return

//   const toDelete = new Set()
//   function collect(pid) {
//     toDelete.add(pid)
//     sheets.filter(s => s.parent === pid).forEach(s => collect(s.id))
//   }
//   collect(id)

//   toDelete.forEach(did => {
//     fetch("/delete/" + did, { method: "DELETE" })
//     expandedIds.delete(did)
//   })

//   sheets = sheets.filter(s => !toDelete.has(s.id))

//   if (toDelete.has(current)) {
//     current = null
//     editor.innerHTML = ""
//   }

//   renderSheets()
//   updateWordCount()
// }

// function deleteSheet() {
//   if (!current) return
//   deleteSheetById(current)
// }

// // ── Load from server ──────────────────────────────────────────────────────
// function loadSheets() {
//   fetch("/load")
//     .then(res => res.json())
//     .then(data => {
//       if (!data || data.length === 0) { newSheet(); return }
//       sheets = data
//       renderSheets()
//     })
// }

// loadSheets()

// // ── Search ────────────────────────────────────────────────────────────────
// document.getElementById("search").addEventListener("input", function () {
//   searchQuery = this.value
//   renderSheets()
// })

// // ── Word count ────────────────────────────────────────────────────────────
// function updateWordCount() {
//   const text = editor.innerText.trim()
//   const words = text ? text.split(/\s+/).length : 0
//   const chars = text.replace(/\s/g, "").length
//   document.getElementById("wordCount").innerText = `${words} words · ${chars} chars`
// }
// editor.addEventListener("input", updateWordCount)

// // ── Toast ─────────────────────────────────────────────────────────────────
// function showSaveToast(msg) {
//   const toast = document.getElementById("toast")
//   toast.innerText = msg
//   toast.classList.add("show")
//   setTimeout(() => toast.classList.remove("show"), 2000)
// }

// // ── File upload ───────────────────────────────────────────────────────────
// function uploadFile(file) {
//   const formData = new FormData()
//   formData.append("file", file)
//   fetch("/upload_file", { method: "POST", body: formData })
//     .then(res => res.json())
//     .then(data => {
//       const ext = file.name.split(".").pop().toLowerCase()
//       if (["png", "jpg", "jpeg", "gif", "webp"].includes(ext)) {
//         const img = document.createElement("img")
//         img.src = "/file/" + data.id
//         img.style.maxWidth = "100%"
//         editor.appendChild(img)
//       } else if (ext === "pdf") {
//         const iframe = document.createElement("iframe")
//         iframe.src = "/file/" + data.id
//         iframe.style.cssText = "width:100%;height:400px;border:none"
//         editor.appendChild(iframe)
//       } else if (ext === "doc" || ext === "docx") {
//         const iframe = document.createElement("iframe")
//         iframe.src = "https://view.officeapps.live.com/op/view.aspx?src=" + window.location.origin + "/file/" + data.id
//         iframe.style.cssText = "width:100%;height:400px;border:none"
//         editor.appendChild(iframe)
//       }
//       saveEditorSilent()
//     })
// }

// document.getElementById("fileUpload").addEventListener("change", function () { uploadFile(this.files[0]) })
// editor.addEventListener("drop", e => { e.preventDefault(); if (e.dataTransfer.files[0]) uploadFile(e.dataTransfer.files[0]) })
// editor.addEventListener("dragover", e => e.preventDefault())
// editor.addEventListener("paste", e => {
//   for (const item of e.clipboardData.items) {
//     if (item.type.indexOf("image") !== -1) uploadFile(item.getAsFile())
//   }
// })

// // ── Delete overlays for images & tables ───────────────────────────────────
// function attachDeleteButtons() {
//   editor.querySelectorAll("img").forEach(img => {
//     if (!img.parentElement?.classList.contains("deletable-wrap")) wrapWithDelete(img)
//   })
//   editor.querySelectorAll("table").forEach(table => {
//     if (!table.parentElement?.classList.contains("deletable-wrap")) wrapWithDelete(table)
//   })
// }

// function wrapWithDelete(el) {
//   const wrap = document.createElement("div")
//   wrap.className = "deletable-wrap"
//   el.replaceWith(wrap)
//   wrap.appendChild(el)
//   const btn = document.createElement("button")
//   btn.className = "delete-overlay"
//   btn.title = "Delete"
//   btn.innerHTML = `<svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 2l8 8M10 2l-8 8" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>`
//   btn.onclick = e => { e.stopPropagation(); wrap.remove(); saveEditorSilent() }
//   wrap.appendChild(btn)
// }

// const mo = new MutationObserver(() => attachDeleteButtons())
// mo.observe(editor, { childList: true, subtree: true })

// // ── Table ─────────────────────────────────────────────────────────────────
// function insertTable() {
//   const table = document.createElement("table")
//   for (let i = 0; i < 3; i++) {
//     const tr = document.createElement("tr")
//     for (let j = 0; j < 3; j++) {
//       const td = document.createElement("td")
//       td.contentEditable = true
//       td.innerHTML = "&nbsp;"
//       tr.appendChild(td)
//     }
//     table.appendChild(tr)
//   }
//   editor.appendChild(table)
//   table.addEventListener("contextmenu", e => {
//     e.preventDefault()
//     const cell = e.target.closest("td")
//     if (cell) showTableMenu(e.pageX, e.pageY, cell)
//   })
//   saveEditorSilent()
// }

// function showTableMenu(x, y, cell) {
//   document.getElementById("tableMenu")?.remove()
//   const menu = document.createElement("div")
//   menu.id = "tableMenu"
//   menu.innerHTML = `
//     <div class="menu-item" onclick="addRow()">Add Row Below</div>
//     <div class="menu-item" onclick="addColumn()">Add Column Right</div>
//     <div class="menu-sep"></div>
//     <div class="menu-item danger" onclick="deleteRow()">Delete Row</div>
//     <div class="menu-item danger" onclick="deleteColumn()">Delete Column</div>
//   `
//   document.body.appendChild(menu)
//   menu.style.left = Math.min(x, window.innerWidth - 180) + "px"
//   menu.style.top  = Math.min(y, window.innerHeight - 160) + "px"
//   window.currentCell = cell
//   setTimeout(() => document.addEventListener("click", () => menu.remove(), { once: true }), 0)
// }

// function addRow()    { const r = currentCell.parentElement; const nr = r.cloneNode(true); nr.querySelectorAll("td").forEach(td => td.innerHTML = "&nbsp;"); r.after(nr) }
// function addColumn() { const t = currentCell.closest("table"); const i = currentCell.cellIndex; t.querySelectorAll("tr").forEach(r => { const c = r.insertCell(i+1); c.contentEditable=true; c.innerHTML="&nbsp;" }) }
// function deleteRow()    { currentCell.parentElement.remove() }
// function deleteColumn() { const t = currentCell.closest("table"); const i = currentCell.cellIndex; t.querySelectorAll("tr").forEach(r => r.deleteCell(i)) }

// // ── Formatting ────────────────────────────────────────────────────────────
// function fmt(cmd, val) { document.execCommand(cmd, false, val); editor.focus() }

// // ── Keyboard shortcuts ────────────────────────────────────────────────────
// document.addEventListener("keydown", e => {
//   if ((e.ctrlKey || e.metaKey) && e.key === "s") { e.preventDefault(); manualSave() }
// })

// window.addEventListener("beforeunload", () => {
//   saveEditorSilent()
//   navigator.sendBeacon("/save", new Blob([JSON.stringify(sheets)], { type: "application/json" }))
// })

let sheets = []
let current = null
let searchQuery = ""

const editor = document.getElementById("editor")

// ── Track expanded state across re-renders ────────────────────────────────
const expandedIds = new Set()

// ── New root sheet ────────────────────────────────────────────────────────
function newSheet() {
  saveEditorSilent()
  const sheet = { id: crypto.randomUUID(), parent: "root", title: "Untitled", content: "" }
  sheets.push(sheet)
  persistAll()
  current = sheet.id
  editor.innerHTML = ""
  renderSheets()
  editor.focus()
  updateWordCount()
}

// ── New sub-sheet under any parent ────────────────────────────────────────
function newSubSheet(parentId) {
  saveEditorSilent()
  const sheet = { id: crypto.randomUUID(), parent: parentId, title: "Untitled", content: "" }
  sheets.push(sheet)
  let pid = parentId
  while (pid && pid !== "root") {
    expandedIds.add(pid)
    const p = sheets.find(s => s.id === pid)
    pid = p ? p.parent : null
  }
  persistAll()
  current = sheet.id
  editor.innerHTML = ""
  renderSheets()
  editor.focus()
  updateWordCount()
}

// ── Build sidebar tree ────────────────────────────────────────────────────
function hasDescendantMatch(id, q) {
  return sheets
    .filter(s => s.parent === id)
    .some(c => c.title.toLowerCase().includes(q) || hasDescendantMatch(c.id, q))
}

function renderSheets() {
  const container = document.getElementById("sheetList")
  container.innerHTML = ""
  const q = searchQuery.trim().toLowerCase()
  sheets
    .filter(s => s.parent === "root")
    .forEach(root => {
      const node = buildNode(root, q, 0)
      if (node) container.appendChild(node)
    })
}

function buildNode(sheet, q, depth) {
  const children = sheets.filter(s => s.parent === sheet.id)
  const matchesSelf = !q || sheet.title.toLowerCase().includes(q)
  const matchingChildren = q
    ? children.filter(c => c.title.toLowerCase().includes(q) || hasDescendantMatch(c.id, q))
    : children

  if (!matchesSelf && matchingChildren.length === 0) return null

  const wrapper = document.createElement("div")
  wrapper.className = "sheet-group"

  const row = document.createElement("div")
  row.className = "sheet-item" + (depth === 0 ? " parent-sheet" : " sub-sheet") + (current === sheet.id ? " active" : "")
  row.style.paddingLeft = (12 + depth * 16) + "px"

  const arrow = document.createElement("span")
  arrow.className = "arrow"
  arrow.style.visibility = children.length === 0 ? "hidden" : "visible"
  arrow.innerHTML = `<svg width="10" height="10" viewBox="0 0 10 10"><path d="M3 2l4 3-4 3" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`

  const titleSpan = document.createElement("span")
  titleSpan.className = "sheet-title"
  titleSpan.innerText = sheet.title

  const left = document.createElement("div")
  left.className = "sheet-item-left"
  left.appendChild(arrow)
  left.appendChild(titleSpan)

  const addBtn = document.createElement("button")
  addBtn.className = "icon-btn"
  addBtn.title = "Add sub-page"
  addBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 12 12"><path d="M6 1v10M1 6h10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`
  addBtn.onclick = e => { e.stopPropagation(); newSubSheet(sheet.id) }

  const delBtn = document.createElement("button")
  delBtn.className = "icon-btn danger"
  delBtn.title = "Delete"
  delBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 3h8M5 3V2h2v1M4.5 9.5l-.5-5M7.5 9.5l.5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><rect x="2.5" y="3" width="7" height="7" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>`
  delBtn.onclick = e => { e.stopPropagation(); deleteSheetById(sheet.id) }

  const actions = document.createElement("div")
  actions.className = "sheet-actions"
  actions.appendChild(addBtn)
  actions.appendChild(delBtn)

  row.appendChild(left)
  row.appendChild(actions)

  const childContainer = document.createElement("div")
  childContainer.className = "sub-container"

  const forceOpen = q && matchingChildren.length > 0
  let isExpanded = forceOpen || expandedIds.has(sheet.id)

  const applyExpand = () => {
    childContainer.style.display = isExpanded ? "block" : "none"
    arrow.style.transform = isExpanded ? "rotate(90deg)" : ""
  }
  applyExpand()

  const toggleExpand = () => {
    isExpanded = !isExpanded
    if (isExpanded) expandedIds.add(sheet.id)
    else expandedIds.delete(sheet.id)
    applyExpand()
  }

  arrow.onclick = e => {
    if (children.length === 0) return
    e.stopPropagation()
    toggleExpand()
  }

  row.onclick = () => {
    if (children.length > 0 && !isExpanded) toggleExpand()
    openSheet(sheet.id)
  }

  ;(q ? matchingChildren : children).forEach(child => {
    const childNode = buildNode(child, q, depth + 1)
    if (childNode) childContainer.appendChild(childNode)
  })

  wrapper.appendChild(row)
  wrapper.appendChild(childContainer)
  return wrapper
}

// ── Open a sheet into the editor ──────────────────────────────────────────
function openSheet(id) {
  if (current === id) return
  saveEditorSilent()
  current = id
  const sheet = sheets.find(s => s.id === id)
  editor.innerHTML = sheet ? (sheet.content || "") : ""
  attachDeleteButtons()
  enableAllTableDragDrop()
  renderSheets()
  updateWordCount()
  editor.focus()
}

// ── Save editor content into the sheet object ─────────────────────────────
function saveEditorSilent() {
  if (!current) return
  const sheet = sheets.find(s => s.id === current)
  if (!sheet) return

  const clone = editor.cloneNode(true)
  clone.querySelectorAll(".delete-overlay").forEach(el => el.remove())
  clone.querySelectorAll(".row-drag-handle, .col-drag-handle").forEach(el => el.remove())
  clone.querySelectorAll("[draggable]").forEach(el => el.removeAttribute("draggable"))
  sheet.content = clone.innerHTML

  const firstLine = editor.innerText.split("\n")[0].trim()
  if (firstLine !== "") sheet.title = firstLine.slice(0, 30)

  renderSheets()
}

function persistAll() {
  return fetch("/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sheets)
  })
}

function manualSave() {
  saveEditorSilent()
  persistAll()
  showSaveToast("Saved ✓")
}

setInterval(() => {
  saveEditorSilent()
  persistAll()
  showSaveToast("Auto-saved")
}, 5000)

// ── Delete sheet + all descendants ───────────────────────────────────────
function deleteSheetById(id) {
  if (!confirm("Delete this page and all its sub-pages?")) return

  const toDelete = new Set()
  function collect(pid) {
    toDelete.add(pid)
    sheets.filter(s => s.parent === pid).forEach(s => collect(s.id))
  }
  collect(id)

  toDelete.forEach(did => {
    fetch("/delete/" + did, { method: "DELETE" })
    expandedIds.delete(did)
  })

  sheets = sheets.filter(s => !toDelete.has(s.id))

  if (toDelete.has(current)) {
    current = null
    editor.innerHTML = ""
  }

  renderSheets()
  updateWordCount()
}

function deleteSheet() {
  if (!current) return
  deleteSheetById(current)
}

// ── Load from server ──────────────────────────────────────────────────────
function loadSheets() {
  fetch("/load")
    .then(res => res.json())
    .then(data => {
      if (!data || data.length === 0) { newSheet(); return }
      sheets = data
      renderSheets()
    })
}

loadSheets()

// ── Search ────────────────────────────────────────────────────────────────
document.getElementById("search").addEventListener("input", function () {
  searchQuery = this.value
  renderSheets()
})

// ── Word count ────────────────────────────────────────────────────────────
function updateWordCount() {
  const text = editor.innerText.trim()
  const words = text ? text.split(/\s+/).length : 0
  const chars = text.replace(/\s/g, "").length
  document.getElementById("wordCount").innerText = `${words} words · ${chars} chars`
}
editor.addEventListener("input", updateWordCount)

// ── Toast ─────────────────────────────────────────────────────────────────
function showSaveToast(msg) {
  const toast = document.getElementById("toast")
  toast.innerText = msg
  toast.classList.add("show")
  setTimeout(() => toast.classList.remove("show"), 2000)
}

// ── File upload ───────────────────────────────────────────────────────────
function uploadFile(file) {
  const formData = new FormData()
  formData.append("file", file)
  fetch("/upload_file", { method: "POST", body: formData })
    .then(res => res.json())
    .then(data => {
      const ext = file.name.split(".").pop().toLowerCase()
      if (["png", "jpg", "jpeg", "gif", "webp"].includes(ext)) {
        const img = document.createElement("img")
        img.src = "/file/" + data.id
        img.style.maxWidth = "100%"
        editor.appendChild(img)
      } else if (ext === "pdf") {
        const iframe = document.createElement("iframe")
        iframe.src = "/file/" + data.id
        iframe.style.cssText = "width:100%;height:400px;border:none"
        editor.appendChild(iframe)
      } else if (ext === "doc" || ext === "docx") {
        const iframe = document.createElement("iframe")
        iframe.src = "https://view.officeapps.live.com/op/view.aspx?src=" + window.location.origin + "/file/" + data.id
        iframe.style.cssText = "width:100%;height:400px;border:none"
        editor.appendChild(iframe)
      }
      saveEditorSilent()
    })
}

document.getElementById("fileUpload").addEventListener("change", function () { uploadFile(this.files[0]) })
editor.addEventListener("drop", e => { e.preventDefault(); if (e.dataTransfer.files[0]) uploadFile(e.dataTransfer.files[0]) })
editor.addEventListener("dragover", e => e.preventDefault())
editor.addEventListener("paste", e => {
  for (const item of e.clipboardData.items) {
    if (item.type.indexOf("image") !== -1) uploadFile(item.getAsFile())
  }
})

// ── Delete overlays for images & tables ───────────────────────────────────
function attachDeleteButtons() {
  editor.querySelectorAll("img").forEach(img => {
    if (!img.parentElement?.classList.contains("deletable-wrap")) wrapWithDelete(img)
  })
  editor.querySelectorAll("table").forEach(table => {
    if (!table.parentElement?.classList.contains("deletable-wrap")) wrapWithDelete(table)
  })
}

function wrapWithDelete(el) {
  const wrap = document.createElement("div")
  wrap.className = "deletable-wrap"
  el.replaceWith(wrap)
  wrap.appendChild(el)
  const btn = document.createElement("button")
  btn.className = "delete-overlay"
  btn.title = "Delete"
  btn.innerHTML = `<svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 2l8 8M10 2l-8 8" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>`
  btn.onclick = e => { e.stopPropagation(); wrap.remove(); saveEditorSilent() }
  wrap.appendChild(btn)
}

const mo = new MutationObserver(() => {
  attachDeleteButtons()
  enableAllTableDragDrop()
})
mo.observe(editor, { childList: true, subtree: true })

// ═══════════════════════════════════════════════════════════════════════════
// ── CUSTOM TABLE DIALOG ───────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

function insertTable() {
  // Show custom dialog instead of inserting immediately
  showTableDialog()
}

function showTableDialog() {
  document.getElementById("tableDialog")?.remove()

  const overlay = document.createElement("div")
  overlay.id = "tableDialog"
  overlay.innerHTML = `
    <div class="td-backdrop"></div>
    <div class="td-panel">
      <div class="td-header">
        <span class="td-title">Insert Table</span>
        <button class="td-close" onclick="document.getElementById('tableDialog').remove()">
          <svg width="14" height="14" viewBox="0 0 14 14"><path d="M2 2l10 10M12 2l-10 10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        </button>
      </div>
      <div class="td-body">
        <div class="td-grid-picker">
          <div class="td-label">Pick size (click to select)</div>
          <div id="tdGridWrap" class="td-grid-wrap"></div>
          <div id="tdGridLabel" class="td-grid-size-label">0 × 0</div>
        </div>
        <div class="td-options">
          <div class="td-row">
            <label class="td-field-label">Rows</label>
            <input id="tdRows" class="td-input" type="number" min="1" max="20" value="3">
          </div>
          <div class="td-row">
            <label class="td-field-label">Columns</label>
            <input id="tdCols" class="td-input" type="number" min="1" max="10" value="3">
          </div>
          <div class="td-row">
            <label class="td-field-label">Header Row</label>
            <label class="td-toggle">
              <input type="checkbox" id="tdHeader" checked>
              <span class="td-toggle-track"></span>
            </label>
          </div>
          <div class="td-row">
            <label class="td-field-label">Column Widths</label>
            <select id="tdColWidth" class="td-select">
              <option value="equal">Equal</option>
              <option value="auto">Auto</option>
              <option value="first-wide">First Wide</option>
              <option value="last-wide">Last Wide</option>
            </select>
          </div>
          <div class="td-row">
            <label class="td-field-label">Style</label>
            <select id="tdStyle" class="td-select">
              <option value="default">Default</option>
              <option value="striped">Striped Rows</option>
              <option value="minimal">Minimal</option>
              <option value="bordered">All Borders</option>
            </select>
          </div>
        </div>
      </div>
      <div class="td-footer">
        <button class="td-btn-cancel" onclick="document.getElementById('tableDialog').remove()">Cancel</button>
        <button class="td-btn-insert" onclick="confirmInsertTable()">Insert Table</button>
      </div>
    </div>
  `
  document.body.appendChild(overlay)

  // Grid picker
  const GRID_ROWS = 8, GRID_COLS = 8
  const gridWrap = document.getElementById("tdGridWrap")
  const gridLabel = document.getElementById("tdGridLabel")
  let hoverR = 0, hoverC = 0

  for (let r = 1; r <= GRID_ROWS; r++) {
    for (let c = 1; c <= GRID_COLS; c++) {
      const cell = document.createElement("div")
      cell.className = "td-grid-cell"
      cell.dataset.r = r
      cell.dataset.c = c
      cell.onmouseenter = () => {
        hoverR = r; hoverC = c
        gridLabel.textContent = `${r} × ${c}`
        gridWrap.querySelectorAll(".td-grid-cell").forEach(el => {
          el.classList.toggle("hi", +el.dataset.r <= r && +el.dataset.c <= c)
        })
      }
      cell.onclick = () => {
        document.getElementById("tdRows").value = r
        document.getElementById("tdCols").value = c
        confirmInsertTable()
      }
      gridWrap.appendChild(cell)
    }
  }

  // Close on backdrop click
  overlay.querySelector(".td-backdrop").onclick = () => overlay.remove()

  // Sync grid highlights when row/col inputs change
  document.getElementById("tdRows").oninput = syncGridFromInputs
  document.getElementById("tdCols").oninput = syncGridFromInputs

  function syncGridFromInputs() {
    const r = +document.getElementById("tdRows").value
    const c = +document.getElementById("tdCols").value
    gridLabel.textContent = `${r} × ${c}`
    gridWrap.querySelectorAll(".td-grid-cell").forEach(el => {
      el.classList.toggle("hi", +el.dataset.r <= r && +el.dataset.c <= c)
    })
  }
  syncGridFromInputs()
}

function confirmInsertTable() {
  const rows = Math.max(1, Math.min(20, +document.getElementById("tdRows").value || 3))
  const cols = Math.max(1, Math.min(10, +document.getElementById("tdCols").value || 3))
  const hasHeader = document.getElementById("tdHeader").checked
  const colWidth = document.getElementById("tdColWidth").value
  const style = document.getElementById("tdStyle").value

  document.getElementById("tableDialog")?.remove()

  const table = document.createElement("table")
  table.dataset.tableStyle = style

  // Apply style class
  table.classList.add("tbl-" + style)

  // Column widths via colgroup
  const colgroup = document.createElement("colgroup")
  for (let c = 0; c < cols; c++) {
    const col = document.createElement("col")
    if (colWidth === "equal") {
      col.style.width = (100 / cols) + "%"
    } else if (colWidth === "first-wide") {
      col.style.width = c === 0 ? "35%" : (65 / (cols - 1)) + "%"
    } else if (colWidth === "last-wide") {
      col.style.width = c === cols - 1 ? "35%" : (65 / (cols - 1)) + "%"
    }
    colgroup.appendChild(col)
  }
  table.appendChild(colgroup)

  for (let r = 0; r < rows; r++) {
    const tr = document.createElement("tr")
    tr.draggable = true
    for (let c = 0; c < cols; c++) {
      const td = document.createElement("td")
      td.contentEditable = true
      if (r === 0 && hasHeader) {
        td.dataset.header = "true"
        td.innerHTML = `Column ${c + 1}`
      } else {
        td.innerHTML = "&nbsp;"
      }
      tr.appendChild(td)
    }
    table.appendChild(tr)
  }

  editor.appendChild(table)
  enableTableDragDrop(table)
  setupTableContextMenu(table)
  saveEditorSilent()
}

// ═══════════════════════════════════════════════════════════════════════════
// ── TABLE DRAG & DROP (rows + columns) ───────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

let dragSrcRow = null
let dragSrcColIndex = null
let isDraggingCol = false

function enableAllTableDragDrop() {
  editor.querySelectorAll("table").forEach(t => {
    if (!t.dataset.ddEnabled) enableTableDragDrop(t)
    if (!t.dataset.ctxEnabled) setupTableContextMenu(t)
  })
}

function enableTableDragDrop(table) {
  if (table.dataset.ddEnabled) return
  table.dataset.ddEnabled = "1"

  // ── Row drag ──────────────────────────────────────────────────────────
  function refreshRowHandles() {
    table.querySelectorAll("tr").forEach(tr => {
      if (tr.querySelector(".row-drag-handle")) return
      tr.draggable = true
      const handle = document.createElement("td")
      handle.className = "row-drag-handle"
      handle.contentEditable = false
      handle.innerHTML = `<svg width="10" height="14" viewBox="0 0 10 14"><circle cx="3" cy="3" r="1.2" fill="currentColor"/><circle cx="7" cy="3" r="1.2" fill="currentColor"/><circle cx="3" cy="7" r="1.2" fill="currentColor"/><circle cx="7" cy="7" r="1.2" fill="currentColor"/><circle cx="3" cy="11" r="1.2" fill="currentColor"/><circle cx="7" cy="11" r="1.2" fill="currentColor"/></svg>`
      tr.insertBefore(handle, tr.firstChild)
    })
  }
  refreshRowHandles()

  table.addEventListener("dragstart", e => {
    const handle = e.target.closest(".row-drag-handle")
    if (!handle) return
    isDraggingCol = false
    dragSrcRow = handle.parentElement
    dragSrcRow.classList.add("drag-row-src")
    e.dataTransfer.effectAllowed = "move"
  })

  table.addEventListener("dragover", e => {
    if (isDraggingCol) return
    e.preventDefault()
    const tr = e.target.closest("tr")
    if (!tr || tr === dragSrcRow || !table.contains(tr)) return
    table.querySelectorAll("tr").forEach(r => r.classList.remove("drag-row-over"))
    tr.classList.add("drag-row-over")
  })

  table.addEventListener("drop", e => {
    if (isDraggingCol) return
    e.preventDefault()
    const tr = e.target.closest("tr")
    if (!tr || tr === dragSrcRow || !table.contains(tr)) return
    table.querySelectorAll("tr").forEach(r => r.classList.remove("drag-row-over", "drag-row-src"))
    const rows = [...table.querySelectorAll("tr")]
    const srcIdx = rows.indexOf(dragSrcRow)
    const tgtIdx = rows.indexOf(tr)
    if (srcIdx < tgtIdx) tr.after(dragSrcRow)
    else tr.before(dragSrcRow)
    dragSrcRow = null
    saveEditorSilent()
  })

  table.addEventListener("dragend", () => {
    table.querySelectorAll("tr").forEach(r => r.classList.remove("drag-row-over", "drag-row-src"))
    dragSrcRow = null
  })

  // ── Column drag ───────────────────────────────────────────────────────
  function refreshColHandles() {
    // Remove existing col handles row
    table.querySelector("tr.col-handle-row")?.remove()
    const firstRow = table.querySelector("tr")
    if (!firstRow) return

    const handleRow = document.createElement("tr")
    handleRow.className = "col-handle-row"
    handleRow.contentEditable = false

    // placeholder cell for row-handle column
    const ph = document.createElement("td")
    ph.className = "col-handle-ph"
    handleRow.appendChild(ph)

    const colCount = firstRow.querySelectorAll("td").length
    for (let i = 0; i < colCount; i++) {
      const th = document.createElement("td")
      th.className = "col-drag-handle"
      th.draggable = true
      th.dataset.colIdx = i
      th.innerHTML = `<svg width="14" height="10" viewBox="0 0 14 10"><circle cx="3" cy="3" r="1.2" fill="currentColor"/><circle cx="7" cy="3" r="1.2" fill="currentColor"/><circle cx="11" cy="3" r="1.2" fill="currentColor"/><circle cx="3" cy="7" r="1.2" fill="currentColor"/><circle cx="7" cy="7" r="1.2" fill="currentColor"/><circle cx="11" cy="7" r="1.2" fill="currentColor"/></svg>`
      handleRow.appendChild(th)
    }
    table.insertBefore(handleRow, table.firstChild)
  }
  refreshColHandles()

  table.addEventListener("dragstart", e => {
    const handle = e.target.closest(".col-drag-handle")
    if (!handle) return
    isDraggingCol = true
    dragSrcColIndex = +handle.dataset.colIdx
    handle.classList.add("drag-col-src")
    e.dataTransfer.effectAllowed = "move"
  })

  table.addEventListener("dragover", e => {
    if (!isDraggingCol) return
    e.preventDefault()
    const handle = e.target.closest(".col-drag-handle")
    if (!handle) return
    table.querySelectorAll(".col-drag-handle").forEach(h => h.classList.remove("drag-col-over"))
    handle.classList.add("drag-col-over")
  })

  table.addEventListener("drop", e => {
    if (!isDraggingCol) return
    e.preventDefault()
    const handle = e.target.closest(".col-drag-handle")
    table.querySelectorAll(".col-drag-handle").forEach(h => h.classList.remove("drag-col-over", "drag-col-src"))
    if (!handle) { isDraggingCol = false; return }
    const tgtIdx = +handle.dataset.colIdx
    if (tgtIdx === dragSrcColIndex) { isDraggingCol = false; return }

    // Move columns: skip col-handle-row (row index 0)
    const dataRows = [...table.querySelectorAll("tr")].filter(r => !r.classList.contains("col-handle-row"))
    dataRows.forEach(tr => {
      const cells = [...tr.querySelectorAll("td")]
      // +1 offset because row-drag-handle is first td
      const srcCell = cells[dragSrcColIndex + 1]
      const tgtCell = cells[tgtIdx + 1]
      if (!srcCell || !tgtCell) return
      if (dragSrcColIndex < tgtIdx) tgtCell.after(srcCell)
      else tgtCell.before(srcCell)
    })

    // Re-index col handle data attributes
    refreshColHandles()
    isDraggingCol = false
    saveEditorSilent()
  })

  table.addEventListener("dragend", () => {
    table.querySelectorAll(".col-drag-handle").forEach(h => h.classList.remove("drag-col-over", "drag-col-src"))
    isDraggingCol = false
  })
}

// ── Table context menu ────────────────────────────────────────────────────
function setupTableContextMenu(table) {
  if (table.dataset.ctxEnabled) return
  table.dataset.ctxEnabled = "1"
  table.addEventListener("contextmenu", e => {
    const cell = e.target.closest("td")
    if (!cell || cell.classList.contains("row-drag-handle") || cell.classList.contains("col-drag-handle") || cell.classList.contains("col-handle-ph")) return
    e.preventDefault()
    showTableMenu(e.pageX, e.pageY, cell, table)
  })
}

function showTableMenu(x, y, cell, table) {
  document.getElementById("tableMenu")?.remove()
  const menu = document.createElement("div")
  menu.id = "tableMenu"
  menu.innerHTML = `
    <div class="menu-item" onclick="addRow()">Add Row Below</div>
    <div class="menu-item" onclick="addRowAbove()">Add Row Above</div>
    <div class="menu-item" onclick="addColumn()">Add Column Right</div>
    <div class="menu-item" onclick="addColumnLeft()">Add Column Left</div>
    <div class="menu-sep"></div>
    <div class="menu-item" onclick="toggleHeaderRow()">Toggle Header Row</div>
    <div class="menu-sep"></div>
    <div class="menu-item danger" onclick="deleteRow()">Delete Row</div>
    <div class="menu-item danger" onclick="deleteColumn()">Delete Column</div>
  `
  document.body.appendChild(menu)
  menu.style.left = Math.min(x, window.innerWidth - 200) + "px"
  menu.style.top  = Math.min(y, window.innerHeight - 220) + "px"
  window.currentCell = cell
  window.currentTable = table
  setTimeout(() => document.addEventListener("click", () => menu.remove(), { once: true }), 0)
}

function addRow() {
  const r = currentCell.parentElement
  const nr = r.cloneNode(true)
  nr.querySelectorAll("td:not(.row-drag-handle)").forEach(td => td.innerHTML = "&nbsp;")
  r.after(nr)
}
function addRowAbove() {
  const r = currentCell.parentElement
  const nr = r.cloneNode(true)
  nr.querySelectorAll("td:not(.row-drag-handle)").forEach(td => td.innerHTML = "&nbsp;")
  r.before(nr)
}
function addColumn() {
  const t = currentCell.closest("table")
  const cells = [...currentCell.parentElement.querySelectorAll("td")]
  const i = cells.indexOf(currentCell)
  t.querySelectorAll("tr:not(.col-handle-row)").forEach(r => {
    const allCells = [...r.querySelectorAll("td")]
    const c = document.createElement("td")
    c.contentEditable = true
    c.innerHTML = "&nbsp;"
    allCells[i].after(c)
  })
  // Rebuild col handles
  const tbl = currentCell.closest("table")
  tbl.querySelector("tr.col-handle-row")?.remove()
  if (tbl.dataset.ddEnabled) {
    const fakeTable = { dataset: {} }
    // Re-enable to rebuild handles
    delete tbl.dataset.ddEnabled
    enableTableDragDrop(tbl)
  }
}
function addColumnLeft() {
  const t = currentCell.closest("table")
  const cells = [...currentCell.parentElement.querySelectorAll("td")]
  const i = cells.indexOf(currentCell)
  t.querySelectorAll("tr:not(.col-handle-row)").forEach(r => {
    const allCells = [...r.querySelectorAll("td")]
    const c = document.createElement("td")
    c.contentEditable = true
    c.innerHTML = "&nbsp;"
    allCells[i].before(c)
  })
  const tbl = currentCell.closest("table")
  tbl.querySelector("tr.col-handle-row")?.remove()
  delete tbl.dataset.ddEnabled
  enableTableDragDrop(tbl)
}
function deleteRow() { currentCell.parentElement.remove() }
function deleteColumn() {
  const t = currentCell.closest("table")
  const cells = [...currentCell.parentElement.querySelectorAll("td")]
  const i = cells.indexOf(currentCell)
  t.querySelectorAll("tr:not(.col-handle-row)").forEach(r => {
    const allCells = [...r.querySelectorAll("td")]
    if (allCells[i]) allCells[i].remove()
  })
  const tbl = currentCell.closest("table")
  tbl.querySelector("tr.col-handle-row")?.remove()
  delete tbl.dataset.ddEnabled
  enableTableDragDrop(tbl)
}
function toggleHeaderRow() {
  const t = currentTable || currentCell.closest("table")
  const firstRow = t.querySelector("tr:not(.col-handle-row)")
  if (!firstRow) return
  firstRow.querySelectorAll("td:not(.row-drag-handle)").forEach(td => {
    if (td.dataset.header) delete td.dataset.header
    else td.dataset.header = "true"
  })
}

// ── Formatting ────────────────────────────────────────────────────────────
function fmt(cmd, val) { document.execCommand(cmd, false, val); editor.focus() }

// ── Keyboard shortcuts ────────────────────────────────────────────────────
document.addEventListener("keydown", e => {
  if ((e.ctrlKey || e.metaKey) && e.key === "s") { e.preventDefault(); manualSave() }
})

window.addEventListener("beforeunload", () => {
  saveEditorSilent()
  navigator.sendBeacon("/save", new Blob([JSON.stringify(sheets)], { type: "application/json" }))
})

function loadSheets() {
  fetch("/load")
    .then(res => res.json())
    .then(data => {
      if (!data || data.length === 0) { newSheet(); return }
      sheets = data
      renderSheets()

      // Restore last opened sheet
      const lastId = localStorage.getItem("lastSheetId")
      const found = lastId && sheets.find(s => s.id === lastId)
      if (found) {
        openSheet(found.id)
      } else if (sheets.length > 0) {
        openSheet(sheets[0].id)  // fallback to first sheet
      }
    })
}

function openSheet(id) {
  if (current === id) return
  saveEditorSilent()
  current = id
  localStorage.setItem("lastSheetId", id)  // ← add this line
  const sheet = sheets.find(s => s.id === id)
  editor.innerHTML = sheet ? (sheet.content || "") : ""
  attachDeleteButtons()
  enableAllTableDragDrop()
  renderSheets()
  updateWordCount()
  editor.focus()
}