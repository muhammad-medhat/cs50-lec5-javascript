document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  
  document.querySelector('#compose-form').onsubmit = () =>{
    console.log("Sending an Email...")
    sendEmail()
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
  document.querySelector('#emails-view').innerHTML = `<h3>Show the mailbox name: ${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  console.log(`'milbox is: ${mailbox}`)
  switch(mailbox){
    case 'inbox': 
      getInbox()
      break;
    default: 

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
  console.log('show inbox...')
  fetch('/emails/inbox')
  .then(response => response.json())
  .then(emails => {
      // Print emails
      console.log(emails);

      // ... do something else with emails ...
      const inboxDev = document.createElement('div')
      inboxDev.id = "inbox-div"
      
      const resUl = document.createElement('ul')
      const emailsLi = emails.forEach(e => {
        const li = document.createElement('li')
        const sn = document.createElement('div')
        const dv = document.createElement('div')
        li.className = 'mail-li'
        sn.className = 'mail-sn'
        dv.className = 'mail-body'
        li.dataset.eid = e.id
        li.innerHTML = e.subject
        sn.innerHTML = e.sender
        dv.innerHTML = e.body
        li.append(sn)
        li.append(dv)
        resUl.append(li)
      });
      // resUl.append(emailsLi)
      inboxDev.append(resUl)
      document.getElementById("emails-view").append(inboxDev)
      document.querySelectorAll('.mail-li').forEach(li=>{
        li.addEventListener('click', ()=>{
          getEmail(li.dataset.eid)
          // console.log(li)
        })
      })
  });
}
const getEmail = (id) => {

  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(email => {
      // Print email
      console.log(email);

      // ... do something else with email ...
  });

}
// const fillInbox = (arr, div) =>{

//   const cont = arr.map

// }