let currentCell, lastContent;

$('.tool-item > a[href="#edit"]').on('click', function () {
    if ($(this).hasClass('active')) {
        enableEdit();
    }
});

// Kích hoạt khả năng chỉnh sửa cho bảng điểm
function enableEdit() {
    table.addClass('edit-mode').removeClass('table-hover');
    tableBody.on('click', 'td', enableCellEdit);
}

// Vô hiệu hóa khả năng chỉnh sửa cho bảng điểm
function disableEdit() {
    table.removeClass('edit-mode').addClass('table-hover');
    tableBody.off('click', 'td', enableCellEdit);
}

// Kích hoạt khả năng chỉnh sửa cho ô được nhấn vào
function enableCellEdit() {
    const cell = $(this);

    // Chỉ cho phép chỉnh sửa tên và điểm thành phần
    if (cell.index() >= NAME_INDEX && cell.index() < AVERAGE_INDEX) {
        let editInput = cloneInput(cell.index() - 1);

        // Tạm thời thay ô của bảng thành phần tử input để người dùng sửa thông tin
        cell.replaceWith(editInput);

        editInput.val(cell.text()).focus().select();

        currentCell = cell;
        lastContent = editInput.val();
    }
}

// Sao chép một phần tử input của add form theo index được truyền vào
// Đảm bảo sự chỉnh sửa của người dùng vẫn được xác thực
function cloneInput(index) {
    return $('#add-form input')
        .eq(index)
        .clone()
        .removeAttr('id')
        .addClass('text-center py-1')
        .removeClass('form-control-sm')
        .on({
            blur: saveEdit,
            keydown: function (event) {
                // Nếu người dùng nhấn Enter và nội dung sửa hợp lệ thì mới lưu nội dung vào ô
                if (event.key == 'Enter' && $(this).get(0).reportValidity()) {
                    $(this).blur();
                }
            }
        });
}

// Lưu lại thông tin sau khi sửa
// Nếu thông tin không hợp lệ thì ô bảng sẽ được quay về trước khi sửa
function saveEdit(event) {
    const input = $(this);
    const row = input.parent();

    if (input.get(0).reportValidity()) {
        let value =
            input.attr('type') == 'number'
                ? Number(Number(input.val()).toFixed(2))
                : input.val().trim();

        // Trả lại ô bảng với thông tin sau khi sửa
        currentCell.text(value);
        input.replaceWith(currentCell);

        // Nếu điểm bị thay đổi thì đặt lại điểm trung bình,
        // số học sinh giỏi và phần trăm giỏi về "?"
        if (input.attr('type') == 'number' && value != lastContent) {
            row.removeClass('excellent-student').children('td').eq(AVERAGE_INDEX).text('?');
            excStudents.text('?');
            excStudentsPercent.text('?');
        }
    } else if (event.type == 'blur') {
        input.replaceWith(currentCell);
    }
}
