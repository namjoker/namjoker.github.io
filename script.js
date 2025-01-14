$(document).ready(function () {
    $('#startButton').click(function () {
        var code = $('#codeInput').val();
        if (code.length === 3) {
            $('#codeDisplay').text(code);
            $('#popup').addClass('hidden');
            $('#greeting').removeClass('hidden');
            $('#maleImages').removeClass('hidden');
            showImagesSequentially('#maleImages .row img');
        } else {
            alert('Hãy nhập đúng mã trên thiệp mời.');
        }
    });

    function showImagesSequentially(selector) {
        $(selector).each(function (index) {
            $(this).delay(index * 200).queue(function (next) {
                $(this).addClass('visible');
                next();
            });
        });
    }

    $('#maleImages .row img').click(function (e) {
        // Handle image enlargement first
        // $('#imageModal').show();
        // $('#enlargedImage').attr('src', $(this).attr('src'));

        // Handle selection
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            $('#maleImages .row img').removeClass('dimmed');
            $('#nextButton').addClass('hidden');
        } else {
            $('#maleImages .row img').removeClass('selected').addClass('dimmed');
            
            $(this).removeClass('dimmed').addClass('selected');
            $('#nextButton').removeClass('hidden');
        }
    });

    // Update female images click handler similarly
    $('#femaleImages .row img').click(function (e) {
        // Handle image enlargement first
        // $('#imageModal').show();
        // $('#enlargedImage').attr('src', $(this).attr('src'));

        // Handle selection
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            $('#femaleImages .row img').removeClass('dimmed');
            $('#finishButton').addClass('hidden');
        } else {
            $('#femaleImages .row img').removeClass('selected').addClass('dimmed');
            $(this).removeClass('dimmed').addClass('selected');
            $('#finishButton').removeClass('hidden');
        }
    });

    $('#nextButton').click(function () {
        $('#maleImages').addClass('hidden');
        $('#femaleImages').removeClass('hidden');
        $(this).addClass('hidden');
        showImagesSequentially('#femaleImages .row img');
    });

    // $('#femaleImages .row img').click(function () {
    //     if ($(this).hasClass('selected')) {
    //         $(this).removeClass('selected');
    //         $('#femaleImages .row img').removeClass('dimmed');
    //         $('#finishButton').addClass('hidden');
    //     } else {
    //         $('#femaleImages .row img').removeClass('selected').addClass('dimmed');
    //         $(this).removeClass('dimmed').addClass('selected');
    //         $('#finishButton').removeClass('hidden');
    //     }
    // });

    $('#finishButton').click(function () {
        $('#finishButton').addClass('hidden');
        var selectedMaleImage = $('#maleImages .row img.selected').clone().removeClass('selected dimmed visible');
        var selectedFemaleImage = $('#femaleImages .row img.selected').clone().removeClass('selected dimmed visible');
        $('#selectedImages').empty().append(selectedMaleImage).append(selectedFemaleImage);
        $('#confirmationPopup').show().css('display', 'grid');;
    });



    $('#confirmButton').click(function () {
        var voterID = $('#codeInput').val();
        var kingID = $('#maleImages .row img.selected').data('code');
        var queenID = $('#femaleImages .row img.selected').data('code');
        var apiUrl = `https://script.google.com/macros/s/AKfycbzDqCxpVJ-11jv5tg2QVj_wsO2ulUwRARoVpgnrcab1ue3-sAopUa2gUmDA8YEGYclP/exec?action=poll&voterID=${voterID}&kingID=${kingID}&queenID=${queenID}`;

        $('#loadingCircle').removeClass('hidden'); // Show loading circle
        $('#confirmButton').addClass('hidden'); // Hide confirmButton

        $.getJSON(apiUrl, function (response) {
            $('#loadingCircle').addClass('hidden'); // Hide loading circle
            if (response.code === 1) {
                $('#confirmationPopup .popup-content').html('<h2>✅Bạn đã bầu chọn thành công!</h2><p>Quay lại trang bắt đầu sau <span id="countdown">3</span> giây...</p>');
                var countdown = 3;
                var countdownInterval = setInterval(function () {
                    countdown--;
                    $('#countdown').text(countdown);
                    if (countdown === 0) {
                        clearInterval(countdownInterval);
                        resetVoting();
                    }
                }, 1000);
            } else {
                $('#confirmationPopup .popup-content').html(`<h2>❌ Lỗi bầu chọn</h2><p>${response.message}</p><p>Quay lại trang bắt đầu sau <span id="countdown">3</span> giây...</p>`);
                var countdown = 5;
                var countdownInterval = setInterval(function () {
                    countdown--;
                    $('#countdown').text(countdown);
                    if (countdown === 0) {
                        clearInterval(countdownInterval);
                        resetVoting();
                    }
                }, 1000);
            }
        });
    });

    function resetVoting() {
        // Ẩn popup xác nhận
        $('#confirmationPopup').hide();

        // Khôi phục nội dung mặc định của popup
        $('#confirmationPopup .popup-content').html(`
        <h2>Xác nhận bầu chọn</h2>
        <div id="selectedImages"></div>
        <button id="confirmButton" class="btn btn-primary mt-3">Xác nhận</button>
        <div id="loadingCircle" class="hidden"></div>
    `);

        // Gắn lại sự kiện click cho nút Confirm
        $('#confirmButton').on('click', function () {
            // Hành động khi bấm nút Confirm
            handleConfirmation();
        });

        // Hiển thị lại popup nhập code
        $('#popup').removeClass('hidden');

        // Xóa mã đã nhập
        $('#codeInput').val('');

        // Ẩn giao diện chào mừng và các container
        $('#greeting').addClass('hidden');
        $('#maleImages, #femaleImages').addClass('hidden');

        // Xóa trạng thái các hình ảnh
        $('#maleImages .row img, #femaleImages .row img').removeClass('selected dimmed visible');

        // Ẩn các nút điều hướng
        $('#nextButton, #finishButton').addClass('hidden');
    }

    function handleConfirmation() {
        var voterID = $('#codeInput').val();
        var kingID = $('#maleImages .row img.selected').data('code');
        var queenID = $('#femaleImages .row img.selected').data('code');
        var apiUrl = `https://script.google.com/macros/s/AKfycbzDqCxpVJ-11jv5tg2QVj_wsO2ulUwRARoVpgnrcab1ue3-sAopUa2gUmDA8YEGYclP/exec?action=poll&voterID=${voterID}&kingID=${kingID}&queenID=${queenID}`;

        $('#loadingCircle').removeClass('hidden'); // Show loading circle
        $('#confirmButton').addClass('hidden'); // Hide confirmButton

        $.getJSON(apiUrl, function (response) {
            $('#loadingCircle').addClass('hidden'); // Hide loading circle
            if (response.code === 1) {
                $('#confirmationPopup .popup-content').html('<h2>✅Bạn đã bầu chọn thành công!</h2><p>Quay lại trang bắt đầu sau <span id="countdown">3</span> giây...</p>');
                var countdown = 3;
                var countdownInterval = setInterval(function () {
                    countdown--;
                    $('#countdown').text(countdown);
                    if (countdown === 0) {
                        clearInterval(countdownInterval);
                        resetVoting();
                    }
                }, 1000);
            } else {
                $('#confirmationPopup .popup-content').html(`<h2>❌ Lỗi bầu chọn</h2><p>${response.message}</p><p>Quay lại trang bắt đầu sau <span id="countdown">3</span> giây...</p>`);
                var countdown = 5;
                var countdownInterval = setInterval(function () {
                    countdown--;
                    $('#countdown').text(countdown);
                    if (countdown === 0) {
                        clearInterval(countdownInterval);
                        resetVoting();
                    }
                }, 1000);
            }
        });
    
    }


    // Close modal when clicking outside
    $('#imageModal').click(function () {
        $(this).hide();
    });



});
