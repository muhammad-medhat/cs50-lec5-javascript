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
  document.querySelector('#emails-view').innerHTML = `<h3> ${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  console.log(`mailbox is: ${mailbox}`)
  switch(mailbox){
    case 'archive': 
      console.log('get archived mail')
      break;
    case 'sent':
        console.log('loading sent tab')
      break;
    default: getInbox()
  }
}

const sendEmail = () => {
const res = document.getElementById('compose-recipients').value
const sub = document.getElementById('compose-subject').value
const bdy = document.getElementById('compose-body').value
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: res,
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

const getInbox = () => {
  //console.log('show inbox...')
  fetch('/emails/inbox')
  .then(response => response.json())
  .then(emails => {
      // Print emails
      console.log('emails log', emails);

      // ... do something else with emails ...
      // ####################################################
      const inboxDev = cElemnt('div', 'inbox-div')
      
      
      const resUl = cElemnt('ul', 'res-ul')
      
      const emailsLi = emails.forEach(e => {
        const li = cElemnt('li', `msg-${e.id}`, 'mail-li', e.subject)
        const sn = cElemnt('div', `sn-${e.id}`, 'mail-sn', e.sender)
        const dv = cElemnt('div', `dv-${e.id}`, 'mail-body', e.body)


        li.dataset.eid = e.id

        li.append(lbl('Archive', 'lbl'))
        li.append(sn)
        li.append(dv)

        resUl.append(li)
      });
      // resUl.append(emailsLi)
      inboxDev.append(resUl)
      document.getElementById("emails-view").append(inboxDev)
      document.querySelectorAll('.mail-li').forEach(li=>{
        li.addEventListener('click', ()=>{
          console.log("loading...")
          // console.log("loading...")

          //const inboxDiv = document.querySelector('#inbox-div')
          const msgDiv = document.querySelector('#current-msg')
          inboxDev.style.display = 'none'
          msgDiv.style.display = 'block'          
          loadEmail(li.dataset.eid)
          const bdyDiv = document.createElement('div')
          // bdyDiv.innerHTML = emailTemplate()

        })
      })
  });
}

const updateEmail = (id, archive) => {
  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
        archived: archive
    })
  })
  
}

// const getEmail = (id) => {

//   fetch(`/emails/${id}`)
//   .then(response => response.json())
//   .then(email => {
//       // Print email
//       console.log(email);

//       // ... do something else with email ...
//   });
// }



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
      console.log(email);
  
      // ... do something else with email ...
      emailTemplate(email.sender, email.subject, email.body)
  });
}

emailTemplate = (from, subject, body) => {

  const ret = `<div>
                  <li>From: ${from}
                  <li>Subject:${subject}
                  <div>${body}</div>
              </div>`

  const el = document.createElement('div')
  el.className= 'msg';
  const liFrom = document.createElement('li')
  liFrom.innerHTML = `From: ${from}`

  const liSubject = document.createElement('li')
  liSubject.innerHTML = `subject: ${subject}`
 
  const dvBody = document.createElement('div')
  dvBody.innerHTML = `${body}`

  return ret
}




function cElemnt(el, id='', cls='', html=''){
  const ret = document.createElement(el)
  ret.id = id
  console.log(`'class-${cls}-eeeee`)
  // if(cls !== null || cls !== '') {
    
  if(cls.length!=0){
    ret.className=cls
  }
  if(html.length!=0){
    ret.innerHTML = html

  }
  console.log("creating ", ret)
  return ret
}

const inbDiv = (emails)=>{

  
}