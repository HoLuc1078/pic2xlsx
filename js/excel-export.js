// 导出Excel
document.getElementById('export-btn').addEventListener('click', async () => {
    if (!pixelData) {
        alert('请先处理图片！');
        return;
    }
    try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('像素颜色表');
        // 设置单元格尺寸，单位：磅
        const cellSize = 2;
        for (let x = 1; x <= targetWidth; x++) worksheet.getColumn(x).width = cellSize * 0.1;
        for (let y = 1; y <= targetHeight; y++) worksheet.getRow(y).height = cellSize;
        // RGB转ARGB设置背景色
        for (let y = 0; y < targetHeight; y++) {
            for (let x = 0; x < targetWidth; x++) {
                const cell = worksheet.getCell(y + 1, x + 1);
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FF' + pixelData[y][x].replace('#', '') }
                };
                cell.value = '';
            }
        }
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, `${Date.now()}.xlsx`);
        // alert('导出成功！');
	// 无意义的提示
    } catch (err) {
        console.error(err);
        alert('我靠居然导出失败了，是不是你的图片太大或者什么原因，反正赶紧联系开发者！');
    }
});