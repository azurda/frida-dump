function storeArrayBuffer(filename:string, buffer:ArrayBuffer) {
    let destFileName:File = new File(filename, "wb");
    destFileName.write(buffer);
    destFileName.flush();
    destFileName.close();
}

rpc.exports = {
    dumpProcessMemory: function (protection) {
        let ranges:RangeDetails[] = Process.enumerateRanges(protection);
        let totalRanges: number = ranges.length;
        let failedDumps:number = 0;
        console.log('[BEGIN] Located ' + totalRanges + ' memory ranges matching [' + protection + ']');
        ranges.forEach(function (range) {
            let destFileName = `dumps/${range.base}_dump`;
            let arrayBuf:ArrayBuffer|null;
            try {
                arrayBuf = range.base.readByteArray(range.size);
            } catch (e) {
                failedDumps += 1;
                return;
            }

            if (arrayBuf) {
                storeArrayBuffer(destFileName, arrayBuf);
            }
        });
        let sucessfulDumps:number = totalRanges - failedDumps;
        console.log(`[FINISH] Succesfully dumped ${sucessfulDumps}/${totalRanges} ranges.`);
    },
};