document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  
  /**
   * Compose mail
   */
  document.querySelector('#compose-form').onsubmit = () =>{
    console.log("Sending an Email...")
    sendEmail()
    // Load the inbox
    load_mailbox('inbox')
    // Stop the Default Behaviour
    return false
  };

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#lblEmails').innerHTML = `<h3> ${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  console.log(`mailbox is: ${mailbox}`)
  getMailBox(mailbox)
  // switch(mailbox){
  //   case 'archive': 
  //     console.log('get archived mail')
  //     break;
  //   case 'sent':
  //       console.log('loading sent tab')
  //     break;
  //   default: getInbox()
  //}
}

const sendEmail = () => {
const res = document.getElementById('compose-recipients').value
const sub = document.getElementById('compose-subject').value
const bdy = document.getElementById('compose-body').value
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: res,
        eTime: currDt(), 
        subject: sub, //'Meeting time',
        body: bdy //'How about we meet tomorrow at 3pm?'
    })
  })
  .then(response => response.json())
  .then(result => {
      // Print result
      console.log(result);
  });
  
}

const getMailBox = type => {
  console.log(`Loaading the mailbox ${type}...`)

  fetch(`/emails/${type}`)
  .then(response => response.json())
  .then(emails => {
    console.log('API return', emails)
    bindEmails(emails)
  })
}

const getInbox = () => {
  getMailBox('inbox')
}

const eventListener = () =>{
  //click email
    document.querySelectorAll('.mail-li').forEach(li=>{
      li.addEventListener('click', ()=>{
        console.log("loading...")
        // console.log('li is clicked', li)

        const single = cElemnt('div', `msg-${li.dataset.eid}`)
        // console.log('single', single)

        const msgDiv = document.querySelector('#current-msg')

        // console.log('APPENDING...')    
        const msg = loadEmail(li.dataset.eid)  
        // console.log('MSG', msg)
        msgDiv.append(msg)
        readEmail(li.dataset.eid)

    })
  })
}

const bindEmails = (emailsList) =>{

  console.log('bindEmails...', emailsList)
  const inboxDev = document.getElementById( 'inbox-div') 
  inboxDev.innerHTML =''                      
  const resUl = cElemnt('ul', 'res-ul')

  const emailsLi = emailsList.forEach(e => {
    const li = cElemnt('li', `msg-${e.id}`, 'mail-li', e.subject)
    const sn = cElemnt('div', `sn-${e.id}`, 'mail-sn', e.sender)
    const dv = cElemnt('div', `dv-${e.id}`, 'mail-body', e.body)


    li.dataset.eid = e.id

    li.append(lbl('Show Email', 'lbl btn primary'))
    li.append(sn)
    li.append(dv)

    if(e.read){
      li.className='read'
    }

    resUl.append(li)
  });
  inboxDev.append(resUl)
  eventListener()



}
const archiveEmail = (id, archive) => {
  fetch(`/emails/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        archived: archive
    })
  })
}
const readEmail = (id) => {
  fetch(`/emails/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        read: true
    })
  })  
  // .then( response => response.json() )
  // .then(e =>{
  //   console.log('read email', e)
  // })

}

const lbl = (label, cls='') =>{
  const ret = document.createElement('label')
  ret.innerHTML = label
  ret.className=cls
  return ret
}

/**
 * Each email should then be rendered in its own box (e.g. as a <div> with a border) 
 * that displays who the email is from, what the subject line is, and the timestamp of the email.
 */

const loadEmail = id => {
  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(email => {
      // Print email
      //console.log(email);
  
      // ... do something else with email ...
      const msg = emailTemplate(email.sender,email.timestamp, email.subject, email.body)
      const msgDiv = document.querySelector('#current-msg')
      msgDiv.innerHTML = msg.outerHTML

  });
}

emailTemplate = (from, timestamp, subject, body) => {

  const el = cElemnt('div', '', 'msg' )
  const dvFrom = cElemnt('div', '', '', lbl(`From: ${from}`).outerHTML )
  const dvTimestamp = cElemnt('div', '', '', lbl(`Timestamp: ${timestamp}`).outerHTML )
  const dvSubject = cElemnt('div', '', '', lbl(`subject: ${subject}`, 'font-weight-bold').outerHTML )
  const dvBody = cElemnt('div', '', 'border mx-auto', `${body}`)

  el.append(dvFrom, dvTimestamp, dvSubject, dvBody)
  console.log('emailTemplate()', el)

  return el
}




function cElemnt(el, id='', cls='', html=''){
  const ret = document.createElement(el)
  // console.log(`'class-${cls}-eeeee`)
  // if(cls !== null || cls !== '') {
    
  if(id.length!=0){  
    ret.id = id
  }
  if(cls.length!=0){
    ret.className=cls
  }
  if(html.length!=0){
    ret.innerHTML = html

  }
  // console.log("creating ", ret)
  return ret
}

const inbDiv = (emails)=>{

  
}
const currDt = () =>{
  let currentDate = new Date();
  let cDay = currentDate.getDate()
  let cMonth = currentDate.getMonth() + 1
  let cYear = currentDate.getFullYear()
  let cHr = currentDate.getHours() 
  let cMn = currentDate.getMinutes() 
  let cSc =  currentDate.getSeconds();

  return `${cDay}/${cMonth}/${cYear} ${cHr}:${cMn}:${cSc}`
}