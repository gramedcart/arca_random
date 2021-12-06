"use strict";
async function run() {
    const loading = document.getElementById('loading')
    loading.style.visibility = 'visible'
    const url = document.getElementById('link').value
    const tempDiv = document.getElementById('temp')
    let page = 1
    let authorname = ''
    let Ulist = []
    let pre
    let already = []
    while (true) {
        try{
            loading.innerText = `로딩 중 ${page}`
            let response = await axios.get(`https://proxyana.herokuapp.com/${url}`, {
                params: {
                    cp: page,
                },
            });
            tempDiv.innerHTML = ''
            tempDiv.innerHTML = (response.data)
            let v = tempDiv.querySelectorAll('.info-row .user-info a')
            if (pre == v){
                break
            }
            authorname = v[0]
            if (v.length <= 1) {
                break
            }
            let isAdded = false
            for (let i = 1; i < v.length; i++) {
                const name = decodeURIComponent(v[i].getAttribute('href').split('@')[1])
                if(!Ulist.includes(name)){
                    isAdded = true
                    Ulist.push(name)
                }
            }
            if (!isAdded){
                console.log(Ulist)
                break
            }
            page += 1
            tempDiv.innerHTML = ''
        }
        catch{
            tempDiv.innerHTML = ''
            break
        }
    }
    tempDiv.innerHTML = ''
    loading.innerText = ''
    console.log(authorname)
    let tcz = [authorname]
    for(let i=0;i<document.getElementById('count').value;i++){
        console.log(i)
        for(let i2=0;i2<1000;i2++){
            const target = Ulist[Math.floor(Math.random() * Ulist.length)]
            if(!tcz.includes(target)){
                loading.innerText += target + '\n'
                tcz.push(target)
                console.log(tcz)
                break
            }
        }
    }
}