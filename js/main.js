let pixelData = null;
let targetWidth = 20;
let targetHeight = 20;

const imageUpload = document.getElementById('image-upload');
const imagePreview = document.getElementById('image-preview');
const targetWidthInput = document.getElementById('target-width');
const targetHeightInput = document.getElementById('target-height');
const processBtn = document.getElementById('process-btn');
const exportBtn = document.getElementById('export-btn');
const pixelGrid = document.getElementById('pixel-grid');

imageUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
        const img = document.createElement('img');
        img.src = event.target.result;
        imagePreview.innerHTML = '';
        imagePreview.appendChild(img);
        processBtn.disabled = false;
    };
    reader.readAsDataURL(file);
});
// 打断施法，不过现在删了，在下面加一个“免责提示”比弹出式窗口好得多
targetWidthInput.addEventListener('input', (e) => {
    targetWidth = Math.max(1, Math.min(32768, parseInt(e.target.value) || 20));
    e.target.value = targetWidth;
// if (targetWidth > 1000) alert('宽度过大可能卡顿！');
});

targetHeightInput.addEventListener('input', (e) => {
    targetHeight = Math.max(1, Math.min(32768, parseInt(e.target.value) || 20));
    e.target.value = targetHeight;
// if (targetHeight > 1000) alert('高度过大可能卡顿！');
});

// getImageData取RGB值
processBtn.addEventListener('click', async () => {
    const file = imageUpload.files[0];
    if (!file || (targetWidth * targetHeight > 1000000 && !confirm('尺寸过大，继续？'))) return;
    try {
        const img = await new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.src = URL.createObjectURL(file);
        });
        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        canvas.getContext('2d').drawImage(img, 0, 0, targetWidth, targetHeight);
        // 提取像素RGB并转十六进制
        const imageData = canvas.getContext('2d').getImageData(0, 0, targetWidth, targetHeight);
        pixelData = [];
        for (let y = 0; y < targetHeight; y++) {
            const row = [];
            for (let x = 0; x < targetWidth; x++) {
                const i = (y * targetWidth + x) * 4;
                row.push('#' + ((1 << 24) + (imageData.data[i] << 16) + (imageData.data[i+1] << 8) + imageData.data[i+2]).toString(16).slice(1).toUpperCase());
            }
            pixelData.push(row);
        }
        // 预览控制
        if (targetWidth <= 1000 && targetHeight <= 1000) {
            pixelGrid.innerHTML = '';
            pixelGrid.style.gridTemplateColumns = `repeat(${targetWidth}, 10px)`;
            pixelGrid.style.gridTemplateRows = `repeat(${targetHeight}, 10px)`;
            for (let y = 0; y < targetHeight; y++) {
                for (let x = 0; x < targetWidth; x++) {
                    const cell = document.createElement('div');
                    cell.className = 'pixel-cell';
                    cell.style.backgroundColor = pixelData[y][x];
                    pixelGrid.appendChild(cell);
                }
            }
        } else {
            pixelGrid.innerHTML = '<p>超大尺寸，暂不预览</p>';
        }
        exportBtn.disabled = false;
        alert('像素提取完成！');
    } catch (err) {
        console.error(err);
        alert('处理失败！');
    }
});