const playBtn = document.querySelector('#jsPlay');
const playIcon = playBtn.querySelector('.fas');
const playFinishBtn = document.querySelector('#play_finish_btn');
const playStopwatch = document.querySelector('#play_stopwatch');
const playStarttime = document.querySelector('#play_starttime');
const playStatus = document.querySelector('#play_status');
const addSetBtn = document.querySelector('#add__set__btn');
const addWorkBtn = document.querySelector('#add__work__btn');
const workOkBtn = document.querySelector('#work__ok__btn');

let logging = false;
let reqStopwatch;

let startTime = 0;

function writeFile() {
    console.log("write_gdrvie_file");

    console.log("date:" + startTime);

    hello();
    //write in google docs
    //filename - workout-start_date.json
    /*
    {
        "date": "2019-12-17",
        "start_time": "22:22:22",
        "duration": "22:22:22",
        "works": [
            {
                "id": "0",
                "name": "벤치프레스(머신)",
                "part": "chest",
                "weight_unit": "kg",
                "sets": [
                    {
                        "idx": 0,
                        "weight": 12,
                        "rep": 20
                    },
                    {
                        "idx": 1,
                        "weight": 12,
                        "rep": 20
                    }
                ]
            },
            {
                "id": "1",
                "name": "크런치",
                "part": "core"                    
            }
        ]
    }
    */

}

function toggleCustomWork(selectElem) {

    const selVal = selectElem.options[selectElem.selectedIndex].value;
    const customInput = selectElem.parentElement.querySelector("#custom__work");

    if (selVal === "99") {
        //show
        customInput.removeAttribute("hidden");
    }
    else {
        //hide
        customInput.setAttribute("hidden", true);
    }
}

function createSetIdxCell(setIdx) {
    const setIdxCell = document.createElement("span");
    setIdxCell.setAttribute("class", "cell col__set");
    setIdxCell.innerHTML = setIdx.toString();

    return setIdxCell;
}

function createWeightCell() {
    const weightCell = document.createElement("span");
    weightCell.setAttribute("class", "cell col__weigth");
    const weightInput = document.createElement("input");
    weightInput.setAttribute("type", "text");
    weightCell.appendChild(weightInput);

    return weightCell;
}

function createRepCell() {
    const repCell = document.createElement("span");
    repCell.setAttribute("class", "cell col__rep");
    const repInput = document.createElement("input");
    repInput.setAttribute("type", "text");
    repCell.appendChild(repInput);

    return repCell;
}

function createBtnCell(tableId, rowNumber) {
    const btnCell = document.createElement("span");
    btnCell.setAttribute("class", "cell col__btn");
    const btn = document.createElement("button");
    const btnIcon = document.createElement("i");
    btnIcon.setAttribute("class", "fas fa-minus");
    const fnName = "handleRemoveSetBtnClk(this)"
    btn.setAttribute("onclick", fnName)
    btn.appendChild(btnIcon);
    btnCell.appendChild(btn);

    return btnCell;
}

function handleAddSetBtnClk(element) {

    const tableId = parseInt(element.parentElement.getAttribute("id"));
    const table = document.querySelectorAll(".set__table")[tableId];

    const rowNumber = table.querySelectorAll(".row").length;

    const setIdxCell = createSetIdxCell(rowNumber);
    const weightCell = createWeightCell();
    const repCell = createRepCell();
    const btnCell = createBtnCell(tableId, rowNumber);

    const newLine = document.createElement("div");
    newLine.setAttribute("class", "row set__line");

    newLine.appendChild(setIdxCell);
    newLine.appendChild(weightCell);
    newLine.appendChild(repCell);
    newLine.appendChild(btnCell);

    table.appendChild(newLine);
}

function reorderingSetIdx(table) {

    //get table    
    const setLine = table.querySelectorAll(".set__line");
    let setIdx = 1;

    setLine.forEach(function (row) {
        const setIdxElem = row.querySelector(".col__set");
        setIdxElem.innerHTML = setIdx;
        setIdx++
    })
}

function handleRemoveSetBtnClk(element) {

    const tableId = element.parentElement.parentElement.parentElement.parentElement.getAttribute("id");
    const table = document.querySelectorAll(".set__table")[parseInt(tableId)];
    const tableRow = table.querySelectorAll(".row");
    const setIdx = element.parentElement.parentElement.querySelector(".col__set").innerHTML;

    table.removeChild(tableRow[parseInt(setIdx)]);

    reorderingSetIdx(table);
}

function createModalBtn() {
    const btn = document.createElement("button");
    btn.setAttribute("id", "myBtn");
    btn.setAttribute("onClick", "handleExerModalOpenBtnClk(this)");
    btn.innerText = "운동을 선택해주세요";
    return btn;
}

function createRemoveWorkBtn() {
    const btn = document.createElement("button");
    btn.setAttribute("onclick", "handleRemoveWorkBtnClk(this)");
    const btnIcon = document.createElement("i");
    btnIcon.setAttribute("class", "fas fa-minus");

    btn.appendChild(btnIcon);

    return btn;
}

function createSetTable() {
    const table = document.createElement("div");
    table.setAttribute("class", "set__table");

    const tableHeader = document.createElement("div");
    tableHeader.setAttribute("class", "row heaqder");

    const headerSet = document.createElement("span");
    headerSet.setAttribute("class", "cell col__set");
    headerSet.innerText = "세트수";
    tableHeader.appendChild(headerSet);

    const headerWeight = document.createElement("span");
    headerWeight.setAttribute("class", "cell col__weight");
    headerWeight.innerText = "kg";
    tableHeader.appendChild(headerWeight);

    const headerRep = document.createElement("span");
    headerRep.setAttribute("class", "cell col__rep");
    headerRep.innerText = "횟수";
    tableHeader.appendChild(headerRep);

    const headerBtn = document.createElement("span");
    headerBtn.setAttribute("class", "cell col__btn");
    headerBtn.innerText = "action";
    tableHeader.appendChild(headerBtn);

    table.appendChild(tableHeader);

    const tableEmptyRow = document.createElement("div");
    tableEmptyRow.setAttribute("class", "row set__line");

    const cellSetIdx = createSetIdxCell(1);
    const cellWeight = createWeightCell();
    const cellRep = createRepCell();
    const cellBtn = document.createElement("span");
    cellBtn.setAttribute("class", "cell col__btn");

    tableEmptyRow.appendChild(cellSetIdx);
    tableEmptyRow.appendChild(cellWeight);
    tableEmptyRow.appendChild(cellRep);
    tableEmptyRow.appendChild(cellBtn);

    table.appendChild(tableEmptyRow);

    return table;
}

function createAddSetBtn() {
    const btn = document.createElement("button");
    btn.setAttribute("id", "add__set__btn");
    btn.setAttribute("onclick", "handleAddSetBtnClk(this)")
    btn.innerText = "다음 세트"
    return btn;
}

function handleAddWorkBtnClk(event) {

    const playList = document.querySelector("#play_list");

    const playSet = document.createElement("div");

    const playSetIdx = document.querySelectorAll(".play__set").length;
    playSet.setAttribute("class", "play__set");
    playSet.setAttribute("id", playSetIdx);

    const modelBtn = createModalBtn();
    const removeBtn = createRemoveWorkBtn();
    const setTable = createSetTable();
    const addSetBtn = createAddSetBtn();

    playSet.appendChild(modelBtn);
    playSet.appendChild(removeBtn);
    playSet.appendChild(setTable);
    playSet.appendChild(addSetBtn);

    playList.appendChild(playSet);
}

function reorderingPlayListIdx() {
    const arrPlaySet = document.querySelectorAll(".play__set");
    for (i = 0; i < arrPlaySet.length; i++) {
        arrPlaySet[i].setAttribute("id", i.toString());
    }
}

function handleRemoveWorkBtnClk(element) {
    const playList = document.querySelector("#play_list");
    const playSet = element.parentElement;

    playList.removeChild(playSet);

    reorderingPlayListIdx();
}

function updateStartTime(startTime) {
    startTime = new Date(startTime);
    // console.log(startTime);

    let isAm = true;
    hours = startTime.getHours();
    minutes = startTime.getMinutes();

    if (hours > 12) {
        isAm = false;
        hours -= 12;
    }

    playStarttime.innerHTML = "(" + (isAm ? "AM" : "PM") + " " + hours.toString().padStart(2, '0') + ":" + minutes.toString().padStart(2, '0') + " ~ )";
}

function performStopwatch() {
    let currentTime;
    let timer, hours, minutes, seconds;
    reqStopwatch = requestAnimationFrame(performStopwatch);
    if (startTime === 0) {
        startTime = parseInt(new Date().getTime());
        updateStartTime(startTime);
    }

    currentTime = parseInt(new Date().getTime());

    timer = new Date(0, 0, 0, 0, 0, 0, parseInt(currentTime - startTime));
    hours = timer.getHours();
    minutes = timer.getMinutes();
    seconds = timer.getSeconds();

    const timeString = hours.toString().padStart(2, '0')
        + ':' + minutes.toString().padStart(2, '0')
        + ':' + seconds.toString().padStart(2, '0');

    playStopwatch.innerHTML = timeString;
}

function handleStopwatch(method) {
    if (method === "start") {
        requestAnimationFrame(performStopwatch);
    }
    else {
        cancelAnimationFrame(reqStopwatch);
        //playStopwatch.innerHTML = "00:00:00";
    }
}

function handlePlayFinishBtn(event) {
    if (logging) {
        logging = false;
        //change icon (play)        
        playIcon.className = "fas fa-play";
        //stop stopwatch
        handleStopwatch("stop");
        playStatus.innerHTML = "Ready";
        playStarttime.style.display = "none";
        writeFile();

        startTime = 0;
        //updateStartTime(startTime);      

    }
}

function handlePlayBtnClk(event) {
    if (!logging) {
        //start
        logging = true;
        //change icon (stop)
        playIcon.className = "fas fa-stop";
        playStatus.innerHTML = "Running...";
        playStarttime.style.display = "block";
        //start stopwatch       
        handleStopwatch("start");
    }

}

if (playBtn) {
    playBtn.addEventListener('click', handlePlayBtnClk);
}

if (playFinishBtn) {
    playFinishBtn.addEventListener('click', handlePlayFinishBtn);
}

if (addWorkBtn) {
    addWorkBtn.addEventListener('click', handleAddWorkBtnClk);
}

function handleExerModalOpenBtnClk(element) {
    const modal = document.querySelector("#exerModal");
    modal.style.display = "block";

    //modal content id change to distinguish work
    const workId = element.parentElement.getAttribute("id");
    const modalContent = modal.querySelector(".modal-content");

    modalContent.setAttribute("id", workId.toString());

}

function handleExerModalCloseBtnClk() {
    const modal = document.querySelector("#exerModal");
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    const modal = document.querySelector("#exerModal");
    if (event.target === modal) {
        modal.style.display = "none";
    }
}

const partRadios = document.partRadio.part;
updateWorkSelectList("chest"); //default

function updateWorkSelectList(part) {
    //TODO Read list
    const chestList = ["벤치프레스(머신)", "벤치프레스(바벨)", "체스트플라이"];
    const tricepList = ["트라이셉스 익스텐션(케이블)", "트라이셉스 익스텐션(바벨)"];
    const backList = ["로우(머신)", "친업(어시스티드)"];
    const bicepList = ["바이셉 컬(덤벨)", "해머컬(덤벨)체스트플라이"];
    const legsList = ["스쿼트(바벨)", "레그프레스", "레그익스텐션(머신)", "레그컬(머신)"];
    const shoulderList = ["숄더프레스", "오버헤드프레스"];
    const coreList = ["크런치", "행잉레그레이즈"];
    const etcList = ["족욕"];

    //change select
    const workSelect = document.querySelector("#workSelect");
    // console.log(workSelect);

    //deleteOption
    for (i = workSelect.length; i >= 0; i--) {
        // console.log(workSelect.options[i]);
        workSelect.options[i] = null;
    }

    //addOption
    let selectList;
    if (part === "chest") { selectList = chestList; }
    else if (part === "tricep") { selectList = tricepList; }
    else if (part === "back") { selectList = backList; }
    else if (part === "bicep") { selectList = bicepList; }
    else if (part === "legs") { selectList = legsList; }
    else if (part === "shoulder") { selectList = shoulderList; }
    else if (part === "core") { selectList = coreList; }
    else if (part === "etc") { selectList = etcList; }

    for (i = 0; i < selectList.length; i++) {
        const workOpt = document.createElement("option");
        workOpt.text = selectList[i].toString();
        workOpt.value = i.toString();

        workSelect.options.add(workOpt);
    }

    //addLastNewWork
    const addOpt = document.createElement("option");
    addOpt.text = "새로운 운동";
    addOpt.value = "99";
    workSelect.options.add(addOpt);
    //hidden the text box
    const customWork = document.querySelector("#custom__work");
    customWork.setAttribute("hidden", true);
}

function handleChangePartRadios(event) {
    // console.log(partRadios.value);

    updateWorkSelectList(partRadios.value);

}

partRadios.forEach(function (rad) {
    rad.addEventListener("change", handleChangePartRadios);
});

function handleWorkOkBtnClk(event) {

    const modal = document.querySelector("#exerModal");
    const modalContent = modal.querySelector(".modal-content");
    const workSelect = document.querySelector("#workSelect");

    const modalId = parseInt(modalContent.getAttribute("id"));

    const partValue = partRadios.value;
    const selector = 'label[for=' + partValue + ']';
    const partName = document.querySelector(selector).innerHTML;

    const workValue = parseInt(workSelect.value);
    let workName;
    if (workValue === 99) {
        const inputText = document.querySelector("#custom__work").value;
        //get from textBox
        workName = inputText;
    }
    else {
        workName = workSelect.options[workValue].text;
    }
    //change button name
    const playSet = document.querySelectorAll(".play__set")[modalId];
    const modalBtn = playSet.querySelector("#myBtn");
    modalBtn.innerHTML = "[" + partName + "] " + workName;

    //close modal
    modal.style.display = "none";
}

if (workOkBtn) {
    workOkBtn.addEventListener('click', handleWorkOkBtnClk);
}