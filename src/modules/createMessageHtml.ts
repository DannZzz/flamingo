import { Attachment } from "../database/models/Message";
import dataToImage, { imageSlider } from "./dataToImage";

export interface MessageHtml { 
  date: Date, 
  avatarUrl: string, 
  username: string, 
  message: string, 
  messageId: string, 
  attachments: Attachment[],
  premium: Date,
  displayColor: string,
}

/**
 * Create html message
 * 
 * @param {MessageHtml} data message Data
 * @returns {string}
 */
export default function createMessageHtml(data: MessageHtml): string {
  return `<div id="${data.messageId}" class="chat-message clearfix">
  
      <img class="avatar" src="${data.avatarUrl}" alt="" width="50" height="50">
  
      <div class="chat-message-content clearfix">
  
        <span class="chat-time">${createTime(data.date)}</span>

        <div class="content-text">
        <h5 class="username" style="${getUsernameStyle(data.premium, data.displayColor)}">${data.username}</h5>
  
        <p id="Content-${data.messageId}" class="messageData" onclick="contextMenu('${data.messageId}')">${data.message}</p>
        </div>
        <div onclick="contextMenu('${data.messageId}')" class="chatImages sentImages ${!data.attachments || data.attachments.length === 0 ? "hide" : ""}">
          ${dataToImage(data.attachments).join("\n")}
        </div>
          
        </div>
      </div>
      <hr id="HR-${data.messageId}">`
    
      
}
export function createEditableMessage(data: MessageHtml) {
  return `<div id="CTX-${data.messageId}" class="messageDiv chat-message clearfix">
  
  <img class="avatar" src="${data.avatarUrl}" alt="" width="50" height="50">

  <div class="chat-message-content clearfix">

    <span class="chat-time">${createTime(data.date)}</span>

    <h5 class="username" style="${getUsernameStyle(data.premium, data.displayColor)}">${data.username}</h5>

    <p class="messageData" onclick="contextMenu('${data.messageId}')">${data.message}</p>

    <div onclick="contextMenu('${data.messageId}')" class="sentImages slider ${!data.attachments || data.attachments.length === 0 ? "hide" : ""}">
      <div class="slider-image-space">${imageSlider(data.attachments).join("\n")}</div>
      <div class="${data.attachments?.length === 1 ? "hide" : ""} left-controll controller" onclick="sliderTo(-1)"><i class="sMove fa-solid fa-angle-left"></i></div>
      <div class="${data.attachments?.length === 1 ? "hide" : ""} right-controll controller" onclick="sliderTo(1)"><i class="sMove fa-solid fa-angle-right"></i></div>
    </div>
      
    </div>
  </div>
  `
}

/**
 * Date to time string
 * 
 * @param {Date} current date object
 * @returns {string} dd.mm.yyyy HH:MM
 */
export function createTime(current: Date): string {
  let cDate = to2(current.getDate()) + '.' + to2((current.getMonth() + 1)) + '.' + current.getFullYear();
  let cTime = current.getHours() + ":" + to2(current.getMinutes());
  return cDate + ' ' + cTime;
}

function to2(v: number) {
  if (`${v}`.length === 1) return `0${v}`;
  return v + "";
}


function getUsernameStyle (premium: Date, color: string): string {
  if (!premium || new Date() > premium || !color) return "";
  return `color: ${color}`
}