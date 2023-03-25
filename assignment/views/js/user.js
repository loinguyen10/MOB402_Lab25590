const avatarPreview = document.getElementById('avatar-preview');
const fileInput = document.getElementById('file-input');

avatarPreview.addEventListener('click', function () {
    fileInput.click();
});

fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];

    // Kiểm tra xem người dùng đã chọn ảnh hay chưa.
    if (file) {
        const reader = new FileReader();

        // Đọc nội dung của tệp và cập nhật src của ảnh preview.
        reader.addEventListener("load", () => {
            avatarPreview.src = reader.result;
        });

        reader.readAsDataURL(file);
    }
});

