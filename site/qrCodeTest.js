function eventPageLoaded() {
    const containerInitCamera = document.getElementById('initCamera');
    createStartScanningButton(containerInitCamera);

}

/**
 * Выбор камеры
 * @param container
 */
function cameraSelection(container) {
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
                selectedButton.innerText = 'Выбрать';
                selectedButton.onclick = () => {
                    selectedButton.onclick = null;
                    const cameraId = select.value;

                    console.log(cameraId);
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
    const containerCamera = document.getElementById('camera');

    const html5QrCode = new Html5Qrcode('camera');
    containerButtonCancel.innerHTML = '';

    const div_cancelScanning = document.createElement('div');
    div_cancelScanning.className = 'cancelScanningButton';
    div_cancelScanning.innerText = 'Отмена';
    div_cancelScanning.onclick = () => {
        div_cancelScanning.onclick = null;
        console.log('stop!');
        html5QrCode.stop()
            .then(()=>{
                html5QrCode.clear();
                cameraSelection(containerButtonCancel);
            });
    }

    containerButtonCancel.append(div_cancelScanning);


    html5QrCode.start(
        inputCameraId, // retreived in the previous step.
        {
            fps: 10,    // sets the framerate to 10 frame per second
            qrbox: {width: 250, height: 250}
            // scannable, rest shaded.
        },
        qrCodeMessage => {
            // do something when code is read. For example:
            console.log(`QR Code detected: ${qrCodeMessage}`);

            const qrListContainer = document.getElementById('qrResult')
            const div_qrContainer = document.createElement('div');
            div_qrContainer.innerText = qrCodeMessage;
            qrListContainer.append(div_qrContainer);
        },
        errorMessage => {
            // parse error, ideally ignore it. For example:
            console.log(`QR Code no longer in front of camera.`);
        })
        .catch(err => {
            // Start failed, handle it. For example,
            console.log(`Unable to start scanning, error: ${err}`);
        });
}


document.addEventListener("DOMContentLoaded", eventPageLoaded);
