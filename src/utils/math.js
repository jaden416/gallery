export function offset(index){
  let stagger
  0 === index ? stagger = 1.1 : 1 === index ? stagger = 1.15 : 2 === index ? stagger = 1.2 : 3 === index ? stagger = 1.25 : 4 === index ? stagger  = 1.3 : 5 === index ? stagger = 1.35 : null
  return stagger
}