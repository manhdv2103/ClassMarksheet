const toolbarToggle = $('#toolbar-toggle');

$('.tool-item > a').on('click', switchTool);
toolbarToggle.on('click', toggleToolbar);

// Đổi công cụ tương tác với bảng điểm
function switchTool(event) {
    event.preventDefault();

    // Nếu như có công cụ đang đóng thì không mở công cụ khác
    if (!$('.tool-pane.hiding').length) {
        const tool = $(this);
        const pane = $(tool.attr('href'));
        const activeTool = $('.tool-item > a.active');
        const activePane = $(activeTool.attr('href'));

        let slideSpeed = $(window).innerWidth() <= 768 ? 250 : 0;

        tool.addClass('active');
        activeTool.removeClass('active');

        // Ẩn công cụ trước đi
        activePane.addClass('hiding');
        activePane.slideUp(slideSpeed, () => {
            activePane.removeClass('hiding');

            // Chỉ mở công cụ mới nếu người dùng nhấn sang công cụ khác
            if (tool[0] != activeTool[0]) {
                pane.slideDown(slideSpeed, () => {
                    pane.removeClass('hidden');
                });
            }
        });

        // Mở công cụ mới khi tất cả các công cụ đều đóng
        if (!activeTool.length) {
            pane.slideDown(slideSpeed, () => {
                pane.removeClass('hidden');
            });
        }

        // Vô hiệu hóa tất cả công cụ rồi kích hoạt công cụ được chọn sau
        disableAllTools();
    }
}

// Đóng/mở thanh công cụ
function toggleToolbar() {
    $('#toolbar').slideToggle(250);
    toolbarToggle
        .toggleClass('collapsed')
        .attr('title', (toolbarToggle.hasClass('collapsed') ? 'Mở' : 'Đóng') + ' thanh công cụ');
}

// Vô hiệu hóa tất cả các công cụ
function disableAllTools() {
    disableEdit();
    disableFilter();
    disableSort();
    disableDelete();
}
