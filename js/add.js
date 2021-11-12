createTestScores(45);

$('#add-form').on('submit', function (event) {
    event.preventDefault();

    addNewTestScore(
        $('#name').val(),
        Number($('#math').val()),
        Number($('#physics').val()),
        Number($('#chemistry').val())
    );

    $(this).trigger('reset');

    // Cuộn bảng xuống hàng của học sinh mới thêm
    table.focus();
    table.parent().stop().animate({ scrollTop: table.height() }, 400, 'swing');
});

// Thêm học sinh mới với tên và các điểm thành phần được truyền vào
function addNewTestScore(name, math, physics, chemistry) {
    const testScore = {
        name: '',
        math: 0,
        physics: 0,
        chemistry: 0
    };
    testScore.name = name.trim();
    testScore.math = math;
    testScore.physics = physics;
    testScore.chemistry = chemistry;

    const row = $('<tr>', { tabIndex: 0 });
    tableBody.append(row);

    row.append($('<td>').text(++i))
        .append($('<td>').text(testScore.name))
        .append($('<td>').text(Number(testScore.math.toFixed(2))))
        .append($('<td>').text(Number(testScore.physics.toFixed(2))))
        .append($('<td>').text(Number(testScore.chemistry.toFixed(2))))
        .append($('<td>').text('?'));

    totalStudents.text(Number(totalStudents.text()) + 1);
}

// Tạo dữ liệu điểm học sinh ngẫu nhiên với số lượng xác định
function createTestScores(numOfTestScores) {
    // Tạo một số ngẫu nhiên với phần nguyên trong khoảng xác định
    function randNum(min, max) {
        return Math.random() * (max - min + 1) + min;
    }

    // Tạo điểm ngẫu nhiên
    function randScore() {
        // Có 50% điểm trên 8 -> tăng khả năng trở thành học sinh giỏi
        if (Math.random() < 0.5) {
            return randNum(8, 9);
        }

        return randNum(0, 7);
    }

    const lastNames = ['Nguyễn ', 'Trần ', 'Vũ ', 'Lê ', 'Bùi '];
    const middleNames = ['Văn ', 'Thị '];

    for (let i = 0; i < numOfTestScores; i++) {
        let name =
            lastNames[Math.floor(randNum(0, 4))] +
            middleNames[Math.floor(randNum(0, 1))] +
            String.fromCharCode(randNum(65, 90));

        addNewTestScore(name, randScore(), randScore(), randScore());
    }
}
