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
const NOT_MATCH_INCH = "etc";

// UTIL
function getInch(source) {
  const INCH_VALID = {
    B09: "1.6",
    B19: "2.2",
    B29: "2.9",
    B69: "4.2",
  };

  if (!source || source.length != 12) {
    return NOT_MATCH_INCH;
  }

  let inch = source.slice(-4).slice(0, 3);
  if (INCH_VALID[inch]) {
    console.log("INCH_VALID[inch]", INCH_VALID[inch]);
    return `${INCH_VALID[inch]}"`;
  }
  return NOT_MATCH_INCH;
}

// SCAN
function scanItem(barcode) {
  let date = dayjs().format("YY.MM.DD HH:mm:ss");
  let no = scanned.length + 1;
  let inch = getInch(barcode);
  if (barcode) {
    // 바코드가 존재하는 경우에만 목록을 추가한다
    scanned.push({ barcode, date, no, inch });
    redraw();
  }
}

// UPDATE
function updateTagCount() {
  let i16 = scanned.filter((x) => x.inch == '1.6"').length;
  let i22 = scanned.filter((x) => x.inch == '2.2"').length;
  let i29 = scanned.filter((x) => x.inch == '2.9"').length;
  let i42 = scanned.filter((x) => x.inch == '4.2"').length;
  let ietc = scanned.filter((x) => x.inch == NOT_MATCH_INCH).length;

  document.getElementById("i16").innerHTML = i16;
  document.getElementById("i22").innerHTML = i22;
  document.getElementById("i29").innerHTML = i29;
  document.getElementById("i42").innerHTML = i42;
  document.getElementById("ietc").innerHTML = ietc;
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
    drawBuffer.push(`<tr class='error'>`);
    drawBuffer.push(`<th>${item.no}</th>`);
    if (item.barcode.length == 12) {
      drawBuffer.push(`<td >${item.barcode}</td>`);
    } else {
      drawBuffer.push(
        `<td class='underline decoration-4 text-red-600'>${item.barcode}</td>`
      );
    }

    if (item.inch == NOT_MATCH_INCH) {
      drawBuffer.push(
        `<td class='underline decoration-4 text-red-600'>${item.inch}</td>`
      );
    } else {
      drawBuffer.push(`<td >${item.inch}</td>`);
    }

    drawBuffer.push(`<td>${item.date}</td>`);
    drawBuffer.push(`</tr>`);
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
  const JUST_FIT = scanned.length % PAGE_PER_SHOW == 0;
  if (page < MAX_PAGE && !(JUST_FIT && page + 1 == MAX_PAGE)) {
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
