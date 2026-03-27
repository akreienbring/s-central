import { r as o, j as e } from "./react-D5PRlRBS.js";
import { i as Nt } from "./i18next-CvEbW1Rb.js";
import { i as ds, u as z } from "./react-i18next-BBhYYy4w.js";
import { R as us } from "./react-dom-GwDk5dX4.js";
import {
  u as Ue,
  a as ze,
  L as ps,
  b as hs,
  O as xs,
  N as pt,
  B as gs,
} from "./react-router-IxcrMGK8.js";
import { H as ms, a as he } from "./react-helmet-async-CS66t3E1.js";
import {
  u as Me,
  a as Oe,
  B as N,
  S as O,
  T as C,
  s as He,
  b as B,
  A as _e,
  c as Q,
  D as ue,
  L as Tt,
  C as et,
  F as $e,
  d as X,
  I as Be,
  e as U,
  f as je,
  g as le,
  M as q,
  h as qe,
  i as oe,
  P as ye,
  j as Ee,
  k as Ce,
  l as fs,
  m as ee,
  n as ht,
  o as xt,
  p as bs,
  q as _s,
  r as tt,
  t as js,
  v as ys,
  w as vs,
  x as ws,
  y as Ss,
  z as Cs,
  E as ks,
  G as Ps,
  H as $s,
  J as Fs,
  K as Ds,
  N as Is,
  O as Os,
  Q as Es,
  R as Rs,
  U as As,
  V as Ns,
  W as Ts,
  X as Ws,
  Y as Bs,
  Z as Ls,
  _ as Us,
  $ as xe,
  a0 as st,
  a1 as zs,
  a2 as ve,
  a3 as se,
  a4 as Ms,
  a5 as ge,
  a6 as H,
  a7 as Wt,
  a8 as Bt,
  a9 as Lt,
  aa as Hs,
  ab as Ut,
  ac as zt,
  ad as Mt,
  ae as Ht,
  af as qs,
  ag as Gs,
  ah as gt,
  ai as Re,
  aj as Vs,
  ak as Js,
  al as Ks,
  am as Ys,
  an as Zs,
  ao as Xs,
  ap as Qs,
  aq as mt,
  ar as en,
  as as Se,
} from "./@mui-CLLudrsH.js";
import { n as tn } from "./numeral-U-QONPil.js";
import { h as nt } from "./react-apexcharts-DhGqeCGb.js";
import { T as sn, a as nn } from "./mui-tiptap-editor-CuoQbOVA.js";
import "./@emotion-D9MBL6Uu.js";
import { i as pe, d as rn, _ as ft } from "./lodash-B9YLDK5x.js";
import { C as on } from "./react-material-ui-carousel-C2qMVQfc.js";
import { I as an } from "./@iconify-CJeX-ZRr.js";
import { S as ln } from "./mui-color-input-BYOC_RjI.js";
import {
  f as it,
  a as cn,
  e as bt,
  b as dn,
  d as un,
  i as pn,
  c as hn,
  g as xn,
} from "./date-fns-B88SwEGX.js";
import { w as gn } from "./websocket-CTkLia8j.js";
import { c as mn } from "./sha256-uint8array-Byzi5pvz.js";
import { S as fn } from "./simplebar-react-imY7VD5D.js";
import "./index-DmZ4WJzI.js";
import "./use-sync-external-store-DOHO3YGb.js";
import "./scheduler-7OC5HNn7.js";
import "./react-fast-compare-DTmHUB5Z.js";
import "./invariant-7fkv2pge.js";
import "./shallowequal-BPus9M1V.js";
import "./clsx-B-dksMZM.js";
import "./@popperjs-B_2vCoY7.js";
import "./@babel-DlT2rxzE.js";
import "./react-is-Rj29YxKv.js";
import "./apexcharts-Bw6UNgWf.js";
import "./prop-types-CznpoFu7.js";
import "./@tiptap-DpZr3dzN.js";
import "./prosemirror-state-BLwXW4Ka.js";
import "./prosemirror-model-CRZLy2j9.js";
import "./orderedmap-C4TimWWB.js";
import "./prosemirror-transform-C09io-ca.js";
import "./tippy.js-T2NbCdtq.js";
import "./linkifyjs-DVrXeg1a.js";
import "./prosemirror-view-pwFtEW9y.js";
import "./prosemirror-tables-BSgStsi8.js";
import "./prosemirror-keymap-CKVplV9_.js";
import "./w3c-keyname-DEtA-KhA.js";
import "./prosemirror-dropcursor-3jZb0A5n.js";
import "./prosemirror-gapcursor-BZOWUZCz.js";
import "./prosemirror-history-DpoOkdY4.js";
import "./rope-sequence-nfUW61tr.js";
import "./prosemirror-commands-CQrOMeus.js";
import "./prosemirror-schema-list-cRCmABXK.js";
import "./lowlight-DNXHKgyN.js";
import "./highlight.js-DoH8FEla.js";
import "./hoist-non-react-statics-BTNdDy0I.js";
import "./stylis-BqmD5Vow.js";
import "./tslib-BDK5Lrfq.js";
import "./hey-listen-DMFX4YFs.js";
import "./style-value-types-z-ZkxmhX.js";
import "./popmotion-DM-ugk6M.js";
import "./framesync-BEUTIEb0.js";
import "./es5-ext-CknBaJLz.js";
import "./simplebar-core-Bgcd6PBI.js";
import "./lodash-es-BFDc8I3u.js";
(function () {
  const n = document.createElement("link").relList;
  if (n && n.supports && n.supports("modulepreload")) return;
  for (const r of document.querySelectorAll('link[rel="modulepreload"]')) i(r);
  new MutationObserver((r) => {
    for (const c of r)
      if (c.type === "childList")
        for (const a of c.addedNodes)
          a.tagName === "LINK" && a.rel === "modulepreload" && i(a);
  }).observe(document, { childList: !0, subtree: !0 });
  function s(r) {
    const c = {};
    return (
      r.integrity && (c.integrity = r.integrity),
      r.referrerPolicy && (c.referrerPolicy = r.referrerPolicy),
      r.crossOrigin === "use-credentials"
        ? (c.credentials = "include")
        : r.crossOrigin === "anonymous"
          ? (c.credentials = "omit")
          : (c.credentials = "same-origin"),
      c
    );
  }
  function i(r) {
    if (r.ep) return;
    r.ep = !0;
    const c = s(r);
    fetch(r.href, c);
  }
})();
var To =
  typeof globalThis < "u"
    ? globalThis
    : typeof window < "u"
      ? window
      : typeof global < "u"
        ? global
        : typeof self < "u"
          ? self
          : {};
function Wo(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default")
    ? t.default
    : t;
}
function Bo(t) {
  if (Object.prototype.hasOwnProperty.call(t, "__esModule")) return t;
  var n = t.default;
  if (typeof n == "function") {
    var s = function i() {
      var r = !1;
      try {
        r = this instanceof i;
      } catch {}
      return r
        ? Reflect.construct(n, arguments, this.constructor)
        : n.apply(this, arguments);
    };
    s.prototype = n.prototype;
  } else s = {};
  return (
    Object.defineProperty(s, "__esModule", { value: !0 }),
    Object.keys(t).forEach(function (i) {
      var r = Object.getOwnPropertyDescriptor(t, i);
      Object.defineProperty(
        s,
        i,
        r.get
          ? r
          : {
              enumerable: !0,
              get: function () {
                return t[i];
              },
            },
      );
    }),
    s
  );
}
const bn = {
    English: "English",
    Spanish: "Spanish",
    German: "German",
    _consumption_: "Current Consumption",
    _perShelly_: "per Shelly",
    Running: "Running",
    Connected: "Connected",
    _welcome_: "Welcome back 👋",
    Filters: "Filters",
    _sortby_: "Sort by",
    Submit: "Submit",
    Clear: "Clear",
    Alias: "Alias",
    Model: "Model",
    Generation: "Generation",
    _byminute_: "By Minute",
    _byhour_: "By Hour",
    _byday_: "By Day",
    _bymonth_: "By Month",
    _byyear_: "By Year",
    _notconnected_: "Disconnected!",
    _getinvolved_: "Get involved!",
    _gotogithub_: "Go to Github",
    _opensource_: "Open Source AGPL License",
    Home: "Home",
    Profile: "Profile",
    Security: "Security",
    Settings: "Settings",
    Logout: "Logout",
    _forgotpw_: "Forgot Password?",
    _wrongpw_: "Wrong Password!",
    _usernotexists_: "EMail not found!",
    _resetpw_: "Password was reset.",
    _notresetpw_: "Password was not reset.",
    Password: "Password",
    Email: "Email",
    Firstname: "Firstname",
    Lastname: "Lastname",
    Role: "Role",
    _newuser_: "New User",
    _editprofile_: "Your Profile",
    _edituserprofile_: "Edit User",
    _editsecurity_: "Your Access",
    _editsettings: "Your Settings",
    _searchuser_: "Search User",
    Users: "Users",
    _rowsperpage_: "Rows per page:",
    of: "of",
    _morethan_: "more than",
    Login: "Login",
    Save: "Save",
    _userupdated_: "User was updated",
    _usernotupdated_: "Could not update user",
    _usercreated_: "User was created",
    _usernotcreated_: "Could not create user",
    _blogpostcreated_: "Post was saved",
    _blogpostnotcreated_: "Could not save post",
    _blogpostupdated_: "Post was updated",
    _blogpostnotupdated_: "Could not update post",
    Delete: "Delete",
    Edit: "Edit",
    _reallydelete_: "Really Delete?",
    _userdeleted_: "User deleted",
    _usernotdeleted: "Couldn't delete user",
    _emailexists_: "Email already exists",
    _aliasexists_: "Alias already exists",
    Read: "Read",
    Unread: "Unread",
    Notifications: "Notifications",
    _unreadmessages_: "You have {{totalUnRead}} new messages",
    _markallasread_: "Mark all as read",
    Brightness: "Brightness",
    White: "White",
    Control: "Controls",
    _newpost_: "New Post",
    Title: "Title",
    Content: "Content",
    _editpost_: "Edit Post",
    "_editor-preview_": "Preview",
    "_editor-bold_": "Bold",
    "_editor-italic_": "Italic",
    "_editor-strike_": "Strikethrough",
    "_editor-underline_": "Underline",
    "_editor-link_": "Link",
    "_editor-bulletlist_": "Bullet List",
    "_editor-orderedlist_": "Ordered List",
    "_editor-alignleft_": "Align left",
    "_editor-aligncenter_": "Align Center",
    "_editor-alignright_": "Align Right",
    "_editor-alignjustify_": "Align Justify",
    "_editor-blockquote_": "Blockquote",
    "_editor-codeblock_": "Codeblock",
    "_editor-undo_": "Undo",
    "_editor-redo_": "Redo",
    "_editor-normaltext_": "Normal",
    "_editor-h1_": "Heading1",
    "_editor-h2_": "Heading2",
    "_editor-h3_": "Heading3",
    "_editor-h4_": "Heading4",
    "_editor-h5_": "Heading5",
    "_editor-h6_": "Heading6",
    "_editor-insertlink_": "Insert Link",
    "_editor-invalidlink_": "Invalid Link",
    "_editor-color_": "Text Color",
    "_editor-placeholder_": "Write your post",
    _notfound_: "Not found",
    _noresultsfor_: "No results found for",
    selected: "selected",
    _assigndevices_: "Shelly assingment",
    _devicesupdated_: "Assignment saved",
    _devicesnotupdated: "Error saving Assignment",
    _firmwarestable_: "Update to stable Version",
    _firmwarebeta_: "Update to Beta Version",
    Reboot: "Reboot",
    Name: "Name",
    Uptime: "Uptime",
    _required_: "requiered",
    _notrequired_: "not required",
    _wifiupdated_:
      "Successfully updated WiFi settings ({{successful}} of {{total}})",
    _wifinotupdated_: "Could not update all ({{successful}} of {{total}})",
    _wifiwarming_: "Warning: Changing WiFi settings can disconnect the device!",
    _acceptrisk_: "I accept the risk",
    _updateavailable_:
      "Only {{checked}} of {{selected}} need an {{type}} update",
    _noupdateavailable_:
      "No {{type}} updates available for the selected devices",
    _copysettings_: "Copy this settings",
    _copyreset_: "Cancel copy",
    _pastesettingsfrom_: "Paste settings from {{deviceName}}",
    _showall_: "Show all",
    showmin: "Minimize",
  },
  _n = { translation: bn },
  jn = {
    English: "Englisch",
    Spanish: "Spanisch",
    German: "Deutsch",
    _consumption_: "Aktueller Verbrauch",
    _perShelly_: "per Shelly",
    Running: "Laufen",
    Connected: "Verbunden",
    _welcome_: "Willkommen zurück 👋",
    Filters: "Filter",
    _sortby_: "Sortierung",
    Submit: "Anwenden",
    Clear: "Löschen",
    Alias: "Alias",
    Model: "Model",
    Generation: "Generation",
    _byminute_: "Per Minute",
    _byhour_: "Per Stunde",
    _byday_: "Per Tag",
    _bymonth_: "Per Monat",
    _byyear_: "Per Jahr",
    _notconnected_: "Getrennt!",
    _getinvolved_: "Helf mit!",
    _gotogithub_: "Besuch das Github Projekt",
    _opensource_: "Open Source AGPL Lizenz",
    Home: "Home",
    Profile: "Profil",
    Security: "Sicherheit",
    Settings: "Einstellungen",
    Logout: "Logout",
    _forgotpw_: "Passwort vergessen?",
    _wrongpw_: "Falsches Passwort!",
    _usernotexists_: "Email nicht gefunden!",
    _resetpw_: "Passwort wurde zurück gesetzt.",
    _notresetpw_: "Passwort wurde nicht zurück gesetzt.",
    Password: "Passwort",
    Email: "Email",
    Firstname: "Vorname",
    Lastname: "Nachname",
    Role: "Rolle",
    _newuser_: "Neuer Benutzer",
    _editprofile_: "Dein Profil",
    _edituserprofile_: "Benutzer bearbeiten",
    _editsecurity_: "Deine Zugangsdaten",
    _editsettings: "Deine Einstellungen",
    _searchuser_: "Benutzer suchen",
    Users: "Benutzer",
    _rowsperpage_: "Zeilen per Seite:",
    of: "von",
    _morethan_: "mehr als",
    Login: "Anmelden",
    Save: "Speichern",
    _userupdated_: "User aktualisiert",
    _usernotupdated_: "Fehler bei der Aktualisierung ",
    _usercreated_: "Benutzer wurde angelegt",
    _usernotcreated_: "Benutzer konnte nicht angelegt werden",
    _blogpostcreated_: "Post wurde gespeichert",
    _blogpostnotcreated_: "Post konnte nicht gespeichert werden",
    _blogpostupdated_: "Post wurde aktualisiert",
    _blogpostnotupdated_: "Fehler bei der Aktualisierung",
    Delete: "Löschen",
    Edit: "Bearbeiten",
    _reallydelete_: "Wirklich Löschen?",
    _userdeleted_: "Benutzer wurde gelöscht",
    _usernotdeleted: "Benutzer konnte nicht gelöscht werden",
    _emailexists_: "Email existiert bereits",
    _aliasexists_: "Alias existiert bereits",
    Read: "Gelesen",
    Unread: "Ungelesen",
    Notifications: "Nachrichten",
    _unreadmessages_: "Du hast {{totalUnRead}} neue Meldungen",
    _markallasread_: "Alle als gelesen markieren",
    Brightness: "Helligkeit",
    White: "Weiß",
    Control: "Einstellung",
    _newpost_: "Neuer Post",
    Title: "Titel",
    Content: "Inhalt",
    _editpost_: "Post bearbeiten",
    "_editor-preview_": "Vorschau",
    "_editor-bold_": "Fett",
    "_editor-italic_": "Kursiv",
    "_editor-strike_": "Durchgestrichen",
    "_editor-underline_": "Unterstrichen",
    "_editor-link_": "Link",
    "_editor-bulletlist_": "Aufzählung",
    "_editor-orderedlist_": "Numerierung",
    "_editor-alignleft_": "Links Ausrichten",
    "_editor-aligncenter_": "Mittig Ausrichten",
    "_editor-alignright_": "Rechts Ausrichten",
    "_editor-alignjustify_": "Gleichmäig Ausrichten",
    "_editor-blockquote_": "Zitat",
    "_editor-codeblock_": "Codeblock",
    "_editor-undo_": "Zurück",
    "_editor-redo_": "Wiederherstellen",
    "_editor-normaltext_": "Normal",
    "_editor-h1_": "Überschrift1",
    "_editor-h2_": "Überschrift2",
    "_editor-h3_": "Überschrift3",
    "_editor-h4_": "Überschrift4",
    "_editor-h5_": "Überschrift5",
    "_editor-h6_": "Überschrift6",
    "_editor-insertlink_": "Link Einfügen",
    "_editor-invalidlink_": "Ungültiger Link",
    "_editor-color_": "Textfarbe",
    "_editor-placeholder_": "Schreib deinen Post",
    _notfound_: "Nicht gefunden",
    _noresultsfor_: "Keine Resultate gefunden für",
    selected: "ausgewählt",
    _assigndevices_: "Shelly zuordnen",
    _devicesupdated_: "Zuordnung gespeichert",
    _devicesnotupdated: "Fehler bei der Zuordnung",
    _firmwarestable_: "Aktualisiere auf stablile Version",
    _firmwarebeta_: "Aktualisiere auf Beta Version",
    Reboot: "Neustart",
    Name: "Name",
    Uptime: "Laufzeit",
    _required_: "notwendig",
    _notrequired_: "nicht notwendig",
    _wifiupdated_:
      "WiFi settings erfolgreich aktualisiert ({{successful}} von {{total}})",
    _wifinotupdated_: "Nicht alle aktualisiert ({{successful}} von {{total}})",
    _wifiwarming_:
      "Achtung: Das Ändern der WiFi Einstellungen kann das Gerät trennen!",
    _acceptrisk_: "Ich akzeptiere das Risiko",
    _updateavailable_:
      "Nur {{checked}} von {{selected}} werden auf {{type}} aktualisiert.",
    _noupdateavailable_:
      "Keine {{type}} Updates für die ausgewählten Geräte verfügbar",
    _copysettings_: "Diese Einstellungen kopieren",
    _copyreset_: "Kopieren abbrechen",
    _pastesettingsfrom_: "Einstellungen von {{deviceName}} verwenden",
    _showall_: "Alles anzeigen",
    showmin: "Minimieren",
  },
  yn = { translation: jn },
  vn = {
    English: "Inglés",
    Spanish: "Español",
    German: "Alemán",
    _consumption_: "Consumo Actual",
    _perShelly_: "por Shelly",
    Running: "Corriendo",
    Connected: "Connectado",
    _welcome_: "Bienvenido de nuevo 👋",
    Filters: "Filtrar",
    _sortby_: "Clasificación",
    Submit: "Entregar",
    Clear: "Borrar",
    Alias: "Alias",
    Model: "Modelo",
    Generation: "Generación",
    _byminute_: "por Minuto",
    _byhour_: "por Hora",
    _byday_: "por Dia",
    _bymonth_: "por Mes",
    _byyear_: "por Año",
    _notconnected_: "Desconnectado!",
    _getinvolved_: "Participar!",
    _gotogithub_: "Ir a Github",
    _opensource_: "Open Source AGPL Licencia",
    Home: "Home",
    Profile: "Perfil",
    Security: "Securidad",
    Settings: "Ajustes",
    Logout: "Cerrar sesión",
    _forgotpw_: "Contraseña olvidado?",
    _wrongpw_: "Contraseña incorrecto!",
    _usernotexists_: "Correo electrónico incorrecto!",
    _resetpw_: "Contraseña restablecida.",
    _notresetpw_: "Contraseña no esta restablecida.",
    Password: "Contraseña",
    Email: "Correo electrónico",
    Firstname: "Nombre",
    Lastname: "Apellido",
    Role: "Rol",
    _newuser_: "Nuevo Usuario",
    _editprofile_: "Tu Perfil",
    _edituserprofile_: "Editar usuario",
    _editsecurity_: "Tu Acceso",
    _editsettings: "Tu Adjusto",
    _searchuser_: "Busca Usuario",
    Users: "Usuarios",
    _rowsperpage_: "Filas por página:",
    of: "de",
    _morethan_: "mas de",
    Login: "Acceso",
    Save: "Guardar",
    _userupdated_: "Usuario actualizada",
    _usernotupdated_: "No pudo actualizar el usuario",
    _usercreated_: "Usario creado",
    _usernotcreated_: "No se pudo crear el usuario",
    _blogpostcreated_: "Post creado",
    _blogpostnotcreated_: "No se pudo crear el post",
    _blogpostupdated_: "Post actualizada",
    _blogpostnotupdated_: "No pudo actualizar el post",
    Delete: "Borrar",
    Edit: "Editar",
    _reallydelete_: "Realmente Borrar?",
    _userdeleted_: "Usuario eliminado",
    _usernotdeleted: "No se pudo eliminar el usuario",
    _emailexists_: "El correo electrónico ya existe",
    _aliasexists_: "Alias ya existe",
    Read: "Ya leí",
    Unread: "No leído",
    _unreadmessages_: "Tienes {{totalUnRead}} nuevos mensajes",
    _markallasread_: "Marcar todo como leído",
    Brightness: "Brillo",
    White: "Blanco",
    Control: "Ajustes",
    _newpost_: "Nuevo Post",
    Title: "Titulo",
    Content: "Contenido",
    _editpost_: "Editar Post",
    "_editor-preview_": "Previsión",
    "_editor-bold_": "Gordo",
    "_editor-italic_": "Itálico",
    "_editor-strike_": "Tachado",
    "_editor-underline_": "Testado",
    "_editor-link_": "Enlace",
    "_editor-bulletlist_": "Enumeración",
    "_editor-orderedlist_": "Numeración",
    "_editor-alignleft_": "Alinear Izquierda",
    "_editor-aligncenter_": "Alinear Central",
    "_editor-alignright_": "Alinear Derecha",
    "_editor-alignjustify_": "Alinear Igualmente",
    "_editor-blockquote_": "Cita",
    "_editor-codeblock_": "Codeblock",
    "_editor-undo_": "Atrás",
    "_editor-redo_": "Rehacer",
    "_editor-normaltext_": "Normal",
    "_editor-h1_": "Sobrescritura1",
    "_editor-h2_": "Sobrescritura2",
    "_editor-h3_": "Sobrescritura3",
    "_editor-h4_": "Sobrescritura4",
    "_editor-h5_": "Sobrescritura5",
    "_editor-h6_": "Sobrescritura6",
    "_editor-insertlink_": "Entrar Enlace",
    "_editor-invalidlink_": "Enlace Invalido",
    "_editor-color_": "Color del texto",
    "_editor-placeholder_": "Escribir tu post",
    _notfound_: "No encontrado",
    _noresultsfor_: "No se encontraron resultados para",
    selected: "seleccionado",
    _assigndevices_: "Relacionar Shelly",
    _devicesupdated_: "Relacion guardada",
    _devicesnotupdated: "Error al guardar",
    _firmwarestable_: "Actualizar a la versión estable",
    _firmwarebeta_: "Actualizar a la versión beta",
    Reboot: "Reanudar",
    Name: "Nombre",
    Uptime: "Duración",
    _required_: "necesario",
    _notrequired_: "no es necesario",
    _wifiupdated_:
      "Configuración WiFi actualizada ({{successful}} de {{total}})",
    _wifinotupdated_:
      "No todos eran actualizadas ({{successful}} de {{total}})",
    _wifiwarming_:
      "Advertencia: ¡Cambiar la configuración de WiFi puede desconectar el dispositivo!",
    _acceptrisk_: "Accepto el riesgo",
    _updateavailable_:
      "Solo {{checked}} de {{selected}} dispositivos necesita actualización {{type}}",
    _noupdateavailable_:
      "No hay {{type}} actualizaciones para los dispositivos seleccionados",
    _copysettings_: "Copiar esta configuración",
    _copyreset_: "Cancelar copia",
    _pastesettingsfrom_: "Usar la configuración de {{deviceName}}",
    _showall_: "Mostrar todo",
    showmin: "Minimizar",
  },
  wn = { translation: vn },
  Te = [
    { value: "en", label: "English" },
    { value: "de", label: "German" },
    { value: "es", label: "Spanish" },
  ],
  Sn = () => {
    const t = localStorage.getItem("i18nLanguage");
    if (t !== null)
      return (console.log(`Using last selected language ${t}`), t);
    if (typeof navigator.language < "u") {
      const n = navigator.language.substring(0, 2);
      if (typeof Te.find((s) => s.value === n) < "u")
        return (
          console.log(`Using browser language ${n}`),
          navigator.language.substring(0, 2)
        );
    }
    return (console.log("Using browser language en"), "en");
  };
Nt.use(ds).init({
  resources: { en: { ..._n }, de: { ...yn }, es: { ...wn } },
  lng: Sn(),
});
const Cn = "modulepreload",
  kn = function (t) {
    return "/" + t;
  },
  _t = {},
  me = function (n, s, i) {
    let r = Promise.resolve();
    if (s && s.length > 0) {
      let p = function (l) {
        return Promise.all(
          l.map((h) =>
            Promise.resolve(h).then(
              (d) => ({ status: "fulfilled", value: d }),
              (d) => ({ status: "rejected", reason: d }),
            ),
          ),
        );
      };
      document.getElementsByTagName("link");
      const a = document.querySelector("meta[property=csp-nonce]"),
        u = a?.nonce || a?.getAttribute("nonce");
      r = p(
        s.map((l) => {
          if (((l = kn(l)), l in _t)) return;
          _t[l] = !0;
          const h = l.endsWith(".css"),
            d = h ? '[rel="stylesheet"]' : "";
          if (document.querySelector(`link[href="${l}"]${d}`)) return;
          const g = document.createElement("link");
          if (
            ((g.rel = h ? "stylesheet" : Cn),
            h || (g.as = "script"),
            (g.crossOrigin = ""),
            (g.href = l),
            u && g.setAttribute("nonce", u),
            document.head.appendChild(g),
            h)
          )
            return new Promise((f, j) => {
              (g.addEventListener("load", f),
                g.addEventListener("error", () =>
                  j(new Error(`Unable to preload CSS for ${l}`)),
                ));
            });
        }),
      );
    }
    function c(a) {
      const u = new Event("vite:preloadError", { cancelable: !0 });
      if (((u.payload = a), window.dispatchEvent(u), !u.defaultPrevented))
        throw a;
    }
    return r.then((a) => {
      for (const u of a || []) u.status === "rejected" && c(u.reason);
      return n().catch(c);
    });
  },
  Ze = (t) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t),
  v = () =>
    "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (t) =>
      (
        +t ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+t / 4)))
      ).toString(16),
    ),
  ae = (t, n) => (t < n ? t : t % n === 0 ? n : t % n);
function jt(t) {
  return mn().update(t).digest("hex");
}
function Pn(t, n, s, i) {
  if (typeof s > "u" || s === "")
    throw new Error("Failed to authenticate!  Please supply a password!");
  if (typeof n > "u" || n.auth_type !== "digest")
    throw new Error("The message contains no authentication information");
  const r = {
    nonce: t.nonce,
    nc: n.nc,
    realm: n.realm,
    algorithm: n.algorithm,
  };
  return $n(r, s, i);
}
function $n(t, n, s) {
  ((t.username = s), (t.cnonce = String(Math.floor(Math.random() * 1e9))));
  let i = jt(`${t.username}:${t.realm}:${n}`);
  return (
    (i += `:${t.nonce}`),
    (i += `:1:${t.cnonce}`),
    (t.response = jt(i)),
    t
  );
}
const rt = (t, n) => {
    typeof document < "u" && document.addEventListener(t, n);
  },
  ot = (t, n) => {
    typeof document < "u" && document.removeEventListener(t, n);
  },
  re = (t, n) => {
    const s = new CustomEvent(t, { detail: n, bubbles: !1, cancelable: !0 });
    typeof document < "u" && document.dispatchEvent(s);
  },
  yt = [
    {
      ip: "192.168.68.20",
      cname: "Test",
      password: "test",
      online: !0,
      name: "PlusRGBWPM",
      gen: 2,
      fw_id: "20250924-062733/1.7.1-gd336f31",
      id: "shellyplusrgbwpm-30c92257d20c",
      image: "/assets/images/devices/PlusRGBWPM.png",
      wsmessages: {
        NotifyStatus: {
          src: "shellyplusrgbwpm-30c92257d20c",
          dst: "ws",
          method: "NotifyStatus",
          params: {
            ts: 1763563860,
            "rgbw:0": {
              aenergy: {
                by_minute: [0, 0, 0],
                minute_ts: 1763563860,
                total: 3102,
              },
            },
          },
        },
        NotifyEvent: {
          src: "shellyplusrgbwpm-30c92257d20c",
          dst: "ws",
          method: "NotifyEvent",
          params: {
            ts: 176356359465e-2,
            events: [
              {
                component: "sys",
                event: "scheduled_restart",
                time_ms: 997,
                ts: 176356359465e-2,
              },
            ],
          },
        },
        NotifyFullStatus: {
          src: "shellyplusrgbwpm-30c92257d20c",
          dst: "request",
          method: "NotifyFullStatus",
          params: {
            ble: {},
            cloud: { connected: !0 },
            "input:0": { id: 0, state: null },
            "input:1": { id: 1, state: null },
            "input:2": { id: 2, state: null },
            "input:3": { id: 3, state: null },
            mqtt: { connected: !1 },
            plusrgbwpm: {},
            "rgbw:0": {
              id: 0,
              source: "init",
              output: !1,
              rgb: [255, 255, 255],
              brightness: 10,
              white: 0,
              temperature: { tC: 48.2, tF: 118.7 },
              aenergy: {
                total: 3102,
                by_minute: [0, 0, 0],
                minute_ts: 1763563800,
              },
              apower: 0,
              current: 0,
              voltage: 24.6,
            },
            "script:1": {
              id: 1,
              running: !0,
              mem_used: 784,
              mem_peak: 1652,
              mem_free: 22974,
              cpu: 0,
            },
            "script:2": {
              id: 2,
              running: !0,
              mem_used: 1414,
              mem_peak: 3192,
              mem_free: 22974,
              cpu: 0,
            },
            sys: {
              mac: "30C92257D20C",
              restart_required: !1,
              time: "15:50",
              unixtime: 1763563834,
              last_sync_ts: 1763563717,
              uptime: 121,
              ram_size: 249200,
              ram_free: 119908,
              ram_min_free: 112248,
              fs_size: 393216,
              fs_free: 98304,
              cfg_rev: 255,
              kvs_rev: 4,
              schedule_rev: 0,
              webhook_rev: 0,
              btrelay_rev: 0,
              available_updates: {},
              reset_reason: 4,
              utc_offset: 3600,
            },
            wifi: {
              sta_ip: "192.168.68.20",
              status: "got ip",
              ssid: "Tropired2709",
              bssid: "32:16:9d:2f:f7:ca",
              rssi: -47,
            },
            ws: { connected: !0 },
            ts: 1763563833,
          },
        },
      },
      scripts: [
        {
          id: 1,
          name: "Example",
          enable: !0,
          running: !0,
          logmessages: [
            {
              ts: 1763563688,
              msg: "Looks like with Firmware 1.7.0 messages without prefix can also be captured\0",
            },
            {
              ts: 1763563744,
              msg: "Example (#1): Please participate and help the project become better!\0",
            },
            {
              ts: 1763563744,
              msg: "Looks like with Firmware 1.7.0 messages without prefix can also be captured\0",
            },
            {
              ts: 1763563774,
              msg: "Example (#1): Please participate and help the project become better!\0",
            },
            {
              ts: 1763563774,
              msg: "Looks like with Firmware 1.7.0 messages without prefix can also be captured\0",
            },
            {
              ts: 1763563804,
              msg: "Example (#1): Please participate and help the project become better!\0",
            },
            {
              ts: 1763563804,
              msg: "Looks like with Firmware 1.7.0 messages without prefix can also be captured\0",
            },
            {
              ts: 1763563834,
              msg: "Example (#1): Please participate and help the project become better!\0",
            },
            {
              ts: 1763563834,
              msg: "Looks like with Firmware 1.7.0 messages without prefix can also be captured\0",
            },
            {
              ts: 1763563864,
              msg: "Example (#1): Please participate and help the project become better!\0",
            },
            {
              ts: 1763563864,
              msg: "Looks like with Firmware 1.7.0 messages without prefix can also be captured\0",
            },
          ],
        },
        {
          id: 2,
          name: "Watchdog",
          enable: !0,
          running: !0,
          logmessages: [
            {
              ts: 1763563864,
              msg: 'Watchdog (#2): result: {"id":1,"running":true,"mem_used":784,"mem_peak":1652,"mem_free":22610,"cpu":0}\0',
            },
            { ts: 1763563864, msg: "Watchdog (#2): error_code: 0\0" },
            { ts: 1763563864, msg: "Watchdog (#2): error_message:\0" },
            {
              ts: 1763563864,
              msg: 'Watchdog (#2): userdata: {"report":true,"error_msg":"Could not get the status of Script Example","success_msg":"Successfully got\0',
            },
            {
              ts: 1763563864,
              msg: 'the status of Script Example","sScriptname":"Example","nScriptIndex":0,"nID":1,"sIP":"192.168.68.20"}\0',
            },
            {
              ts: 1763563864,
              msg: "Watchdog (#2): Successfully got the status of Script Example\0",
            },
            { ts: 1763563864, msg: "Script 'Example' is running" },
          ],
        },
      ],
      kvs: [
        {
          key: "ClimateControl",
          value: "1",
          display: "Klimakontrolle",
          style: "color",
        },
      ],
      switches: [
        {
          deviceIp: "192.168.68.20",
          key: "rgbw:0",
          id: 0,
          output: !1,
          brightness: 10,
          white: 0,
          rgb: [255, 255, 255],
        },
      ],
    },
  ],
  qt = o.createContext(),
  K = () => o.useContext(qt),
  Fn = ({ children: t }) => {
    const [n, s] = o.useState(JSON.parse(localStorage.getItem("user"))),
      [i, r] = o.useState(null),
      [c, a] = o.useState(!1),
      [u, p] = o.useState(0.001),
      l = o.useRef(null),
      h = o.useRef({}),
      d = o.useRef({}),
      g = o.useRef(!1),
      f = o.useRef(null),
      j = Ue(),
      S = o.useRef({
        event: "user reconnect",
        data: {
          name: "Shelly Context",
          channelID: `sc${v()}`,
          message: "Hello from Shelly Context",
          user: n,
        },
      }),
      $ = o.useRef(["user validate", "blogposts get public", "user resetpw"]),
      D = o.useCallback((m, w) => {
        S.current.data.user !== null &&
          (w && (m = 0.001),
          (g.current = !0),
          setTimeout(
            () => {
              if (
                l.current !== null &&
                l.current.readyState === WebSocket.OPEN
              ) {
                g.current = !1;
                return;
              }
              if (m > window.scconfig.RECONNECT_MAX) {
                ((g.current = !1),
                  console.log(
                    "Reconnecting makes no sense! Please reload Page",
                  ),
                  re("lastUpdatedAt", null));
                return;
              }
              (console.log(`Trying to reconnect: ${m}`),
                p(m + 1),
                D(m + 1, !1));
            },
            m * window.scconfig.RECONNECT_DELAY * 1e3,
          ));
      }, []),
      E = (m, w) => {
        w.forEach((x) => {
          typeof h.current[x] > "u"
            ? (h.current[x] = [m])
            : h.current[x].push(m);
        });
      },
      k = (m, w) => {
        w.forEach((x) => {
          typeof h.current[x] < "u" &&
            (h.current[x] = h.current[x].filter((_) => _.subscriptionID !== m));
        });
      },
      P = o.useCallback(
        (m) => {
          const w = !$.current.includes(m.event);
          if (
            (w && (m.data.secret = f.current),
            l.current !== null &&
              l.current.readyState === WebSocket.OPEN &&
              (!w || f.current !== null))
          )
            l.current.send(JSON.stringify(m));
          else {
            const x = v();
            ((d.current[x] = { msg: m, undefined: void 0 }),
              g.current || D(u, !0));
          }
        },
        [D, u],
      ),
      b = o.useCallback(
        (m, w) => {
          if (m.event === "user validate")
            (a(m.data.isTest), r({ msg: m, callback: w }));
          else {
            const _ = v();
            ((m.data.requestID = _), (d.current[_] = { msg: m, callback: w }));
          }
          const x = !$.current.includes(m.event);
          (x && (m.data.secret = f.current),
            l.current !== null &&
            l.current.readyState === WebSocket.OPEN &&
            (!x || f.current !== null)
              ? l.current.send(JSON.stringify(m))
              : !g.current &&
                (l.current === null ||
                  l.current.readyState !== WebSocket.OPEN) &&
                D(u, !0));
        },
        [D, u],
      ),
      I = o.useCallback(
        (m, w) => {
          ((S.current.data.user = m),
            s(m),
            console.log(`Loggin in user '${m.alias}'`),
            w && j(m.home));
        },
        [j],
      ),
      R = o.useCallback(() => {
        s(null);
      }, []);
    return (
      o.useEffect(() => {
        n !== null
          ? localStorage.setItem("user", JSON.stringify(n))
          : (localStorage.removeItem("user"), (S.current.data.user = null));
      }, [n]),
      o.useEffect(() => {
        if (
          l.current === null ||
          (g && l.current.readyState !== WebSocket.OPEN)
        ) {
          re("lastUpdatedAt", "connecting");
          const m = window.scconfig.WSSURL;
          (console.log(`Creating websocket connection to ${m}`),
            (l.current = new gn.w3cwebsocket(m)));
        }
        ((l.current.onerror = (m) => console.error(m)),
          (l.current.onopen = () => {
            ((g.current = !1),
              re("lastUpdatedAt", Date.now()),
              console.log("WebSocket connection opened for Shelly Context!"),
              i !== null
                ? (console.log("Sending an existing validation request"),
                  l.current.send(
                    JSON.stringify({
                      event: "user validate",
                      data: {
                        source: i.msg.data.source,
                        message: i.msg.data.message,
                        user: { email: i.msg.data.user.email },
                      },
                    }),
                  ))
                : S.current.data.user !== null &&
                  (console.log(
                    `Reconnecting the previously logged in user '${S.current.data.user.alias}' on websocket open`,
                  ),
                  l.current.send(JSON.stringify(S.current))),
              Object.entries(d.current).forEach((m) => {
                const [w, x] = m;
                if ($.current.includes(x.msg.event)) {
                  console.log(
                    `Sending '${x.msg.event}' after opening the websocket`,
                  );
                  try {
                    l.current.send(JSON.stringify(x.msg));
                  } catch (_) {
                    console.error(_);
                  }
                }
                typeof x.callback > "u" && delete d[w];
              }));
          }),
          (l.current.onmessage = (m) => {
            re("lastUpdatedAt", Date.now());
            const w = JSON.parse(m.data);
            if (w !== null)
              if (w.event === "user validate")
                i !== null &&
                typeof w.data.error < "u" &&
                w.data.error.code === 401
                  ? ((i.msg.data.auth = Pn(
                      w.data.error,
                      w.data.error.message,
                      i.msg.data.user.password,
                      i.msg.data.user.email,
                    )),
                    delete i.msg.data.user.password,
                    delete i.msg.data.error,
                    l.current.send(JSON.stringify(i.msg)))
                  : ((f.current = w.data.secret),
                    delete w.data.secret,
                    i.callback(w),
                    r(null),
                    (S.current.data.user = w.data.user),
                    console.log(
                      `Reconnecting the previously logged in user '${S.current.data.user.alias}' after successful validation`,
                    ),
                    l.current.send(JSON.stringify(S.current)),
                    console.log(
                      `Deleted the 'user validate' request. Now have ${Object.entries(d.current).length} requests left`,
                    ));
              else if (w.event === "user-reconnect")
                if (typeof w.data.secret < "u") {
                  const x = S.current.data.user;
                  (console.log(
                    `Just reconnected with user ${x.alias}. There are ${Object.entries(d.current).length} outstanding requests`,
                  ),
                    (f.current = w.data.secret),
                    I(x, !0),
                    Object.entries(d.current).forEach((_) => {
                      const [F, T] = _;
                      ($.current.includes(w.event) ||
                        (T.msg.data.secret = f.current),
                        console.log(
                          `Sending '${T.msg.event}' after reconnecting`,
                        ),
                        l.current.send(JSON.stringify(T.msg)),
                        typeof T.callback > "u" && delete d[F]);
                    }));
                } else
                  (console.error("Reconnecting was not possible. Logging out!"),
                    R());
              else if (w.event === "ping")
                l.current.send(
                  JSON.stringify({
                    event: "pong",
                    data: { source: "SC Context", message: w.data.message },
                  }),
                );
              else if (
                typeof w.data.requestID < "u" &&
                typeof d.current[w.data.requestID] < "u"
              ) {
                c && w.event === "device get" && (w.data.device = yt[0]);
                const x = w.data.requestID;
                (delete w.data.requestID,
                  d.current[x].callback(w),
                  delete d.current[x],
                  console.log(
                    `Deleted request '${w.event}' on answer: '${w.data.message}'. Now have ${Object.entries(d.current).length} requests`,
                  ));
              } else
                typeof w.event < "u"
                  ? typeof h.current[w.event] < "u" &&
                    h.current[w.event].forEach((x) => {
                      (x.all || w.data.subscriptionID === x.subscriptionID) &&
                        x.callback(w);
                    })
                  : console.error(
                      `Shelly context received an unhandled message ${JSON.stringify(w)} `,
                    );
          }),
          (l.current.onclose = (m) => {
            (g.current
              ? re("lastUpdatedAt", null)
              : (re("lastUpdatedAt", "connecting"), D(u, !0)),
              l.current
                ? console.log(
                    `WebSocket connection closed by the server with code ${m.code} for SC Context. Reason: ${m.reason}!`,
                  )
                : console.log(
                    `WebSocket connection closed because SC Context was unmounted. Reason: ${m.reason}!`,
                  ));
          }));
      }, [i, D, u, R, n, c, I]),
      e.jsx(qt.Provider, {
        value: o.useMemo(
          () => ({
            user: n,
            login: I,
            logout: R,
            subscribe: E,
            unsubscribe: k,
            request: b,
            send: P,
            testDevices: yt,
            isTest: c,
          }),
          [n, I, R, b, P, c],
        ),
        children: t,
      })
    );
  };
function Gt() {
  const { pathname: t } = ze();
  return o.useMemo(() => t, [t]);
}
const Vt = o.forwardRef(({ href: t, ...n }, s) =>
  e.jsx(ps, { ref: s, to: t, ...n }),
);
function at(t, n, s) {
  const i = Me(),
    r = Oe(i.breakpoints.up(n));
  return (
    Oe(i.breakpoints.down(n)),
    Oe(i.breakpoints.between(n, s)),
    Oe(i.breakpoints.only(n)),
    r
  );
}
const Ge = ({ disabledLink: t = !1, sx: n }) => {
    const s = e.jsx(N, {
      component: "img",
      src: "/assets/logo.svg",
      sx: { width: 40, height: 40, ...n },
    });
    return t
      ? s
      : e.jsxs(O, {
          direction: "row",
          spacing: 2,
          sx: { justifyContent: "flex-start", alignItems: "center" },
          children: [
            e.jsx(N, { sx: { display: "contents" }, children: s }),
            e.jsx(C, { variant: "h6", sx: { pt: 3 }, children: "S-Central" }),
          ],
        });
  },
  Dn = He("div")(() => ({ flexGrow: 1, height: "100%", overflow: "hidden" })),
  In = He(fn)(({ theme: t }) => ({
    maxHeight: "100%",
    "& .simplebar-scrollbar": {
      "&:before": { backgroundColor: B(t.palette.grey[600], 0.48) },
      "&.simplebar-visible:before": { opacity: 1 },
    },
    "& .simplebar-mask": { zIndex: "inherit" },
  })),
  On = o.forwardRef(({ children: t, sx: n, ...s }, i) => {
    const r = typeof navigator > "u" ? "SSR" : navigator.userAgent;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      r,
    )
      ? e.jsx(N, { ref: i, sx: { overflow: "auto", ...n }, ...s, children: t })
      : e.jsx(Dn, {
          children: e.jsx(In, {
            scrollableNodeProps: { ref: i },
            clickOnTrack: !1,
            sx: n,
            ...s,
            children: t,
          }),
        });
  }),
  Fe = o.memo(On),
  Le = { H_MOBILE: 64, H_DESKTOP: 80 },
  ke = { WIDTH: 280 },
  Jt = o.forwardRef(({ src: t, sx: n, ...s }, i) =>
    e.jsx(N, {
      component: "span",
      className: "svg-color",
      ref: i,
      sx: {
        width: 24,
        height: 24,
        display: "inline-block",
        bgcolor: "currentColor",
        mask: `url(${t}) no-repeat center / contain`,
        WebkitMask: `url(${t}) no-repeat center / contain`,
        ...n,
      },
      ...s,
    }),
  ),
  Ae = (t) =>
    e.jsx(Jt, {
      src: `/assets/icons/navbar/${t}.svg`,
      sx: { width: 1, height: 1 },
    }),
  En = [
    {
      title: "dashboard",
      path: "/dashboard",
      icon: Ae("ic_analytics"),
      minRole: "User",
    },
    {
      title: "shellies",
      path: "/shellies",
      icon: Ae("ic_device"),
      minRole: "User",
    },
    { title: "blog", path: "/blog", icon: Ae("ic_blog"), minRole: "User" },
    { title: "user", path: "/user", icon: Ae("ic_user"), minRole: "Admin" },
  ];
function Rn({ openNav: t, onCloseNav: n }) {
  const s = Gt(),
    { user: i } = K(),
    { t: r } = z(),
    c = at("up", "lg");
  o.useEffect(() => {
    t && n();
  }, [s]);
  const a = e.jsxs(N, {
      sx: {
        my: 3,
        mx: 2.5,
        py: 2,
        px: 2.5,
        display: "flex",
        borderRadius: 1.5,
        alignItems: "center",
        bgcolor: (h) => B(h.palette.grey[500], 0.12),
      },
      children: [
        e.jsx(_e, {
          src: `/assets/images/avatars/avatar_${ae(i.userid, 25)}.jpg`,
          alt: "photoURL",
        }),
        e.jsxs(N, {
          sx: { ml: 2 },
          children: [
            e.jsx(C, {
              variant: "subtitle2",
              children: `${i.firstname !== null ? i.firstname : i.alias} ${i.lastname !== null ? i.lastname : i.alias}`,
            }),
            e.jsx(C, {
              variant: "body2",
              sx: { color: "text.secondary" },
              children: i.role,
            }),
          ],
        }),
      ],
    }),
    u = e.jsx(O, {
      component: "nav",
      spacing: 0.5,
      sx: { px: 2 },
      children: En.map((h) =>
        h.minRole === "User" || (h.minRole === "Admin" && i.roleid === 1)
          ? e.jsx(An, { item: h }, h.title)
          : null,
      ),
    }),
    p = e.jsx(N, {
      sx: { px: 2.5, pb: 3, mt: 10 },
      children: e.jsxs(O, {
        alignItems: "center",
        spacing: 3,
        sx: { pt: 5, borderRadius: 2, position: "relative" },
        children: [
          e.jsx(N, {
            sx: { width: 100, position: "absolute", top: -50 },
            children: e.jsx(_e, {
              src: "/assets/illustrations/avatar_main.jpg",
              sx: { width: 100, height: 100 },
            }),
          }),
          e.jsxs(N, {
            sx: { textAlign: "center" },
            children: [
              e.jsx(C, { variant: "h6", children: r("_getinvolved_") }),
              e.jsx(C, {
                variant: "body2",
                sx: { color: "text.secondary", mt: 1 },
                children: r("_opensource_"),
              }),
            ],
          }),
          e.jsx(Q, {
            href: "https://github.com/akreienbring/s-central",
            target: "_blank",
            variant: "contained",
            color: "inherit",
            children: r("_gotogithub_"),
          }),
        ],
      }),
    }),
    l = e.jsxs(Fe, {
      sx: {
        height: 1,
        "& .simplebar-content": {
          height: 1,
          display: "flex",
          flexDirection: "column",
        },
      },
      children: [
        e.jsx(Ge, { sx: { mt: 3, ml: 4 } }),
        a,
        u,
        e.jsx(N, { sx: { flexGrow: 1 } }),
        p,
      ],
    });
  return e.jsx(N, {
    sx: { flexShrink: { lg: 0 }, width: { lg: ke.WIDTH } },
    children: c
      ? e.jsx(N, {
          sx: {
            height: 1,
            position: "fixed",
            width: ke.WIDTH,
            borderRight: (h) => `dashed 1px ${h.palette.divider}`,
          },
          children: l,
        })
      : e.jsx(ue, {
          open: t,
          onClose: n,
          slotProps: { paper: { sx: { width: ke.WIDTH } } },
          children: l,
        }),
  });
}
function An({ item: t }) {
  const n = Gt(),
    { t: s } = z(),
    i = t.path === n;
  return e.jsxs(Tt, {
    "data-testid": `nav_item_${t.title}`,
    component: Vt,
    href: t.path,
    sx: {
      minHeight: 44,
      borderRadius: 0.75,
      typography: "body2",
      color: "text.secondary",
      textTransform: "capitalize",
      fontWeight: "fontWeightMedium",
      ...(i && {
        color: "primary.main",
        fontWeight: "fontWeightSemiBold",
        bgcolor: (r) => B(r.palette.primary.main, 0.08),
        "&:hover": { bgcolor: (r) => B(r.palette.primary.main, 0.16) },
      }),
    },
    children: [
      e.jsx(N, {
        component: "span",
        sx: { width: 24, height: 24, mr: 2 },
        children: t.icon,
      }),
      e.jsxs(N, {
        component: "span",
        children: [t.title === "user" ? s("Users") : t.title, " "],
      }),
    ],
  });
}
const vt = 8;
function Nn({ children: t, sx: n, ...s }) {
  const i = at("up", "lg");
  return e.jsx(N, {
    component: "main",
    sx: {
      flexGrow: 1,
      minHeight: 1,
      display: "flex",
      flexDirection: "column",
      py: `${Le.H_MOBILE + vt}px`,
      ...(i && {
        px: 2,
        py: `${Le.H_DESKTOP + vt}px`,
        width: `calc(100% - ${ke.WIDTH}px)`,
      }),
      ...n,
    },
    ...s,
    children: t,
  });
}
const y = o.forwardRef(({ icon: t, width: n = 25, sx: s, ...i }, r) =>
  e.jsx(N, {
    ref: r,
    component: an,
    className: "component-iconify",
    icon: t,
    sx: { width: n, height: n, ...s },
    ...i,
  }),
);
function We(t) {
  const n = t?.color || "#000000",
    s = t?.blur || 6,
    i = t?.opacity || 0.8,
    r = t?.imgUrl;
  return r
    ? {
        position: "relative",
        backgroundImage: `url(${r})`,
        "&:before": {
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 9,
          content: '""',
          width: "100%",
          height: "100%",
          backdropFilter: `blur(${s}px)`,
          WebkitBackdropFilter: `blur(${s}px)`,
          backgroundColor: B(n, i),
        },
      }
    : {
        backdropFilter: `blur(${s}px)`,
        WebkitBackdropFilter: `blur(${s}px)`,
        backgroundColor: B(n, i),
      };
}
function Tn(t) {
  const n = t?.direction || "to bottom",
    s = t?.startColor,
    i = t?.endColor,
    r = t?.imgUrl,
    c = t?.color;
  return {
    background: `linear-gradient(${n}, ${s || c}, ${i || c}), url(${r})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center center",
  };
}
const lt = () => {
  switch (Nt.language) {
    case "en":
      return bt;
    case "de":
      return un;
    case "es":
      return dn;
    default:
      return bt;
  }
};
function Wn(t, n) {
  return t ? it(new Date(t), "dd MMM yyyy", { locale: lt() }) : "";
}
function Kt(t, n) {
  const s = n || "dd MMM yyyy p";
  return t ? it(new Date(t), s, { locale: lt() }) : "";
}
function Qe(t, n) {
  return t ? it(cn(t), n) : "";
}
function Bn(t) {
  return t ? hn(new Date(t), { addSuffix: !0, locale: lt() }) : "";
}
function Ln(t) {
  if (t === 0 || typeof t > "u") return "0";
  const n = pn({ start: 0, end: t * 1e3 });
  return `
    ${typeof n.years < "u" ? n.years + "y:" : ""}
    ${typeof n.months < "u" ? n.months + "m:" : ""}
    ${typeof n.days < "u" ? n.days + "d:" : ""}
    ${typeof n.hours < "u" ? n.hours + "h:" : ""}
    ${typeof n.minutes < "u" ? n.minutes + "m" : ""}
    ${typeof n.seconds < "u" ? n.seconds + "s" : ""}
  `;
}
const Un = () => {
    const [t, n] = o.useState("connecting"),
      { t: s } = z(),
      i = Ue(),
      r = o.useCallback((a) => {
        a !== null && n(a.detail);
      }, []);
    o.useEffect(
      () => (
        rt("lastUpdatedAt", r),
        () => {
          ot("lastUpdatedAt");
        }
      ),
      [r],
    );
    const c = () => {
      t === null && (n(void 0), i(0));
    };
    return t === 0
      ? null
      : e.jsx(Q, {
          "data-testid": "info_lastUpdate_button",
          variant: "contained",
          color: t !== null && t !== "connecting" ? "success" : "error",
          startIcon:
            t === "connecting" || t === "loading"
              ? e.jsx(et, {
                  size: 25,
                  variant: "indeterminate",
                  color: "common.white",
                })
              : e.jsx(y, { icon: "carbon:update-now" }),
          onClick: c,
          children:
            t !== null && t !== "connecting" && t !== "loading"
              ? Kt(t, "HH:mm:ss")
              : s("_notconnected_"),
        });
  },
  zn = ({
    type: t,
    requestResult: n,
    roles: s,
    currentUser: i,
    setRequestResult: r,
    setCurrentUser: c,
    handleForgotten: a,
    handleCurrentUser: u,
  }) => {
    const { user: p } = K(),
      [l, h] = o.useState({ ...i }),
      [d, g] = o.useState(!1),
      [f, j] = o.useState(t === "create" ? "dashboard" : i.home),
      [S, $] = o.useState(i.roleid),
      [D, E] = o.useState(!1),
      { t: k } = z(),
      P = () => {
        r({ success: !0, message: "" });
      },
      b = ({ target: m }) => {
        const w = { ...i };
        (m.name === "role"
          ? ($(m.value), (w.role = s[m.value - 1].name), (w.roleid = m.value))
          : m.name === "home"
            ? (j(m.value), (w.home = m.value))
            : m.name === "alias"
              ? (w[m.name] = m.value.trim())
              : m.name === "test"
                ? g(m.checked)
                : (w[m.name] = m.value),
          c(w));
      },
      I = (m) => {
        (m.preventDefault(), h(i), u(i, d));
      },
      R = () => {
        if (i === null) return !0;
        let m = !1;
        return (
          t === "login" &&
            (m =
              typeof i.email > "u" ||
              i.email.length === 0 ||
              typeof i.password > "u" ||
              i.password.length === 0 ||
              !Ze(i.email)),
          (t === "profile" || t === "settings") &&
            (m =
              (i.alias === l.alias || i.alias.length === 0) &&
              i.roleid === l.roleid &&
              i.firstname === l.firstname &&
              i.lastname === l.lastname &&
              i.home === l.home),
          t === "create" &&
            (m =
              typeof i.email > "u" ||
              i.email.length === 0 ||
              !Ze(i.email) ||
              typeof i.alias > "u" ||
              i.alias.length === 0),
          t === "security" &&
            (m =
              !Ze(i.email) ||
              i.password !== i.password2 ||
              typeof i.password > "u" ||
              i.password.length === 0 ||
              typeof i.password2 > "u" ||
              i.password.length2 === 0),
          m
        );
      };
    return e.jsx("form", {
      onSubmit: I,
      children: e.jsx($e, {
        fullWidth: !0,
        size: "subtitle2",
        children: e.jsxs(O, {
          spacing: 3,
          sx: { px: 3, py: 3 },
          children: [
            (t === "login" || t === "create" || t === "security") &&
              e.jsx(X, {
                slotProps: {
                  htmlInput: { "data-testid": "security_email_input" },
                },
                required: !0,
                value: i.email,
                name: "email",
                label: k("Email"),
                onFocus: P,
                onChange: b,
              }),
            (t === "login" || t === "security") &&
              e.jsxs(e.Fragment, {
                children: [
                  e.jsx(X, {
                    name: "password",
                    required: !0,
                    label: k("Password"),
                    onFocus: P,
                    onChange: b,
                    type: D ? "text" : "password",
                    slotProps: {
                      htmlInput: { "data-testid": "security_password_input" },
                      input: {
                        endAdornment: e.jsx(Be, {
                          position: "end",
                          children: e.jsx(U, {
                            onClick: () => E(!D),
                            edge: "end",
                            children: e.jsx(y, {
                              icon: D ? "eva:eye-fill" : "eva:eye-off-fill",
                            }),
                          }),
                        }),
                      },
                    },
                  }),
                  t === "login" &&
                    e.jsx(je, {
                      "data-testid": "login_test_checkbox",
                      control: e.jsx(le, {
                        name: "test",
                        checked: d,
                        onChange: b,
                      }),
                      label: "Test",
                      sx: { display: "none" },
                    }),
                ],
              }),
            t === "security" &&
              e.jsx(X, {
                required: !0,
                name: "password2",
                label: k("Password"),
                onFocus: P,
                onChange: b,
                type: D ? "text" : "password",
                slotProps: {
                  htmlInput: { "data-testid": "security_password2_input" },
                  input: {
                    endAdornment: e.jsx(Be, {
                      position: "end",
                      children: e.jsx(U, {
                        onClick: () => E(!D),
                        edge: "end",
                        children: e.jsx(y, {
                          icon: D ? "eva:eye-fill" : "eva:eye-off-fill",
                        }),
                      }),
                    }),
                  },
                },
              }),
            (t === "profile" || t === "create") &&
              e.jsxs(O, {
                spacing: 3,
                children: [
                  e.jsx(X, {
                    required: !0,
                    value: i.alias,
                    name: "alias",
                    label: k("Alias"),
                    onChange: b,
                    onFocus: P,
                    slotProps: {
                      htmlInput: { "data-testid": "profile_alias_input" },
                    },
                  }),
                  e.jsx(X, {
                    value: i.firstname ? i.firstname : "",
                    name: "firstname",
                    label: k("Firstname"),
                    onChange: b,
                    onFocus: P,
                    slotProps: {
                      htmlInput: { "data-testid": "profile_firstname_input" },
                    },
                  }),
                  e.jsx(X, {
                    value: i.lastname ? i.lastname : "",
                    name: "lastname",
                    label: k("Lastname"),
                    onChange: b,
                    onFocus: P,
                    slotProps: {
                      htmlInput: { "data-testid": "profile_lastname_input" },
                    },
                  }),
                  e.jsx(X, {
                    disabled: p.userid === i.userid || i.userid === 1,
                    required: !0,
                    select: !0,
                    value: s.length === 0 ? "" : S,
                    name: "role",
                    label: k("Role"),
                    onChange: b,
                    onFocus: P,
                    slotProps: {
                      htmlInput: { "data-testid": "profile_role_select" },
                    },
                    children:
                      typeof s < "u"
                        ? s.map((m) =>
                            e.jsx(q, { value: m.id, children: m.name }, m.name),
                          )
                        : null,
                  }),
                ],
              }),
            (t === "settings" || t === "create") &&
              e.jsxs(X, {
                required: !0,
                select: !0,
                value: f || "dashboard",
                name: "home",
                label: k("Home"),
                onChange: b,
                onFocus: P,
                slotProps: {
                  htmlInput: { "data-testid": "settings_home_select" },
                },
                children: [
                  e.jsx(q, {
                    "data-testid": "home_dashboard_option",
                    value: "dashboard",
                    children: "Dashboard",
                  }),
                  e.jsx(q, {
                    "data-testid": "home_shellies_option",
                    value: "shellies",
                    children: "Shellies",
                  }),
                ],
              }),
            e.jsxs(O, {
              direction: "row",
              alignItems: "baseline",
              justifyContent: "space-between",
              spacing: 1,
              children: [
                e.jsx(C, {
                  variant: "subtitle2",
                  color: n.success ? "success" : "error",
                  children: k(n.message),
                }),
                t === "login" &&
                  e.jsx(qe, {
                    variant: "subtitle2",
                    underline: "hover",
                    color: "primary",
                    style: { cursor: "pointer" },
                    onClick: () => a(i.email),
                    children: k("_forgotpw_"),
                  }),
              ],
            }),
            t === "login"
              ? e.jsx(Q, {
                  "data-testid": "login_submit_button",
                  disabled: R(),
                  fullWidth: !0,
                  size: "large",
                  type: "submit",
                  variant: "contained",
                  color: "inherit",
                  children: k("Login"),
                })
              : e.jsx(Q, {
                  "data-testid": "account_save_button",
                  disabled: R(),
                  fullWidth: !0,
                  size: "large",
                  type: "submit",
                  color: "inherit",
                  variant: "outlined",
                  startIcon: e.jsx(y, { icon: "formkit:submit" }),
                  children: k("Save"),
                }),
          ],
        }),
      }),
    });
  },
  ct = ({
    type: t,
    updateuser: n,
    handleUsersReceived: s,
    handleUpdateUser: i,
  }) => {
    const { login: r, user: c, request: a } = K(),
      [u, p] = o.useState(() =>
        t === "profile" || t === "settings" || t === "security"
          ? typeof n > "u"
            ? {
                alias: c.alias,
                email: c.email,
                firstname: c.firstname,
                lastname: c.lastname,
                home: c.home,
                roleid: c.roleid,
                userid: c.userid,
                uuid: c.uuid,
              }
            : n
          : {
              alias: "",
              email: "",
              firstname: "",
              lastname: "",
              password: "",
              home: "dashboard",
              roleid: 3,
              test: !1,
            },
      ),
      [l, h] = o.useState([]),
      [d, g] = o.useState({ success: !0, message: "" }),
      f = ze(),
      j = o.useCallback(
        (b) => {
          b.data.success
            ? (p(b.data.user), r(b.data.user, !0))
            : g({ success: !1, message: b.data.message });
        },
        [r],
      ),
      S = o.useCallback(
        (b) => {
          g({ success: b.data.success, message: b.data.message });
          const I = { ...u };
          (c.userid === u.userid &&
            (t === "security" || t === "profile") &&
            (delete I.password2, delete I.password, p(I), r(I, !1)),
            typeof i < "u"
              ? i(I)
              : f.pathname === "/user" && re("userUpdated", I));
        },
        [c, u, r, i, f, t],
      ),
      $ = o.useCallback(
        (b) => {
          (g({ success: b.data.success, message: b.data.message }),
            b.data.success && s(b));
        },
        [s],
      ),
      D = o.useCallback((b) => {
        h(b.data.roles);
      }, []),
      E = o.useCallback((b) => {
        g({ success: b.data.success, message: b.data.message });
      }, []);
    o.useEffect(() => {
      (t === "profile" || t === "create") &&
        a(
          {
            event: "roles get all",
            data: {
              source: "Users Form",
              message: "User Form needs the list of roles",
            },
          },
          D,
        );
    }, [t, D, a]);
    const k = (b, I) => {
        t === "login"
          ? a(
              {
                event: "user validate",
                data: {
                  source: "User Form",
                  message: "User Form wants to validate a user",
                  user: b,
                  isTest: I,
                },
              },
              j,
            )
          : t === "profile"
            ? a(
                {
                  event: "user profile update",
                  data: {
                    source: "User Form",
                    message: "User Form wants to update a users profile",
                    user: b,
                  },
                },
                S,
              )
            : t === "create"
              ? a(
                  {
                    event: "user create",
                    data: {
                      source: "User Form ",
                      message: "User Form wants to create a new user",
                      user: b,
                    },
                  },
                  $,
                )
              : t === "security"
                ? a(
                    {
                      event: "user security update",
                      data: {
                        source: "User Form ",
                        message:
                          "User Form  wants to update a users credentials",
                        user: b,
                      },
                    },
                    S,
                  )
                : t === "settings" &&
                  a(
                    {
                      event: "user settings update",
                      data: {
                        source: "User Form ",
                        message: "User Form  wants to update a users settings",
                        user: b,
                      },
                    },
                    S,
                  );
      },
      P = (b) => {
        a(
          {
            event: "user resetpw",
            data: {
              source: "User Form",
              message: "User Form wants to reset a password",
              email: b,
            },
          },
          E,
        );
      };
    return e.jsx(zn, {
      type: t,
      roles: l,
      requestResult: d,
      currentUser: u,
      setCurrentUser: p,
      setRequestResult: g,
      handleForgotten: P,
      handleCurrentUser: k,
    });
  };
function Yt({
  title: t,
  openUpdate: n,
  type: s,
  updateuser: i,
  onCloseUpdate: r,
  handleUpdateUser: c,
}) {
  return e.jsxs(ue, {
    anchor: "right",
    open: n,
    onClose: r,
    slotProps: {
      paper: { sx: { width: 300, border: "none", overflow: "hidden" } },
    },
    children: [
      e.jsxs(O, {
        direction: "row",
        alignItems: "center",
        justifyContent: "space-between",
        sx: { px: 1, py: 2 },
        children: [
          e.jsx(C, { variant: "h6", sx: { ml: 1 }, children: t }),
          e.jsx(U, {
            "data-testid": "updateuser_close_button",
            onClick: r,
            children: e.jsx(y, { icon: "eva:close-fill" }),
          }),
        ],
      }),
      e.jsx(oe, {}),
      e.jsx(ct, { type: s, updateuser: i, handleUpdateUser: c }),
    ],
  });
}
function Mn() {
  const [t, n] = o.useState(null),
    [s, i] = o.useState({ open: !1, type: "" }),
    { user: r, logout: c } = K(),
    { t: a } = z(),
    u = Ue(),
    p = (j) => {
      (g(), i({ open: !0, type: j }));
    },
    l = () => {
      i({ open: !1, type: "" });
    },
    h = () => {
      (g(), u(`${r.home}`));
    },
    d = (j) => {
      n(j.currentTarget);
    },
    g = () => {
      n(null);
    },
    f = (j) =>
      a(
        j === "profile"
          ? "_editprofile_"
          : j === "security"
            ? "_editsecurity_"
            : "_editsettings",
      );
  return e.jsxs(e.Fragment, {
    children: [
      e.jsx(U, {
        "data-testid": "open_account_popover_button",
        onClick: d,
        sx: {
          width: 40,
          height: 40,
          background: (j) => B(j.palette.grey[500], 0.08),
          ...(t && {
            background: (j) =>
              `linear-gradient(135deg, ${j.palette.primary.light} 0%, ${j.palette.primary.main} 100%)`,
          }),
        },
        children: e.jsx(_e, {
          src: `/assets/images/avatars/avatar_${ae(r.userid, 25)}.jpg`,
          alt: r.name,
          sx: {
            width: 36,
            height: 36,
            border: (j) => `solid 2px ${j.palette.background.default}`,
          },
          children: `${r.firstname !== null ? r.firstname : r.alias} ${r.lastname !== null ? r.lastname : r.alias}`,
        }),
      }),
      e.jsxs(ye, {
        open: !!t,
        anchorEl: t,
        onClose: g,
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
        transformOrigin: { vertical: "top", horizontal: "right" },
        marginThreshold: 8,
        slotProps: { paper: { sx: { p: 0, mt: 1, ml: 0.75, width: 200 } } },
        children: [
          e.jsxs(N, {
            sx: { my: 1.5, px: 2 },
            children: [
              e.jsx(C, {
                variant: "subtitle2",
                noWrap: !0,
                children: `${r.firstname !== null ? r.firstname : r.alias} ${r.lastname !== null ? r.lastname : r.alias}`,
              }),
              e.jsx(C, {
                variant: "body2",
                sx: { color: "text.secondary" },
                noWrap: !0,
                children: r.email,
              }),
            ],
          }),
          e.jsx(oe, { sx: { borderStyle: "dashed" } }),
          e.jsxs(
            q,
            {
              "data-testid": "accountpopover_home_item",
              onClick: h,
              children: [
                e.jsx(Ee, { children: e.jsx(y, { icon: "eva:home-fill" }) }),
                e.jsx(Ce, { primary: a("Home") }),
              ],
            },
            "Home",
          ),
          e.jsxs(
            q,
            {
              "data-testid": "accountpopover_profile_item",
              onClick: () => p("profile"),
              children: [
                e.jsx(Ee, { children: e.jsx(y, { icon: "eva:person-fill" }) }),
                e.jsx(Ce, { primary: a("Profile") }),
              ],
            },
            "Profile",
          ),
          e.jsxs(
            q,
            {
              "data-testid": "accountpopover_security_item",
              onClick: () => p("security"),
              children: [
                e.jsx(Ee, { children: e.jsx(y, { icon: "eva:lock-fill" }) }),
                e.jsx(Ce, { primary: a("Security") }),
              ],
            },
            "Security",
          ),
          e.jsxs(
            q,
            {
              "data-testid": "accountpopover_settings_item",
              onClick: () => p("settings"),
              children: [
                e.jsx(Ee, {
                  children: e.jsx(y, { icon: "eva:settings-2-fill" }),
                }),
                e.jsx(Ce, { primary: a("Settings") }),
              ],
            },
            "Settings",
          ),
          e.jsx(oe, { sx: { borderStyle: "dashed", m: 0 } }),
          e.jsx(Q, {
            "data-testid": "accountpopover_logout_button",
            fullWidth: !0,
            color: "inherit",
            variant: "outlined",
            onClick: c,
            startIcon: e.jsx(y, { icon: "formkit:submit" }),
            sx: { color: "error.main", width: "80%", ml: 2, mb: 2 },
            children: a("Logout"),
          }),
        ],
      }),
      e.jsx(Yt, {
        title: f(s.type),
        openUpdate: s.open,
        type: s.type,
        onCloseUpdate: l,
      }),
    ],
  });
}
function Hn() {
  const [t, n] = o.useState(null),
    {
      t: s,
      i18n: { changeLanguage: i, language: r },
    } = z(),
    [c, a] = o.useState(r),
    [u, p] = o.useState(0),
    l = (g, f) => {
      (a(g), p(f), i(g), localStorage.setItem("i18nLanguage", g), d());
    },
    h = (g) => {
      n(g.currentTarget);
    },
    d = () => {
      n(null);
    };
  return e.jsxs(e.Fragment, {
    children: [
      e.jsx(U, {
        "data-testid": "open_language_popover_button",
        onClick: h,
        sx: { width: 40, height: 40, ...(t && { bgcolor: "action.selected" }) },
        children: e.jsx("img", {
          src: `/assets/icons/flags/${c}.svg`,
          alt: s(Te[u].label),
        }),
      }),
      e.jsx(ye, {
        open: !!t,
        anchorEl: t,
        onClose: d,
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
        transformOrigin: { vertical: "top", horizontal: "right" },
        slotProps: { paper: { sx: { p: 0, mt: 1, ml: 0.75, width: 180 } } },
        children: Te.map((g, f) =>
          e.jsxs(
            q,
            {
              selected: g.value === Te[u].value,
              onClick: () => l(g.value, f),
              sx: { typography: "body2", py: 1 },
              children: [
                e.jsx(N, {
                  component: "img",
                  alt: g.label,
                  src: `/assets/icons/flags/${g.value}.svg`,
                  sx: { width: 28, mr: 2 },
                }),
                s(g.label),
              ],
            },
            g.value,
          ),
        ),
      }),
    ],
  });
}
function qn() {
  const [t, n] = o.useState([]),
    s = t.filter((k) => k.isUnread === !0).length,
    [i, r] = o.useState(null),
    { request: c, subscribe: a, unsubscribe: u, send: p } = K(),
    l = o.useRef(v()),
    h = o.useRef(!1),
    { t: d } = z(),
    g = (k) => {
      r(k.currentTarget);
    },
    f = () => {
      r(null);
    },
    j = o.useCallback(
      (k) => {
        const { notification: P } = k.data,
          b = [...t];
        (b.push({
          id: P.id,
          type: P.type,
          title: P.title,
          description: P.notification,
          avatar: null,
          createdAt: new Date(P.ts),
          isUnread: P.isUnread === 1,
        }),
          n(b));
      },
      [t],
    ),
    S = o.useCallback(
      (k) => {
        h.current = !0;
        const P = k.data.notifications.map((b) => ({
          id: b.id,
          type: b.type,
          title: b.title,
          description: b.notification,
          avatar: null,
          createdAt: new Date(b.ts),
          isUnread: b.isUnread === 1,
        }));
        (n(P), P.length === 0 && f());
      },
      [n],
    );
  o.useEffect(() => {
    const k = l.current;
    return (
      h.current ||
        c(
          {
            event: "notifications get all",
            data: {
              source: "Notifications Popover",
              message: "Notifications Popover needs the list of notifications",
            },
          },
          S,
        ),
      a({ subscriptionID: l.current, callback: j, all: !0 }, [
        "notification create",
      ]),
      () => {
        u(k, ["notification create"]);
      }
    );
  }, [S, j, a, u, c]);
  const $ = () => {
      const k = [],
        P = t.map((b) => ((b.isUnread = !1), k.push(b.id), b));
      (n(P),
        p({
          event: "notification update",
          data: {
            source: "Notifications Popover",
            message: "Notifications Popover wants to update notifications",
            ids: k,
          },
        }));
    },
    D = (k) => {
      const P = [],
        b = t.map(
          (I) => (k.id === I.id && ((I.isUnread = !1), P.push(I.id)), I),
        );
      (n(b),
        p({
          event: "notification update",
          data: {
            source: "Notifications Popover",
            message: "Notifications Popover wants to update notifications",
            ids: P,
          },
        }));
    },
    E = (k) => {
      c(
        {
          event: "notification delete",
          data: {
            source: "Notifications Popover",
            message: "Notifications Popover wants to delete a notification",
            ids: [k],
          },
        },
        S,
      );
    };
  return e.jsxs(e.Fragment, {
    children: [
      e.jsx(U, {
        "data-testid": "open_notifications_popover_button",
        color: i ? "primary" : "default",
        onClick: g,
        children: e.jsx(fs, {
          badgeContent: s,
          color: "error",
          children: e.jsx(y, {
            width: 24,
            icon: "solar:bell-bing-bold-duotone",
          }),
        }),
      }),
      e.jsxs(ye, {
        open: !!i,
        anchorEl: i,
        onClose: f,
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
        transformOrigin: { vertical: "top", horizontal: "right" },
        slotProps: { paper: { sx: { mt: 1.5, ml: 0.75, width: 360 } } },
        children: [
          e.jsxs(N, {
            sx: { display: "flex", alignItems: "center", py: 2, px: 2.5 },
            children: [
              e.jsxs(N, {
                sx: { flexGrow: 1 },
                children: [
                  e.jsx(C, {
                    variant: "subtitle1",
                    children: d("Notifications"),
                  }),
                  e.jsx(C, {
                    variant: "body2",
                    sx: { color: "text.secondary" },
                    children: d("_unreadmessages_", { totalUnRead: s }),
                  }),
                ],
              }),
              s > 0 &&
                e.jsx(ee, {
                  title: d("_markallasread_"),
                  children: e.jsx(U, {
                    color: "primary",
                    onClick: $,
                    children: e.jsx(y, { icon: "eva:done-all-fill" }),
                  }),
                }),
            ],
          }),
          e.jsx(oe, { sx: { borderStyle: "dashed" } }),
          e.jsxs(Fe, {
            sx: { height: { xs: 340, sm: "auto" } },
            children: [
              e.jsx(ht, {
                disablePadding: !0,
                subheader: e.jsx(xt, {
                  disableSticky: !0,
                  sx: { py: 1, px: 2.5, typography: "overline" },
                  children: d("Unread"),
                }),
                children: t
                  .filter((k) => k.isUnread === !0)
                  .map((k) =>
                    e.jsx(wt, { notification: k, handleItemClick: D }, v()),
                  ),
              }),
              e.jsx(ht, {
                disablePadding: !0,
                subheader: e.jsx(xt, {
                  disableSticky: !0,
                  sx: { py: 1, px: 2.5, typography: "overline" },
                  children: d("Read"),
                }),
                children: t
                  .filter((k) => k.isUnread === !1)
                  .map((k) =>
                    e.jsx(wt, { notification: k, handleItemDelete: E }, v()),
                  ),
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
function wt({ notification: t, handleItemClick: n, handleItemDelete: s }) {
  const { avatar: i, title: r } = Gn(t);
  return e.jsxs(Tt, {
    onClick: () => {
      t.isUnread && n(t);
    },
    sx: {
      py: 1.5,
      px: 2.5,
      mt: "1px",
      ...(t.isUnread && { bgcolor: "action.selected" }),
    },
    children: [
      e.jsx(bs, {
        children: e.jsx(_e, {
          alt: t.title,
          sx: { bgcolor: "background.neutral" },
          children: i,
        }),
      }),
      e.jsxs(O, {
        direction: "row",
        spacing: 3,
        alignItems: "start",
        justifyContent: "space-between",
        children: [
          e.jsx(Ce, {
            primary: r,
            secondary: e.jsxs(C, {
              variant: "caption",
              sx: {
                mt: 0.5,
                display: "flex",
                alignItems: "center",
                color: "text.disabled",
              },
              children: [
                e.jsx(y, {
                  icon: "eva:clock-outline",
                  sx: { mr: 0.5, width: 16, height: 16 },
                }),
                Bn(t.createdAt),
              ],
            }),
            sx: { maxWidth: 200 },
          }),
          !t.isUnread &&
            e.jsx(U, {
              onClick: () => {
                s(t.id);
              },
              children: e.jsx(y, {
                icon: "eva:trash-2-outline",
                sx: { mr: 2 },
              }),
            }),
        ],
      }),
    ],
  });
}
function Gn(t) {
  const n = e.jsxs(e.Fragment, {
    children: [
      e.jsxs(C, { variant: "subtitle2", children: [t.title, " "] }),
      e.jsx(C, {
        component: "span",
        variant: "body2",
        style: { whiteSpace: "pre-line" },
        sx: { color: "text.secondary" },
        children: t.description,
      }),
    ],
  });
  return t.type === "script-error"
    ? {
        avatar: e.jsx("img", {
          src: "/assets/icons/notification/ic_notification_error.svg",
        }),
        title: n,
      }
    : t.type === "device-offline"
      ? {
          avatar: e.jsx("img", {
            src: "/assets/icons/notification/ic_notification_offline.svg",
          }),
          title: n,
        }
      : null;
}
function Vn({ onOpenNav: t }) {
  const n = Me(),
    s = ze(),
    i = at("up", "lg"),
    r = e.jsxs(e.Fragment, {
      children: [
        !i &&
          e.jsx(U, {
            "data-testid": "nav_open_button",
            onClick: t,
            sx: { mr: 1 },
            children: e.jsx(y, { icon: "eva:menu-2-fill" }),
          }),
        e.jsx(N, { sx: { flexGrow: 1 } }),
        e.jsxs(O, {
          direction: "row",
          alignItems: "center",
          spacing: 1,
          children: [
            (s.pathname === "/dashboard" || s.pathname === "/shellies") &&
              e.jsx(Un, {}),
            e.jsx(Hn, {}),
            e.jsx(qn, {}),
            e.jsx(Mn, {}),
          ],
        }),
      ],
    });
  return e.jsx(_s, {
    sx: {
      boxShadow: "none",
      height: Le.H_MOBILE,
      zIndex: n.zIndex.appBar + 1,
      ...We({ color: n.palette.background.default }),
      transition: n.transitions.create(["height"], {
        duration: n.transitions.duration.shorter,
      }),
      ...(i && {
        width: `calc(100% - ${ke.WIDTH + 1}px)`,
        height: Le.H_DESKTOP,
      }),
    },
    children: e.jsx(tt, { sx: { height: 1, px: { lg: 5 } }, children: r }),
  });
}
function Jn({ children: t }) {
  const [n, s] = o.useState(!1);
  return e.jsxs(e.Fragment, {
    children: [
      e.jsx(Vn, { onOpenNav: () => s(!0) }),
      e.jsxs(N, {
        sx: {
          minHeight: 1,
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
        },
        children: [
          e.jsx(Rn, { openNav: n, onCloseNav: () => s(!1) }),
          e.jsx(Nn, { children: t }),
        ],
      }),
    ],
  });
}
const St = o.lazy(() => me(() => Promise.resolve().then(() => yi), void 0)),
  Ct = o.lazy(() => me(() => Promise.resolve().then(() => Pi), void 0)),
  Kn = o.lazy(() => me(() => Promise.resolve().then(() => Li), void 0)),
  kt = o.lazy(() => me(() => Promise.resolve().then(() => Hi), void 0)),
  Yn = o.lazy(() => me(() => Promise.resolve().then(() => Vi), void 0)),
  Pt = o.lazy(() => me(() => Promise.resolve().then(() => Cr), void 0)),
  Zn = o.lazy(() => me(() => Promise.resolve().then(() => $r), void 0));
function Xn() {
  const { user: t } = K();
  return hs([
    {
      path: "/",
      element:
        window.scconfig.LANDING_PAGE === "login"
          ? e.jsx(kt, {})
          : e.jsx(Yn, {}),
    },
    {
      element: t
        ? e.jsx(Jn, { children: e.jsx(xs, {}) })
        : e.jsx(pt, { to: "/", replace: !0 }),
      children:
        !t || t.roleid === 1
          ? [
              { path: "dashboard", element: e.jsx(St, {}), index: !0 },
              { path: "user", element: e.jsx(Kn, {}) },
              { path: "shellies", element: e.jsx(Pt, {}) },
              { path: "blog", element: e.jsx(Ct, {}) },
            ]
          : [
              { path: "dashboard", element: e.jsx(St, {}), index: !0 },
              { path: "shellies", element: e.jsx(Pt, {}) },
              { path: "blog", element: e.jsx(Ct, {}) },
            ],
    },
    { path: "login", element: e.jsx(kt, {}) },
    { path: "404", element: e.jsx(Zn, {}) },
    { path: "*", element: e.jsx(pt, { to: "/404", replace: !0 }) },
  ]);
}
function Qn() {
  const { pathname: t } = ze();
  return (
    o.useEffect(() => {
      window.scrollTo(0, 0);
    }, [t]),
    null
  );
}
const J = {
    0: "#FFFFFF",
    100: "#F9FAFB",
    200: "#F4F6F8",
    300: "#DFE3E8",
    400: "#C4CDD5",
    500: "#919EAB",
    600: "#637381",
    700: "#454F5B",
    800: "#212B36",
    900: "#161C24",
  },
  Zt = {
    lighter: "#D0ECFE",
    light: "#73BAFB",
    main: "#1877F2",
    dark: "#0C44AE",
    darker: "#042174",
    contrastText: "#FFFFFF",
  },
  Xt = {
    lighter: "#EFD6FF",
    light: "#C684FF",
    main: "#8E33FF",
    dark: "#5119B7",
    darker: "#27097A",
    contrastText: "#FFFFFF",
  },
  Qt = {
    lighter: "#CAFDF5",
    light: "#61F3F3",
    main: "#00B8D9",
    dark: "#006C9C",
    darker: "#003768",
    contrastText: "#FFFFFF",
  },
  es = {
    lighter: "#C8FAD6",
    light: "#5BE49B",
    main: "#00A76F",
    dark: "#007867",
    darker: "#004B50",
    contrastText: "#FFFFFF",
  },
  ts = {
    lighter: "#FFF5CC",
    light: "#FFD666",
    main: "#FFAB00",
    dark: "#B76E00",
    darker: "#7A4100",
    contrastText: J[800],
  },
  ss = {
    lighter: "#FFE9D5",
    light: "#FFAC82",
    main: "#FF5630",
    dark: "#B71D18",
    darker: "#7A0916",
    contrastText: "#FFFFFF",
  },
  ns = { black: "#000000", white: "#FFFFFF" },
  ei = {
    hover: B(J[500], 0.08),
    selected: B(J[500], 0.16),
    disabled: B(J[500], 0.8),
    disabledBackground: B(J[500], 0.24),
    focus: B(J[500], 0.24),
    hoverOpacity: 0.08,
    disabledOpacity: 0.48,
  },
  $t = {
    primary: Zt,
    secondary: Xt,
    info: Qt,
    success: es,
    warning: ts,
    error: ss,
    grey: J,
    common: ns,
    divider: B(J[500], 0.2),
    action: ei,
  };
function ti() {
  return {
    ...$t,
    mode: "light",
    text: { primary: J[800], secondary: J[600], disabled: J[500] },
    background: { paper: "#FFFFFF", default: J[100], neutral: J[200] },
    action: { ...$t.action, active: J[600] },
  };
}
function si() {
  const t = B(J[500], 0.2),
    n = B(J[500], 0.14),
    s = B(J[500], 0.12);
  return [
    "none",
    `0px 2px 1px -1px ${t},0px 1px 1px 0px ${n},0px 1px 3px 0px ${s}`,
    `0px 3px 1px -2px ${t},0px 2px 2px 0px ${n},0px 1px 5px 0px ${s}`,
    `0px 3px 3px -2px ${t},0px 3px 4px 0px ${n},0px 1px 8px 0px ${s}`,
    `0px 2px 4px -1px ${t},0px 4px 5px 0px ${n},0px 1px 10px 0px ${s}`,
    `0px 3px 5px -1px ${t},0px 5px 8px 0px ${n},0px 1px 14px 0px ${s}`,
    `0px 3px 5px -1px ${t},0px 6px 10px 0px ${n},0px 1px 18px 0px ${s}`,
    `0px 4px 5px -2px ${t},0px 7px 10px 1px ${n},0px 2px 16px 1px ${s}`,
    `0px 5px 5px -3px ${t},0px 8px 10px 1px ${n},0px 3px 14px 2px ${s}`,
    `0px 5px 6px -3px ${t},0px 9px 12px 1px ${n},0px 3px 16px 2px ${s}`,
    `0px 6px 6px -3px ${t},0px 10px 14px 1px ${n},0px 4px 18px 3px ${s}`,
    `0px 6px 7px -4px ${t},0px 11px 15px 1px ${n},0px 4px 20px 3px ${s}`,
    `0px 7px 8px -4px ${t},0px 12px 17px 2px ${n},0px 5px 22px 4px ${s}`,
    `0px 7px 8px -4px ${t},0px 13px 19px 2px ${n},0px 5px 24px 4px ${s}`,
    `0px 7px 9px -4px ${t},0px 14px 21px 2px ${n},0px 5px 26px 4px ${s}`,
    `0px 8px 9px -5px ${t},0px 15px 22px 2px ${n},0px 6px 28px 5px ${s}`,
    `0px 8px 10px -5px ${t},0px 16px 24px 2px ${n},0px 6px 30px 5px ${s}`,
    `0px 8px 11px -5px ${t},0px 17px 26px 2px ${n},0px 6px 32px 5px ${s}`,
    `0px 9px 11px -5px ${t},0px 18px 28px 2px ${n},0px 7px 34px 6px ${s}`,
    `0px 9px 12px -6px ${t},0px 19px 29px 2px ${n},0px 7px 36px 6px ${s}`,
    `0px 10px 13px -6px ${t},0px 20px 31px 3px ${n},0px 8px 38px 7px ${s}`,
    `0px 10px 13px -6px ${t},0px 21px 33px 3px ${n},0px 8px 40px 7px ${s}`,
    `0px 10px 14px -6px ${t},0px 22px 35px 3px ${n},0px 8px 42px 7px ${s}`,
    `0px 11px 14px -7px ${t},0px 23px 36px 3px ${n},0px 9px 44px 8px ${s}`,
    `0px 11px 15px -7px ${t},0px 24px 38px 3px ${n},0px 9px 46px 8px ${s}`,
  ];
}
function ni(t) {
  return {
    MuiCssBaseline: {
      styleOverrides: {
        "*": { boxSizing: "border-box" },
        html: {
          margin: 0,
          padding: 0,
          width: "100%",
          height: "100%",
          WebkitOverflowScrolling: "touch",
        },
        body: { margin: 0, padding: 0, width: "100%", height: "100%" },
        "#root": { width: "100%", height: "100%" },
        input: {
          "&[type=number]": {
            MozAppearance: "textfield",
            "&::-webkit-outer-spin-button": {
              margin: 0,
              WebkitAppearance: "none",
            },
            "&::-webkit-inner-spin-button": {
              margin: 0,
              WebkitAppearance: "none",
            },
          },
        },
        img: {
          maxWidth: "100%",
          display: "inline-block",
          verticalAlign: "bottom",
        },
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: { backgroundColor: B(t.palette.grey[900], 0.8) },
        invisible: { background: "transparent" },
      },
    },
    MuiButton: {
      styleOverrides: {
        containedInherit: {
          color: t.palette.common.white,
          backgroundColor: t.palette.grey[800],
          "&:hover": {
            color: t.palette.common.white,
            backgroundColor: t.palette.grey[800],
          },
        },
        sizeLarge: { minHeight: 48 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: t.customShadows.card,
          borderRadius: Number(t.shape.borderRadius) * 2,
          position: "relative",
          zIndex: 0,
        },
      },
    },
    MuiCardHeader: {
      defaultProps: {
        titleTypographyProps: { variant: "h6" },
        subheaderTypographyProps: { variant: "body2" },
      },
      styleOverrides: { root: { padding: t.spacing(3, 3, 0) } },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          [`& .${js.notchedOutline}`]: {
            borderColor: B(t.palette.grey[500], 0.24),
          },
        },
      },
    },
    MuiPaper: { defaultProps: { elevation: 0 } },
    MuiTableCell: {
      styleOverrides: {
        head: {
          color: t.palette.text.secondary,
          backgroundColor: t.palette.background.neutral,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: { backgroundColor: t.palette.grey[800] },
        arrow: { color: t.palette.grey[800] },
      },
    },
    MuiTypography: {
      styleOverrides: {
        paragraph: { marginBottom: t.spacing(2) },
        gutterBottom: { marginBottom: t.spacing(1) },
      },
    },
    MuiMenuItem: { styleOverrides: { root: { ...t.typography.body2 } } },
  };
}
function Z(t) {
  return `${t / 16}rem`;
}
function fe({ sm: t, md: n, lg: s }) {
  return {
    "@media (min-width:600px)": { fontSize: Z(t) },
    "@media (min-width:900px)": { fontSize: Z(n) },
    "@media (min-width:1200px)": { fontSize: Z(s) },
  };
}
const ii = "Public Sans, sans-serif",
  ri = "Barlow, sans-serif",
  oi = {
    fontFamily: ii,
    fontSecondaryFamily: ri,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightSemiBold: 600,
    fontWeightBold: 700,
    h1: {
      fontWeight: 800,
      lineHeight: 80 / 64,
      fontSize: Z(40),
      ...fe({ sm: 52, md: 58, lg: 64 }),
    },
    h2: {
      fontWeight: 800,
      lineHeight: 64 / 48,
      fontSize: Z(32),
      ...fe({ sm: 40, md: 44, lg: 48 }),
    },
    h3: {
      fontWeight: 700,
      lineHeight: 1.5,
      fontSize: Z(24),
      ...fe({ sm: 26, md: 30, lg: 32 }),
    },
    h4: {
      fontWeight: 700,
      lineHeight: 1.5,
      fontSize: Z(20),
      ...fe({ sm: 20, md: 24, lg: 24 }),
    },
    h5: {
      fontWeight: 700,
      lineHeight: 1.5,
      fontSize: Z(18),
      ...fe({ sm: 19, md: 20, lg: 20 }),
    },
    h6: {
      fontWeight: 700,
      lineHeight: 28 / 18,
      fontSize: Z(17),
      ...fe({ sm: 18, md: 18, lg: 18 }),
    },
    subtitle1: { fontWeight: 600, lineHeight: 1.5, fontSize: Z(16) },
    subtitle2: { fontWeight: 600, lineHeight: 22 / 14, fontSize: Z(14) },
    body1: { lineHeight: 1.5, fontSize: Z(16) },
    body2: { lineHeight: 22 / 14, fontSize: Z(14) },
    caption: { lineHeight: 1.5, fontSize: Z(12) },
    overline: {
      fontWeight: 700,
      lineHeight: 1.5,
      fontSize: Z(12),
      textTransform: "uppercase",
    },
    button: {
      fontWeight: 700,
      lineHeight: 24 / 14,
      fontSize: Z(14),
      textTransform: "unset",
    },
  };
function ai() {
  const t = B(J[500], 0.16);
  return {
    z1: `0 1px 2px 0 ${t}`,
    z4: `0 4px 8px 0 ${t}`,
    z8: `0 8px 16px 0 ${t}`,
    z12: `0 12px 24px -4px ${t}`,
    z16: `0 16px 32px -4px ${t}`,
    z20: `0 20px 40px -4px ${t}`,
    z24: `0 24px 48px 0 ${t}`,
    card: `0 0 2px 0 ${B(J[500], 0.08)}, 0 12px 24px -4px ${B(J[500], 0.08)}`,
    dropdown: `0 0 2px 0 ${B(J[500], 0.24)}, -20px 20px 40px -4px ${B(J[500], 0.24)}`,
    dialog: `-40px 40px 80px -8px ${B(ns.black, 0.24)}`,
    primary: `0 8px 16px 0 ${B(Zt.main, 0.24)}`,
    info: `0 8px 16px 0 ${B(Qt.main, 0.24)}`,
    secondary: `0 8px 16px 0 ${B(Xt.main, 0.24)}`,
    success: `0 8px 16px 0 ${B(es.main, 0.24)}`,
    warning: `0 8px 16px 0 ${B(ts.main, 0.24)}`,
    error: `0 8px 16px 0 ${B(ss.main, 0.24)}`,
  };
}
function li({ children: t }) {
  const n = o.useMemo(
      () => ({
        palette: ti(),
        typography: oi,
        shadows: si(),
        customShadows: ai(),
        shape: { borderRadius: 8 },
      }),
      [],
    ),
    s = ys(n);
  return (
    (s.components = ni(s)),
    e.jsxs(vs, { theme: s, children: [e.jsx(ws, {}), t] })
  );
}
function ci() {
  return (
    Qn(),
    e.jsx(Fn, { children: e.jsx(li, { children: e.jsx(Xn, {}) }) })
  );
}
const di = us.createRoot(document.getElementById("root"));
di.render(
  e.jsx(ms, {
    children: e.jsx(gs, {
      children: e.jsx(o.Suspense, { children: e.jsx(ci, {}) }),
    }),
  }),
);
function ui(t) {
  const n = typeof t < "u" ? tn(t).format("0.00a") : "";
  return dt(n, ".00");
}
function Ft(t) {
  const n = typeof t < "u" ? `${((t / 1e3 / 1e3) * 60).toFixed(2)} kw/h` : "";
  return dt(n, "");
}
function Pe(t) {
  const n = typeof t < "u" ? `${((t / 1e3) * 60).toFixed(2)} w/h` : "";
  return dt(n, "");
}
function dt(t, n) {
  return t.includes(n) ? t.replace(n, "") : t;
}
function ut(t, n) {
  let s,
    i = 0,
    r = !1;
  const c = [];
  for (let a = 0; a <= 3; a += 1)
    if (((s = n[`switch:${a}`]), typeof s?.aenergy?.by_minute < "u")) {
      r = !0;
      const u = Number(s.aenergy.by_minute[0]);
      u > 0 && ((i += u), c.push({ label: `${t} switch:${a}`, value: u }));
    }
  if (((s = n["rgbw:0"]), typeof s?.aenergy?.by_minute < "u")) {
    r = !0;
    const a = Number(s.aenergy.by_minute[0]);
    a > 0 && ((i += a), c.push({ label: `${t} rgbw:0`, value: a }));
  }
  return { hasSwitch: r, totalPower: i, powerPerDevice: c };
}
const pi = () => {
    const t = [
        Ss,
        Cs,
        ks,
        Ps,
        $s,
        Fs,
        Ds,
        Is,
        Os,
        Es,
        Rs,
        As,
        Ns,
        Ts,
        Ws,
        Bs,
        Ls,
        Us,
      ],
      n = [900, 700, 500, 300],
      s = [];
    return (
      t.forEach((i) => {
        n.forEach((r) => {
          s.push(i[r]);
        });
      }),
      s
    );
  },
  hi = He(nt)(({ theme: t }) => ({
    "& .apexcharts-canvas": {
      "& .apexcharts-tooltip": {
        ...We({ color: t.palette.background.default }),
        color: t.palette.text.primary,
        boxShadow: t.customShadows.dropdown,
        borderRadius: t.shape.borderRadius * 1.25,
        "&.apexcharts-theme-light": {
          borderColor: "transparent",
          ...We({ color: t.palette.background.default }),
        },
      },
      "& .apexcharts-xaxistooltip": {
        ...We({ color: t.palette.background.default }),
        borderColor: "transparent",
        color: t.palette.text.primary,
        boxShadow: t.customShadows.dropdown,
        borderRadius: t.shape.borderRadius * 1.25,
        "&:before": { borderBottomColor: B(t.palette.grey[500], 0.24) },
        "&:after": { borderBottomColor: B(t.palette.background.default, 0.8) },
      },
      "& .apexcharts-tooltip-title": {
        textAlign: "center",
        fontWeight: t.typography.fontWeightBold,
        backgroundColor: B(t.palette.grey[500], 0.08),
        color:
          t.palette.text[t.palette.mode === "light" ? "secondary" : "primary"],
      },
      "& .apexcharts-legend": { padding: 0 },
      "& .apexcharts-legend-series": {
        display: "inline-flex !important",
        alignItems: "center",
      },
      "& .apexcharts-legend-marker": { marginRight: 8 },
      "& .apexcharts-legend-text": {
        lineHeight: "18px",
        textTransform: "capitalize",
      },
    },
  }));
o.memo(hi);
function Ne({ title: t, subtitle: n, icon: s, sx: i, ...r }) {
  return e.jsxs(xe, {
    component: O,
    spacing: 3,
    direction: "row",
    sx: { px: 3, py: 5, borderRadius: 2, ...i },
    ...r,
    children: [
      s && e.jsx(N, { sx: { width: 64, height: 64 }, children: s }),
      e.jsxs(O, {
        spacing: 0.5,
        children: [
          e.jsx(C, { variant: "h5", children: t }),
          e.jsx(C, {
            variant: "subtitle2",
            sx: { color: "text.disabled" },
            children: n,
          }),
        ],
      }),
    ],
  });
}
function xi(t) {
  let n = 0,
    s = 0,
    i = 0,
    r = 0,
    c = 0,
    a = [];
  const u = [];
  let p = { totalPower: 0, powerPerDevice: [] };
  return (
    Object.values(t).forEach((l) => {
      const h = l?.wsmessages?.NotifyFullStatus?.params;
      if (
        (l.online && (i += 1),
        typeof h < "u" &&
          ((p = ut(l.cname, h)),
          p.totalPower > 0 && u.push(l.chartColor),
          (a = a.concat(p.powerPerDevice)),
          (c += p.totalPower),
          typeof h?.cloud?.connected < "u" && h.cloud.connected && (r += 1),
          typeof l.scripts < "u"))
      ) {
        let d;
        Object.values(l.scripts).forEach((g) => {
          ((d = h[`script:${g.id}`]),
            d !== "undefined" &&
              ((n += 1), d.running && (s += 1), (g.running = d.running)));
        });
      }
    }),
    {
      currentPower: c,
      powerPerDevice: a,
      colorPerDevice: u,
      scriptsRunning: s,
      scriptsCount: n,
      cloudCount: r,
      onlineCount: i,
    }
  );
}
function gi({ title: t, subheader: n, colors: s, powerPerDevice: i, ...r }) {
  const c = Me(),
    a = [],
    u = [];
  i.forEach((l) => {
    (a.push(l.label), u.push(l.value));
  });
  const p = {
    chart: { id: "current-consumption" },
    labels: a,
    stroke: { colors: [c.palette.background.paper] },
    legend: { show: !0, position: "bottom" },
    colors: s,
    dataLabels: { enabled: !0, dropShadow: { enabled: !1 } },
    tooltip: {
      fillSeriesColor: !1,
      shared: !0,
      intersect: !1,
      y: { formatter: (l) => (typeof l < "u" ? Pe(l) : l) },
    },
  };
  return e.jsxs(xe, {
    ...r,
    children: [
      e.jsx(st, { title: t, subheader: n, sx: { mb: 5 } }),
      e.jsx(nt, {
        "data-testid": "chart_current_component",
        type: "pie",
        series: u,
        options: p,
        width: "100%",
        height: 280,
      }),
    ],
  });
}
function mi({
  title: t,
  subheader: n,
  chart: s,
  handleTimelineChange: i,
  selection: r,
  ...c
}) {
  const { labels: a, colors: u, series: p, timeline: l, maxConsumption: h } = s,
    { t: d } = z(),
    g = {
      colors: u,
      legend: { show: !0, position: "bottom", showForSingleSeries: !0 },
      plotOptions: { bar: { columnWidth: "28%" } },
      chart: { stacked: l.data !== "Minute", zoom: { enabled: !1 } },
      yaxis: {
        labels: {
          formatter(f) {
            return l.data === "Minute"
              ? (h / 1e3) * 60 < 1e3
                ? Pe(f)
                : Ft(f)
              : h / 1e3 < 1e3
                ? `${(f / 1e3).toFixed(2)} w/h`
                : `${(f / 1e3 / 1e3).toFixed(2)} kw/h`;
          },
        },
        forceNiceScale: !0,
      },
      xaxis: {
        type: "datetime",
        labels: {
          formatter: (f, j) => (typeof f < "u" ? Kt(j, l.format) : f),
          datetimeUTC: !1,
        },
      },
      stroke: { width: 5, curve: "smooth", lineCap: "round" },
      tooltip: {
        shared: !1,
        followCursor: !0,
        intersect: l.data !== "Minute",
        x: { show: !0, format: l.format || "undefined" },
        y: {
          formatter(f) {
            return l.data === "Minute"
              ? (h / 1e3) * 60 < 9e3
                ? Pe(f)
                : Ft(f)
              : h / 1e3 < 9e3
                ? `${(f / 1e3).toFixed(2)} w/h`
                : `${(f / 1e3 / 1e3).toFixed(2)} kw/h`;
          },
        },
      },
    };
  return e.jsxs(xe, {
    ...c,
    children: [
      e.jsx(st, {
        title: t,
        subheader: n,
        action: e.jsx($e, {
          sx: { m: 1, minWidth: 120 },
          size: "small",
          children: e.jsxs(zs, {
            value: r,
            onChange: i,
            children: [
              e.jsx(q, { value: "0", children: d("_byminute_") }),
              e.jsx(q, { value: "1", children: d("_byhour_") }),
              e.jsx(q, { value: "2", children: d("_byday_") }),
              e.jsx(q, { value: "3", children: d("_bymonth_") }),
              e.jsx(q, { value: "4", children: d("_byyear_") }),
            ],
          }),
        }),
      }),
      e.jsx(N, {
        sx: { p: 3, pb: 1 },
        children: e.jsx(nt, {
          "data-testid": "chart_timeline_component",
          dir: "ltr",
          type: p[0].type,
          series: p,
          options: g,
          width: "100%",
          height: 364,
        }),
      }),
    ],
  });
}
function fi(t) {
  const n = {};
  switch (t) {
    case 1:
      ((n.data = "Hour"),
        (n.format = "HH:00"),
        (n.catformat = "yyyy-MM-dd HH:00"));
      break;
    case 2:
      ((n.data = "Day"), (n.format = "dd.MM"), (n.catformat = "yyyy-MM-dd"));
      break;
    case 3:
      ((n.data = "Month"), (n.format = "MMM.yyyy"), (n.catformat = "yyyy-MM"));
      break;
    case 4:
      ((n.data = "Year"), (n.format = "yyyy"), (n.catformat = "yyyy"));
      break;
    default:
      ((n.data = "Minute"),
        (n.format = "HH:mm"),
        (n.catformat = "yyyy-MM-dd HH:mm"));
  }
  return n;
}
function bi(t, n, s) {
  const i = [],
    r = [],
    c = [],
    a = [];
  let u = 0;
  return (
    n.forEach((p, l) => {
      p.consumption > u && (u = p.consumption);
      const h = Qe(p.ts, s.catformat);
      i.includes(h) || i.push(h);
      const d = c.indexOf(p.device_id);
      if (d === -1) {
        const g = t.findIndex((f) => f.id === p.device_id);
        g !== -1
          ? (c.push(p.device_id),
            a.push(t[g].chartColor),
            r.push({
              name: t[g].cname,
              type: s.data === "Minute" ? "line" : "bar",
              data: [{ x: h, y: p.consumption }],
            }))
          : console.error(`Could not find device with id ${p.device_id}`);
      } else {
        if (s.data === "Minute" && n[l - 1].device_id === p.device_id) {
          let g = n[l - 1].ts;
          for (; p.ts - g >= 120; ) {
            const f = Qe(g + 60, s.catformat);
            (r[d].data.push({ x: f, y: null }), (g = g + 60));
          }
        }
        r[d].data.push({ x: h, y: p.consumption });
      }
    }),
    { labels: i, series: r, colors: a, maxConsumption: u }
  );
}
function _i() {
  const [t, n] = o.useState(0),
    [s, i] = o.useState({ running: 0, count: 0 }),
    [r, c] = o.useState(0),
    [a, u] = o.useState([]),
    [p, l] = o.useState([]),
    [h, d] = o.useState({ online: 0, count: 0 }),
    [g, f] = o.useState({
      labels: [],
      colors: [],
      series: [],
      timeline: {},
      maxConsumption: 0,
    }),
    [j, S] = o.useState([]),
    { t: $ } = z(),
    [D, E] = o.useState(0),
    k = o.useRef({
      data: "Minute",
      format: "HH:mm",
      catformat: "yyyy-MM-dd HH:mm",
    }),
    { user: P, request: b, subscribe: I, unsubscribe: R } = K(),
    m = pi(),
    w = o.useRef(v()),
    x = o.useRef(!1),
    _ = o.useCallback(
      (G) => {
        let M;
        if (j.length !== 0) M = j;
        else if (typeof G.data.devices < "u") M = G.data.devices;
        else return;
        M = M.map((ce, de) => ((ce.chartColor = m[ae(de + 1, m.length)]), ce));
        const { rows: ie } = G.data,
          te = bi(M, ie, k.current);
        M.length > 0 &&
          f({
            labels: te.labels,
            colors: te.colors,
            series: te.series,
            timeline: k.current,
            maxConsumption: te.maxConsumption,
          });
      },
      [j, m],
    ),
    F = o.useCallback(
      (G) => {
        S(G);
        const M = xi(G);
        (i({ running: M.scriptsRunning, count: M.scriptsCount }),
          c(M.cloudCount),
          u(M.colorPerDevice),
          l(M.powerPerDevice),
          n(M.currentPower),
          d({ online: M.onlineCount, count: G.length }),
          x.current &&
            b(
              {
                event: `getTimeline${k.current.data}`,
                data: {
                  source: "App View",
                  message: "App View needs timeline for a device",
                },
              },
              _,
            ));
      },
      [b, _],
    ),
    T = o.useCallback(
      (G) => {
        const M = G.data.device;
        if (G.event === "ShellyUpdate" && G.type === "ws") {
          const ie = j.map((te, ce) => {
            if (te.id === M.id) {
              x.current = !0;
              const de = M?.wsmessages?.NotifyFullStatus?.params;
              return (
                typeof M < "u" &&
                  typeof de < "u" &&
                  ut(M.cname, de).totalPower === 0 &&
                  (x.current = !1),
                (M.chartColor = m[ae(ce + 1, m.length)]),
                M
              );
            }
            return te;
          });
          F(ie);
        }
      },
      [F, j, m],
    ),
    Y = o.useCallback(
      (G) => {
        (_(G), F(G.data.devices));
      },
      [F, _],
    );
  o.useEffect(() => {
    const G = w.current;
    return (
      j.length === 0 &&
        b(
          {
            event: "devices timeline get",
            data: {
              source: "App View",
              message: "App View needs the list of devices and the timeline",
            },
          },
          Y,
        ),
      I({ subscriptionID: G, callback: T, all: !0 }, ["ShellyUpdate"]),
      () => {
        R(G, ["ShellyUpdate"]);
      }
    );
  }, [j, Y, T, R, I, b]);
  const ne = (G) => {
    const M = Number(G.target.value);
    (E(M),
      (k.current = fi(M)),
      b(
        {
          event: `getTimeline${k.current.data}`,
          data: {
            source: "App View",
            message: "App View needs timeline for a device",
          },
        },
        _,
      ));
  };
  return j.length === 0
    ? null
    : e.jsxs(ve, {
        maxWidth: "xl",
        children: [
          e.jsx(C, {
            variant: "h4",
            children: `${$("_welcome_")} ${P.firstname !== null ? P.firstname : P.alias}`,
          }),
          e.jsxs(se, {
            container: !0,
            spacing: 3,
            children: [
              e.jsx(se, {
                size: { xs: 12, sm: 6, md: 3 },
                children: e.jsx(Ne, {
                  "data-testid": "dashboard_shellies_component",
                  title: `${h.online}/${h.count}`,
                  subtitle: `Shellies ${$("Connected")}`,
                  color: "success",
                  icon: e.jsx("img", {
                    alt: "icon",
                    src: "/assets/icons/overview/S-Shelly-Icon.svg",
                  }),
                }),
              }),
              e.jsx(se, {
                size: { xs: 12, sm: 6, md: 3 },
                children: e.jsx(Ne, {
                  "data-testid": "dashboard_totalconsumption_component",
                  title: Pe(t),
                  subtitle: $("_consumption_"),
                  color: "info",
                  icon: e.jsx("img", {
                    alt: "icon",
                    src: "/assets/icons/overview/consumption.svg",
                  }),
                }),
              }),
              e.jsx(se, {
                size: { xs: 12, sm: 6, md: 3 },
                children: e.jsx(Ne, {
                  "data-testid": "dashboard_scripts_component",
                  title: `${s.running}/${s.count}`,
                  subtitle: $("Running"),
                  color: "success",
                  icon: e.jsx("img", {
                    alt: "icon",
                    src: "/assets/icons/overview/script.svg",
                  }),
                }),
              }),
              e.jsx(se, {
                size: { xs: 12, sm: 6, md: 3 },
                children: e.jsx(Ne, {
                  "data-testid": "dashboard_cloud_component",
                  title: ui(r),
                  subtitle: $("Connected"),
                  color: "error",
                  icon: e.jsx("img", {
                    alt: "icon",
                    src: "/assets/icons/overview/cloud.svg",
                  }),
                }),
              }),
              e.jsx(se, {
                size: { xs: 12, sm: 12, md: 12, lg: 12 },
                children: e.jsx(gi, {
                  "data-testid": "dashboard_current_consumption_component",
                  title: $("_consumption_"),
                  subheader: $("_perShelly_"),
                  colors: a,
                  powerPerDevice: p,
                }),
              }),
              e.jsx(se, {
                size: { xs: 12, sm: 12, md: 12, lg: 12 },
                children: e.jsx(mi, {
                  "data-testid": "dashboard_timeline_component",
                  title: "Timeline",
                  subheader: $("_perShelly_"),
                  chart: g,
                  handleTimelineChange: ne,
                  selection: D,
                }),
              }),
            ],
          }),
        ],
      });
}
function ji() {
  const { user: t } = K();
  return e.jsxs(e.Fragment, {
    children: [
      e.jsx(he, { children: e.jsx("title", { children: " Dashboard" }) }),
      t ? e.jsx(_i, {}) : null,
    ],
  });
}
const yi = Object.freeze(
  Object.defineProperty({ __proto__: null, default: ji }, Symbol.toStringTag, {
    value: "Module",
  }),
);
function vi({ handleContentChange: t, content: n }) {
  const { t: s } = z(),
    i = {
      editor: { editor: "Editor", preview: s("_editor-preview_") },
      toolbar: {
        bold: s("_editor-bold_"),
        italic: s("_editor-italic_"),
        strike: s("_editor-strike_"),
        underline: s("_editor-underline_"),
        link: s("_editor-link_"),
        bulletList: s("_editor-bulletlist_"),
        orderedList: s("_editor-orderedlist_"),
        alignLeft: s("_editor-alignleft_"),
        alignCenter: s("_editor-aligncenter_"),
        alignRight: s("_editor-alignright_"),
        alignJustify: s("_editor-alignjustify_"),
        blockquote: s("_editor-blockquote_"),
        codeBlock: s("_editor-codeblock_"),
        color: s("_editor-color_"),
        undo: s("_editor-undo_"),
        redo: s("_editor-redo_"),
      },
      headings: {
        normalText: s("_editor-normaltext_"),
        h1: s("_editor-h1_"),
        h2: s("_editor-h2_"),
        h3: s("_editor-h3_"),
        h4: s("_editor-h4_"),
        h5: s("_editor-h5_"),
        h6: s("_editor-h6_"),
      },
    };
  return e.jsxs("div", {
    children: [
      e.jsx(sn, {
        id: "override-labels",
        value: n,
        onChange: t,
        placeholder: s("_editor-placeholder_"),
        disableTabs: !0,
        toolbarPosition: "top",
        customLabels: i,
        withBubbleMenu: !1,
      }),
      e.jsx("div", { "data-testid": "blogpost_content_component" }),
    ],
  });
}
const is = ({
  type: t,
  handleUpdatePost: n,
  updatepost: s,
  handleBlogpostsReceived: i,
}) => {
  const { user: r, request: c } = K(),
    [a, u] = o.useState(
      t === "update" ? s : { title: "", content: "", public: 0 },
    ),
    { t: p } = z(),
    [l, h] = o.useState({ success: !0, message: "" }),
    d = (D) => {
      (h({ success: D.data.success, message: D.data.message }),
        D.data.success && i(D));
    },
    g = (D) => {
      (h({ success: D.data.success, message: D.data.message }),
        D.data.success && n(a));
    },
    f = ({ target: D }) => {
      const E = { ...a };
      (D.name === "public"
        ? (E.public = D.checked ? 1 : 0)
        : (E[D.name] = D.value),
        u(E));
    },
    j = (D) => {
      const E = { ...a };
      ((E.content = D), u(E));
    },
    S = (D) => {
      if ((D.preventDefault(), t === "create")) {
        const E = { ...a };
        ((E.userid = r.userid),
          (E.createdAt = Date.now()),
          u(E),
          c(
            {
              event: "blogpost create",
              data: {
                source: "Blogpost Form",
                message: "Blogpost Form wants to create a new post",
                blogpost: E,
              },
            },
            d,
          ));
      } else
        t === "update" &&
          c(
            {
              event: "blogpost update",
              data: {
                source: "Blogpost Form",
                message: "Blogpost Form wants to update a post",
                blogpost: a,
              },
            },
            g,
          );
    },
    $ = () =>
      typeof a.title > "u" ||
      a.title.length === 0 ||
      typeof a.content > "u" ||
      a.content.length === 0 ||
      pe(s, a);
  return e.jsx("form", {
    onSubmit: S,
    children: e.jsx($e, {
      fullWidth: !0,
      size: "subtitle2",
      children: e.jsxs(O, {
        spacing: 3,
        sx: { px: 3, py: 3 },
        children: [
          e.jsxs(O, {
            direction: "row",
            spacing: 3,
            children: [
              e.jsx(X, {
                required: !0,
                value: a.title,
                name: "title",
                label: p("Title"),
                slotProps: {
                  htmlInput: {
                    "data-testid": "blogpost_title_input",
                    maxLength: 40,
                  },
                },
                onChange: f,
                sx: { width: 280 },
              }),
              e.jsx(je, {
                control: e.jsx(Ms, {
                  name: "public",
                  size: "medium",
                  checked: a.public === 1,
                  onChange: f,
                }),
                label: "Public",
                labelPlacement: "bottom",
              }),
            ],
          }),
          e.jsx(vi, { handleContentChange: j, content: a.content }),
          e.jsx(C, {
            variant: "subtitle2",
            color: l.success ? "success" : "error",
            children: p(l.message),
          }),
          e.jsx(Q, {
            disabled: $(),
            fullWidth: !0,
            size: "large",
            type: "submit",
            color: "inherit",
            variant: "outlined",
            startIcon: e.jsx(y, { icon: "formkit:submit" }),
            children: p("Save"),
          }),
        ],
      }),
    }),
  });
};
function wi({
  openUpdate: t,
  updatepost: n,
  onCloseUpdate: s,
  handleUpdatePost: i,
}) {
  const { t: r } = z();
  return e.jsxs(ue, {
    anchor: "right",
    open: t,
    onClose: s,
    slotProps: {
      paper: { sx: { width: 1, border: "none", overflow: "auto" } },
    },
    children: [
      e.jsxs(O, {
        direction: "row",
        alignItems: "center",
        justifyContent: "space-between",
        sx: { px: 1, py: 2 },
        children: [
          e.jsx(C, { variant: "h6", sx: { ml: 1 }, children: r("_editpost_") }),
          e.jsx(U, {
            onClick: s,
            children: e.jsx(y, { icon: "eva:close-fill" }),
          }),
        ],
      }),
      e.jsx(oe, {}),
      e.jsx(is, { type: "update", handleUpdatePost: i, updatepost: n }),
    ],
  });
}
function rs({ blogpost: t, index: n, handleDeletePost: s }) {
  const [i, r] = o.useState(null),
    [c, a] = o.useState(!1),
    [u, p] = o.useState(!1),
    [l, h] = o.useState(!1),
    [d, g] = o.useState(t),
    { t: f } = z(),
    { user: j } = K(),
    S = n === 0,
    $ = n === 1 || n === 2,
    D = (_) => {
      const F = { ...d };
      ((F.title = _.title),
        (F.content = _.content),
        (F.public = _.public),
        g(F));
    },
    E = (_) => {
      (r(_.currentTarget), h(!1));
    },
    k = () => {
      r(null);
    },
    P = () => {
      a(!1);
    },
    b = () => {
      (a(!0), r(null));
    },
    I = () => {
      h(!0);
    },
    R = e.jsx(ee, {
      title: d.author.name,
      children: e.jsx(_e, {
        alt: d.author.name,
        src: d.author.avatarUrl,
        sx: {
          zIndex: 9,
          width: 32,
          height: 32,
          position: "absolute",
          left: (_) => _.spacing(3),
          bottom: (_) => _.spacing(-2),
          ...((S || $) && {
            zIndex: 9,
            top: 24,
            left: 24,
            width: 40,
            height: 40,
          }),
        },
      }),
    }),
    m = e.jsx(N, {
      sx:
        S || $ ? { position: "absolute", top: 80, left: 25 } : { pl: 3, pt: 4 },
      children: e.jsxs(O, {
        children: [
          e.jsx(C, {
            variant: "caption",
            component: "div",
            sx: {
              mb: 2,
              color: "text.disabled",
              ...((S || $) && { opacity: 0.48, color: "common.white" }),
            },
            children: Wn(d.createdAt),
          }),
          e.jsxs(O, {
            direction: "row",
            spacing: 2,
            children: [
              e.jsx(C, {
                color: "inherit",
                variant: "subtitle2",
                sx: {
                  height: 44,
                  overflow: "hidden",
                  WebkitLineClamp: 2,
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  ...(S && { typography: "h5", height: 60 }),
                  ...((S || $) && { color: "common.white" }),
                },
                children: d.title,
              }),
              e.jsx(ee, {
                title: f(u ? "showmin" : "_showall_"),
                children: e.jsx(y, {
                  icon: "mdi:text-box",
                  onClick: () => p(!u),
                  sx: {
                    cursor: "pointer",
                    ...((S || $) && { color: "white" }),
                  },
                }),
              }),
            ],
          }),
          e.jsx(C, {
            variant: "caption",
            color: "inherit",
            sx: { ...((S || $) && { color: "common.white" }) },
            children: e.jsx(N, {
              sx: {
                display: "flex",
                width: 1,
                overflowX: "auto",
                overflowY: "auto",
              },
              children: e.jsx(nn, {
                value: u ? d.content : `${d.content.substring(0, 150)}...`,
              }),
            }),
          }),
        ],
      }),
    }),
    w = e.jsx(N, {
      component: "img",
      alt: d.title,
      src: d.cover,
      sx: {
        top: 0,
        width: 1,
        height: 1,
        objectFit: "cover",
        position: "absolute",
      },
    }),
    x = e.jsx(Jt, {
      color: "paper",
      src: "/assets/icons/shape-avatar.svg",
      sx: {
        width: 80,
        height: 36,
        zIndex: 9,
        bottom: -15,
        position: "absolute",
        color: "background.paper",
        ...((S || $) && { display: "none" }),
      },
    });
  return e.jsxs(se, {
    size: u
      ? { xs: 12, sm: 12, md: 12 }
      : { xs: 12, sm: S ? 12 : 6, md: S ? 6 : 3 },
    children: [
      e.jsxs(xe, {
        children: [
          e.jsxs(N, {
            sx: {
              position: "relative",
              pt: "calc(100% * 3 / 4)",
              ...((S || $) && {
                pt: "calc(100% * 4 / 3)",
                "&:after": {
                  top: 0,
                  content: "''",
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  bgcolor: (_) => B(_.palette.grey[900], 0.72),
                },
              }),
              ...(S && {
                pt: { xs: "calc(100% * 4 / 3)", sm: "calc(100% * 3 / 4.66)" },
              }),
            },
            children: [
              j !== null &&
                j.roleid < 3 &&
                e.jsx(U, {
                  onClick: E,
                  sx: {
                    zIndex: 9,
                    position: "absolute",
                    top: 24,
                    right: 20,
                    width: 40,
                    height: 40,
                  },
                  children: e.jsx(y, {
                    icon: "eva:more-vertical-fill",
                    color: "white",
                  }),
                }),
              x,
              R,
              w,
            ],
          }),
          m,
        ],
      }),
      j !== null &&
        j.roleid < 3 &&
        e.jsxs(ye, {
          open: !!i,
          anchorEl: i,
          onClose: k,
          anchorOrigin: { vertical: "top", horizontal: "left" },
          transformOrigin: { vertical: "top", horizontal: "right" },
          slotProps: { paper: { sx: { width: 200 } } },
          children: [
            e.jsxs(q, {
              onClick: b,
              children: [
                e.jsx(y, { icon: "eva:edit-fill", sx: { mr: 2 } }),
                f("Edit"),
              ],
            }),
            !l &&
              e.jsxs(q, {
                onClick: I,
                sx: { color: "error.main" },
                children: [
                  e.jsx(y, { icon: "eva:trash-2-outline", sx: { mr: 2 } }),
                  f("Delete"),
                ],
              }),
            l &&
              e.jsxs(q, {
                onClick: s,
                sx: { color: "error.main" },
                children: [
                  e.jsx(y, {
                    icon: "eva:question-mark-circle-outline",
                    sx: { mr: 2 },
                  }),
                  f("_reallydelete_"),
                ],
              }),
          ],
        }),
      e.jsx(wi, {
        title: f("_editpost_"),
        openUpdate: c,
        type: "update",
        updatepost: d,
        onCloseUpdate: P,
        handleUpdatePost: D,
      }),
    ],
  });
}
function Si({
  openCreate: t,
  onOpenCreate: n,
  onCloseCreate: s,
  handleBlogpostsReceived: i,
}) {
  const { t: r } = z();
  return e.jsxs(e.Fragment, {
    children: [
      e.jsx(Q, {
        "data-testid": "blog_newblog_button",
        variant: "contained",
        color: "inherit",
        startIcon: e.jsx(y, { icon: "eva:plus-fill" }),
        onClick: n,
        children: r("_newpost_"),
      }),
      e.jsxs(ue, {
        anchor: "right",
        open: t,
        onClose: s,
        slotProps: {
          paper: { sx: { width: 1, border: "none", overflow: "auto" } },
        },
        children: [
          e.jsxs(O, {
            direction: "row",
            alignItems: "center",
            justifyContent: "space-between",
            sx: { px: 1, py: 2 },
            children: [
              e.jsx(C, {
                variant: "h6",
                sx: { ml: 1 },
                children: r("_newpost_"),
              }),
              e.jsx(U, {
                "data-testid": "blogpost_close_button",
                onClick: s,
                children: e.jsx(y, { icon: "eva:close-fill" }),
              }),
            ],
          }),
          e.jsx(oe, {}),
          e.jsx(is, { type: "create", handleBlogpostsReceived: i }),
        ],
      }),
    ],
  });
}
function Ci() {
  const [t, n] = o.useState([]),
    { request: s, user: i } = K(),
    r = o.useRef(!1),
    [c, a] = o.useState(!1),
    u = o.useCallback(
      (d) => {
        r.current = !0;
        const g = d.data.blogposts.map((f, j) => ({
          id: f.blogpostid,
          cover: `/assets/images/covers/cover_${ae(j + 1, 24)}.jpg`,
          title: f.title,
          content: f.content,
          createdAt: f.createdAt,
          public: f.public,
          author: {
            name: f.alias,
            avatarUrl: `/assets/images/avatars/avatar_${ae(f.userid, 25)}.jpg`,
          },
        }));
        n(g);
      },
      [n],
    );
  o.useEffect(() => {
    r.current ||
      s(
        {
          event: "blogposts-get-all",
          data: {
            source: "Blog View",
            message: "Blog View  needs the list of blogposts",
          },
        },
        u,
      );
  }, [u, s]);
  const p = () => {
      a(!0);
    },
    l = () => {
      a(!1);
    },
    h = (d) => {
      s(
        {
          event: "blogpost delete",
          data: {
            source: "Blog View",
            message: "Blog View wants to delete a post",
            ids: [d],
          },
        },
        u,
      );
    };
  return e.jsxs(ve, {
    children: [
      e.jsxs(O, {
        direction: "row",
        alignItems: "center",
        justifyContent: "space-between",
        mb: 5,
        children: [
          e.jsx(C, { variant: "h4", children: "Blog" }),
          i.roleid < 3 &&
            e.jsx(Si, {
              openCreate: c,
              onOpenCreate: p,
              onCloseCreate: l,
              handleBlogpostsReceived: u,
            }),
        ],
      }),
      e.jsx(se, {
        container: !0,
        spacing: 3,
        children: t.map((d, g) =>
          e.jsx(
            rs,
            { blogpost: d, index: g, handleDeletePost: () => h(d.id) },
            v(),
          ),
        ),
      }),
    ],
  });
}
function ki() {
  const { user: t } = K();
  return e.jsxs(e.Fragment, {
    children: [
      e.jsx(he, { children: e.jsx("title", { children: " Blog" }) }),
      t ? e.jsx(Ci, {}) : null,
    ],
  });
}
const Pi = Object.freeze(
  Object.defineProperty({ __proto__: null, default: ki }, Symbol.toStringTag, {
    value: "Module",
  }),
);
function $i(t, n) {
  return t.sort((s, i) => s[n] - i[n]);
}
function Fi(t, n) {
  return t.sort((s, i) => s[n].localeCompare(i[n]));
}
function Dt(t, n, s) {
  return t[s] === null
    ? 1
    : n[s] === null || n[s] < t[s]
      ? -1
      : n[s] > t[s]
        ? 1
        : 0;
}
function os(t, n) {
  return t === "desc" ? (s, i) => Dt(s, i, n) : (s, i) => -Dt(s, i, n);
}
function Di({ inputData: t, comparator: n, filterName: s, field: i }) {
  const r = t.map((c, a) => [c, a]);
  return (
    r.sort((c, a) => {
      const u = n(c[0], a[0]);
      return u !== 0 ? u : c[1] - a[1];
    }),
    (t = r.map((c) => c[0])),
    s &&
      (t = t.filter((c) => c[i].toLowerCase().indexOf(s.toLowerCase()) !== -1)),
    t
  );
}
function as(t, n, s) {
  return t > 0 ? Math.max(0, (1 + t) * n - s) : 0;
}
function Ii({
  openCreate: t,
  onOpenCreate: n,
  onCloseCreate: s,
  handleUsersReceived: i,
}) {
  const { t: r } = z();
  return e.jsxs(e.Fragment, {
    children: [
      e.jsx(Q, {
        "data-testid": "users_newuser_button",
        variant: "contained",
        color: "inherit",
        startIcon: e.jsx(y, { icon: "eva:plus-fill" }),
        onClick: n,
        children: r("_newuser_"),
      }),
      e.jsxs(ue, {
        anchor: "right",
        open: t,
        onClose: s,
        slotProps: {
          paper: { sx: { width: 300, border: "none", overflow: "hidden" } },
        },
        children: [
          e.jsxs(O, {
            direction: "row",
            alignItems: "center",
            justifyContent: "space-between",
            sx: { px: 1, py: 2 },
            children: [
              e.jsx(C, {
                variant: "h6",
                sx: { ml: 1 },
                children: r("_newuser_"),
              }),
              e.jsx(U, {
                "data-testid": "createuser_close_button",
                onClick: s,
                children: e.jsx(y, { icon: "eva:close-fill" }),
              }),
            ],
          }),
          e.jsx(oe, {}),
          e.jsx(ct, { type: "create", handleUsersReceived: i }),
        ],
      }),
    ],
  });
}
function Oi({ query: t }) {
  const { t: n } = z();
  return e.jsx(ge, {
    children: e.jsx(H, {
      align: "center",
      colSpan: 6,
      sx: { py: 3 },
      children: e.jsxs(Wt, {
        sx: { textAlign: "center" },
        children: [
          e.jsx(C, { variant: "h6", paragraph: !0, children: n("_notfound_") }),
          e.jsxs(C, {
            variant: "body2",
            children: [
              n("_noresultsfor_"),
              "  ",
              e.jsxs("strong", { children: ['"', t, '"'] }),
              ".",
            ],
          }),
        ],
      }),
    }),
  });
}
function Ei({
  updateuser: t,
  openDevices: n,
  onCloseDevices: s,
  devices: i,
  userDevices: r,
  handleUserDeviceChange: c,
  handleDevicesSubmit: a,
  requestResult: u,
  isChanged: p,
}) {
  const { t: l } = z();
  return e.jsxs(ue, {
    anchor: "right",
    open: n,
    onClose: s,
    slotProps: {
      paper: { sx: { width: 300, border: "none", overflow: "hidden" } },
    },
    children: [
      e.jsxs(O, {
        direction: "row",
        alignItems: "center",
        justifyContent: "space-between",
        sx: { px: 1, py: 2 },
        children: [
          e.jsx(C, {
            variant: "h6",
            sx: { ml: 1 },
            children: `${t.firstname} ${t.lastname}`,
          }),
          e.jsx(U, {
            onClick: s,
            children: e.jsx(y, { icon: "eva:close-fill" }),
          }),
        ],
      }),
      e.jsx(oe, {}),
      e.jsx($e, {
        fullWidth: !0,
        size: "subtitle2",
        sx: { maxHeight: "calc(100% - 180px)" },
        children: e.jsx(Fe, {
          children: e.jsx(O, {
            spacing: 0.2,
            children: i.map((h) =>
              e.jsx(
                je,
                {
                  value: h.id,
                  control: e.jsx(le, { checked: r.includes(h.id) }),
                  onChange: () => c(h.id),
                  label: h.cname,
                },
                h.id,
              ),
            ),
          }),
        }),
      }),
      e.jsx(C, {
        variant: "subtitle2",
        color: u.success ? "success" : "error",
        sx: { my: 2, mx: 2 },
        children: l(u.message),
      }),
      e.jsx(Q, {
        disabled: !p,
        size: "large",
        onClick: a,
        color: "inherit",
        variant: "outlined",
        startIcon: e.jsx(y, { icon: "formkit:submit" }),
        sx: { mb: 5, mx: 2 },
        children: l("Save"),
      }),
    ],
  });
}
function Ri({
  userid: t,
  uuid: n,
  appUser: s,
  selected: i,
  alias: r,
  avatarUrl: c,
  firstname: a,
  lastname: u,
  roleid: p,
  role: l,
  email: h,
  home: d,
  handleClick: g,
  handleDeleteUser: f,
  handleUpdateUser: j,
  devices: S,
}) {
  const [$, D] = o.useState(null),
    [E, k] = o.useState(!1),
    { t: P } = z(),
    [b, I] = o.useState({ open: !1, type: "" }),
    { user: R, request: m } = K(),
    [w, x] = o.useState([]),
    [_, F] = o.useState([]),
    [T, Y] = o.useState({ success: !0, message: "" }),
    [ne, G] = o.useState({ open: !1 }),
    [M, ie] = o.useState(!1),
    te = o.useCallback((W) => {
      (x(W.data.userdevices), F(W.data.userdevices));
    }, []);
  o.useEffect(() => {
    m(
      {
        event: "user devices get all",
        data: {
          source: "Devices Form",
          message: "Devices Form needs the list of devices of a user",
          userid: t,
        },
      },
      te,
    );
  }, [te, m, t, R]);
  const ce = () => {
      m(
        {
          event: "user devices update",
          data: {
            source: "Devices Form",
            message: `Updating the devices of user ${r}`,
            userid: t,
            userdevices: w,
          },
        },
        de,
      );
    },
    de = (W) => {
      if (
        (Y({ success: W.data.success, message: W.data.message }),
        W.data.success)
      ) {
        const L = [...w];
        (x(L), F(L), ie(!1));
      }
    },
    De = (W) => {
      const L = [...w];
      (L.includes(W)
        ? L.splice(
            L.findIndex((V) => V === W),
            1,
          )
        : L.push(W),
        x(L),
        Y({ success: !0, message: "" }),
        pe(L, _) ? ie(!1) : ie(!0));
    },
    Ve = (W) => {
      (we(), I({ open: !0, type: W }));
    },
    Je = () => {
      I({ open: !1, type: "" });
    },
    Ke = (W) => {
      (D(W.currentTarget), k(!1));
    },
    we = () => {
      D(null);
    },
    Ie = () => {
      k(!0);
    },
    Ye = () => {
      (we(), G({ open: !0 }));
    },
    A = () => {
      (G({ open: !1 }), Y({ success: !0, message: "" }), ie(!1));
    };
  return e.jsxs(e.Fragment, {
    children: [
      e.jsxs(ge, {
        "data-testid": "user_tablerow_component",
        hover: !0,
        tabIndex: -1,
        role: "checkbox",
        selected: i,
        children: [
          e.jsx(H, {
            padding: "checkbox",
            children:
              t !== 1 &&
              t !== s.userid &&
              (s.roleid === 1 || p !== 1) &&
              e.jsx(le, { disableRipple: !0, checked: i, onChange: g }),
          }),
          e.jsx(H, {
            component: "th",
            scope: "row",
            padding: "none",
            children: e.jsxs(O, {
              direction: "row",
              alignItems: "center",
              spacing: 2,
              children: [
                e.jsx(_e, { alt: r, src: c }),
                e.jsx(C, { variant: "subtitle2", noWrap: !0, children: r }),
              ],
            }),
          }),
          e.jsx(H, { children: a }),
          e.jsx(H, { children: u }),
          e.jsx(H, { children: l }),
          e.jsx(H, { children: h }),
          e.jsx(H, { children: d }),
          e.jsx(H, {
            align: "right",
            children: e.jsx(U, {
              "data-testid": `user${t}_openmenue_button`,
              onClick: Ke,
              children: e.jsx(y, { icon: "eva:more-vertical-fill" }),
            }),
          }),
        ],
      }),
      e.jsxs(ye, {
        open: !!$,
        anchorEl: $,
        onClose: we,
        anchorOrigin: { vertical: "top", horizontal: "left" },
        transformOrigin: { vertical: "top", horizontal: "right" },
        slotProps: { paper: { sx: { width: 200 } } },
        children: [
          e.jsxs(q, {
            "data-testid": "user_editprofile_button",
            disabled: t === 1 && s.userid !== 1,
            onClick: () => Ve("profile"),
            children: [
              e.jsx(y, { icon: "eva:edit-fill", sx: { mr: 2 } }),
              P("Edit"),
            ],
          }),
          p !== 1 &&
            e.jsxs(q, {
              onClick: () => Ye(),
              children: [
                e.jsx(y, { icon: "eva:edit-fill", sx: { mr: 2 } }),
                P("_assigndevices_"),
              ],
            }),
          !E &&
            t !== 1 &&
            t !== s.userid &&
            (s.roleid === 1 || p !== 1) &&
            e.jsxs(q, {
              onClick: Ie,
              sx: { color: "error.main" },
              children: [
                e.jsx(y, { icon: "eva:trash-2-outline", sx: { mr: 2 } }),
                P("Delete"),
              ],
            }),
          E &&
            e.jsxs(q, {
              onClick: f,
              sx: { color: "error.main" },
              children: [
                e.jsx(y, {
                  icon: "eva:question-mark-circle-outline",
                  sx: { mr: 2 },
                }),
                P("_reallydelete_"),
              ],
            }),
        ],
      }),
      e.jsx(Yt, {
        title: P("_edituserprofile_"),
        openUpdate: b.open,
        type: b.type,
        updateuser: {
          alias: r,
          email: h,
          firstname: a,
          lastname: u,
          home: d,
          userid: t,
          roleid: p,
          role: l,
          uuid: n,
        },
        onCloseUpdate: Je,
        handleUpdateUser: j,
      }),
      e.jsx(Ei, {
        updateuser: { alias: r, firstname: a, lastname: u, userid: t },
        openDevices: ne.open,
        onCloseDevices: A,
        devices: S,
        userDevices: w,
        handleUserDeviceChange: De,
        handleDevicesSubmit: ce,
        requestResult: T,
        isChanged: M,
      }),
    ],
  });
}
function Ai({
  order: t,
  orderBy: n,
  rowCount: s,
  headLabel: i,
  numSelected: r,
  onRequestSort: c,
  onSelectAllClick: a,
}) {
  const u = (p) => (l) => {
    c(l, p);
  };
  return e.jsx(Bt, {
    children: e.jsxs(ge, {
      children: [
        e.jsx(H, {
          padding: "checkbox",
          children: e.jsx(le, {
            indeterminate: r > 0 && r < s,
            checked: s > 0 && r === s,
            onChange: a,
          }),
        }),
        i.map((p) =>
          e.jsx(
            H,
            {
              align: p.align || "left",
              sortDirection: n === p.id ? t : !1,
              sx: { width: p.width, minWidth: p.minWidth },
              children: e.jsx(Lt, {
                hideSortIcon: !0,
                active: n === p.id,
                direction: n === p.id ? t : "asc",
                onClick: u(p.id),
                children: p.label,
              }),
            },
            p.id,
          ),
        ),
      ],
    }),
  });
}
function Ni({ emptyRows: t, height: n }) {
  return t
    ? e.jsx(ge, {
        sx: { ...(n && { height: n * t }) },
        children: e.jsx(H, { colSpan: 9 }),
      })
    : null;
}
function Ti({
  selected: t,
  filterName: n,
  onFilterName: s,
  placeholder: i,
  handleDeleteSelected: r,
  showReallyDelete: c,
  handleShowReallyDelete: a,
}) {
  const { t: u } = z();
  return e.jsxs(tt, {
    sx: {
      height: 96,
      display: "flex",
      justifyContent: "space-between",
      p: (p) => p.spacing(0, 1, 0, 3),
      ...(t.length > 0 && {
        color: "primary.main",
        bgcolor: "primary.lighter",
      }),
    },
    children: [
      t.length > 0
        ? e.jsxs(C, {
            component: "div",
            variant: "subtitle1",
            children: [t.length, " ", u("selected")],
          })
        : e.jsx(Hs, {
            value: n,
            onChange: s,
            placeholder: i,
            startAdornment: e.jsx(Be, {
              position: "start",
              children: e.jsx(y, {
                icon: "eva:search-fill",
                sx: { color: "text.disabled", width: 20, height: 20 },
              }),
            }),
          }),
      t.length > 0 &&
        !c &&
        e.jsx(ee, {
          title: u("Delete"),
          children: e.jsx(U, {
            onClick: () => a(!0),
            children: e.jsx(y, { icon: "eva:trash-2-fill" }),
          }),
        }),
      t.length > 0 &&
        c &&
        e.jsx(Q, {
          color: "error",
          variant: "contained",
          startIcon: e.jsx(y, { icon: "eva:question-mark-circle-outline" }),
          onClick: () => {
            (r(), a(!1));
          },
          children: e.jsx(C, {
            variant: "subtitle1",
            children: u("_reallydelete_"),
          }),
        }),
    ],
  });
}
function Wi() {
  const [t, n] = o.useState(0),
    [s, i] = o.useState([]),
    [r, c] = o.useState("asc"),
    [a, u] = o.useState([]),
    [p, l] = o.useState("name"),
    [h, d] = o.useState(""),
    [g, f] = o.useState(5),
    { t: j } = z(),
    { request: S, user: $, isTest: D, testDevices: E } = K(),
    [k, P] = o.useState(!1),
    b = o.useRef(!1),
    [I, R] = o.useState(!1),
    [m, w] = o.useState([
      $.roleid === 1 && $.userid !== 1 ? s.length - 2 : s.length - 1,
    ]),
    [x, _] = o.useState([]),
    F = o.useCallback(
      (A) => {
        _(D ? E : A.data.devices);
      },
      [D, E],
    ),
    T = o.useCallback(
      (A) => {
        const L = A.data.users.map((V, Fr) => ({
          userid: V.userid,
          uuid: V.uuid,
          avatarUrl: `/assets/images/avatars/avatar_${ae(V.userid, 25)}.jpg`,
          alias: V.alias,
          firstname: V.firstname,
          lastname: V.lastname,
          role: V.rolename,
          email: V.email,
          home: V.home,
          roleid: V.roleid,
        }));
        ((b.current = !0),
          i(L),
          w($.roleid === 1 && $.userid !== 1 ? L.length - 2 : L.length - 1),
          u([]));
      },
      [$],
    ),
    Y = o.useCallback(
      (A) => {
        const W = [...s],
          L = W.findIndex((V) => V.userid === A.userid);
        ((W[L] = A),
          (W[L].avatarUrl =
            `/assets/images/avatars/avatar_${ae(A.userid, 25)}.jpg`),
          i(W));
      },
      [s],
    ),
    ne = o.useCallback(
      (A) => {
        A !== null && Y(A.detail);
      },
      [Y],
    );
  o.useEffect(
    () => (
      S(
        {
          event: "devices get all",
          data: {
            source: "Devices Form",
            message: "Devices Form needs the list of devices",
            userid: $.roleid != 1 ? $.userid : null,
          },
        },
        F,
      ),
      rt("userUpdated", ne),
      b.current ||
        S(
          {
            event: "users get all",
            data: {
              source: "Users View",
              message: "User View needs the list of users",
            },
          },
          T,
        ),
      () => {
        ot("userUpdated");
      }
    ),
    [S, ne, T, $, F],
  );
  const G = () => {
      P(!0);
    },
    M = () => {
      P(!1);
    },
    ie = (A) => {
      R(A);
    },
    te = (A, W) => {
      W !== "" && (c(p === W && r === "asc" ? "desc" : "asc"), l(W));
    },
    ce = (A) => {
      if (A.target.checked) {
        const W = s
          .filter((L) => L.userid !== 1 && $.userid !== L.userid)
          .map((L) => L.alias);
        u(W);
        return;
      }
      (u([]), R(!1));
    },
    de = (A, W) => {
      const L = a.indexOf(W);
      let V = [];
      (L === -1
        ? (V = V.concat(a, W))
        : L === 0
          ? (V = V.concat(a.slice(1)))
          : L === a.length - 1
            ? (V = V.concat(a.slice(0, -1)))
            : L > 0 && (V = V.concat(a.slice(0, L), a.slice(L + 1))),
        u(V),
        R(!1));
    },
    De = (A) => {
      S(
        {
          event: "user delete",
          data: {
            source: "Users View",
            message: "User View wants to delete a user",
            ids: [A],
          },
        },
        T,
      );
    },
    Ve = () => {
      const A = s
        .filter((W) => a.includes(W.alias) && W.userid !== 1)
        .map((W) => W.userid);
      (u([]),
        S(
          {
            event: "user delete",
            data: {
              source: "Users View",
              message: "User View wants to delete users",
              ids: A,
            },
          },
          T,
        ));
    },
    Je = (A, W) => {
      n(W);
    },
    Ke = (A) => {
      (n(0), f(parseInt(A.target.value, 10)));
    },
    we = (A) => {
      (n(0), d(A.target.value));
    },
    Ie = Di({
      inputData: s,
      comparator: os(r, p),
      filterName: h,
      field: "alias",
    }),
    Ye = !Ie.length && !!h;
  return e.jsxs(ve, {
    children: [
      e.jsxs(O, {
        direction: "row",
        alignItems: "center",
        justifyContent: "space-between",
        mb: 5,
        children: [
          e.jsx(C, { variant: "h4", children: j("Users") }),
          e.jsx(Ii, {
            openCreate: k,
            onOpenCreate: G,
            onCloseCreate: M,
            handleUsersReceived: T,
          }),
        ],
      }),
      e.jsxs(xe, {
        children: [
          e.jsx(Ti, {
            selected: a,
            filterName: h,
            onFilterName: we,
            placeholder: j("_searchuser_"),
            handleDeleteSelected: Ve,
            showReallyDelete: I,
            handleShowReallyDelete: ie,
          }),
          e.jsx(Fe, {
            children: e.jsx(Ut, {
              sx: { overflow: "unset" },
              children: e.jsxs(zt, {
                sx: { minWidth: 800 },
                size: "small",
                children: [
                  e.jsx(Ai, {
                    order: r,
                    orderBy: p,
                    rowCount: m,
                    numSelected: a.length,
                    onRequestSort: te,
                    onSelectAllClick: ce,
                    headLabel: [
                      { id: "alias", label: j("Alias") },
                      { id: "firstname", label: j("Firstname") },
                      { id: "lastname", label: j("Lastname") },
                      { id: "role", label: j("Role") },
                      { id: "email", label: j("Email") },
                      { id: "home", label: j("Home") },
                      { id: "" },
                    ],
                  }),
                  e.jsxs(Mt, {
                    children: [
                      Ie.slice(t * g, t * g + g).map((A) =>
                        e.jsx(
                          Ri,
                          {
                            appUser: $,
                            userid: A.userid,
                            uuid: A.uuid,
                            alias: A.alias,
                            firstname: A.firstname,
                            lastname: A.lastname,
                            role: A.role,
                            email: A.email,
                            home: A.home,
                            roleid: A.roleid,
                            avatarUrl: A.avatarUrl,
                            selected: a.indexOf(A.alias) !== -1,
                            handleClick: (W) => de(W, A.alias),
                            handleDeleteUser: () => De(A.userid),
                            handleUpdateUser: Y,
                            devices: x,
                          },
                          A.userid,
                        ),
                      ),
                      e.jsx(Ni, { height: 77, emptyRows: as(t, g, s.length) }),
                      Ye && e.jsx(Oi, { query: h }),
                    ],
                  }),
                ],
              }),
            }),
          }),
          e.jsx(Ht, {
            page: t,
            component: "div",
            count: s.length,
            rowsPerPage: g,
            onPageChange: Je,
            rowsPerPageOptions: [5, 10, 25],
            onRowsPerPageChange: Ke,
            labelRowsPerPage: j("_rowsperpage_"),
            labelDisplayedRows: ({ from: A, to: W, count: L }) =>
              `${A}–${W} ${j("of")} ${L !== -1 ? L : `${j("_morethan_")} ${W}`}`,
          }),
        ],
      }),
    ],
  });
}
function Bi() {
  const { user: t } = K();
  return e.jsxs(e.Fragment, {
    children: [
      e.jsx(he, { children: e.jsx("title", { children: " User" }) }),
      t ? e.jsx(Wi, {}) : null,
    ],
  });
}
const Li = Object.freeze(
  Object.defineProperty({ __proto__: null, default: Bi }, Symbol.toStringTag, {
    value: "Module",
  }),
);
function Ui() {
  const t = [
      "Plus1PM",
      "Plus1PMMini",
      "PlusI4",
      "PlusRGBWPM",
      "SHBDUO-1",
      "SHPLG-S",
    ],
    [n, s] = o.useState(0),
    i = (r) => {
      s(r);
    };
  return e.jsx("div", {
    children: e.jsx(on, {
      index: n,
      onChange: i,
      interval: 4e3,
      animation: "fade",
      indicators: !0,
      stopAutoPlayOnHover: !0,
      children: t.map((r) =>
        e.jsx(
          N,
          {
            component: "img",
            src: `/assets/images/devices/${r}.png`,
            sx: { width: 200, hight: 200, objectFit: "scale-down" },
          },
          v(),
        ),
      ),
    }),
  });
}
function zi() {
  const t = Me();
  return e.jsx(N, {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    sx: {
      ...Tn({
        color: B(t.palette.background.default, 0.9),
        imgUrl: "/assets/background/overlay_4.jpg",
      }),
      height: 1,
    },
    children: e.jsx(xe, {
      sx: { p: 5, width: 1, maxWidth: 420 },
      children: e.jsxs(O, {
        sx: { alignItems: "center", justifyContent: "center", height: 1 },
        children: [
          e.jsx(Ge, { sx: { mt: 3 } }),
          e.jsx(Ui, {}),
          e.jsx(ct, { type: "login" }),
        ],
      }),
    }),
  });
}
function Mi() {
  return e.jsxs(e.Fragment, {
    children: [
      e.jsx(he, { children: e.jsx("title", { children: " Login" }) }),
      e.jsx(zi, {}),
    ],
  });
}
const Hi = Object.freeze(
  Object.defineProperty({ __proto__: null, default: Mi }, Symbol.toStringTag, {
    value: "Module",
  }),
);
function qi() {
  const [t, n] = o.useState([]),
    { request: s } = K(),
    i = o.useRef(!1),
    r = Ue(),
    c = o.useCallback(
      (u) => {
        if (((i.current = !0), u.data.blogposts.length > 0)) {
          const p = u.data.blogposts.map((l, h) => ({
            id: l.blogpostid,
            cover: `/assets/images/covers/cover_${ae(h + 1, 24)}.jpg`,
            title: l.title,
            content: l.content,
            createdAt: l.createdAt,
            view: 23,
            comment: 45,
            share: 45,
            favorite: 5,
            author: {
              name: l.alias,
              avatarUrl: `/assets/images/avatars/avatar_${ae(l.userid, 25)}.jpg`,
            },
          }));
          n(p);
        } else r("/login");
      },
      [n, r],
    );
  o.useEffect(() => {
    i.current ||
      s(
        {
          event: "blogposts get public",
          data: {
            name: "LandingView",
            message: "LandingView  needs the list of public blogposts",
          },
        },
        c,
      );
  }, [c, s]);
  const a = () => {
    r("/login");
  };
  return e.jsxs(ve, {
    children: [
      e.jsx(N, {
        sx: { flexGrow: 1 },
        children: e.jsxs(O, {
          direction: "row",
          spacing: 10,
          sx: { justifyContent: "space-between" },
          children: [
            e.jsx(Ge, { sx: { mt: 3 } }),
            e.jsx(O, {
              direction: "row",
              sx: { alignItems: "center" },
              children: e.jsxs(U, {
                "data-testid": "landing_login_button",
                onClick: a,
                sx: { pt: 3 },
                "aria-label": "Login",
                children: [
                  e.jsx(y, { icon: "eva:lock-fill" }),
                  e.jsx(C, { variant: "h6", children: "Login" }),
                ],
              }),
            }),
          ],
        }),
      }),
      e.jsx(se, {
        container: !0,
        spacing: 3,
        sx: { pt: 5 },
        children: t.map((u, p) => e.jsx(rs, { blogpost: u, index: p }, v())),
      }),
    ],
  });
}
function Gi() {
  return e.jsxs(e.Fragment, {
    children: [
      e.jsx(he, { children: e.jsx("title", { children: " S-Central" }) }),
      e.jsx(qi, {}),
    ],
  });
}
const Vi = Object.freeze(
    Object.defineProperty(
      { __proto__: null, default: Gi },
      Symbol.toStringTag,
      { value: "Module" },
    ),
  ),
  Ji = ({ online: t }) =>
    e.jsx(y, {
      icon: t ? "material-symbols:wifi" : "material-symbols:wifi-off",
      sx: { color: t ? "green" : "red" },
    });
function Ki({ switches: t, handleClick: n }) {
  return typeof t > "u"
    ? null
    : t.map(
        (s, i) => (
          (s.index = i),
          e.jsx(
            ee,
            {
              title: `Toggle Switch ${s.id}`,
              children: e.jsx(
                y,
                {
                  icon: "icomoon-free:switch",
                  sx: {
                    cursor: "pointer",
                    color: s.output ? "green" : "black",
                  },
                  onClick: () => n(s),
                },
                v(),
              ),
            },
            v(),
          )
        ),
      );
}
const Yi = ({ device: t, handleSwitchToggle: n }) => {
    const [s, i] = o.useState(t.switches),
      r = (c) => {
        c.output = !c.output;
        const a = [...s];
        ((a[c.index] = c), i(a), n(c));
      };
    return e.jsxs(e.Fragment, {
      children: [
        e.jsxs(O, {
          direction: "row",
          sx: {
            minHeight: 35,
            maxHeight: 35,
            pr: 1,
            pl: 1,
            alignItems: "center",
            justifyContent: "space-between",
          },
          children: [
            e.jsx(Ji, { online: t.online }),
            e.jsx(Ki, { switches: t.switches, handleClick: r }),
          ],
        }),
        e.jsx(st, {
          title: e.jsx(qe, {
            href: `http://${t.ip}`,
            target: "_blank",
            color: "inherit",
            underline: "hover",
            children: t.cname.substring(0, 14),
          }),
          subheader: `${t.name} ${t.gen > 0 ? `(Gen ${t.gen})` : ""}`,
          sx: { minWidth: 200, minHeight: 50, maxHeight: 50, pt: 1 },
        }),
        e.jsx(qs, {
          sx: {
            minWidth: 160,
            maxWidth: 160,
            minHeight: 120,
            objectFit: "scale-down",
          },
          image: t.image,
          title: t.name,
          component: "img",
          alt: t.name,
        }),
      ],
    });
  },
  Zi = ({ scripts: t }) =>
    typeof t > "u"
      ? null
      : t.map((n) =>
          n?.logmessages?.length > 0
            ? e.jsxs(
                O,
                {
                  spacing: 0,
                  children: [
                    e.jsx(C, { variant: "subtitle2", children: n.name }, v()),
                    n.logmessages.map((s) => {
                      const i = new Date(s.ts * 1e3)
                        .toTimeString()
                        .substring(0, 8);
                      return e.jsxs(
                        O,
                        {
                          direction: "row",
                          spacing: 1,
                          sx: { minWidth: 0 },
                          children: [
                            e.jsx(C, { variant: "caption", children: i }, v()),
                            e.jsx(
                              C,
                              {
                                variant: "caption",
                                noWrap: !0,
                                children: s.msg,
                              },
                              v(),
                            ),
                          ],
                        },
                        v(),
                      );
                    }),
                  ],
                },
                v(),
              )
            : null,
        );
o.forwardRef(
  (
    {
      colors: t,
      selected: n,
      onSelectColor: s,
      limit: i = "auto",
      sx: r,
      ...c
    },
    a,
  ) => {
    const u = typeof n == "string",
      p = o.useCallback(
        (l) => {
          if (u) l !== n && s(l);
          else {
            const h = n.includes(l) ? n.filter((d) => d !== l) : [...n, l];
            s(h);
          }
        },
        [s, n, u],
      );
    return e.jsx(O, {
      ref: a,
      direction: "row",
      display: "inline-flex",
      sx: {
        flexWrap: "wrap",
        ...(i !== "auto" && { width: i * 36, justifyContent: "flex-end" }),
        ...r,
      },
      ...c,
      children: t.map((l) => {
        const h = u ? n === l : n.includes(l);
        return e.jsx(
          Gs,
          {
            sx: { width: 36, height: 36, borderRadius: "50%" },
            onClick: () => {
              p(l);
            },
            children: e.jsx(O, {
              alignItems: "center",
              justifyContent: "center",
              sx: {
                width: 20,
                height: 20,
                bgcolor: l,
                borderRadius: "50%",
                border: (d) => `solid 1px ${B(d.palette.grey[500], 0.16)}`,
                ...(h && {
                  transform: "scale(1.3)",
                  boxShadow: `4px 4px 8px 0 ${B(l, 0.48)}`,
                  outline: `solid 2px ${B(l, 0.08)}`,
                  transition: (d) =>
                    d.transitions.create("all", {
                      duration: d.transitions.duration.shortest,
                    }),
                }),
              },
              children: e.jsx(y, {
                width: h ? 12 : 0,
                icon: "eva:checkmark-fill",
                sx: {
                  color: (d) => d.palette.getContrastText(l),
                  transition: (d) =>
                    d.transitions.create("all", {
                      duration: d.transitions.duration.shortest,
                    }),
                },
              }),
            }),
          },
          l,
        );
      }),
    });
  },
);
function ls({ colors: t, limit: n = 3, sx: s }) {
  const i = t.slice(0, n),
    r = t.length - n;
  return e.jsxs(O, {
    component: "span",
    direction: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    sx: s,
    children: [
      i.map((c, a) =>
        e.jsx(
          N,
          {
            sx: {
              ml: -0.75,
              width: 16,
              height: 16,
              bgcolor: c,
              borderRadius: "50%",
              border: (u) => `solid 2px ${u.palette.background.paper}`,
              boxShadow: (u) =>
                `inset -1px 1px 2px ${B(u.palette.common.black, 0.24)}`,
            },
          },
          c + a,
        ),
      ),
      t.length > n &&
        e.jsx(N, {
          component: "span",
          sx: { typography: "subtitle2" },
          children: `+${r}`,
        }),
    ],
  });
}
const It = ["#00AB55", "#D22B2B", "#000000"];
function Xi({ deviceIp: t, kvs: n }) {
  return n.map((s) => {
    const i = typeof s.display < "u" ? s.display : s.key,
      r = () => {
        switch (typeof s.style < "u" ? s.style : s.value) {
          case "boolean":
            return Number(s.value) === 1 ? "true" : "false";
          case "color":
            return e.jsx(
              ls,
              {
                colors: Number(s.value) === 1 ? It.slice(0, 1) : It.slice(1, 2),
                sx: { pt: "5px" },
              },
              v(),
            );
          default:
            return s.value;
        }
      };
    return e.jsxs(
      O,
      {
        direction: "row",
        justifyContent: "space-between",
        style: { gap: 20 },
        useFlexGap: !0,
        flexWrap: "wrap",
        children: [
          e.jsx(qe, {
            href: `http://${t}/#/key-value-store/edit?key=${s.key}`,
            target: "_blank",
            color: "inherit",
            underline: "hover",
            variant: "subtitle2",
            noWrap: !0,
            sx: { minWidth: 100 },
            children: e.jsx(
              C,
              { noWrap: !0, variant: "caption", children: i.substring(0, 14) },
              v(),
            ),
          }),
          e.jsx(C, { variant: "caption", children: r() }, v()),
        ],
      },
      v(),
    );
  });
}
const Qi = ({ device: t, handleSwitchSet: n }) => {
    const [s, i] = o.useState(null),
      [r, c] = o.useState(t.switches[0]),
      { t: a } = z(),
      [u, p] = o.useState(
        typeof r.rgb < "u"
          ? `rgb (${r.rgb[0]}, ${r.rgb[1]}, ${r.rgb[2]})`
          : "undefined",
      ),
      [l, h] = o.useState(r?.brightness),
      [d, g] = o.useState(r?.white),
      f = o.useMemo(() => rn(n, 30, { leading: !1, trailing: !0 }), [n]),
      j = o.useCallback((P) => {
        P !== null && i(P.detail);
      }, []);
    o.useEffect(
      () => (
        rt("copySourceSet", j),
        () => {
          ot("copySourceSet");
        }
      ),
      [j],
    );
    const S = (P) => {
        s?.deviceId === t.id &&
          re("copySourceSet", {
            deviceId: t.id,
            deviceName: t.cname,
            aSwitch: P,
          });
      },
      $ = (P, b) => {
        p(b.rgb);
        const I = { ...r };
        ((I.rgb = b.rgb), c(I), S(I), f(I));
      },
      D = (P, b) => {
        h(b);
        const I = { ...r };
        ((I.brightness = b), c(I), S(I), f(I));
      },
      E = (P, b) => {
        g(b);
        const I = { ...r };
        ((I.white = b), c(I), S(I), f(I));
      },
      k = () => {
        if (typeof s > "u" || s === null) return;
        const P = { ...r },
          b = s.aSwitch;
        (typeof r.brightness < "u" &&
          typeof b.brightness < "u" &&
          ((P.brightness = b.brightness), h(b.brightness)),
          typeof r.white < "u" &&
            typeof b.white < "u" &&
            ((P.white = b.white), g(b.white)),
          typeof r.rgb < "u" &&
            typeof b.rgb < "u" &&
            ((P.rgb = b.rgb), p(`rgb (${b.rgb[0]}, ${b.rgb[1]}, ${b.rgb[2]})`)),
          c(P),
          n(P));
      };
    return e.jsxs(O, {
      alignItems: "flex-start",
      children: [
        typeof r.brightness < "u" &&
          e.jsxs(e.Fragment, {
            children: [
              e.jsx(C, { variant: "subtitle", children: a("Brightness") }),
              e.jsx(gt, {
                "data-testid": "shelly_brightness_slider",
                value: l,
                min: 0,
                max: 100,
                step: 10,
                marks: !0,
                valueLabelDisplay: "auto",
                size: "small",
                onChange: D,
                "aria-label": "Brighness slider",
              }),
            ],
          }),
        typeof r.white < "u" &&
          e.jsxs(e.Fragment, {
            children: [
              e.jsx(C, { variant: "subtitle", children: a("White") }),
              e.jsx(gt, {
                "data-testid": "shelly_white_slider",
                value: d,
                min: 0,
                max: t.gen === 1 ? 100 : 255,
                step: t.gen === 1 ? 10 : 25,
                marks: !0,
                valueLabelDisplay: "auto",
                size: "small",
                onChange: E,
                "aria-label": "White slider",
              }),
            ],
          }),
        typeof r.rgb < "u" &&
          e.jsx(ln, {
            "data-testid": "shelly_multicolor_input",
            format: "rgb",
            isAlphaHidden: !0,
            value: u,
            onChange: $,
            size: "small",
            variant: "outlined",
            "aria-label": "Color Selection",
            sx: { pt: 1, ml: -1 },
          }),
        e.jsxs(O, {
          direction: "row",
          justifyContent: "center",
          sx: { ml: -2, mr: -2, minWidth: "110%" },
          children: [
            e.jsx(ee, {
              title:
                s?.deviceId !== t.id ? a("_copysettings_") : a("_copyreset_"),
              children: e.jsx(U, {
                "data-testid": "shelly_setcopysource_button",
                onClick: () => {
                  s?.deviceId !== t.id || s === null
                    ? re("copySourceSet", {
                        deviceId: t.id,
                        deviceName: t.cname,
                        aSwitch: r,
                      })
                    : re("copySourceSet", null);
                },
                color: s?.deviceId !== t.id ? "inherit" : "success",
                children: e.jsx(y, {
                  icon:
                    s?.deviceId !== t.id
                      ? "tabler:copy-check"
                      : "tabler:copy-off",
                }),
              }),
            }),
            s !== null &&
              s.deviceId !== t.id &&
              e.jsx(ee, {
                title: a("_pastesettingsfrom_", { deviceName: s?.deviceName }),
                children: e.jsx(U, {
                  onClick: k,
                  color: "success",
                  children: e.jsx(y, { icon: "fa7-regular:paste" }),
                }),
              }),
          ],
        }),
      ],
    });
  },
  Ot = ({ white: t }) =>
    e.jsxs(
      O,
      {
        direction: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        spacing: 0.5,
        children: [
          e.jsx(y, { icon: "stash:circle-dot" }, v()),
          e.jsx(C, { variant: "caption", children: t }, v()),
        ],
      },
      v(),
    ),
  er = ({ data: t }) => {
    if (typeof t.motion < "u")
      return e.jsx(
        y,
        {
          icon:
            Number(t.motion) === 1
              ? "material-symbols:directions-walk"
              : "fa6-solid:person",
          sx: { color: Number(t.motion) === 1 ? "blue" : "black" },
        },
        v(),
      );
    if (typeof t.window < "u")
      return Number(t.window) === 1
        ? e.jsx(
            y,
            {
              icon: "material-symbols:door-open-rounded",
              sx: { color: "black" },
            },
            v(),
          )
        : e.jsx(
            y,
            {
              icon: "material-symbols:door-front-rounded",
              sx: { color: "black" },
            },
            v(),
          );
    if (typeof t.button < "u")
      switch (Number(t.button)) {
        case 1:
          return e.jsx(
            y,
            { icon: "mdi:number-1-box", sx: { color: "blue" } },
            v(),
          );
        case 2:
          return e.jsx(
            y,
            { icon: "mdi:number-2-box", sx: { color: "blue" } },
            v(),
          );
        case 3:
          return e.jsx(
            y,
            { icon: "mdi:number-3-box", sx: { color: "blue" } },
            v(),
          );
        case 4:
          return e.jsx(
            y,
            { icon: "mdi:number-4-box", sx: { color: "blue" } },
            v(),
          );
        case 254:
          return e.jsx(
            y,
            { icon: "f7:hand-point-left-fill", sx: { color: "blue" } },
            v(),
          );
        default:
          return e.jsx(
            y,
            { icon: "f7:hand-point-left-fill", sx: { color: "blue" } },
            v(),
          );
      }
    return e.jsx(
      y,
      { icon: "material-symbols:event-busy", sx: { color: "black" } },
      v(),
    );
  },
  tr = ({ event: t }) => {
    let n;
    switch (Number(t.id)) {
      case 0:
        n = 180;
        break;
      case 1:
        n = 270;
        break;
      case 2:
        n = 90;
        break;
      default:
        n = 0;
    }
    return e.jsxs(
      O,
      {
        direction: "row",
        children: [
          e.jsx(
            y,
            {
              icon: "system-uicons:grid-squares-add",
              sx: { color: "black" },
              className: `rotate${n}`,
            },
            v(),
          ),
          t.event === "single_push" &&
            e.jsx(y, { icon: "mdi:number-1-box", sx: { color: "blue" } }, v()),
          t.event === "double_push" &&
            e.jsx(y, { icon: "mdi:number-2-box", sx: { color: "blue" } }, v()),
          t.event === "triple_push" &&
            e.jsx(y, { icon: "mdi:number-3-box", sx: { color: "blue" } }, v()),
          (t.event === "long_push" || t.event === "btn_up") &&
            e.jsx(
              y,
              { icon: "f7:hand-point-left-fill", sx: { color: "blue" } },
              v(),
            ),
        ],
      },
      v(),
    );
  },
  sr = ({ events: t }) => {
    const n = t.map((s) =>
      s.event === "shelly-blu" && typeof s.data < "u"
        ? e.jsx(er, { data: s.data }, v())
        : ["single_push", "double_push", "triple_push", "long_push"].includes(
              s.event,
            )
          ? e.jsx(tr, { event: s }, v())
          : s.event === "btn_up" || s.event === "btn_down"
            ? null
            : s.event === "scheduled_restart"
              ? e.jsx(
                  y,
                  { icon: "solar:restart-square-bold", sx: { color: "black" } },
                  v(),
                )
              : e.jsx(
                  y,
                  { icon: "ic:sharp-help", sx: { color: "black" } },
                  v(),
                ),
    );
    return n.length > 0
      ? n
      : e.jsx(y, { icon: "mdi:bug", sx: { color: "red" } }, v());
  },
  Et = ({ consume: t }) =>
    e.jsxs(
      O,
      {
        direction: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        spacing: 0.5,
        children: [
          e.jsx(
            y,
            {
              icon: "material-symbols-light:bolt",
              sx: { color: +(t > 0) ? "blue" : "black" },
            },
            v(),
          ),
          e.jsx(C, { variant: "caption", children: Pe(t) }, v()),
        ],
      },
      v(),
    ),
  nr = ({ params: t }) => {
    const n = [];
    return (
      Object.keys(t).forEach((i) => {
        if (i.startsWith("script")) {
          const r = t[i];
          n.push(
            e.jsxs(
              O,
              {
                justifyContent: "flex-start",
                alignItems: "center",
                spacing: 0.5,
                direction: "row",
                children: [
                  e.jsxs(
                    C,
                    {
                      variant: "subtitle2",
                      color: r.running ? "green" : "red",
                      children: ["{", r.id, "}"],
                    },
                    v(),
                  ),
                  e.jsxs(
                    C,
                    {
                      variant: "caption",
                      children: [
                        Math.round(Number(r.mem_free) / 1024),
                        " kb free",
                      ],
                    },
                    v(),
                  ),
                ],
              },
              v(),
            ),
          );
        }
      }),
      n
    );
  },
  ir = ({ version: t }) =>
    e.jsxs(
      O,
      {
        direction: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        spacing: 0.5,
        children: [
          e.jsx(
            y,
            {
              icon: "material-symbols:system-update-alt",
              sx: { color: "green" },
            },
            v(),
          ),
          e.jsx(C, { variant: "caption", children: t }, v()),
        ],
      },
      v(),
    ),
  Rt = ({ brightness: t }) =>
    e.jsxs(
      O,
      {
        direction: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        spacing: 0.5,
        children: [
          e.jsx(y, { icon: "subway:black-white", width: 18, height: 18 }, v()),
          e.jsxs(C, { variant: "caption", children: [t, "%"] }, v()),
        ],
      },
      v(),
    ),
  rr = ({ sys: t }) =>
    e.jsxs(
      O,
      {
        direction: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        spacing: 0.5,
        children: [
          e.jsx(
            y,
            { icon: "material-symbols-light:sd", sx: { color: "black" } },
            v(),
          ),
          e.jsxs(
            C,
            {
              variant: "caption",
              children: [Math.round(Number(t.ram_free) / 1024), " kb free"],
            },
            v(),
          ),
          e.jsx(
            y,
            {
              icon: "material-symbols:storage-rounded",
              sx: { color: "black" },
            },
            v(),
          ),
          e.jsxs(
            C,
            {
              variant: "caption",
              children: [Math.round(Number(t.fs_free) / 1024), " kb free"],
            },
            v(),
          ),
        ],
      },
      v(),
    ),
  or = ({ deviceName: t, wsMessage: n }) => {
    const { params: s } = n;
    if (typeof s > "u") return [];
    const i = [];
    let r;
    if (
      (n.method !== "NotifyEvent" && (r = ut(t, s)),
      n.method === "NotifyFullStatus")
    ) {
      if (
        (typeof s?.sys < "u" && i.push(e.jsx(rr, { sys: s.sys }, v())),
        typeof s?.cloud?.connected < "u" &&
          i.push(
            e.jsx(
              y,
              {
                icon: "material-symbols-light:cloud",
                sx: { color: s.cloud.connected ? "green" : "black" },
              },
              v(),
            ),
          ),
        typeof s?.sys?.available_updates?.stable?.version < "u" &&
          i.push(
            e.jsx(ir, { version: s.sys.available_updates.stable.version }, v()),
          ),
        i.push(e.jsx(nr, { params: n.params }, v())),
        r.hasSwitch && i.push(e.jsx(Et, { consume: r.totalPower }, v())),
        typeof s["rgbw:0"]?.brightness < "u" &&
          i.push(e.jsx(Rt, { brightness: s["rgbw:0"].brightness }, v())),
        typeof s["switch:0"]?.brightness < "u" &&
          i.push(e.jsx(Rt, { brightness: s["switch:0"].brightness }, v())),
        typeof s["rgbw:0"]?.white < "u" &&
          i.push(e.jsx(Ot, { white: s["rgbw:0"].white }, v())),
        typeof s["switch:0"]?.white < "u" &&
          i.push(e.jsx(Ot, { white: s["switch:0"].white }, v())),
        typeof s["rgbw:0"]?.rgb < "u")
      ) {
        const { rgb: c } = s["rgbw:0"],
          a = `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
        i.push(
          e.jsx(
            y,
            { icon: "material-symbols:light-mode", sx: { color: a } },
            v(),
          ),
        );
      }
    } else
      n.method === "NotifyStatus"
        ? r.hasSwitch && i.push(e.jsx(Et, { consume: r.totalPower }, v()))
        : n.method === "NotifyEvent"
          ? typeof s?.events < "u" &&
            i.push(e.jsx(sr, { events: s.events }, v()))
          : i.push(
              e.jsx(y, { icon: "ic:sharp-help", sx: { color: "black" } }, v()),
            );
    return i;
  },
  ar = ({ ts: t }) =>
    e.jsx(C, { variant: "subtitle2", children: Qe(t, "HH:mm") }, v()),
  lr = ({ deviceName: t, wsmessages: n }) =>
    typeof n > "u"
      ? null
      : Object.keys(n).map((i) => {
          const r = n[i];
          return e.jsxs(
            o.Fragment,
            {
              children: [
                e.jsxs(
                  O,
                  {
                    direction: "row",
                    justifyContent: "left",
                    alignItems: "center",
                    spacing: 2,
                    children: [
                      typeof r?.params?.ts < "u" &&
                        e.jsx(ar, { ts: r.params.ts }, v()),
                      e.jsx(C, { variant: "subtitle2", children: i }, v()),
                      e.jsx(or, { deviceName: t, wsMessage: r }, v()),
                    ],
                  },
                  v(),
                ),
                e.jsx(
                  C,
                  { variant: "caption", children: JSON.stringify(r) },
                  v(),
                ),
              ],
            },
            v(),
          );
        }),
  be = ["#00AB55", "#D22B2B", "#000000"],
  cr = ({ deviceIP: t, deviceOnline: n, scripts: s }) => {
    if (typeof s > "u" || s == null || typeof s[Symbol.iterator] != "function")
      s = [
        { name: "n/a", colors: be.slice(-1) },
        { name: "n/a", colors: be.slice(-1) },
        { name: "n/a", colors: be.slice(-1) },
      ];
    else {
      s = [...s];
      for (let i = 0; i <= 2; i += 1)
        typeof s[i] > "u"
          ? s.push({ name: "n/a", colors: be.slice(-1) })
          : (s[i].colors = s[i].running && n ? be.slice(0, 1) : be.slice(1, 2));
    }
    return s.map((i) =>
      e.jsx(
        o.Fragment,
        {
          children: e.jsxs(
            O,
            {
              direction: "row",
              style: { gap: 20 },
              useFlexGap: !0,
              flexWrap: "wrap",
              children: [
                e.jsx(qe, {
                  href:
                    i.id !== 0
                      ? `http://${t}/#/script/${i.id}`
                      : `http://${t}/#/scripts`,
                  target: "_blank",
                  color: "inherit",
                  underline: "hover",
                  variant: "subtitle2",
                  noWrap: !0,
                  sx: { minWidth: 100 },
                  children: e.jsx(
                    C,
                    {
                      noWrap: !0,
                      variant: "caption",
                      children: i.name.substring(0, 14),
                    },
                    v(),
                  ),
                }),
                e.jsx(ls, { colors: i.colors, sx: { pt: "5px" } }, v()),
              ],
            },
            v(),
          ),
        },
        v(),
      ),
    );
  };
function dr(t, n) {
  let s = !t.online;
  if (typeof t.scripts < "u") {
    let i;
    Object.values(t.scripts).forEach((r) => {
      ((i = n[`script:${r.id}`]),
        r.running !== i.running && ((s = !0), (r.running = i.running)));
    });
  }
  if (typeof t.switches < "u") {
    let i;
    t.switches.forEach((r) => {
      i = n[`switch:${r.id}`] || n[`rgbw:${r.id}`];
      const c = typeof r.ts > "u" || n.ts - r.ts > 2;
      typeof i < "u" && c
        ? (r.output !== i.output &&
            ((s = !0),
            (r.output = i.output),
            console.log(
              `Switch ${r.key} of device ${t.cname} output was set to ${r.output}`,
            )),
          r.brightness !== i.brightness &&
            ((s = !0),
            (r.brightness = i.brightness),
            console.log(
              `Switch ${r.key} of device ${t.cname} brightness was set to ${r.brightness}`,
            )),
          r.white !== i.white &&
            ((s = !0),
            (r.white = i.white),
            console.log(
              `Switch ${r.key} of device ${t.cname} white was set to ${r.white}`,
            )),
          pe(r.rgb, i.rgb) ||
            ((s = !0),
            (r.rgb = i.rgb),
            console.log(
              `Switch ${r.key} of device ${t.cname} rgb was set to ${r.rgb}`,
            )))
        : console.log(
            `Skipping update of switch ${r.id} of device ${t.cname} to prevent overwrite of manual changes.`,
          );
    });
  }
  return (
    s && ((t.scripts = [...t.scripts]), (t.switches = [...t.switches])),
    s ? { ...t } : null
  );
}
const ur = He((t) => {
    const { expand: n, ...s } = t;
    return e.jsx(U, { "data-testid": "shelly_openkvs_button", ...s });
  })(({ theme: t, expand: n }) => ({
    transform: n ? "rotate(180deg)" : "rotate(0deg)",
    marginLeft: "auto",
    transition: t.transitions.create("transform", {
      duration: t.transitions.duration.shortest,
    }),
  })),
  pr = ({
    deviceId: t,
    deviceGen: n,
    type: s,
    isUpdateNeeded: i,
    setDeviceLastUpdate: r,
    getDeviceLastUpdate: c,
  }) => {
    const [a, u] = o.useState(!1),
      [p, l] = o.useState(),
      [h, d] = o.useState([]),
      [g, f] = o.useState({}),
      [j, S] = o.useState([]),
      { request: $, subscribe: D, unsubscribe: E, send: k } = K(),
      P = o.useCallback(
        (x) => {
          const _ = x.data.device;
          (l(() => _),
            d(() => _.scripts),
            f(() => _.wsmessages),
            S(() => _.kvs),
            r(t, Date.now(), _));
        },
        [t, r],
      ),
      b = o.useCallback(() => {
        let x = i(t);
        x === null
          ? $(
              {
                event: "device get",
                data: {
                  source: "ShellyCard",
                  message: "ShellyCard needs a device",
                  deviceId: t,
                },
              },
              P,
            )
          : ((x = { ...x }),
            l(() => x),
            d(() => x.scripts),
            f(() => x.wsmessages),
            S(() => x.kvs));
      }, [t, P, i, $]),
      I = o.useCallback(
        (x) => {
          const _ = x.type,
            F = x.data.device;
          switch (_) {
            case "script":
              pe(h, F.scripts) || d(() => F.scripts);
              break;
            case "kvs":
              pe(j, F.kvs) || S(() => F.kvs);
              break;
            case "log":
              pe(h, F.scripts) || d(() => F.scripts);
              break;
            case "ws": {
              const T = F?.wsmessages?.NotifyFullStatus?.params;
              if (typeof T < "u") {
                const Y = c(t)?.device;
                if (typeof Y < "u") {
                  const ne = dr(Y, T);
                  ne !== null && l(ne);
                } else
                  console.log(
                    "oldDevice is undefined in ShellyCard.handleDeviceUpdate",
                  );
              }
              f(() => F.wsmessages);
              break;
            }
            default:
              pe(p, F) || l(() => F);
          }
          r(F.id, Date.now(), F);
        },
        [p, t, c, j, h, r],
      );
    o.useEffect(() => {
      if ((b(), n !== 0))
        return (
          D({ subscriptionID: t, callback: I, all: !1 }, ["ShellyUpdate"]),
          () => {
            E(t, ["ShellyUpdate"]);
          }
        );
    }, []);
    const R = () => {
        u(!a);
      },
      m = (x) => {
        ((x.ts = Math.floor(Date.now()) / 1e3),
          k({
            event: "toggleSwitch",
            data: {
              name: "Shelly Device",
              message: `${p.cname} wants to toggle a switch`,
              switch: x,
            },
          }));
      },
      w = (x) => {
        if (
          ((x.ts = Math.floor(Date.now()) / 1e3),
          typeof x.rgb < "u" && !(x.rgb instanceof Array))
        ) {
          let _ = x.rgb
            .substring(x.rgb.indexOf("(") + 1, x.rgb.indexOf(")"))
            .split(",");
          ((_ = _.map((F) => Number(F))), (x.rgb = _));
        }
        k({
          event: "setSwitch",
          data: {
            name: "Shelly Device",
            message: `${p.cname} wants to set a switch`,
            switch: x,
          },
        });
      };
    return typeof p > "u"
      ? null
      : e.jsx(xe, {
          raised: !0,
          children: e.jsxs(O, {
            direction: s === "ctrl" ? "column" : "row",
            children: [
              e.jsxs(O, {
                children: [
                  e.jsx(Yi, { device: p, handleSwitchToggle: m }),
                  s === "sk" &&
                    e.jsxs(e.Fragment, {
                      children: [
                        e.jsx(Re, {
                          sx: { minWidth: 200, pt: 0 },
                          children: e.jsx(O, {
                            justifyContent: "left",
                            alignItems: "flex-start",
                            children: e.jsx(cr, {
                              deviceIP: p.ip,
                              deviceOnline: p.online,
                              scripts: h,
                            }),
                          }),
                        }),
                        e.jsxs(Vs, {
                          disableSpacing: !0,
                          children: [
                            e.jsx(U, {
                              href: `http://${p.ip}/#/key-value-store`,
                              target: "_blank",
                              "aria-label": "show KVS entries",
                              children: e.jsx(
                                y,
                                {
                                  icon: "material-symbols:storage-rounded",
                                  sx: {
                                    color:
                                      p?.kvs?.length === 0 ? "grey" : "green",
                                  },
                                },
                                v(),
                              ),
                            }),
                            e.jsx(ur, {
                              disabled: p?.kvs?.length === 0,
                              onClick: R,
                              expand: a,
                              "aria-expanded": a,
                              "aria-label": "show KVS entries",
                              children: e.jsx(
                                y,
                                {
                                  icon: "mdi:expand-more",
                                  sx: { color: "gray" },
                                },
                                v(),
                              ),
                            }),
                          ],
                        }),
                        e.jsx(Js, {
                          in: a,
                          timeout: "auto",
                          mountOnEnter: !0,
                          unmountOnExit: !0,
                          children: e.jsx(Re, {
                            sx: { pt: 0 },
                            children: e.jsx(O, {
                              justifyContent: "left",
                              alignItems: "flex-start",
                              children: e.jsx(Xi, { deviceIp: p.ip, kvs: j }),
                            }),
                          }),
                        }),
                      ],
                    }),
                ],
              }),
              s === "ws" &&
                e.jsx(Re, {
                  sx: {
                    display: "flex",
                    width: 1,
                    overflowX: "auto",
                    overflowY: "auto",
                  },
                  children: e.jsx(O, {
                    children: e.jsx(lr, { deviceName: p.name, wsmessages: g }),
                  }),
                }),
              s === "log" &&
                e.jsx(Re, {
                  sx: {
                    display: "flex",
                    width: 1,
                    overflowX: "auto",
                    overflowY: "auto",
                  },
                  children: e.jsx(O, { children: e.jsx(Zi, { scripts: h }) }),
                }),
              s === "ctrl" &&
                e.jsx(N, {
                  bgcolor: "white",
                  sx: { minWidth: 230, maxWidth: 230, pl: 2, pr: 2 },
                  children: e.jsx(Qi, { device: p, handleSwitchSet: w }),
                }),
            ],
          }),
        });
  },
  hr = o.memo(pr),
  At = ({ count: t, max: n }) =>
    e.jsxs(N, {
      position: "relative",
      display: "inline-flex",
      children: [
        e.jsx(et, {
          size: 40,
          variant: "indeterminate",
          color: t >= n - 1 ? "error" : "success",
        }),
        e.jsx(N, {
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          children: e.jsx(C, {
            variant: "caption",
            component: "div",
            sx: { color: "text.primary" },
            children: `${t}/${n}`,
          }),
        }),
      ],
    });
function cs({
  type: t,
  title: n,
  openWifi: s,
  row: i,
  onCloseWifi: r,
  selected: c,
}) {
  const [a, u] = o.useState(
      t === "single" ? {} : { ssid: "", password: "", ap: { enabled: !1 } },
    ),
    [p, l] = o.useState(!1),
    [h, d] = o.useState({ success: !0, message: "", successful: 0, total: 0 }),
    { t: g } = z(),
    { request: f } = K(),
    j = o.useCallback((E) => {
      u(E.data.wifisettings);
    }, []),
    S = o.useCallback((E) => {
      d({
        success: E.data.success,
        successful: E.data.successful,
        total: E.data.total,
        message: E.data.message,
      });
    }, []);
  o.useEffect(() => {
    s &&
      t === "single" &&
      ft.isEmpty(a) &&
      f(
        {
          event: "device get wifi settings",
          data: {
            source: "Wifi Form",
            message: "Wifi Form needs the wifi settings of a device",
            deviceId: i.id,
          },
        },
        j,
      );
  }, [i, j, f, s, t, a]);
  const $ = (E) => {
      (E.preventDefault(),
        f(
          {
            event: "device wifi update",
            data: {
              source: "Wifi Form",
              message: "Updating the wifi settings",
              wifiSettings: a,
              ids: t === "single" ? [i.id] : c,
            },
          },
          S,
        ));
    },
    D = (E) => {
      const k = { ...a };
      ((k[E.target.name] = E.target.value), u(k));
    };
  return ft.isEmpty(a)
    ? null
    : e.jsxs(ue, {
        anchor: "right",
        open: s,
        onClose: r,
        slotProps: {
          paper: { sx: { width: 300, border: "none", overflow: "hidden" } },
        },
        children: [
          e.jsxs(O, {
            direction: "row",
            alignItems: "center",
            justifyContent: "space-between",
            sx: { px: 1, py: 2 },
            children: [
              e.jsx(C, { variant: "h6", sx: { ml: 1 }, children: n }),
              e.jsx(U, {
                "data-testid": "device_closewifi_button",
                onClick: r,
                children: e.jsx(y, { icon: "eva:close-fill" }),
              }),
            ],
          }),
          e.jsx(C, {
            variant: "subtitle2",
            color: "error",
            sx: { ml: 1 },
            children: g("_wifiwarming_"),
          }),
          e.jsx(oe, {}),
          e.jsx($e, {
            fullWidth: !0,
            size: "subtitle2",
            children: e.jsx(N, {
              component: "form",
              onSubmit: $,
              sx: { display: "flex", flexDirection: "column", gap: 2 },
              children: e.jsxs(O, {
                spacing: 3,
                sx: { px: 3, py: 3 },
                children: [
                  e.jsx(X, {
                    required: !0,
                    autoComplete: "off",
                    label: "SSID",
                    name: "ssid",
                    value: a.ssid,
                    onChange: D,
                    slotProps: {
                      htmlInput: { "data-testid": "wifi_ssid_input" },
                    },
                  }),
                  e.jsx(X, {
                    required: !0,
                    name: "password",
                    autoComplete: "new-password",
                    label: g("Password"),
                    onChange: D,
                    type: p ? "text" : "password",
                    slotProps: {
                      input: {
                        endAdornment: e.jsx(Be, {
                          position: "end",
                          children: e.jsx(U, {
                            onClick: () => l(!p),
                            edge: "end",
                            children: e.jsx(y, {
                              icon: p ? "eva:eye-fill" : "eva:eye-off-fill",
                            }),
                          }),
                        }),
                      },
                      htmlInput: { minLength: 8, maxLength: 63 },
                    },
                  }),
                  t === "single" &&
                    e.jsxs(e.Fragment, {
                      children: [
                        e.jsx(X, {
                          disabled: !0,
                          label: "IP",
                          name: "ip",
                          value: a.ip,
                        }),
                        e.jsx(X, {
                          disabled: !0,
                          label: "Mode",
                          name: "ipv4mode",
                          value: a.ipv4mode,
                        }),
                        e.jsx(X, {
                          disabled: !0,
                          label: "Gatway",
                          name: "gw",
                          value: a.gw,
                        }),
                        e.jsx(X, {
                          disabled: !0,
                          label: "Mask",
                          name: "netmask",
                          value: a.netmask,
                        }),
                        e.jsx(X, {
                          disabled: !0,
                          label: "DNS",
                          name: "nameserver",
                          value: a.nameserver != null ? a.nameserver : "",
                        }),
                      ],
                    }),
                  e.jsx(je, {
                    required: !0,
                    control: e.jsx(le, { color: "error" }),
                    label: g("_acceptrisk_"),
                  }),
                  e.jsx(C, {
                    variant: "subtitle2",
                    color: h.success ? "success" : "error",
                    children: g(h.message, {
                      successful: h.successful,
                      total: h.total,
                    }),
                  }),
                  e.jsx(Q, {
                    fullWidth: !0,
                    size: "large",
                    type: "submit",
                    color: "inherit",
                    variant: "outlined",
                    startIcon: e.jsx(y, { icon: "formkit:submit" }),
                    children: g("Save"),
                  }),
                ],
              }),
            }),
          }),
        ],
      });
}
function xr({
  row: t,
  labelId: n,
  isItemSelected: s,
  handleClick: i,
  handleRebootDevices: r,
  handleFirmwareUpdates: c,
  updateRow: a,
}) {
  const { t: u } = z(),
    { request: p, subscribe: l, unsubscribe: h } = K(),
    [d, g] = o.useState(t),
    [f, j] = o.useState(null),
    [S, $] = o.useState({ open: !1 }),
    D = () => {
      $({ open: !0 });
    },
    E = () => {
      $({ open: !1 });
    },
    k = (I) => {
      (I.stopPropagation(), j(I.currentTarget));
    },
    P = (I) => {
      switch (I) {
        case "reboot": {
          r([d.id]);
          break;
        }
        case "stable": {
          c("stable", [d.id]);
          break;
        }
        case "beta": {
          c("beta", [d.id]);
          break;
        }
        case "wifi": {
          D();
          break;
        }
      }
      j(null);
    },
    b = o.useCallback(
      (I) => {
        const R = I.data.device;
        if (R.gen > 0) {
          const m = R?.wsmessages?.NotifyFullStatus?.params?.sys,
            w = {
              id: R.id,
              image: R.image,
              name: R.cname.substring(0, 14),
              model: R.name,
              gen: R.gen,
              uptime: m?.uptime,
              restart: R.rebootPending ? "reboot pending" : m?.restart_required,
              firmware: R.fw_id,
              stable: R.updateStablePending ? "stable pending" : R.stable,
              beta: R.updateBetaPending ? "beta pending" : R.beta,
              reloads: R.reloads,
            };
          (a(w), g(w));
        }
      },
      [g, a],
    );
  return (
    o.useEffect(() => {
      if (
        (p(
          {
            event: "device get",
            data: {
              source: "ShellyCard",
              message: "ShellyCard needs a device",
              deviceId: t.id,
            },
          },
          b,
        ),
        t.gen !== 0)
      )
        return (
          l({ subscriptionID: t.id, callback: b, all: !1 }, ["device-update"]),
          () => {
            h(t.id, ["ShellyUpdate"]);
          }
        );
    }, []),
    e.jsxs(e.Fragment, {
      children: [
        e.jsxs(
          ge,
          {
            hover: !0,
            onClick: (I) => i(I, d.id),
            role: "checkbox",
            "aria-checked": s,
            tabIndex: -1,
            selected: s,
            sx: { cursor: "pointer" },
            children: [
              e.jsx(H, {
                padding: "checkbox",
                children: e.jsx(le, { color: "primary", checked: s }),
              }),
              e.jsx(H, {
                align: "right",
                sx: { minWidth: 70, maxWidth: 70, objectFit: "scale-down" },
                children: e.jsx("img", { src: t.image, alt: t.name }),
              }),
              e.jsx(H, {
                component: "th",
                id: n,
                scope: "row",
                padding: "none",
                children: e.jsx(C, { children: t.name }),
              }),
              e.jsx(H, {
                align: "left",
                children: e.jsxs(C, { children: [d.model, " "] }),
              }),
              e.jsx(H, {
                align: "left",
                children: e.jsx(C, { children: d.gen }),
              }),
              e.jsx(H, {
                align: "left",
                children: e.jsx(C, { children: Ln(d.uptime) }),
              }),
              e.jsx(H, {
                align: "left",
                children: e.jsx(C, {
                  color: d.restart === "reboot pending" ? "success" : "string",
                  children:
                    d.restart === "reboot pending"
                      ? e.jsx(et, {
                          size: 25,
                          variant: "indeterminate",
                          color: "success",
                        })
                      : d.restart
                        ? e.jsx(ee, {
                            title: u("_required_"),
                            children: e.jsx(y, {
                              icon: "mdi:restart-alert",
                              width: 25,
                              height: 25,
                              sx: { color: "red" },
                            }),
                          })
                        : e.jsx(ee, {
                            title: u("_notrequired_"),
                            children: e.jsx(y, {
                              icon: "mdi:restart-off",
                              width: 25,
                              height: 25,
                            }),
                          }),
                }),
              }),
              e.jsx(H, {
                align: "left",
                children: e.jsx(C, {
                  children:
                    typeof d.firmware > "u"
                      ? "--"
                      : d.gen === 1
                        ? d.firmware.substring(
                            d.firmware.lastIndexOf("/") + 2,
                            d.firmware.lastIndexOf("g") - 1,
                          )
                        : d.firmware.substring(
                            d.firmware.lastIndexOf("/") + 1,
                            d.firmware.lastIndexOf("-"),
                          ),
                }),
              }),
              e.jsx(H, {
                align: "left",
                children: e.jsx(C, {
                  color: d.stable === "stable pending" ? "success" : "string",
                  children:
                    typeof d.stable > "u"
                      ? "--"
                      : d.stable === "stable pending"
                        ? e.jsx(At, { count: d.reloads, max: 5 })
                        : d.stable,
                }),
              }),
              e.jsx(H, {
                align: "left",
                children: e.jsx(C, {
                  color: d.beta === "beta pending" ? "success" : "string",
                  children:
                    typeof d.beta > "u"
                      ? "--"
                      : d.beta === "beta pending"
                        ? e.jsx(At, { count: d.reloads, max: 5 })
                        : d.beta,
                }),
              }),
              e.jsx(H, {
                align: "right",
                children: e.jsx(U, {
                  "data-testid": `device${d.id}_openmenue_button`,
                  onClick: k,
                  children: e.jsx(y, { icon: "eva:more-vertical-fill" }),
                }),
              }),
            ],
          },
          d.id,
        ),
        e.jsxs(ye, {
          open: !!f,
          anchorEl: f,
          onClose: P,
          anchorOrigin: { vertical: "top", horizontal: "left" },
          transformOrigin: { vertical: "top", horizontal: "right" },
          slotProps: { paper: { sx: { width: 300 } } },
          children: [
            e.jsxs(q, {
              onClick: () => {
                P("stable");
              },
              disabled: typeof d.stable > "u",
              children: [
                e.jsx(y, {
                  icon: "material-symbols:system-update-alt",
                  sx: { color: "green", mr: 2 },
                }),
                u("_firmwarestable_"),
              ],
            }),
            e.jsxs(q, {
              onClick: () => {
                P("beta");
              },
              disabled: typeof d.beta > "u",
              children: [
                e.jsx(y, {
                  icon: "material-symbols:system-update-alt",
                  sx: { color: "red", mr: 2 },
                }),
                u("_firmwarebeta_"),
              ],
            }),
            e.jsxs(q, {
              onClick: () => {
                P("reboot");
              },
              children: [
                e.jsx(y, { icon: "ix:reboot", sx: { mr: 2 } }),
                u("Reboot"),
              ],
            }),
            e.jsxs(q, {
              "data-testid": `device${d.id}_openwifi_button`,
              onClick: () => P("wifi"),
              children: [
                e.jsx(y, { icon: "material-symbols:wifi", sx: { mr: 2 } }),
                "Wifi",
              ],
            }),
          ],
        }),
        e.jsx(cs, {
          type: "single",
          title: `Wifi ${d.name}`,
          openWifi: S.open,
          row: d,
          onCloseWifi: E,
          selected: [t.id],
        }),
      ],
    })
  );
}
function gr({ alert: t, setAlert: n }) {
  return e.jsx(Ks, {
    in: t.visible,
    timeout: { enter: 0, exit: 2e3 },
    addEndListener: () => {
      setTimeout(() => {
        n({ title: t.title, text: t.text, severity: t.severity, visible: !1 });
      }, 5e3);
    },
    children: e.jsxs(Ys, {
      severity: t.severity,
      variant: "filled",
      sx: { maxHeight: "50px", width: "100%" },
      children: [t.title !== "" && e.jsx(Zs, { children: t.title }), t.text],
    }),
  });
}
function mr({
  selected: t,
  handleRebootDevices: n,
  handleFirmwareUpdates: s,
  alert: i,
  setAlert: r,
}) {
  const { t: c } = z(),
    [a, u] = o.useState({ open: !1 }),
    p = () => {
      u({ open: !0 });
    },
    l = () => {
      u({ open: !1 });
    };
  return e.jsxs(e.Fragment, {
    children: [
      e.jsxs(tt, {
        sx: [
          { pl: { sm: 2 }, pr: { xs: 1, sm: 1 } },
          t.length > 0 && {
            bgcolor: (h) =>
              B(h.palette.primary.main, h.palette.action.activatedOpacity),
          },
        ],
        children: [
          e.jsxs(O, {
            direction: "row",
            spacing: 2,
            sx: {
              px: 1,
              py: 2,
              justifyContent: "flex-start",
              alignItems: "center",
              width: "60%",
            },
            children: [
              t.length > 0
                ? e.jsxs(C, {
                    sx: { flex: "1 1 40%" },
                    color: "inherit",
                    variant: "subtitle1",
                    component: "div",
                    children: [`Batch ${t.length}`, " ", c("selected")],
                  })
                : e.jsx(C, {
                    sx: { flex: "1 1 40%" },
                    variant: "h6",
                    id: "tableTitle",
                    component: "div",
                    children: "Batch",
                  }),
              e.jsx(gr, {
                text: c("Select devices to enable batch actions."),
                severity: "info",
                alert: i,
                setAlert: r,
              }),
            ],
          }),
          t.length > 0 &&
            e.jsxs(O, {
              direction: "row",
              sx: {
                px: 1,
                py: 2,
                justifyContent: "flex-end",
                alignItems: "center",
                width: "40%",
              },
              children: [
                e.jsx(ee, {
                  title: c("_firmwarestable_"),
                  children: e.jsx(U, {
                    onClick: () => s("stable"),
                    children: e.jsx(y, {
                      icon: "material-symbols:system-update-alt",
                      sx: { color: "green" },
                    }),
                  }),
                }),
                e.jsx(ee, {
                  title: c("_firmwarebeta_"),
                  children: e.jsx(U, {
                    onClick: () => s("beta"),
                    children: e.jsx(y, {
                      icon: "material-symbols:system-update-alt",
                      sx: { color: "red" },
                    }),
                  }),
                }),
                e.jsx(ee, {
                  title: c("Reboot"),
                  children: e.jsx(U, {
                    onClick: () => n(),
                    children: e.jsx(y, { icon: "ix:reboot" }),
                  }),
                }),
                e.jsx(ee, {
                  title: "Wifi",
                  children: e.jsx(U, {
                    onClick: () => p(),
                    children: e.jsx(y, { icon: "material-symbols:wifi" }),
                  }),
                }),
              ],
            }),
        ],
      }),
      e.jsx(cs, {
        type: "selected",
        title: `Wifi ${t.length} ${c("selected")}`,
        openWifi: a.open,
        onCloseWifi: l,
        selected: t,
      }),
    ],
  });
}
const fr = [
  { id: "image", disablePadding: !0, label: "" },
  { id: "name", disablePadding: !0, label: "Name" },
  { id: "model", disablePadding: !1, label: "Model" },
  { id: "gen", disablePadding: !1, label: "Gen" },
  { id: "uptime", disablePadding: !1, label: "Uptime" },
  { id: "restart", disablePadding: !1, label: "Reboot" },
  { id: "firmware", disablePadding: !1, label: "Firmware" },
  { id: "stable", disablePadding: !1, label: "Stable" },
  { id: "beta", disablePadding: !1, label: "Beta" },
  { id: "menue", disablePadding: !0, label: "" },
];
function br(t) {
  const {
      onSelectAllClick: n,
      order: s,
      orderBy: i,
      numSelected: r,
      rowCount: c,
      onRequestSort: a,
    } = t,
    u = (l) => (h) => {
      a(h, l);
    },
    { t: p } = z();
  return e.jsx(Bt, {
    children: e.jsxs(ge, {
      children: [
        e.jsx(H, {
          padding: "checkbox",
          children: e.jsx(le, {
            color: "primary",
            indeterminate: r > 0 && r < c,
            checked: c > 0 && r === c,
            onChange: n,
          }),
        }),
        fr.map((l) =>
          e.jsx(
            H,
            {
              align: "left",
              padding: l.disablePadding ? "none" : "normal",
              sortDirection: i === l.id ? s : !1,
              children: e.jsx(Lt, {
                active: i === l.id,
                direction: i === l.id ? s : "asc",
                onClick: u(l.id),
                hideSortIcon: !0,
                children: p(l.label),
              }),
            },
            l.id,
          ),
        ),
      ],
    }),
  });
}
function _r({ devices: t }) {
  const [n, s] = o.useState("asc"),
    [i, r] = o.useState(""),
    [c, a] = o.useState([]),
    [u, p] = o.useState(0),
    [l, h] = o.useState(5),
    { send: d } = K(),
    [g, f] = o.useState(
      t.map((x) => {
        const _ = x?.wsmessages?.NotifyFullStatus?.params?.sys;
        return {
          id: x.id,
          image: x.image,
          name: x.cname.substring(0, 14),
          model: x.name,
          gen: x.gen,
          uptime: _?.uptime,
          restart: x.rebootPending ? "reboot pending" : _?.restart_required,
          firmware: x.fw_id,
          stable: x.updateStablePending ? "stable pending" : x.stable,
          beta: x.updateBetaPending ? "beta pending" : x.beta,
          reloads: x.reloads,
        };
      }),
    ),
    [j, S] = o.useState({ title: "", text: "", severity: "", visible: !1 }),
    { t: $ } = z(),
    D = (x) => {
      const _ = [...g];
      ((_[_.findIndex((F) => F.id === x.id)] = x), f(_));
    },
    E = (x, _) => {
      typeof _ > "u" && (_ = c);
      const F = _.filter((T) => {
        const Y = g.find((ne) => ne.id === T);
        return x === "stable" ? typeof Y.stable < "u" : typeof Y.beta < "u";
      });
      (F.length > 0 &&
        d({
          event: `devices ${x} update`,
          data: {
            source: "Shelly Table",
            message: "Shelly Table wants to update the firmware of devices",
            ids: F,
          },
        }),
        F.length !== _.length &&
          S({
            title: "",
            text:
              F.length === 0
                ? $("_noupdateavailable_", { type: x })
                : $("_updateavailable_", {
                    checked: F.length,
                    selected: _.length,
                    type: x,
                  }),
            severity: "warning",
            visible: !0,
          }));
    },
    k = (x) => {
      (typeof x > "u" && (x = c),
        d({
          event: "devices reboot",
          data: {
            source: "Shelly Table",
            message: "Shelly Table wants to reboot devices",
            ids: x,
          },
        }));
    },
    P = (x, _) => {
      (s(i === _ && n === "asc" ? "desc" : "asc"), r(_));
    },
    b = (x) => {
      if (x.target.checked) {
        const _ = g.map((F) => F.id);
        a(_);
        return;
      }
      a([]);
    },
    I = (x, _) => {
      const F = c.indexOf(_);
      let T = [];
      (F === -1
        ? (T = T.concat(c, _))
        : F === 0
          ? (T = T.concat(c.slice(1)))
          : F === c.length - 1
            ? (T = T.concat(c.slice(0, -1)))
            : F > 0 && (T = T.concat(c.slice(0, F), c.slice(F + 1))),
        a(T));
    },
    R = (x, _) => {
      p(_);
    },
    m = (x) => {
      (h(parseInt(x.target.value, 10)), p(0));
    },
    w = as(u, l, g.length);
  return e.jsx(N, {
    sx: { width: "100%" },
    children: e.jsxs(Wt, {
      sx: { width: "100%", mb: 2 },
      children: [
        e.jsx(mr, {
          selected: c,
          handleRebootDevices: k,
          handleFirmwareUpdates: E,
          alert: j,
          setAlert: S,
        }),
        e.jsx(Ut, {
          children: e.jsxs(zt, {
            sx: { minWidth: 750 },
            "aria-labelledby": "tableTitle",
            size: "small",
            children: [
              e.jsx(br, {
                numSelected: c.length,
                order: n,
                orderBy: i,
                onSelectAllClick: b,
                onRequestSort: P,
                rowCount: g.length,
              }),
              e.jsxs(Mt, {
                children: [
                  g
                    .sort(os(n, i))
                    .slice(u * l, u * l + l)
                    .map((x, _) => {
                      const F = c.includes(x.id),
                        T = `enhanced-table-checkbox-${_}`;
                      return e.jsx(
                        xr,
                        {
                          row: x,
                          labelId: T,
                          isItemSelected: F,
                          handleClick: I,
                          handleRebootDevices: k,
                          handleFirmwareUpdates: E,
                          updateRow: D,
                        },
                        x.id,
                      );
                    }),
                  w > 0 &&
                    e.jsx(ge, {
                      style: { height: 33 * w },
                      children: e.jsx(H, { colSpan: 10 }),
                    }),
                ],
              }),
            ],
          }),
        }),
        e.jsx(Ht, {
          rowsPerPageOptions: [5, 10, 25],
          component: "div",
          count: g.length,
          rowsPerPage: l,
          page: u,
          onPageChange: R,
          onRowsPerPageChange: m,
        }),
      ],
    }),
  });
}
const jr = ({ index: t, devices: n }) => {
    const i = ["sk", "ctrl", "log", "ws", "table"][t],
      r = o.useRef({}),
      c = o.useCallback((f) => r.current[f], []),
      a = o.useCallback((f, j, S) => {
        r.current[f] = { ts: j, device: S };
      }, []),
      u = o.useCallback((f) => {
        const j = r.current[f];
        return typeof r.current[f] < "u"
          ? xn(Date.now(), new Date(j.ts)) >= 60
            ? null
            : r.current[f].device
          : null;
      }, []);
    if (i === "table") return e.jsx(_r, { devices: n });
    const p = 12,
      l = i === "sk" || i === "ctrl" ? 4 : 12,
      h = i === "sk" || i === "ctrl" ? 2 : 12,
      d = i === "sk" || i === "ctrl" ? 2 : 12,
      g = i === "sk" || i === "ctrl" ? 2 : 12;
    return e.jsx(se, {
      container: !0,
      spacing: 2,
      size: {
        xs: { xs: p },
        sm: { sm: l },
        md: { md: h },
        lg: { lg: d },
        xl: { xl: g },
      },
      children: n.map((f) => {
        const j = f.switches[0];
        return i === "sk" ||
          (i === "ws" && f.gen > 0) ||
          (i === "log" && f.gen > 1) ||
          (i === "ctrl" &&
            (typeof j?.brightness < "u" ||
              typeof j?.white < "u" ||
              typeof j?.rgb < "u"))
          ? e.jsx(
              se,
              {
                sx: { minWidth: i === "sk" || i === "ctrl" ? 0 : 1 },
                children: e.jsx(
                  hr,
                  {
                    deviceId: f.id,
                    deviceGen: f.gen,
                    type: i,
                    isUpdateNeeded: u,
                    setDeviceLastUpdate: a,
                    getDeviceLastUpdate: c,
                  },
                  f.id,
                ),
              },
              v(),
            )
          : null;
      }),
    });
  },
  Xe = [
    { value: "config", label: "Config" },
    { value: "cname", label: "Name" },
    { value: "name", label: "Model" },
    { value: "gen", label: "Gen" },
  ];
function yr({ handleSort: t }) {
  const [n, s] = o.useState(null),
    [i, r] = o.useState(0),
    { t: c } = z(),
    a = (l) => {
      s(l.currentTarget);
    },
    u = () => {
      s(null);
    },
    p = (l, h) => {
      (s(null), r(h), t(Xe[h].value));
    };
  return e.jsxs(e.Fragment, {
    children: [
      e.jsxs(Q, {
        disableRipple: !0,
        color: "inherit",
        onClick: a,
        endIcon: e.jsx(y, {
          icon: n ? "eva:chevron-up-fill" : "eva:chevron-down-fill",
        }),
        children: [
          c("_sortby_"),
          ": ",
          e.jsx(C, {
            component: "span",
            variant: "subtitle2",
            sx: { color: "text.secondary" },
            children: c(Xe[i].label),
          }),
        ],
      }),
      e.jsx(Xs, {
        open: !!n,
        anchorEl: n,
        onClose: u,
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
        transformOrigin: { vertical: "top", horizontal: "right" },
        slotProps: { paper: { sx: { [`& .${Qs.root}`]: { p: 0 } } } },
        children: Xe.map((l, h) =>
          e.jsx(
            q,
            {
              onClick: (d) => p(d, h),
              selected: h === i,
              children: c(l.label),
            },
            l.value,
          ),
        ),
      }),
    ],
  });
}
function vr({
  openFilter: t,
  onOpenFilter: n,
  onCloseFilter: s,
  filter: i,
  handleDeviceFilter: r,
}) {
  const [c, a] = o.useState([]),
    [u, p] = o.useState([]),
    { t: l } = z();
  if (
    (o.useEffect(() => {
      (a(Array.from(i.mChecked)), p(Array.from(i.gChecked)));
    }, [i]),
    typeof i > "u")
  )
    return null;
  const h = (S) => {
      const $ = c.map((D, E) => (E === S ? !D : D));
      a($);
    },
    d = (S) => {
      const $ = u.map((D, E) => (E === S ? !D : D));
      p($);
    },
    g = e.jsxs(O, {
      spacing: 1,
      children: [
        e.jsx(C, { variant: "subtitle2", children: l("Model") }),
        e.jsx(mt, {
          children: i.models.map((S, $) =>
            e.jsx(
              je,
              {
                control: e.jsx(le, { checked: !!c[$], onChange: () => h($) }),
                label: S,
              },
              S,
            ),
          ),
        }),
      ],
    }),
    f = e.jsxs(O, {
      spacing: 1,
      children: [
        e.jsx(C, { variant: "subtitle2", children: l("Generation") }),
        e.jsx(mt, {
          children: i.generations.map((S, $) =>
            e.jsx(
              je,
              {
                value: S,
                control: e.jsx(le, { checked: !!u[$], onChange: () => d($) }),
                label: S !== "" ? `Gen ${S}` : "no Gen",
              },
              S,
            ),
          ),
        }),
      ],
    }),
    j = () => {
      (a(new Array(i.mChecked.length).fill(!1)),
        p(new Array(i.gChecked.length).fill(!1)));
    };
  return e.jsxs(e.Fragment, {
    children: [
      e.jsxs(Q, {
        disableRipple: !0,
        color: i.isFilter ? "success" : "inherit",
        endIcon: e.jsx(y, { icon: "ic:round-filter-list" }),
        onClick: n,
        children: [l("Filters"), " "],
      }),
      e.jsxs(ue, {
        anchor: "right",
        open: t,
        onClose: s,
        slotProps: {
          paper: { sx: { width: 300, border: "none", overflow: "hidden" } },
        },
        children: [
          e.jsxs(O, {
            direction: "row",
            alignItems: "center",
            justifyContent: "space-between",
            sx: { px: 1, py: 2 },
            children: [
              e.jsx(C, {
                variant: "h6",
                sx: { ml: 1 },
                children: l("Filters"),
              }),
              e.jsx(U, {
                onClick: s,
                children: e.jsx(y, { icon: "eva:close-fill" }),
              }),
            ],
          }),
          e.jsx(oe, {}),
          e.jsx(Fe, {
            children: e.jsxs(O, { spacing: 3, sx: { p: 3 }, children: [g, f] }),
          }),
          e.jsx(N, {
            sx: { p: 3 },
            children: e.jsxs(O, {
              direction: "row",
              spacing: 2,
              children: [
                e.jsx(Q, {
                  fullWidth: !0,
                  size: "large",
                  color: "inherit",
                  variant: "outlined",
                  startIcon: e.jsx(y, { icon: "formkit:submit" }),
                  onClick: () => r(c, u),
                  children: l("Submit"),
                }),
                e.jsx(Q, {
                  fullWidth: !0,
                  size: "large",
                  color: "inherit",
                  variant: "outlined",
                  startIcon: e.jsx(y, { icon: "ic:round-clear-all" }),
                  onClick: () => j(),
                  children: l("Clear"),
                }),
              ],
            }),
          }),
        ],
      }),
    ],
  });
}
function wr() {
  const { user: t, request: n, isTest: s, testDevices: i } = K(),
    [r, c] = o.useState([]),
    [a, u] = o.useState([]),
    [p, l] = o.useState(!1),
    [h, d] = o.useState(0),
    [g, f] = o.useState("config"),
    [j, S] = o.useState({
      models: [],
      generations: [],
      mChecked: [],
      gChecked: [],
      isFilter: !1,
      deviceFilters: {},
    }),
    { t: $ } = z(),
    D = o.useCallback(
      (m) => {
        const w = [],
          x = [];
        let _ = [];
        (s ? (_ = i) : (_ = m.data.devices),
          _.forEach((T) => {
            (w.includes(T.name) || w.push(T.name),
              x.includes(T.gen) || x.push(T.gen));
          }));
        const F = {
          models: w,
          generations: x,
          mChecked: new Array(w.length).fill(!1),
          gChecked: new Array(x.length).fill(!1),
          isFilter: !1,
          deviceFilters: {},
        };
        (c(_), u(_), S(F));
      },
      [s, i],
    );
  o.useEffect(() => {
    n(
      {
        event: "devices get all",
        data: {
          source: "Shelly View",
          message: "Shelly View needs the list of devices",
          userid: t.roleid != 1 ? t.userid : null,
        },
      },
      D,
    );
  }, [D, n, t]);
  const E = (m, w) => {
      d(w);
    },
    k = () => {
      l(!0);
    },
    P = () => {
      l(!1);
    },
    b = (m, w) => {
      f(m);
      const x = r.length !== a.length;
      let _;
      switch (m) {
        case "config":
          _ = [...r];
          break;
        case "gen":
          _ = $i([...r], "gen");
          break;
        default:
          _ = Fi([...r], m);
      }
      return w ? _ : (x && (_ = I(j.deviceFilters, _)), u(() => _), null);
    },
    I = (m, w) =>
      w.filter((_) => {
        for (const F in m)
          if (_[F] === void 0 || !m[F].includes(_[F])) return !1;
        return !0;
      }),
    R = (m, w) => {
      let x = !1;
      const _ = {};
      if (
        (j.models.forEach((F, T) => {
          m[T] &&
            ((x = !0), typeof _.name > "u" && (_.name = []), _.name.push(F));
        }),
        j.generations.forEach((F, T) => {
          w[T] && ((x = !0), typeof _.gen > "u" && (_.gen = []), _.gen.push(F));
        }),
        S({
          models: j.models,
          generations: j.generations,
          mChecked: m,
          gChecked: w,
          isFilter: x,
          deviceFilters: _,
        }),
        x)
      ) {
        let F;
        (g !== "config" ? (F = b(g, !0)) : (F = [...r]), (F = I(_, F)), u(F));
      } else u(b(g, !0));
      l(!1);
    };
  return e.jsxs(ve, {
    children: [
      e.jsx(C, { variant: "h4", children: "Shellies" }),
      e.jsx(O, {
        direction: "row",
        alignItems: "center",
        flexWrap: "wrap-reverse",
        justifyContent: "flex-end",
        sx: { mb: 5 },
        children: e.jsxs(O, {
          direction: "row",
          spacing: 1,
          flexShrink: 0,
          sx: { my: 1 },
          children: [
            e.jsx(vr, {
              openFilter: p,
              onOpenFilter: k,
              onCloseFilter: P,
              filter: j,
              handleDeviceFilter: R,
            }),
            e.jsx(yr, { handleSort: b }),
          ],
        }),
      }),
      e.jsx(N, {
        sx: { pb: 2, borderBottom: 1, borderColor: "divider" },
        children: e.jsxs(en, {
          value: h,
          onChange: E,
          variant: "scrollable",
          scrollButtons: "auto",
          "aria-label": "shelly tabs",
          children: [
            e.jsx(Se, {
              "data-testid": "shellies_script_tab",
              label: "Script / KVS",
            }),
            e.jsx(Se, {
              "data-testid": "shellies_control_tab",
              label: $("Control"),
            }),
            e.jsx(Se, { "data-testid": "shellies_logs_tab", label: "Logs" }),
            e.jsx(Se, {
              "data-testid": "shellies_ws_tab",
              label: "WS Inspector",
            }),
            e.jsx(Se, {
              "data-testid": "shellies_list_tab",
              label: "List / Batch",
            }),
          ],
        }),
      }),
      e.jsx(jr, { index: h, devices: a }, "shelliesTab"),
    ],
  });
}
function Sr() {
  const { user: t } = K();
  return e.jsxs(e.Fragment, {
    children: [
      e.jsx(he, { children: e.jsx("title", { children: " Shellies" }) }),
      t ? e.jsx(wr, {}) : null,
    ],
  });
}
const Cr = Object.freeze(
  Object.defineProperty({ __proto__: null, default: Sr }, Symbol.toStringTag, {
    value: "Module",
  }),
);
function kr() {
  const t = e.jsx(N, {
    component: "header",
    sx: {
      top: 0,
      left: 0,
      width: 1,
      lineHeight: 0,
      position: "fixed",
      p: (n) => ({ xs: n.spacing(3, 3, 0), sm: n.spacing(5, 5, 0) }),
    },
    children: e.jsx(Ge, { sx: { mt: 3, ml: 4 } }),
  });
  return e.jsxs(e.Fragment, {
    children: [
      t,
      e.jsx(ve, {
        children: e.jsxs(N, {
          sx: {
            py: 12,
            maxWidth: 480,
            mx: "auto",
            display: "flex",
            minHeight: "100vh",
            textAlign: "center",
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "center",
          },
          children: [
            e.jsx(C, {
              variant: "h3",
              sx: { mb: 3 },
              children: "Sorry, page not found!",
            }),
            e.jsx(C, {
              sx: { color: "text.secondary" },
              children:
                "Sorry, we couldn’t find the page you’re looking for. Perhaps you’ve mistyped the URL? Be sure to check your spelling.",
            }),
            e.jsx(N, {
              component: "img",
              src: "/assets/illustrations/illustration_404.svg",
              sx: { mx: "auto", height: 260, my: { xs: 5, sm: 10 } },
            }),
            e.jsx(Q, {
              href: "/",
              size: "large",
              variant: "contained",
              component: Vt,
              children: "Go to Home",
            }),
          ],
        }),
      }),
    ],
  });
}
function Pr() {
  return e.jsxs(e.Fragment, {
    children: [
      e.jsx(he, {
        children: e.jsx("title", { children: " 404 Page Not Found " }),
      }),
      e.jsx(kr, {}),
    ],
  });
}
const $r = Object.freeze(
  Object.defineProperty({ __proto__: null, default: Pr }, Symbol.toStringTag, {
    value: "Module",
  }),
);
export { Wo as a, To as c, Bo as g };
