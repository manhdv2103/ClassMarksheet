const STT_INDEX = 0,
    NAME_INDEX = 1,
    MATH_INDEX = 2,
    PHYSICS_INDEX = 3,
    CHEMISTRY_INDEX = 4,
    AVERAGE_INDEX = 5;
let i = 0;

const table = $('#test-score-table');
const tableHead = table.children('thead');
const tableBody = table.children('tbody');

const totalStudents = $('#total-students-count');
const excStudents = $('#excellent-students-count');
const excStudentsPercent = $('#excellent-students-percent');

$('#average-btn').on('click', calculateAverage);
$('#excellent-students-btn').on('click', highlightExcStudents);
$('#to-top-btn').on('click', toTableTop);

// Tính điểm trung bình của các học sinh
function calculateAverage() {
    tableBody.children('tr').each(function () {
        const cells = $(this).children('td');
        const averageCell = cells.eq(AVERAGE_INDEX);

        if (averageCell.text() == '?') {
            let math = Number(cells.eq(MATH_INDEX).text());
            let physics = Number(cells.eq(PHYSICS_INDEX).text());
            let chemistry = Number(cells.eq(CHEMISTRY_INDEX).text());

            let average = (math + physics + chemistry) / 3;
            averageCell.text(Number(average.toFixed(1)));
        }
    });
}

// Các học sinh giỏi (điểm trung bình >= 8) sẽ được đánh dấu bằng nền màu xanh lá
function highlightExcStudents() {
    let numOfExc = 0;

    tableBody.children('tr').each(function () {
        let average = $(this).children('td').eq(AVERAGE_INDEX).text();

        if (average >= 8) {
            $(this).addClass('excellent-student');
            numOfExc++;
        }
    });
    excStudents.text(numOfExc);

    calculateExcPercent();
}

// Cuộn lên trên đầu bảng
function toTableTop() {
    table.parent().stop().animate({ scrollTop: 0 }, 400, 'swing');
}

// Tính và hiển thị phần trăm học sinh giỏi
function calculateExcPercent() {
    if (excStudents.text() != '?') {
        excStudentsPercent.text(
            Math.round((excStudents.text() / totalStudents.text()) * 100 * 100) / 100
        );
    }
}
