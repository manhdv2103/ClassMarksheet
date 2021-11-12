$('.tool-item > a[href="#sort"]').on('click', function () {
    if ($(this).hasClass('active')) {
        enableSort();
    }
});

// Kích hoạt khả năng sắp xếp cho bảng điểm
function enableSort() {
    table.addClass('sort-mode');
    tableHead.on('click', 'th', sortTable).find('th').attr('tabIndex', 0);
}

// Vô hiệu hóa khả năng sắp xếp cho bảng điểm
function disableSort() {
    resetAllHeaders();
    table.removeClass('sort-mode');
    tableHead.off('click', 'th', sortTable).find('th').removeAttr('tabIndex title');
}

// Sắp xếp bảng điểm theo cột
function sortTable() {
    const header = $(this);
    let index = header.index();
    let sortedTable,
        switching = true,
        switchCount = 0;

    // Đặt hướng sắp xếp ban đầu là tăng dần
    let direction = 'asc';

    while (switching) {
        switching = false;

        // Sắp xếp lại bảng theo chiều tăng hoặc giảm
        sortedTable = tableBody.children('tr').sort((row1, row2) => {
            let content1 = $(`td:eq(${index})`, row1).text();
            let content2 = $(`td:eq(${index})`, row2).text();

            let result = content1 - content2 || content1.localeCompare(content2);
            if (direction == 'desc') {
                result = -result;
            }

            // Nếu hai hàng bị tráo đổi thì tăng switchCount lên 1
            if ($(row1).index() < $(row2).index()) {
                if (result > 0) {
                    switchCount++;
                }
            } else {
                if (result < 0) {
                    switchCount++;
                }
            }

            return result;
        });

        // Nếu không có hàng nào bị tráo đổi và chiều là tăng dần thì đổi chiều và chạy lại
        if (switchCount == 0 && direction == 'asc') {
            direction = 'desc';
            switching = true;
        }
    }
    tableBody.append(sortedTable);

    resetAllHeaders();

    // Đặt trạng thái cho tiêu đề cột theo chiều vừa được xếp
    header
        .addClass('sort-' + direction)
        .attr('title', 'Nhấn để xếp ' + (direction == 'asc' ? 'giảm' : 'tăng') + ' dần');
}

// Đặt lại trạng thái của tất cả tiêu đề bảng (bỏ mũi tên sắp xếp)
function resetAllHeaders() {
    tableHead.find('th').removeClass('sort-asc sort-desc').attr('title', 'Nhấn để xếp tăng dần');
}
