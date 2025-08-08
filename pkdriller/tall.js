const {
  zokou
} = require("../framework/zokou");
const traduire = require("../framework/traduction");
const axios = require("axios");
zokou({
  'nomCom': "bot",
  'reaction': '📡',
  'categorie': 'IA'
}, async (_0x4cc0a5, _0x326233, _0x3f0bda) => {
  const {
    repondre: _0x410093,
    ms: _0x100a63,
    arg: _0x4fda94
  } = _0x3f0bda;
  if (!_0x4fda94 || !_0x4fda94[0x0]) {
    return _0x410093("yes my brother how are you I'm listening to you today.");
  }
  try {
    const _0x48658a = await traduire(_0x4fda94.join(" "), {
      'to': 'en'
    });
    console.log(_0x48658a);
    fetch("http://api.brainshop.ai/get?bid=177607&key=NwzhALqeO1kubFVD&uid=[uid]&msg=" + _0x48658a).then(_0xeaa5e3 => _0xeaa5e3.json()).then(_0x5e55b1 => {
      const _0x2800b4 = _0x5e55b1.cnt;
      console.log(_0x2800b4);
      traduire(_0x2800b4, {
        'to': 'fr'
      }).then(_0x2e8175 => {
        _0x410093(_0x2e8175);
      })['catch'](_0x5f0c6a => {
        console.error("Erreur lors de la traduction en français :", _0x5f0c6a);
        _0x410093("Erreur lors de la traduction en français");
      });
    })['catch'](_0x40b425 => {
      console.error("Erreur lors de la requête à BrainShop :", _0x40b425);
      _0x410093("Erreur lors de la requête à BrainShop");
    });
  } catch (_0x2ecb21) {
    _0x410093("oupsaa une erreur : " + _0x2ecb21);
  }
});
zokou({
  'nomCom': "dalle",
  'reaction': '💎',
  'categorie': 'IA'
}, async (_0x2f7ac3, _0x5688f8, _0x1ef8a5) => {
  const {
    repondre: _0xb444aa,
    arg: _0xfd7e6,
    ms: _0x31c8ae
  } = _0x1ef8a5;
  try {
    if (!_0xfd7e6 || _0xfd7e6.length === 0x0) {
      return _0xb444aa("Veuillez entrer les informations nécessaires pour générer l'image.");
    }
    const _0x4250f2 = _0xfd7e6.join(" ");
    const _0x26eba0 = await axios.get("https://api.maher-zubair.tech/ai/photoleap?q=" + _0x4250f2);
    const _0x2c3d3f = _0x26eba0.data;
    if (_0x2c3d3f.status && _0x2c3d3f.result) {
      const _0x42ff30 = _0x2c3d3f.result;
      _0x5688f8.sendMessage(_0x2f7ac3, {
        'image': {
          'url': _0x42ff30
        },
        'caption': "*Propulsé parX20RAHMANI_MD*"
      }, {
        'quoted': _0x31c8ae
      });
    } else {
      _0xb444aa("Erreur lors de la génération de l'image");
    }
  } catch (_0x19e24b) {
    console.error('Erreur:', _0x19e24b.message || "Une erreur s'est produite");
    _0xb444aa("Oups, une erreur est survenue lors du traitement de votre demande.");
  }
});
zokou({
  'nomCom': "gpt",
  'reaction': '🌐',
  'categorie': 'IA'
}, async (_0xa240d3, _0x430ce8, _0x4d4fa7) => {
  const {
    repondre: _0x1a7fd0,
    arg: _0x1e66ad,
    ms: _0xf937dc
  } = _0x4d4fa7;
  try {
    if (!_0x1e66ad || _0x1e66ad.length === 0x0) {
      return _0x1a7fd0("Veuillez poser une questions.");
    }
    const _0x2fcbc4 = _0x1e66ad.join(" ");
    const _0x5e0fc1 = await axios.get("https://api.maher-zubair.tech/ai/chatgpt4?q=" + _0x2fcbc4);
    const _0x436625 = _0x5e0fc1.data;
    if (_0x436625) {
      _0x1a7fd0(_0x436625.result);
    } else {
      _0x1a7fd0("Erreur lors de la génération de la reponse");
    }
  } catch (_0x4635c4) {
    console.error("Erreur:", _0x4635c4.message || "Une erreur s'est produite");
    _0x1a7fd0("Oups, une erreur est survenue lors du traitement de votre demande.");
  }
});
zokou({
  'nomCom': 'chart',
  'reaction': '🐤',
  'categorie': 'IA'
}, async (_0x29cf57, _0x3f7834, _0x2a6688) => {
  const {
    repondre: _0x5560cd,
    ms: _0x423f74,
    arg: _0x4d0898
  } = _0x2a6688;
  if (!_0x4d0898 || !_0x4d0898[0x0]) {
    return _0x5560cd("yes my brother how are you I'm listening to you today.");
  }
  try {
    const _0x16bc6a = await traduire(_0x4d0898.join(" "), {
      'to': 'en'
    });
    console.log(_0x16bc6a);
    fetch("http://api.brainshop.ai/get?bid=177607&key=NwzhALqeO1kubFVD&uid=[uid]&msg=" + _0x16bc6a).then(_0x35788f => _0x35788f.json()).then(_0x1e4e4f => {
      const _0x1d26d8 = _0x1e4e4f.cnt;
      console.log(_0x1d26d8);
      traduire(_0x1d26d8, {
        'to': 'en'
      }).then(_0x41c229 => {
        _0x5560cd(_0x41c229);
      })['catch'](_0x5abd5d => {
        console.error("Erreur lors de la traduction en français :", _0x5abd5d);
        _0x5560cd("Erreur lors de la traduction en français");
      });
    })["catch"](_0x32d6f5 => {
      console.error("Erreur lors de la requête à BrainShop :", _0x32d6f5);
      _0x5560cd("Erreur lors de la requête à BrainShop");
    });
  } catch (_0x2b5ea6) {
    _0x5560cd("oupsaa une erreur : " + _0x2b5ea6);
  }
});
zokou({
  'nomCom': "calcul",
  'reaction': '😂',
  'categorie': 'IA'
}, async (_0x3a6b01, _0x3b0f62, _0x272acf) => {
  const {
    repondre: _0x3f9176,
    arg: _0x242a68,
    ms: _0x34512f
  } = _0x272acf;
  if (!_0x242a68 || _0x242a68.length === 0x0) {
    return _0x3f9176("Please insert maths calculations like 1000*2.");
  }
  const _0x9ecab9 = await fetch("https://api.maher-zubair.tech/ai/mathssolve?q=" + cal);
  const _0x1da7b7 = await _0x9ecab9.json();
  await _0x3f9176(_0x1da7b7.result);
  console.log(_0x1da7b7.completion);
});