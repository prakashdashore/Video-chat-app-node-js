var socket = io();
('video-grid')
const peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '3000'
})
var currentUsr;
var otherUsr;
//PEER JS LOGIC HERE----------------------start

peer.on("open", id =>{
    // currentUsr = id;
    socket.emit("join-room",roomId,id)


})

// MASSAGESS-------------

var inputvalue = document.querySelector("#chat_message")
var chatVal;
inputvalue.addEventListener("keyup", e =>{
    if(e.key === 'Enter' && inputvalue.value != ""  ){
        socket.emit("msg",inputvalue.value)
        inputvalue.value = ''
    } 
    else if( inputvalue.value == "" ){
        alert("Please Type Valid Massage 🤷‍♂️ !!")
    }
   
})


socket.on("create-msg", msg =>{
    // console.log(msg)
    document.querySelector(".messages").innerHTML +=`
    <li><b>username</b><br>${msg}</li>
    
    
    `

})

// function scrollBot (){
//     const chatWindow = document.querySelector("main__chat_window");
//     chatWindow.scrollTop(chatWindow.prop("scrollHeight"))
// }
// scrollBot()


function connectMeToNewUser(userId,stream){
    console.log(userId)
    otherUsr = userId
    const call = peer.call(userId,stream)
    const video = document.createElement("video")
    call.on('stream',userVideoStream =>{
        addVideoStream(video,userVideoStream)
    })



}



// var lol = document.querySelector("#video")
const videoGrid = document.querySelector("#video-grid")
const myVideo = document.createElement('video')
myVideo.id = "my-video";
console.log(videoGrid)
console.log(myVideo)
myVideo.muted = true;
let myVideoStream;
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false

}).then(function (stream) {
    myVideoStream = stream;
    addVideoStream(myVideo, stream)

    peer.on('call',call=>{
        call.answer(stream)
        const video = document.createElement("video")
        call.on('stream',userVideoStream =>{
            addVideoStream(video,userVideoStream)
        })
    })
    


    socket.on("user-connected",(userId)=>{
        // console.log(`this is userid${userId}`)
        // otherUsr = userId;

        connectMeToNewUser(userId,stream)
    })

})



const addVideoStream = (video, stream) => {
    video.srcObject = stream;

    video.addEventListener("loadedmetadata", () => {
        video.play();
    });

    videoGrid.append(video)
}




const mutBtn = document.querySelector(".main__mute_button")
mutBtn.addEventListener("click", function(e){
    let enabled = myVideoStream.getAudioTracks()[0].enabled;
    if(enabled){
        myVideoStream.getAudioTracks()[0].enabled = false;
        mutBtn.innerHTML = `
        <i class="fa-solid fa-microphone-lines-slash"></i>
        <span>Unmute</span>

        `
    }
    else{
        myVideoStream.getAudioTracks()[0].enabled = true;
        mutBtn.innerHTML = `
        <div class="main__controls__button main__mute_button">
                <i class="fas fa-microphone"></i>
                <span>Mute</span>
             </div>

        `
        
    }

})

const videMuteUnmute = document.querySelector(".main__video_button")
videMuteUnmute.addEventListener("click",function(e){
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    console.log(enabled)
    if(enabled){
        myVideoStream.getVideoTracks()[0].enabled = false;
        videMuteUnmute.innerHTML =`
        <i class="fa-sharp fa-solid fa-video-slash"></i>
        <span>Play Video</span>
        `
    }else{
        myVideoStream.getVideoTracks()[0].enabled = true;
        videMuteUnmute.innerHTML = `
        <i class="fas fa-video"></i>
        <span>Stop Video</span>
        `
    }
})



console.log("current usr ",currentUsr)
console.log("other user ",otherUsr)