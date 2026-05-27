/* =========================
   REPORTS PAGE JS
========================= */


/* COUNTER ANIMATION */

function animateCounter(id, start, end, duration){

    let obj =
    document.getElementById(id);

    let range = end - start;

    let current = start;

    let increment =
    end > start ? 1 : -1;

    let step =
    Math.abs(
    Math.floor(duration / range)
    );

    let timer =
    setInterval(function(){

        current += increment;

        obj.innerHTML = current;

        if(current == end){

            clearInterval(timer);
        }

    }, step);

}


/* START COUNTS */

animateCounter(
"membersCount",
0,
1200,
2000
);

animateCounter(
"eventsCount",
0,
85,
2000
);

animateCounter(
"messagesCount",
0,
560,
2000
);

animateCounter(
"opportunitiesCount",
0,
18,
2000
);


/* GENERATE REPORT */

const generateBtn =
document.getElementById(
"generateReportBtn"
);

generateBtn.addEventListener(
"click",
function(){

    addReport(
    "Monthly Analytics Report",
    "Completed"
    );

    alert(
    "Report Generated Successfully!"
    );

});


/* EXPORT PDF */

const pdfBtn =
document.getElementById(
"exportPdfBtn"
);

pdfBtn.addEventListener(
"click",
function(){

    window.print();

});


/* EXPORT EXCEL */

const excelBtn =
document.getElementById(
"exportExcelBtn"
);

excelBtn.addEventListener(
"click",
function(){

    let table =
    document.getElementById(
    "reportTable"
    );

    let html =
    table.outerHTML;

    let url =
    'data:application/vnd.ms-excel,' +
    escape(html);

    let link =
    document.createElement("a");

    link.href = url;

    link.download =
    "reports.xls";

    link.click();

});


/* ADD REPORT ROW */

function addReport(activity, status){

    let table =
    document.getElementById(
    "reportTable"
    );

    let row =
    table.insertRow();

    let date =
    new Date().toLocaleDateString();

    let statusClass =
    status.toLowerCase();

    row.innerHTML = `

        <td>${date}</td>

        <td>${activity}</td>

        <td>
            <span class="status ${statusClass}">
                ${status}
            </span>
        </td>

    `;

}


/* SAMPLE DATA */

addReport(
"Weekly User Growth",
"Completed"
);

addReport(
"Event Attendance Analysis",
"Pending"
);

addReport(
"Community Engagement",
"Failed"
);


/* DARK MODE */

function toggleDarkMode(){

    document.body.classList.toggle(
    "dark-mode"
    );

}