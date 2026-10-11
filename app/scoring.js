export const INSTRUMENT_VERSION = 'ipip-neo-120-johnson-2014-v1';
const names = {O:'Openness',C:'Conscientiousness',E:'Extraversion',A:'Agreeableness',N:'Emotional reactivity'};
const facetNames = {
  N:['Anxiety','Anger','Depression','Self-consciousness','Immoderation','Vulnerability'],
  E:['Friendliness','Gregariousness','Assertiveness','Activity level','Excitement-seeking','Cheerfulness'],
  O:['Imagination','Artistic interests','Emotionality','Adventurousness','Intellect','Liberalism'],
  A:['Trust','Morality','Altruism','Cooperation','Modesty','Sympathy'],
  C:['Self-efficacy','Orderliness','Dutifulness','Achievement-striving','Self-discipline','Cautiousness']
};

function summarize(code,name,values){
  const sum=values.reduce((total,value)=>total+value,0);
  const mean=sum/values.length;
  return {code,name,sum,mean,position:(mean-1)*25,band:mean<2.5?'low':mean>3.5?'high':'middle'};
}

/** Answers are raw accuracy choices, never already reverse-scored values. */
export function scoreAssessment(questions,answers){
  if(!Array.isArray(questions)||questions.length!==120||!answers||typeof answers!=='object')throw new Error('A complete 120-item assessment is required.');
  const ids=new Set(questions.map(q=>q.id));
  if(ids.size!==120||Object.keys(answers).length!==120||Object.keys(answers).some(id=>!ids.has(id)))throw new Error('Answers must match the instrument exactly.');
  const groups=Object.fromEntries(Object.keys(names).map(code=>[code,Array.from({length:6},()=>[])]));
  for(const q of questions){
    if(!groups[q.domain]||!Number.isInteger(q.facet)||q.facet<1||q.facet>6||!['plus','minus'].includes(q.keyed))throw new Error('Invalid scoring key.');
    const value=answers[q.id];
    if(!Number.isInteger(value)||value<1||value>5)throw new Error('Every answer must be an integer from 1 to 5.');
    groups[q.domain][q.facet-1].push(q.keyed==='minus'?6-value:value);
  }
  const domains=Object.keys(names).map(code=>{
    if(groups[code].some(values=>values.length!==4))throw new Error('Each facet requires four items.');
    return {...summarize(code,names[code],groups[code].flat()),facets:groups[code].map((values,index)=>summarize(`${code}${index+1}`,facetNames[code][index],values))};
  });
  return {instrumentVersion:INSTRUMENT_VERSION,domains};
}

/** Editorial rules are deterministic and retain their underlying scores. */
export function createReport(result,content){
  return {...result,reportVersion:'editorial-v1-2026-10-11',introduction:content.introduction,limitations:content.limitations,
    domains:result.domains.map(d=>({...d,name:content.domains[d.code].name,
      description:content.domains[d.code].description,
      content:content.domains[d.code][d.band],
      ruleId:`${INSTRUMENT_VERSION}/${d.code}/${d.band}`,
      facets:d.facets.map(f=>({...f,name:content.facets[f.code].name,content:content.facets[f.code]}))
    }))};
}
