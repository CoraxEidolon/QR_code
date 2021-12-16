function eventPageLoaded() {
    const containerInitCamera = document.getElementById('initCamera');
    createStartScanningButton(containerInitCamera);

}

/**
 * Выбор камеры
 * @param container
 */
function cameraSelection(container, cameraId=null) {
    container.innerHTML = '';
    Html5Qrcode.getCameras()
        .then(devices => {
            if (devices && devices.length) {
                const select = document.createElement('select');

                for (let i = 0; i < devices.length; ++i) {
                    const option = document.createElement('option');

                    if (!devices[i].hasOwnProperty('id')) {
                        continue;
                    }

                    if (!devices[i].hasOwnProperty('label')) {
                        continue;
                    }

                    if(cameraId === devices[i].id){
                        option.selected='selected';
                    }

                    option.value = devices[i].id;
                    option.innerText = devices[i].label;

                    select.append(option);
                }

                const selectedCameraTitle = document.createElement('div');
                selectedCameraTitle.innerText = 'Выберете камеру';
                selectedCameraTitle.className = 'selectCameraTitle';

                const selectContainer = document.createElement('div');
                selectContainer.className = 'selectCameraContainer';
                selectContainer.append(select);

                const selectedButton = document.createElement('div');
                selectedButton.className = 'selectedButton';
                selectedButton.innerText = 'Начать сканирование';
                selectedButton.onclick = () => {
                    selectedButton.onclick = null;
                    const cameraId = select.value;

                    if(!cameraId){
                        return;
                    }

                    readQRCodeCamera(cameraId, container);
                };

                container.append(selectedCameraTitle);
                container.append(selectContainer);
                container.append(selectedButton);

            }
        }).catch(err => {
        container.innerText = 'Не удалось получить доступ к камере';
    });
}

/**
 * Создать кнопку начала работы
 * @param container
 */
function createStartScanningButton(container) {
    container.innerHTML = '';

    const div_startScanning = document.createElement('div');
    div_startScanning.className = 'startScanningButton';
    div_startScanning.innerText = 'Щелкните для начала сканирования и дайте разрешение браузеру на доступ к камере';

    div_startScanning.onclick = () => {
        div_startScanning.onclick = null;
        cameraSelection(container);
    }

    container.append(div_startScanning);
}


function readQRCodeCamera(inputCameraId, containerButtonCancel) {
    // Контейнер с результатом сканирования
    const qrResultContainer = document.getElementById('qrResult')

    const html5QrCode = new Html5Qrcode('camera');
    containerButtonCancel.innerHTML = '';

    function stopScanning() {
        html5QrCode.stop()
            .then(()=>{
                html5QrCode.clear();
                cameraSelection(containerButtonCancel, inputCameraId);
                const containerCamera = document.getElementById('camera');
                containerCamera.innerHTML = '';
                //qrResultContainer.innerHTML = '';
            });
    }

    //Создаем кнопку отмены сканирования
    const div_cancelScanning = document.createElement('div');
    div_cancelScanning.className = 'cancelScanningButton';
    div_cancelScanning.innerText = 'Отмена';
    div_cancelScanning.onclick = () => {
        div_cancelScanning.onclick = null;
        stopScanning();
    }

    containerButtonCancel.append(div_cancelScanning);

    html5QrCode.start(
        inputCameraId,
        {
            fps: 10,
            qrbox: {width: 250, height: 250},
        },
        qrCodeMessage => {
            // QR найден, показываем его
            qrResultContainer.innerText = `QR код "${qrCodeMessage}" отправлен`;
            // Останавливаем сканер, возвращаемся обратно
            stopScanning();
            // ! ! ! ТУТ ДОЛЖЕН БЫТЬ ЗАПРОС НА СЕРВЕР ! ! !
        });
}


document.addEventListener("DOMContentLoaded", eventPageLoaded);
