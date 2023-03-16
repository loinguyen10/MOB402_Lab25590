$(document).ready(function () {
    $('uploadForm').submit(function () {
        $("#status").empty().text("Đang tải file...");
        $(this).ajaxSubmit({
            error: function (xhr) {
                status('Loi: ' + xhr.status);
            },
            success: function (response) {
                console.log(response)
                $('#status').empty().text(response);
            }
        });
        return false;
    });
});