"use strict";

let running = false

async function run(){
    if(running){
        return
    }
    running = true
    await run2()
    running = false
}


async function run2() {
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
            console.log(response)
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(response.data,"text/html");
            let v = xmlDoc.querySelectorAll('.info-row .user-info a')
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
        }
        catch{
            break
        }
    }
    const Channel = `/b/${url.split('/b/')[1].split('/')[0]}/`
    loading.innerText = '유저 뽑는중'
    let tcz = [authorname]
    let gojiCheck = []
    console.log(Ulist)
    const cou = document.getElementById('count').value
    for(let i=0;i<cou;i++){
        loading.innerText = `유저 뽑는중 ${i} / ${cou}`
        for(let i2=0;i2<1000;i2++){
            const target = Ulist[Math.floor(Math.random() * Ulist.length)]
            if(tcz.includes(target)){
                continue
            }
            if(bugoji){
                if(gojiCheck.includes(target)){
                    continue
                }
                const userUrl = `https://arca.live/u/@${encodeURIComponent(target)}`
                try {
                    const v = await axios.get(`${baseUrl}${userUrl}`)
                    const parser = new DOMParser();
                    const xmlDoc = parser.parseFromString(v.data,"text/html");
                    const l = xmlDoc.querySelectorAll('.card-block a');
                    let len = 0
                    for(let c of l){
                        const h = c.getAttribute('href')
                        if(h.startsWith(Channel) && (!h.includes('#c'))){
                            len += 1
                        }
                    }
                    if(len < 5){
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
        loading.innerText += i.replace('/','#') + '\n'
    }
    if(tcz.length === 0){

        loading.innerText = oldMode ? 
            '추첨에 실패하였습니다\n안전 모드를 켜고 시도해 보세요' :
            "추첨에 실패하였습니다"

    }
}