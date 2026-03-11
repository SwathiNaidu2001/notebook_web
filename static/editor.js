// let sheets=[]
// let current=null

// const editor=document.getElementById("editor")

// function newSheet(){

// let sheet={
// id:crypto.randomUUID(),
// parent:"root",
// title:"New Sheet",
// content:""
// }

// sheets.push(sheet)

// renderSheets()

// }

// function newSubSheet(parentId){

// let sheet={
// id:crypto.randomUUID(),
// parent:parentId,
// title:"Sub Sheet",
// content:""
// }

// sheets.push(sheet)

// renderSheets()

// }

// function renderSheets(){

// let container=document.getElementById("sheetList")

// container.innerHTML=""

// let mains=sheets.filter(s=>s.parent==="root")

// mains.forEach(main=>{

// let wrapper=document.createElement("div")

// let header=document.createElement("div")

// header.style.cursor="pointer"
// header.style.display="flex"
// header.style.justifyContent="space-between"

// let title=document.createElement("span")
// title.innerHTML="▶ "+main.title

// let addBtn=document.createElement("button")
// addBtn.innerText="+"

// addBtn.onclick=(e)=>{
// e.stopPropagation()
// newSubSheet(main.id)
// }

// header.appendChild(title)
// header.appendChild(addBtn)

// wrapper.appendChild(header)

// let subContainer=document.createElement("div")
// subContainer.style.display="none"
// subContainer.style.marginLeft="20px"

// header.onclick=()=>{

// if(subContainer.style.display==="none"){

// subContainer.style.display="block"
// title.innerHTML="▼ "+main.title

// }else{

// subContainer.style.display="none"
// title.innerHTML="▶ "+main.title

// }

// }

// let subs=sheets.filter(s=>s.parent===main.id)

// subs.forEach(sub=>{

// let subDiv=document.createElement("div")

// subDiv.innerText="• "+sub.title

// subDiv.style.cursor="pointer"

// subDiv.onclick=()=>openSheet(sub.id)

// subContainer.appendChild(subDiv)

// })

// wrapper.appendChild(subContainer)

// container.appendChild(wrapper)

// })

// }

// function openSheet(id){

// current=id

// let sheet=sheets.find(s=>s.id==id)

// editor.innerHTML=sheet.content || ""

// }

// function saveEditor(){

// if(!current) return

// let sheet=sheets.find(s=>s.id==current)

// sheet.content=editor.innerHTML

// let firstLine=editor.innerText.split("\n")[0]

// if(firstLine.trim()!=""){
// sheet.title=firstLine.slice(0,20)
// }

// renderSheets()

// }

// setInterval(()=>{

// saveEditor()

// fetch("/save",{
// method:"POST",
// headers:{"Content-Type":"application/json"},
// body:JSON.stringify(sheets)
// })

// },5000)

// function loadSheets(){

// fetch("/load")

// .then(res=>res.json())

// .then(data=>{

// if(data.length==0){
// newSheet()
// return
// }

// sheets=data

// renderSheets()

// })

// }

// loadSheets()

// function deleteSheet(){

// if(!current) return

// if(!confirm("Delete permanently?")) return

// fetch("/delete/"+current,{method:"DELETE"})

// sheets=sheets.filter(s=>s.id!=current)

// editor.innerHTML=""

// renderSheets()

// }

// function manualSave(){

// saveEditor()

// fetch("/save",{
// method:"POST",
// headers:{"Content-Type":"application/json"},
// body:JSON.stringify(sheets)
// })

// alert("Saved")

// }

// window.addEventListener("beforeunload",function(){

// saveEditor()

// navigator.sendBeacon(
// "/save",
// new Blob([JSON.stringify(sheets)],{type:"application/json"})
// )

// })

// function uploadFile(file){

// let formData=new FormData()

// formData.append("file",file)

// fetch("/upload_file",{
// method:"POST",
// body:formData
// })
// .then(res=>res.json())
// .then(data=>{

// let ext=file.name.split(".").pop().toLowerCase()

// if(["png","jpg","jpeg","gif"].includes(ext)){

// let img=document.createElement("img")

// img.src="/file/"+data.id

// editor.appendChild(img)

// }
// else if(ext==="pdf"){

// let iframe=document.createElement("iframe")

// iframe.src="/file/"+data.id

// editor.appendChild(iframe)

// }
// else if(ext==="doc" || ext==="docx"){

// let iframe=document.createElement("iframe")

// iframe.src="https://view.officeapps.live.com/op/view.aspx?src="+window.location.origin+"/file/"+data.id

// editor.appendChild(iframe)

// }

// saveEditor()

// })

// }

// document.getElementById("fileUpload").addEventListener("change",function(){

// uploadFile(this.files[0])

// })

// editor.addEventListener("drop",function(e){

// e.preventDefault()

// let file=e.dataTransfer.files[0]

// if(file) uploadFile(file)

// })

// editor.addEventListener("dragover",(e)=>e.preventDefault())

// editor.addEventListener("paste",function(e){

// let items=e.clipboardData.items

// for(let item of items){

// if(item.type.indexOf("image")!==-1){

// uploadFile(item.getAsFile())

// }

// }

// })

// function insertTable(){

// let table=document.createElement("table")

// for(let i=0;i<3;i++){

// let tr=document.createElement("tr")

// for(let j=0;j<3;j++){

// let td=document.createElement("td")

// td.contentEditable=true

// td.innerHTML=" "

// tr.appendChild(td)

// }

// table.appendChild(tr)

// }

// editor.appendChild(table)

// enableTable(table)

// saveEditor()

// }

// function enableTable(table){

// table.addEventListener("contextmenu",function(e){

// e.preventDefault()

// let cell=e.target.closest("td")

// if(!cell) return

// showMenu(e.pageX,e.pageY,cell)

// })

// }

// function showMenu(x,y,cell){

// let menu=document.getElementById("tableMenu")

// if(!menu){

// menu=document.createElement("div")

// menu.id="tableMenu"

// menu.style.position="absolute"
// menu.style.background="white"
// menu.style.border="1px solid #ccc"

// menu.innerHTML=`
// <div onclick="addRow()">Add Row</div>
// <div onclick="addColumn()">Add Column</div>
// <div onclick="deleteRow()">Delete Row</div>
// <div onclick="deleteColumn()">Delete Column</div>
// `

// document.body.appendChild(menu)

// }

// menu.style.left=x+"px"
// menu.style.top=y+"px"
// menu.style.display="block"

// window.currentCell=cell

// document.addEventListener("click",()=>menu.style.display="none",{once:true})

// }

// function addRow(){

// let row=currentCell.parentElement

// let newRow=row.cloneNode(true)

// row.after(newRow)

// }

// function addColumn(){

// let table=currentCell.closest("table")

// let index=currentCell.cellIndex

// table.querySelectorAll("tr").forEach(row=>{

// let cell=row.insertCell(index+1)

// cell.contentEditable=true

// })

// }

// function deleteRow(){

// currentCell.parentElement.remove()

// }

// function deleteColumn(){

// let table=currentCell.closest("table")

// let index=currentCell.cellIndex

// table.querySelectorAll("tr").forEach(row=>row.deleteCell(index))

// }



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

  // Expand all ancestors so the new page is immediately visible
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

  // Row
  const row = document.createElement("div")
  row.className = "sheet-item" + (depth === 0 ? " parent-sheet" : " sub-sheet") + (current === sheet.id ? " active" : "")
  row.style.paddingLeft = (12 + depth * 16) + "px"

  // Arrow toggle
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

  // + button
  const addBtn = document.createElement("button")
  addBtn.className = "icon-btn"
  addBtn.title = "Add sub-page"
  addBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 12 12"><path d="M6 1v10M1 6h10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`
  addBtn.onclick = e => { e.stopPropagation(); newSubSheet(sheet.id) }

  // delete button
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

  // Children container
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

  // Click arrow = just toggle
  arrow.onclick = e => {
    if (children.length === 0) return
    e.stopPropagation()
    toggleExpand()
  }

  // Click row = open sheet; also expand if has children
  row.onclick = () => {
    if (children.length > 0 && !isExpanded) toggleExpand()
    openSheet(sheet.id)
  }

  // Recurse children
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
  if (current === id) return   // already open, don't re-render unnecessarily
  saveEditorSilent()
  current = id
  const sheet = sheets.find(s => s.id === id)
  editor.innerHTML = sheet ? (sheet.content || "") : ""
  attachDeleteButtons()
  renderSheets()
  updateWordCount()
  editor.focus()
}

// ── Save editor content into the sheet object (no fetch) ──────────────────
function saveEditorSilent() {
  if (!current) return
  const sheet = sheets.find(s => s.id === current)
  if (!sheet) return

  const clone = editor.cloneNode(true)
  clone.querySelectorAll(".delete-overlay").forEach(el => el.remove())
  sheet.content = clone.innerHTML

  const firstLine = editor.innerText.split("\n")[0].trim()
  if (firstLine !== "") sheet.title = firstLine.slice(0, 30)

  renderSheets()
}

// ── Save + persist to server ──────────────────────────────────────────────
function saveEditor() {
  saveEditorSilent()
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

// Auto-save every 5 seconds
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

const mo = new MutationObserver(() => attachDeleteButtons())
mo.observe(editor, { childList: true, subtree: true })

// ── Table ─────────────────────────────────────────────────────────────────
function insertTable() {
  const table = document.createElement("table")
  for (let i = 0; i < 3; i++) {
    const tr = document.createElement("tr")
    for (let j = 0; j < 3; j++) {
      const td = document.createElement("td")
      td.contentEditable = true
      td.innerHTML = "&nbsp;"
      tr.appendChild(td)
    }
    table.appendChild(tr)
  }
  editor.appendChild(table)
  table.addEventListener("contextmenu", e => {
    e.preventDefault()
    const cell = e.target.closest("td")
    if (cell) showTableMenu(e.pageX, e.pageY, cell)
  })
  saveEditorSilent()
}

function showTableMenu(x, y, cell) {
  document.getElementById("tableMenu")?.remove()
  const menu = document.createElement("div")
  menu.id = "tableMenu"
  menu.innerHTML = `
    <div class="menu-item" onclick="addRow()">Add Row Below</div>
    <div class="menu-item" onclick="addColumn()">Add Column Right</div>
    <div class="menu-sep"></div>
    <div class="menu-item danger" onclick="deleteRow()">Delete Row</div>
    <div class="menu-item danger" onclick="deleteColumn()">Delete Column</div>
  `
  document.body.appendChild(menu)
  menu.style.left = Math.min(x, window.innerWidth - 180) + "px"
  menu.style.top  = Math.min(y, window.innerHeight - 160) + "px"
  window.currentCell = cell
  setTimeout(() => document.addEventListener("click", () => menu.remove(), { once: true }), 0)
}

function addRow()    { const r = currentCell.parentElement; const nr = r.cloneNode(true); nr.querySelectorAll("td").forEach(td => td.innerHTML = "&nbsp;"); r.after(nr) }
function addColumn() { const t = currentCell.closest("table"); const i = currentCell.cellIndex; t.querySelectorAll("tr").forEach(r => { const c = r.insertCell(i+1); c.contentEditable=true; c.innerHTML="&nbsp;" }) }
function deleteRow()    { currentCell.parentElement.remove() }
function deleteColumn() { const t = currentCell.closest("table"); const i = currentCell.cellIndex; t.querySelectorAll("tr").forEach(r => r.deleteCell(i)) }

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