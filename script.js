"use strict";




async function run() {
    const loading = document.getElementById('loading')
    loading.style.visibility = 'visible'
    const url = document.getElementById('link').value
    const bugoji = document.getElementById('bogoji').checked
    const tempDiv = document.getElementById('temp')
    const baseUrl = document.getElementById('oldMode').checked ? "https://proxyana.herokuapp.com/" : "https://arcatools.gramedcarts.workers.dev/urlbaseproxy/"
    let page = 1
    let authorname = ''
    let Ulist = []
    let pre
    let already = []
    function getPeople(p){
        return decodeURIComponent(p.getAttribute('href').split('@')[1])
    }
    function addPeople(p){
        try{
            const name = getPeople(p)
            if(!Ulist.includes(name)){
                Ulist.push(name)                
            }
        }
        catch{}
    }
    if(!url.includes('arca.live/b/')){
        loading.innerText = `잘못된 주소`
        return
    }
    
    while (true) {
        try{
            loading.innerText = `로딩 중 ${page}`
            let response = await axios.get(`${baseUrl}${url}`, {
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
            authorname = getPeople(v[0])
            if (v.length <= 1) {
                break
            }
            let Ulen = Ulist.length
            for (let i = 1; i < v.length; i++) {
                addPeople(v[i])
            }
            if (Ulen === Ulist.length){
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
    const Channel = `/b/${url.split('/b/')[1].split('/')[0]}`
    tempDiv.innerHTML = ''
    loading.innerText = '유저 뽑는중'
    let tcz = [authorname]
    let gojiCheck = []
    for(let i=0;i<document.getElementById('count').value;i++){
        for(let i2=0;i2<1000;i2++){
            const target = Ulist[Math.floor(Math.random() * Ulist.length)]
            console.log(Ulist)
            if(tcz.includes(target)){
                continue
            }
            if(bugoji){
                
                if(gojiCheck.includes(target)){
                    continue
                }
                const userUrl = `https://arca.live/u/@${encodeURIComponent(target)}`
                console.log(userUrl)
                try {
                    const v = await axios.get(`${baseUrl}${userUrl}`)
                    console.log(v.data.split(Channel).length)
                    if(v.data.split(Channel).length < 30){
                        gojiCheck.push(target)
                        continue
                    }
                } catch (error) {
                    console.log(error)
                }
            }
            tcz.push(target)
            break
        }
    }
    loading.innerText = ''
    tcz.shift()
    for(let i of tcz){
        loading.innerText += i + '\n'
    }
    if(tcz.length === 0){

        loading.innerText = oldMode ? 
            '추첨에 실패하였습니다\n안전 모드를 켜고 시도해 보세요' :
            "추첨에 실패하였습니다"

    }
}