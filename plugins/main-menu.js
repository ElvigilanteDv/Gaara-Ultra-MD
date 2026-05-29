// créditos y creador de código Isagi Y Modificado Por Isagi
import { xpRange } from '../lib/levelling.js'
import ws from 'ws'
import { generateWAMessageFromContent, prepareWAMessageMedia } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

const botname = global.botname || '🌪️ Isagi-bot-MD 🌪️'
const creador = 'https://xzys-ultra.vercel.app'
const versionBot = '2.4.1' // cámbiala si tienes otra

// Categorías
let tags = {
  'serbot': '🤖 𝗦𝗨𝗕-𝗕𝗢𝗧𝗦',
  'info': '🌀 𝗜𝗡𝗙𝗢𝗦',
  'main': '📜 𝗠𝗘𝗡𝗨',
  'nable': '⚡ 𝗠𝗢𝗗𝗢 𝗔𝗩𝗔𝗡𝗭𝗔𝗗𝗢',
  'cmd': '📝 𝗖𝗢𝗠𝗔𝗡𝗗𝗢𝗦',
  'advanced': '🌟 𝗙𝗨𝗡𝗖𝗜𝗢𝗡𝗘𝗦 𝗔𝗩𝗔𝗡𝗭𝗔𝗗𝗔𝗦',
  'game': '🎮 𝗝𝗨𝗘𝗚𝗢𝗦',
  'rpg': '⚔️ 𝗥𝗣𝗚',
  'group': '📚 𝗚𝗥𝗨𝗣𝗢𝗦',
  'downloader': '📥 𝗗𝗘𝗦𝗖𝗔𝗥𝗚𝗔𝗦',
  'sticker': '🖼️ 𝗦𝗧𝗜𝗖𝗞𝗘𝗥',
  'audio': '🔊 𝗔𝗨𝗗𝗜𝗢',
  'search': '🔎 𝗕𝗨𝗦𝗤𝗨𝗘𝗗𝗔',
  'tools': '🧰 𝗛𝗘𝗥𝗔𝗠𝗜𝗘𝗡𝗧𝗔𝗦',
  'fun': '🎉 𝗗𝗜𝗩𝗘𝗥𝗦𝗜𝗢𝗡',
  'anime': '🧧 𝗔𝗡𝗜𝗠𝗘',
  'nsfw': '🔞 𝗡𝗦𝗙𝗪',
  'premium': '💎 𝗣𝗥𝗘𝗠𝗜𝗨𝗠',
  'weather': '🛰️ 𝗖𝗟𝗜𝗠𝗔',
  'news': '📄 𝗡𝗢𝗧𝗜𝗖𝗜𝗔𝗦',
  'finance': '🏛️ 𝗙𝗜𝗡𝗔𝗡𝗭𝗔',
  'education': '🔰 𝗘𝗗𝗨𝗖𝗔𝗖𝗜𝗢𝗡',
  'health': '❤️ 𝗦𝗔𝗟𝗨𝗗',
  'entertainment': '📲 𝗘𝗡𝗧𝗥𝗘𝗧𝗘𝗡𝗜𝗠𝗜𝗘𝗡𝗧𝗢',
  'sports': '⚽ 𝗗𝗘𝗣𝗢𝗥𝗧𝗘𝗦',
  'travel': '✈️ 𝗩𝗜𝗔𝗝𝗘𝗦',
  'food': '🥡 𝗖𝗢𝗠𝗜𝗗𝗔',
  'shopping': '🛍️ 𝗖𝗢𝗠𝗣𝗥𝗔',
  'productivity': '🔖 𝗣𝗥𝗢𝗗𝗨𝗖𝗧𝗜𝗩𝗜𝗗𝗔𝗗',
  'social': '📸 𝗥𝗘𝗗𝗘𝗦 𝗦𝗢𝗖𝗜𝗔𝗟𝗘𝗦',
  'security': '🔱 𝗦𝗘𝗚𝗨𝗥𝗜𝗗𝗔𝗗',
  'custom': '⚙️ 𝗣𝗘𝗥𝗦𝗢𝗡𝗔𝗟𝗜𝗭𝗔𝗗𝗢'
}

let handler = async (m, { conn, usedPrefix: _p }) => {
  try {
    let userId = m.mentionedJid?.[0] || m.sender
    let user = global.db.data.users[userId] || { exp: 0, level: 1, premium: false }

    let { level } = user

    // Inicializar base de datos si no existe
    if (!global.db.data.users) global.db.data.users = {}

    // Contar usuarios reales (exp > 0)
    let totalUsers = Object.values(global.db.data.users).filter(u => u.exp > 0).length

    // Contar usuarios premium (premium === true)
    let totalPremium = Object.values(global.db.data.users).filter(u => u.premium).length

    let { min, xp, max } = xpRange(level, global.multiplier || 1)

    // Plugins activos
    let help = Object.values(global.plugins).filter(plugin => !plugin.disabled).map(plugin => ({
      help: Array.isArray(plugin.help) ? plugin.help : (plugin.help ? [plugin.help] : []),
      tags: Array.isArray(plugin.tags) ? plugin.tags : (plugin.tags ? [plugin.tags] : []),
      limit: plugin.limit,
      premium: plugin.premium,
    }))

    // Saludo + hora exacta
    let saludo = getSaludo()

    // Uptime real
    let uptime = clockString(process.uptime() * 1000)

    // Modo (Privado / Público)
    let modo = global.opts?.self ? "🔒 Privado" : "🚀 Público"

    // Bloque inicial
    let menuText = `
╭━━━〔 ⚡️ *Isagi-Bot-MENU* ⚡️ 〕━━━⬣
┃ ❒ *Nombre*: *${botname}*
┃ ❒ *Creador*: *${creador}*
┃ ❒ *Estado*: *${modo}*
┃ ❒ *Saludo*: *${saludo}*
┃ ❒ *Uptime*: *${uptime}*
┃ ❒ *Premium*: *${totalPremium}*
┃ ❒ *Versión*: *${versionBot}*
╰━━━━━━━━━━━━━━━━━━━━━━⬣
`

    // Recorremos categorías (sin huecos)
    for (let tag in tags) {
      let comandos = help.filter(menu => menu.tags.includes(tag))
      if (!comandos.length) continue

      menuText += `
╭━━━〔 ${tags[tag]} 〕━━━⬣
${comandos.map(menu => menu.help.map(help =>
  `┃ ⚡︎ ${_p}${help}${menu.limit ? ' 🟡' : ''}${menu.premium ? ' 🔒' : ''}`
).join('\n')).join('\n')}
╰━━━━━━━━━━━━━━━━━━━━━━⬣
`
    }

    menuText += `
> 👑 Powered by GP 🥷🏽
`

    await m.react('⚡️')

    let vidBuffer = await (await fetch('https://files.catbox.moe/s5aivx.mp4')).buffer() // cambia la URL por tu video corto
    let media = await prepareWAMessageMedia(
      { video: vidBuffer, gifPlayback: true },
      { upload: conn.waUploadToServer }
    )

    let msg = generateWAMessageFromContent(m.chat, {
      viewOnceMessage: {
        message: {
          videoMessage: {
            ...media.videoMessage,
            gifPlayback: true,
            caption: menuText,
            contextInfo: {
              isForwarded: true,
              forwardedNewsletterMessageInfo: {
                newsletterJid: '120363144038483540@newsletter',
                newsletterName: 'Isagui-Bot-MD ⚡',
                serverMessageId: 100
              }
            }
          }
        }
      }
    }, { userJid: m.sender, quoted: { key: {  fromMe: false, participant: `0@s.whatsapp.net`, ...(false ? { remoteJid: "5219992095479-1625305606@g.us" } : {}) }, message: { orderMessage: { itemCount : -999999, status: 1, surface : 1, message: global.packname, orderTitle: 'Bang', thumbnail: null, sellerJid: '0@s.whatsapp.net'}}} })

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })

  } catch (e) {
    conn.reply(m.chat, `✖️ Error al mostrar el menú Gaara-Ultra.\n\n${e}`, m)
    console.error(e)
  }
}

handler.help = ['menu','m']
handler.tags = ['main']
handler.command = ['menu', 'allmenu', 'menú','m']
handler.register = true

export default handler

// Extra
function clockString(ms) {
  let h = Math.floor(ms / 3600000)
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}

// Saludo dinámico con hora real de Saint Martin (UTC-4)
function getSaludo() {
  let options = { timeZone: "America/Marigot", hour: "numeric", minute: "numeric", second: "numeric", hour12: false }
  let horaStr = new Date().toLocaleString("es-DO", options)
  let [hora] = horaStr.split(":").map(n => parseInt(n))

  let saludo
  if (hora >= 5 && hora < 12) saludo = "🌅 Buenos días"
  else if (hora >= 12 && hora < 18) saludo = "☀️ Buenas tardes"
  else saludo = "🌙 Buenas noches"

  return `${saludo} | 🕒 ${horaStr}`
}
