const {
  zokou
} = require("../framework/zokou");
const tagCommands = [{
  'nomCom': "tagallmembers",
  'filter': () => true,
  'title': "TAG ALL MEMBERS"
}, {
  'nomCom': "tagadmins",
  'filter': (_0x12fd26, _0x4cf701) => _0x4cf701.includes(_0x12fd26.id),
  'title': "TAG ADMINS"
}, {
  'nomCom': "tagonline",
  'filter': _0x4a25eb => _0x4a25eb.isOnline,
  'title': "TAG ONLINE"
}, {
  'nomCom': "tagoffline",
  'filter': _0x188d05 => !_0x188d05.isOnline,
  'title': "TAG OFFLINE"
}];
tagCommands.forEach(({
  nomCom: _0x4b759c,
  filter: _0x240349,
  title: _0x4b6950
}) => {
  zokou({
    'nomCom': _0x4b759c,
    'categorie': "Group",
    'reaction': '📯'
  }, async (_0xee4deb, _0x33ee23, _0x560988) => {
    const {
      ms: _0x2a2687,
      repondre: _0x44fb19,
      arg: _0x1c5f79,
      verifGroupe: _0x3ce218,
      nomGroupe: _0x45cd5e,
      infosGroupe: _0x34516e,
      nomAuteurMessage: _0x2049b0,
      verifAdmin: _0xf55605,
      superUser: _0x305095
    } = _0x560988;
    if (!_0x3ce218) {
      return _0x44fb19("⚠️ This command is for groups only.");
    }
    const _0x4dbe00 = _0x1c5f79 && _0x1c5f79.length > 0 ? _0x1c5f79.join(" ") : "No message provided.";
    const _0x1009c3 = _0x34516e.participants || [];
    const _0x5155ce = _0x1009c3.filter(_0x2306a5 => _0x2306a5.admin).map(_0x460f18 => _0x460f18.id);
    const _0x6e1a56 = _0x1009c3.map(_0x173203 => ({
      ..._0x173203,
      'isOnline': true
    }));
    const _0x2d8c0e = _0x6e1a56.filter(_0x2d89ab => _0x240349(_0x2d89ab, _0x5155ce));
    if (!_0xf55605 && !_0x305095) {
      return _0x44fb19("⚠️ Only admins or super users can use this command.");
    }
    if (_0x2d8c0e.length === 0) {
      return _0x44fb19("❌ No members found for this tag category.");
    }
    const _0x40e9d4 = ['💡', '☢️', "🗡️", "🖌️", '🪫', '🔋', '⚙️', "🕶️", "🌡️", '✏️', '📌', '©️', '$', '®️', '™️', '⚔️', '🔏'];
    const _0x7bcb2 = _0x40e9d4[Math.floor(Math.random() * _0x40e9d4.length)];
    let _0x181fc7 = "┈┈┈┈┈┈┈┈┈┈┈┈\n  \n        " + _0x4b6950 + "\n┈┈┈┈┈┈┈┈┈┈┈┈\n👥 Group: " + _0x45cd5e + "\n👤 By: *" + _0x2049b0 + "*\n📝 Message: *" + _0x4dbe00 + "*\n┈┈┈┈┈┈┈┈┈┈┈┈\n\n";
    for (const _0x362f94 of _0x2d8c0e) {
      _0x181fc7 += _0x7bcb2 + " @" + _0x362f94.id.split('@')[0] + "\n";
    }
    _0x33ee23.sendMessage(_0xee4deb, {
      'text': _0x181fc7,
      'mentions': _0x2d8c0e.map(_0x4b8a89 => _0x4b8a89.id)
    }, {
      'quoted': _0x2a2687
    });
  });
});
