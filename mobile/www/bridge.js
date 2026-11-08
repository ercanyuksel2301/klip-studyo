/* Android köprüsü: uygulamanın "kaydet" adımını telefona uyarlar */
(function () {
  var C = window.Capacitor;
  if (!C || !C.isNativePlatform || !C.isNativePlatform()) return;
  var P = C.Plugins || {};
  function b64(blob) {
    return new Promise(function (res, rej) {
      var r = new FileReader();
      r.onload = function () { res(String(r.result).split(',')[1] || ''); };
      r.onerror = function () { rej(r.error); };
      r.readAsDataURL(blob);
    });
  }
  async function writeAll(FS, blob, path, directory) {
    var CH = 3 * 1024 * 1024; // 3 baytın katı: base64 parçaları sorunsuz birleşir
    for (var o = 0; o < blob.size; o += CH) {
      var part = await b64(blob.slice(o, o + CH));
      if (o === 0) await FS.writeFile({ path: path, data: part, directory: directory, recursive: true });
      else await FS.appendFile({ path: path, data: part, directory: directory });
    }
  }
  async function save(opts) {
    var filename = opts.filename, data = opts.data;
    var FS = P.Filesystem, SH = P.Share;
    if (!FS) throw new Error('Dosya eklentisi bulunamadı');
    // 1) Doğrudan Belgeler/KlipStudyo klasörüne kaydetmeyi dene
    try {
      var dp = 'KlipStudyo/' + filename;
      await writeAll(FS, data, dp, 'DOCUMENTS');
      setTimeout(function () { try { toast('Kaydedildi: Belgeler/KlipStudyo'); } catch (e) {} }, 60);
      return;
    } catch (e) { /* izin yok: paylaşım menüsüne geç */ }
    // 2) Olmazsa geçici dosya yazıp paylaşım menüsünü aç
    if (!SH) throw new Error('Paylaşım eklentisi bulunamadı');
    var path = 'export/' + filename;
    try { await FS.deleteFile({ path: path, directory: 'CACHE' }); } catch (e) {}
    await writeAll(FS, data, path, 'CACHE');
    var u = await FS.getUri({ path: path, directory: 'CACHE' });
    try {
      await SH.share({ title: filename, dialogTitle: 'Videoyu kaydet / paylaş', url: u.uri });
    } catch (e) {
      if (/cancel/i.test(String(e && e.message))) throw { code: 'declined' };
      throw e;
    }
  }
  window.claude = { use: async function (n) { return n === 'downloads' ? { save: save } : null; } };
})();
