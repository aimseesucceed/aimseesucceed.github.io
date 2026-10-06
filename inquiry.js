(()=>{
  'use strict';
  const form=document.querySelector('#inquiry-form');
  if(!form)return;
  form.hidden=false;
  const topic=form.elements.topic, preview=document.querySelector('#email-preview'), draft=document.querySelector('#email-draft'), openEmail=document.querySelector('#open-email'), status=document.querySelector('#inquiry-status');
  const names={support:'Youth support inquiry',volunteer:'Volunteer inquiry',partnership:'Partnership or sponsorship inquiry',donation:'Donation question',general:'General inquiry',privacy:'Privacy question'};
  const prompts={support:'Describe the opportunity, the barrier to participation, and the help you are requesting. Please leave out a child’s name and sensitive details.',volunteer:'Tell us how you would like to help and any relevant skills or experience.',partnership:'Describe your partnership or sponsorship idea and what you would like to discuss.',donation:'Tell us your donation question or the items you would like to offer. Do not include card, bank, or payment login information.',general:'Tell us what you would like to discuss and the question you would like us to answer.',privacy:'Describe your privacy question in general terms. Do not include passwords or private documents.'};
  function updateTopic(){
    form.querySelectorAll('[data-topic]').forEach(group=>{
      const active=group.dataset.topic===topic.value;
      group.hidden=!active;group.disabled=!active;
    });
    document.querySelector('#message-hint').textContent=prompts[topic.value]||prompts.general;
    preview.hidden=true;status.textContent='';
  }
  const requested=new URLSearchParams(location.search).get('topic');
  if(Object.hasOwn(names,requested))topic.value=requested;
  updateTopic();topic.addEventListener('change',updateTopic);
  form.addEventListener('input',()=>{preview.hidden=true;status.textContent='';});
  form.addEventListener('submit',event=>{
    event.preventDefault();
    if(!form.reportValidity())return;
    const data=new FormData(form), value=key=>String(data.get(key)||'').trim();
    const required=['name','email','town','message'];
    const topicRequired={support:['relationship','opportunity','help','deadline'],volunteer:['availability'],partnership:['organization']};
    for(const key of [...required,...(topicRequired[topic.value]||[])]){
      if(!value(key)){const field=form.elements.namedItem(key);field.setCustomValidity('Please enter a response.');field.reportValidity();field.addEventListener('input',()=>field.setCustomValidity(''),{once:true});return;}
    }
    const lines=[names[topic.value],'','Name: '+value('name'),'Reply email: '+value('email'),'Town or community: '+value('town')];
    if(value('phone'))lines.push('Phone (optional): '+value('phone'));
    if(topic.value==='support')lines.push('Connection to youth or program: '+value('relationship'),'Opportunity or program: '+value('opportunity'),'Help requested: '+value('help'),'Deadline or timing: '+value('deadline'),'Estimated cost: '+(value('cost')||'Not yet known'));
    if(topic.value==='volunteer')lines.push('Availability: '+value('availability'));
    if(topic.value==='partnership')lines.push('Organization or affiliation: '+value('organization'),'Timing: '+(value('partnershipTiming')||'To discuss'));
    lines.push('','Message:',value('message'),'','Prepared using the AIM SEE SUCCEED website inquiry guide.');
    draft.value=lines.join('\n');
    openEmail.href='mailto:info@aimseesucceed.org?subject='+encodeURIComponent('AIM SEE SUCCEED — '+names[topic.value])+'&body='+encodeURIComponent(draft.value);
    preview.hidden=false;preview.focus();status.textContent='Your email draft is ready. Review it, then open your email app or copy the message. Nothing has been sent.';
  });
  document.querySelector('#copy-email').addEventListener('click',async()=>{
    try{await navigator.clipboard.writeText(draft.value);status.textContent='Message copied. Paste it into an email to info@aimseesucceed.org and send it.';}
    catch{draft.focus();draft.select();status.textContent='Select and copy the message below, then paste it into an email to info@aimseesucceed.org.';}
  });
})();
