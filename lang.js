class variable{
  constructor(name,value,time){
    this.name = name
    this.value = value
    this.time = time
  }
}
function sort(raws){
  raw = raws.split(';')
  for(let b in raw){
    raw[b] = raw[b].trim()
  }
  raw.pop()
  return raw;
} 
class func{
  constructor(name,code,args){
    this.name = name
    this.code = code
    this.args = args
  }
}
class execution{
  constructor(name,time,args = []){
    this.name = name
    this.time = time
    this.vars = {}
    this.funcs = {}
    this.isNewln = true;
    args.forEach(arg => this.vars[arg.name] = arg)
  }
  check_native(na){
    let fulln = na.split('(')[0]
    let ag = na.split('(').pop().split(')')[0].split(',')
    let cheq = na.split('(')[0]
    switch(cheq){
      case '@print':
        if(this.evals(ag[0]) == ag[0]){
          console.log(ag[0])
        }
        else{
          console.log((this.evals(ag[0]).value).toString())
        }
        return [true,ag[0]]
        break
    }
    return [false]
  }
  run_function(name){
    let args = name.split('(').pop().split(')')[0].split(',')
    let foo = this.funcs[name.split('(')[0]];
    let code = foo.code
    for(let c in foo.args){
          this.vars['$' + foo.args[c]] = new variable(foo.args[c],this.evals(args[c]),1)
    }
    let temp = ''
    let redy = []
    for(let a in code){
      if(code[a].charAt(code[a].length - 1) == ','){
        temp += ' ' + code[a].slice(0,-1)
        redy.push(temp.substring(1))
        temp = ''
      }
      else{
        temp += ' ' + code[a]
      }
      
    }
    redy.push(temp.substring(1))
    for(let a in redy){
      if(redy[a].split(' ')[0] != 'return'){
        this.line(redy[a])
      }
      else{
        return this.eval(redy[a].split(' ')[1])
      }
    }
  }
  evals(name){
    let result = this.vars[name]
    if(typeof result == null || name.charAt(0) != '$'){
      result = this.funcs[name.split('(')[0]]
      if(result == null){
        result = this.check_native(name)
        if(result[0] == false){
          return name
        }
        else{
          return result
        }
      }
      console.log("SEAL" + name)
      if(name.charAt(0) == '@'){
        
        return this.run_function(name);
      }
      return name
    }
    else{
      return this.vars[name]
    }
    return name
  }
  line(line){
      let split = line.split(' ')
      let check = this.evals(split[0]) 
      switch(check) {
        case '//':
          return;
        case 'var':
          let name,time;
          let check = this.evals(split[1])
          if(check.includes('#')){
            name = this.evals(split[1].split('#')[0],split).split('#')[0]
            time = parseInt(this.evals(split[1].split('#')[1]))
          }
          else{
            name = split[1]
            time = 1
          }
          let items = split.slice(2)
          for(let a in items){
            items[a] = this.evals(items[a])
          }
          this.vars['$' + name] = new variable(name,items,time)
          break;
        case 'function':
          let nam,arg,cod,tru,temp
          nam = this.evals(split[1].split('(')[0])
          arg = split[1].split('(').pop().split(')')[0].split(',')
          cod = split.slice(2)
          temp = []
          tru = []
          for(let a in cod){
            cod[a] = cod[a].trim()
            if(cod[a] == ''){
              cod.splice(a,1)
              
            }
            
          }
          let a =  new func(nam,cod,arg)
          this.funcs['@' + nam] = a
          break
          
        default:
          }
            
  }
};
module.exports = {
  Execution: execution,
  Variable: variable,
  Function: func,
  sort: sort
}