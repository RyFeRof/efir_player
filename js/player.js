
const video=document.getElementById("video")
const playBtn=document.getElementById("playBtn")
const seek=document.getElementById("seek")
const timer=document.getElementById("time")
const controls=document.getElementById("controls")
const HIDE_DILEY=4000//через сколько будет скрыта панель управления
const startInto=time_parse("0") //тайминг начала интро
const endIntro=time_parse("5")  // тайминг конца интро
const startTitles=time_parse("3295") // тайминг начала титров
const endTitles=time_parse("3340") // тайминг конца титров
const skipBtn=document.getElementById("universalBtn")
const divBtns=document.getElementById("btns")
const film_logo=document.getElementById("film_logo")
const exitBtn=document.getElementById("exitBtn")
const volumeSeek=document.getElementById("volumeSeek")
const volumeBtn=document.getElementById("volumeBtn")
const innerVolBtn=document.getElementById("innerVolBtn")
const ARBtn=document.getElementById("ageRating")
const playBtnIco=document.getElementById("playBtnIco")
const toggleDownArrow=document.getElementById("toggle-btn-down-arrow")
const toggleUpWrrow=document.getElementById("toggle-btn-up-arrow")
const watchBtn=document.getElementById("Watch")
const SEEK_STEP=10
let IsWatchBtnClick=false
let hideTimer=0
console.log("Ошибка?")
innerVolBtn.addEventListener("mouseover",()=>{
    volumeSeek.classList.remove("hidden")
})
innerVolBtn.addEventListener("mouseleave",()=>{
    volumeSeek.classList.add("hidden")
})
volumeSeek.addEventListener("change",()=>{
    video.volume=Number(volumeSeek.value)/100
    const percent = volumeSeek.value / volumeSeek.max * 100 + "%";
    volumeSeek.style.setProperty("--valueDinamic", percent);
})
volumeSeek.addEventListener("input",()=>{
    const percent = volumeSeek.value / volumeSeek.max * 100 + "%";
    volumeSeek.style.setProperty("--valueDinamic", percent);
})
function updateUniversalBtns(time){
    const t=Number.isFinite(time)?time:video.currentTime
    let shouldShow=false
    if(t>=startInto && t<=endIntro){
        if(!IsWatchBtnClick){
            shouldShow=true
            skipBtn.textContent="Пропустить"
            watchBtn.textContent="Смотреть заставку"
        }
    }
    else if(t>=startTitles && t<=endTitles){
        if(!IsWatchBtnClick){
            shouldShow=true
            skipBtn.textContent="Следующая серия"
            watchBtn.textContent="Смотреть титры"
        }
    }
    else IsWatchBtnClick=false
   divBtns.classList.toggle("hidden",!shouldShow)

}
watchBtn.addEventListener("click",()=>{
    divBtns.classList.add("hidden")
    IsWatchBtnClick=true
})
skipBtn.addEventListener("click",()=>{
    let target=0
    if(Number.isFinite(video.duration))
        if(video.currentTime>=endIntro)target=endTitles
        else target=endIntro
    video.currentTime=target
    updateUniversalBtns(true)
})
function  time_parse(t){
    const mas=String(t).trim().split(':').map(Number)
    if(mas.some(n=>Number.isNaN(n))) return 0
    let res=0,numOfDigits=mas.length-1
    for(const i of mas)
        res+=i*(60**numOfDigits--)
    return res
}
function synchPlayer(){
    if(video.paused) playBtnIco.style="--icon-path:url('../assets/player_images/play.svg')"
    else playBtnIco.style="--icon-path:url('../assets/player_images/pause.svg')"
    
}
synchPlayer()
playBtn.addEventListener("click",()=>{
    if(video.paused)
        video.play()
    else
        video.pause()
    synchPlayer()
})
video.addEventListener("pause",synchPlayer)
video.addEventListener("play",synchPlayer)
function fmt(sec){
    sec=Math.floor(sec)
    const h=Math.floor(sec/3600)
    const m=Math.floor(sec/60)-h*60
    sec%=60
    return "- "+((h>0?String(h).padStart(2,"0")+":":"")+(String(m).padStart(2,"0")+":")+(String(sec).padStart(2,"0")))
}
function loadedmetadata(){
    seek.max=video.duration
    volumeSeek.value=volumeSeek.max
    const percent = volumeSeek.value / volumeSeek.max * 100 + "%";
    volumeSeek.style.setProperty("--valueDinamic", percent);
    timer.textContent=fmt(video.duration-video.currentTime)
    updateUniversalBtns()
}
let isSeeking=false
video.addEventListener("timeupdate",()=>{
    if(!isSeeking) seek.value=video.currentTime
    timer.textContent=fmt(video.duration-seek.value)
    const percent = seek.value / seek.max * 100 + "%";
    seek.style.setProperty("--value", percent);
    updateUniversalBtns()
})
seek.addEventListener("input",()=>{
    const percent = seek.value / seek.max * 100 + "%";
    seek.style.setProperty("--value", percent);
    isSeeking=true
    timer.textContent=fmt(video.duration-seek.value)
    updateUniversalBtns()
})
seek.addEventListener("change",()=>{
    
    isSeeking=false
    video.currentTime=seek.value
    timer.textContent=fmt(video.duration-seek.value)
})
video.addEventListener("click",()=>{
    if(video.paused)
        video.play()
    else
        video.pause()
    synchPlayer()
})

const player=document.getElementById("player")
const sizeChangeBtn=document.getElementById("sizeChangeBtn")
function isFoolScreen(){
    return document.fullscreenElement===player
}
async function toggleFullScreen() {
    try{
        if(!isFoolScreen()){
            await player.requestFullscreen()
            toggleDownArrow.style=""
            toggleUpWrrow.style="transform:rotate(180deg)"
        }
        else{
            await document.exitFullscreen()
            toggleUpWrrow.style=""
            toggleDownArrow.style="transform:rotate(180deg)"
        }
            
    }
    catch (e){
        console.error("Ошибка полноэкранного режима: ",e)
    }
}
video.addEventListener("dblclick",()=>{
    toggleFullScreen()
})
sizeChangeBtn.addEventListener("click",toggleFullScreen)
window.addEventListener("keydown",(e)=>{
    if(e.key.toLowerCase()==="f")
    {
        if(e.repeat) return
        toggleFullScreen()
        return
    }
    if(e.code==="Space"){
        e.preventDefault()
        showControls()
        if(e.repeat) return
        if(video.paused) video.play()
        else video.pause()
        synchPlayer()
        return
    }
    if(e.code==="ArrowRight"){
        e.preventDefault()
        if(e.repeat) showControls
        const dur=Number.isFinite(video.duration)?video.duration:Infinity
        video.currentTime=Math.min(video.currentTime+SEEK_STEP,dur)
        return
    }
    if(e.code==="ArrowLeft"){
         e.preventDefault()
         if(e.repeat) showControls
        video.currentTime=Math.max(video.currentTime-SEEK_STEP,0)
        return
    }
})
function showAgeRating(){
    ARBtn.classList.remove("hidden")
    if(hideTimer) clearTimeout(hideTimer)
    hideTimer=setTimeout(()=>{ARBtn.classList.add("hidden")},HIDE_DILEY)
}
function showControls(){
    ARBtn.classList.add("hidden")
    controls.classList.remove("hidden")
    film_logo.classList.remove("hidden")
    exitBtn.classList.remove("hidden")
    if(hideTimer) clearTimeout(hideTimer)
    hideTimer=setTimeout(()=>{
if(!video.paused)
    {controls.classList.add("hidden") 
    film_logo.classList.add("hidden")
    exitBtn.classList.add("hidden")
    showAgeRating()
}},HIDE_DILEY)
}
window.addEventListener("mousemove",showControls)
player.addEventListener("mouseleave",()=>{
    if(!video.paused){
         controls.classList.add("hidden")
         film_logo.classList.add("hidden")
         exitBtn.classList.add("hidden")
         showAgeRating()
    }
})
video.addEventListener("loadedmetadata",loadedmetadata)
loadedmetadata()
synchPlayer()