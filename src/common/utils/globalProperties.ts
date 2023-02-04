export const commonAlert = (msg: string) =>{
  if(!msg){
    return
  }
  uni.showToast({
    title: msg,
    icon:'none'
  })
};