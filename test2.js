const fn=new Promise((resolve,reject)=>{
    setTimeout(function () {
        console.log(3)
        resolve()
    }, 2000);
})
async function a(){
    console.log(1)
    console.log(2)
    await fn
    console.log(4)
    console.log(5)
    
}
a()