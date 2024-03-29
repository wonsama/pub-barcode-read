// DATA
/*
  scanned {barcode:string, inch:string, date:string, no:number}

  barcode : lengch 12
  barcode : start 2 = inch / ex) 162938182312 => 1.6"

  prevent duplicate scanning
*/
const PAGE_PER_SHOW = 10;
let scanned = [];
let page = 0;
let keys = [];

// UTIL
function getInch(source) {
  const valid = ["16", "22", "29", "42"];
  const DEFULT_MSG = "n/a";

  if (!source || source.length < 2) {
    return DEFULT_MSG;
  }
  let cut = source.substr(0, 2);
  if (valid.indexOf(cut) >= 0) {
    let c = cut.toString();
    return `${c.charAt(0)}.${c.charAt(1)}"`;
  }
  return DEFULT_MSG;
}

// SCAN
function scanItem(barcode) {
  let date = dayjs().format("YY.MM.DD HH:mm:ss");
  let no = scanned.length + 1;
  let inch = getInch(barcode);
  scanned.push({ barcode, date, no, inch });

  redraw();
}

// UPDATE
function updateTagCount() {
  let i16 = scanned.filter((x) => x.inch == '1.6"').length;
  let i22 = scanned.filter((x) => x.inch == '2.2"').length;
  let i29 = scanned.filter((x) => x.inch == '2.9"').length;
  let i42 = scanned.filter((x) => x.inch == '4.2"').length;

  document.getElementById("i16").innerHTML = i16;
  document.getElementById("i22").innerHTML = i22;
  document.getElementById("i29").innerHTML = i29;
  document.getElementById("i42").innerHTML = i42;
}

function updateTotalScanned() {
  document.getElementById("totalScanned").innerHTML = scanned.length;
}

function updateList() {
  // page = 0;

  let showCount = Math.min(
    scanned.length - PAGE_PER_SHOW * page,
    PAGE_PER_SHOW
  );

  let showItems = scanned.slice(-PAGE_PER_SHOW * (page + 1));
  showItems = showItems.slice(0, showCount);
  showItems.reverse();

  let drawBuffer = [];
  for (let item of showItems) {
    drawBuffer.push(`<tr>
      <th>${item.no}</th>
      <td>${item.barcode}</td>
      <td>${item.inch}</td>
      <td>${item.date}</td>
    </tr>`);
  }

  document.getElementById("tbody").innerHTML = drawBuffer.join("");
}

function redraw() {
  updateTotalScanned();
  updateList();
  updateTagCount();
}

function movePrev() {
  if (page > 0) {
    page = page - 1;
    updateList();
  }
}

function moveNext() {
  const MAX_PAGE = Math.floor(scanned.length / PAGE_PER_SHOW);
  if (page < MAX_PAGE) {
    page = page + 1;
    updateList();
  }
}

function btnSave() {
  document.getElementById(
    "saveModalDesc"
  ).innerHTML = `스캔하신 [ ${scanned.length} ] 건이 저장되었습니다.`;
  saveModal.showModal();
}

function showBarcode() {
  window.open("./barcode.html", "_blank");
}

// READY
$(document).ready(() => {
  // ADD EVENT
  $("#movePrev").on("click", movePrev);
  $("#moveNext").on("click", moveNext);
  $("#btnSave").on("click", btnSave);
});

// KEYPRESS
$(document).on("keypress", function (event) {
  if (event.key == "Enter") {
    scanItem(keys.join(""));
    keys = [];
  } else {
    keys.push(event.key);
  }
});
