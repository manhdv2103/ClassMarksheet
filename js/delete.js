$('.tool-item > a[href="#delete"]').on('click', function () {
    if ($(this).hasClass('active')) {
        enableDelete();
    }
});

// Kích hoạt khả năng xóa học sinh cho bảng điểm
function enableDelete() {
    table.addClass('delete-mode');
    tableBody.on('click', 'tr', deleteTestScore);
}

// Vô hiệu hóa khả năng xóa học sinh cho bảng điểm
function disableDelete() {
    table.removeClass('delete-mode');
    tableBody.off('click', 'tr', deleteTestScore);
}

// Xóa học sinh được nhấn vào
function deleteTestScore() {
    const deleteRow = $(this);
    let deleteIndex = Number(deleteRow.children('td').eq(STT_INDEX).text());
    let deleteName = deleteRow.children('td').eq(NAME_INDEX).text();

    if (prompt(`Nhập "YES" để xác nhận xóa học sinh ${deleteName}`) === 'YES') {
        // Đánh lại số thứ tự trước khi xóa
        tableBody
            .children('tr')
            .find(`td:eq(${STT_INDEX})`)
            .each(function () {
                if (Number($(this).text()) > deleteIndex) {
                    $(this).text($(this).text() - 1);
                }
            });

        deleteRow.remove();

        // Tính lại các thông tin tổng quan
        totalStudents.text(--i);
        if (deleteRow.hasClass('excellent-student')) {
            excStudents.text(excStudents.text() - 1);
        }
        calculateExcPercent();
    }
}
