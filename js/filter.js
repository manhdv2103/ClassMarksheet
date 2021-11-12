const filterForm = $('#filter-form');
const numberCondition = $('#number-condition');
const nameCondition = $('#name-condition');
const filterValInput = $('#filter-value');
const filterResetBtn = $('#filter-reset-btn');

$('.tool-item > a[href="#filter"]').on('click', function () {
    if ($(this).hasClass('active')) {
        enableFilter();
    }
});

// Lọc học sinh theo điều kiện khi biểu mẫu được gửi đi
filterForm.on('submit', event => {
    event.preventDefault();

    const filteringHeader = $('#test-score-table th.filtering');
    let cellIndex = filteringHeader.index();
    let filterVal = filterValInput.val();

    // Ghi lại giá trị biểu mẫu lọc vào tiêu đề cột
    filteringHeader.prop('filter').value = filterVal;
    if (cellIndex == NAME_INDEX) {
        filteringHeader.prop('filter').condMode = Number(nameCondition.val());
        filterVal = filterVal.toLowerCase();
    } else {
        filteringHeader.prop('filter').condMode = Number(numberCondition.val());
        filterVal = Number(filterVal);
    }

    // Xét điều kiện từng hàng của bảng
    tableBody.children('tr').each(function () {
        const row = $(this);
        let content = row.children('td').eq(cellIndex).text();
        let result;

        if (cellIndex == NAME_INDEX) {
            content = content.toLowerCase();

            switch (Number(nameCondition.val())) {
                case 0:
                    result = true;
                    break;
                case 1:
                    result = content.includes(filterVal);
                    break;
                case 2:
                    result = content.startsWith(filterVal.trim());
                    break;
                case 3:
                    result = content.endsWith(filterVal.trim());
                    break;
                case 4:
                    result = content == filterVal.trim();
            }
        } else {
            content = Number(content);

            switch (Number(numberCondition.val())) {
                case 0:
                    result = true;
                    break;
                case 1:
                    result = content > filterVal;
                    break;
                case 2:
                    result = content >= filterVal;
                    break;
                case 3:
                    result = content < filterVal;
                    break;
                case 4:
                    result = content <= filterVal;
                    break;
                case 5:
                    result = content == filterVal;
            }
        }

        // Khi mà tất cả các ô trong hàng đều thỏa mãn điều kiện thì mới hiển thị hàng
        row.prop('filterCellsResult')[cellIndex] = result;
        row.prop('filterCellsResult').every(result => result) ? row.show() : row.hide();
    });

    // Đặt trạng thái của cột phụ thuộc vào điều kiện lọc
    if (filteringHeader.prop('filter').condMode) {
        filteringHeader.addClass('filtered').attr('title', 'Đã lọc');
    } else {
        filteringHeader.removeClass('filtered').attr('title', 'Chưa lọc');
    }

    table.focus();
});

// Đặt lại điều kiện lọc của tất cả các cột khi nhấn nút đặt lại
filterResetBtn.on('click', () => {
    tableHead.find('th').removeClass('filtered').attr('title', 'Chưa lọc');
    tableBody.children('tr').show();
});

numberCondition.on('change', setInputRequired);
nameCondition.on('change', setInputRequired);

// Kích hoạt khả năng lọc cho bảng điểm
function enableFilter() {
    table.addClass('filter-mode');

    tableHead
        .on('click', 'th', enableColFilter)
        .find('th')
        .attr({ tabIndex: 0, title: 'Chưa lọc' })
        .each(function () {
            // Tạo đối tượng chứa điều kiện lọc của cột cho tiêu đề cột nếu đối tượng chưa tồn tại
            if (!$(this).prop('filter')) {
                $(this).prop('filter', { condMode: 0, value: '' });
            }
        });

    // Mỗi phần tử trong filterCellsResult sẽ là "true" nếu ô đó thỏa mãn điều kiện lọc và ngược lại
    tableBody.children('tr').each(function () {
        $(this).prop('filterCellsResult', new Array(6).fill(true));
    });
}

// Vô hiệu hóa khả năng lọc cho bảng điểm
function disableFilter() {
    table.removeClass('filter-mode');

    tableHead
        .off('click', 'th', enableColFilter)
        .find('th')
        .removeClass('filtering filtered')
        .removeAttr('tabIndex title');

    hideFilterForm();
}

// Hiển thị biểu mẫu lọc cho cột khi nhấn vào tiêu đề cột tương ứng
// Nhấn lại lần nữa thì ẩn biểu mẫu và hiển thị nút đặt lại
function enableColFilter() {
    const header = $(this);
    const filteringHeader = $('#test-score-table th.filtering');

    if (header[0] != filteringHeader[0]) {
        let [condition, otherCond] =
            header.index() == NAME_INDEX
                ? [nameCondition, numberCondition]
                : [numberCondition, nameCondition];

        // Hiển thị phần tử chọn điều kiện của cột này và ẩn phần tử kia đi
        condition.attr('required', true).parents().eq(1).show();
        otherCond.attr('required', false).parents().eq(1).hide();

        // Đặt giá trị biểu mẫu lọc thành giá trị được ghi lại lần trước của cột
        filterValInput.val(header.prop('filter').value);
        condition.val(header.prop('filter').condMode).trigger('change');

        // Nếu như có cột khác đang lọc thì bỏ trạng thái "đang lọc" đi
        if (filteringHeader) {
            filteringHeader.removeClass('filtering');
        }

        showFilterForm();
        header.addClass('filtering');
    } else {
        hideFilterForm();
        header.removeClass('filtering');
    }
}

// Đặt giá trị "required" của phần tử input theo điều kiện lọc được chọn
function setInputRequired() {
    filterValInput.attr('required', $(this).val() != 0 ? true : false);
}

// Hiển thị biểu mẫu lọc và ẩn nút đặt lại
function showFilterForm() {
    let slideSpeed = $(window).innerWidth() <= 768 ? 250 : 0;

    if (!filterResetBtn.parent().hasClass('hiding')) {
        filterResetBtn.parent().addClass('hiding');

        filterResetBtn.parent().slideUp(slideSpeed, () => {
            filterResetBtn.parent().removeClass('hiding');

            filterForm.slideDown(slideSpeed, () => {
                filterForm.removeClass('hidden');
            });
        });
    }
}

// Ẩn biểu mẫu lọc và hiển thị nút đặt lại
function hideFilterForm() {
    let slideSpeed = $(window).innerWidth() <= 768 ? 250 : 0;

    if (!filterForm.hasClass('hiding')) {
        filterForm.addClass('hiding');

        filterForm.slideUp(slideSpeed, () => {
            filterForm.removeClass('hiding');

            filterResetBtn.parent().slideDown(slideSpeed, () => {
                filterResetBtn.parent().removeClass('hidden');
            });
        });
    }
}
