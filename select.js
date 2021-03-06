var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight;
window.onload = function (){
  
  var old_version = document.getElementById('version').innerHTML;
  check_version_v3("../../../js/version_v3.txt",old_version,"select",function(rst){
    if(rst =="ignore")
      console.log(" select 버전 업그레이드 해주세요");
    else if(rst=="fail")
    {
      location.reload();
    }  
  });

  setTimeout(() => {
    make_base64_from_profileImage();
  }, 5000); 
  windowWidth = window.innerWidth;
  windowHeight = window.innerHeight;
  if(!is_mobile()){
    var logo = document.querySelector('.logo');
    logo.style.width = "258px";
    logo.style.height = "104px"

    document.querySelector('header').style.paddingBottom = "27px";
    document.querySelector('.version').style.bottom = "27px";

    var info = document.querySelector('.info');
    info.style.width = "600px";
    info.style.flexDirection = "row-reverse";
    info.style.justifyContent = "space-between";
    info.style.paddingBottom = "20px";

    var user = document.getElementsByClassName('user');
    for(var i = 0; i < user.length; i++){
      user[i].style.width = "296px";
      user[i].style.paddingLeft = user[i].style.paddingRight = "15px";
    }

    var btn = document.getElementsByClassName('tabBtn');
    for(var i = 0; i < btn.length; i++){
      btn[i].style.width = "200px";
    }

    document.querySelector('.typeTab').style.width = "600px";

    var orangebox = document.getElementsByClassName('orangebox');
    for(var i = 0; i < orangebox.length; i++){
      orangebox[i].style.width = "600px";
      orangebox[i].style.height = "657px";
    }
    document.querySelector('.orangebox.picture').style.height = "547px";

    document.querySelector('.upTxt').style.marginTop = "12px";

    var msgBox = document.querySelector('.msgBox');
    msgBox.style.width = "600px";
    msgBox.style.height = "45px";
    msgBox.style.fontSize = "16px";
    msgBox.style.marginBottom = "20px"

    var sendBtn = document.querySelector('.sendBtn');
    sendBtn.style.width = "600px";
    sendBtn.style.height = "45px";
    sendBtn.style.borderRadius = "23px";

    var sendIcon = document.querySelector('.sendIcon');
    sendIcon.style.width = "19.71px";
    sendIcon.style.height = "20px";
    sendIcon.style.marginRight = "10.88px";

    
    var voteListBox = document.querySelector('.voteListBox');
    voteListBox.classList.remove('mVote');
    voteListBox.classList.remove('mVote1');
    voteListBox.classList.add('pcVote');
    voteListBox.classList.add('pcVote2');

    var toggleCol = document.querySelector('#toggleCol');
    toggleCol.setAttribute('value', '2');
    toggleCol.setAttribute('src', 'img/1row.svg');
    toggleCol.style.top = "7px";
    toggleCol.style.right = "3px";

    document.querySelector('.orangebox.vote').style.paddingRight = "9px";

    var slideContainer = document.querySelector('#slideContainer');
    slideContainer.style.width = "594px";
    slideContainer.style.height = "334.125px";

    //var cropPointer = document.querySelector('.cropper-point.point-se');
    //cropPointer.style.width = "22px";
    //cropPointer.style.height = "22px";
    
  }
  else{
    adjust_size(windowHeight);
  }
}

var profileImageBase64 = "";
function make_base64_from_profileImage()
{
  var user = parent.gapi.auth2.getAuthInstance().currentUser.get();
  var profile = user.getBasicProfile();
  
  
  parent.sunny.getBase64Image(profile.getImageUrl(),function(imgData){

    profileImageBase64 = "data:image/png;base64,"+imgData;
    console.log("profile base64 ",profileImageBase64);
    profile_image = new Image();
    profile_image.setAttribute('src', profileImageBase64);
  });
}

function is_mobile()
{
  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    return true;
  }
  
  if (typeof window.orientation !== 'undefined') {
    return true;
  }
  
  var iOSios = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
  if(iOSios)
    return true;

  return false;    
}

var picture = document.querySelector('.picture');
var upPicBox = document.querySelector('.upPicBox');
var showPic = document.querySelector('.showPic');
var result = document.querySelector('.result');
var editBtn = document.querySelector('.editBtn');
var toggleBtn = document.querySelector('#toggleBtn')
var msgBox = document.querySelector('.msgBox');

var cropper;

var newCanvas = null; //자른 이미지 놓을 canvas
var croppedCanvas = null;
var originalImage;

var chatbox_background;
var profile_image;

var commands = [];  //버튼 명령을 저장하는 배열
var rotateCount = 0;  //원본 이미지를 회전 정보
var btnDisable = false; //크롭 확인 버튼 비활성화

function load_image(input){

  if(parent.sunny == null  || !parent.sunny.is_ready_for_everything())
  {
    parent.sunny_modal.show_alert_only("not ready yet",false);
    return;
    alert("not ready yet");
    return;
  }
  
  if(!parent.sunny.is_coordinator_collecting())
  {
    //alert("coordinator is not collecting image or video");
    parent.sunny_modal.show_alert_only("coordinator is not collecting",false);
    return;

  }

  if(!input.files[0]) return;
  else{
    upPicBox.style.display = "none";

    var newImage = document.createElement("img");
    newImage.setAttribute("id", 'newPic');

    var file = input.files[0];
    original_image_file = file;
    newImage.src = URL.createObjectURL(file);
    showPic.appendChild(newImage);

    chatbox_background = new Image();
    chatbox_background.crossOrigin = 'Anonymous';
    chatbox_background.src = "img/chatbox_background.svg";

    //원본 이미지의 정보 저장
    var fileReader = new FileReader();
    fileReader.onload = function(e){
      originalImage = new Image();
      originalImage.src = e.target.result;
    }
    fileReader.readAsDataURL(file);

    showPic.style.display = "block";
    picture.style.marginBottom = "0px";
    var opt = document.getElementsByClassName('option');
    for(var i = 0; i < opt.length; i++){
      opt[i].style.display = "block";
    }

    newImage.style.width = "100%";
    newImage.style.height = "100%";
    newImage.style.objectFit = "contain";

    edit_image();

    editBtn.style.display = "flex";
    if(!is_mobile()){ editBtn.style.top = "502px"; }
  }
}


function edit_image(){
  const image = document.getElementById('newPic');
  cropper = new Cropper(image, {
    viewMode: 1,
    dragMode: 'move',
    aspectRatio: 16 / 9,
    center: false,
    highlight: false,
    background: false,
    autoCropArea: 1,
    crop(event) {},
  });
}


function toggle_cropper(){
  if(toggleBtn.getAttribute('value') === 'on'){
    toggle_set();
  }
  else{
    toggle_reset();
  }
}
function toggle_reset(){
  cropper.crop();
  btnDisable = false;
  toggleBtn.setAttribute('value', 'on');
  toggleBtn.setAttribute('src', 'img/toggle_grid_on@3x.png');
}
function toggle_set(){
  cropper.clear();
  btnDisable = true;
  toggleBtn.setAttribute('value', 'off');
  toggleBtn.setAttribute('src', 'img/toggle_grid_off@3x.png');
}

function rotateLeft(){
  cropper.rotate(-90);
  commands.push("rotate_L");
  rotateCount--;
}
function rotateRight(){
  cropper.rotate(90);
  commands.push("rotate_R");
  rotateCount++;
}

function get_image(){
  if(btnDisable){return;}
  else{
    newCanvas = null;
    newCanvas = document.createElement("canvas");

    if(is_mobile()){
      newCanvas = cropper.getCroppedCanvas({
        width: 333,
        height: 359
      });
    }
    else{
      newCanvas = cropper.getCroppedCanvas({
      width: 594,
      height: 541
    });
    }
    
    croppedCanvas = null;
    croppedCanvas = document.createElement("canvas");
    croppedCanvas = cropper.getCroppedCanvas({
      width: 1464,
      height: 823
    });

    result.appendChild(newCanvas);
    result.appendChild(croppedCanvas);

    result.style.display = "flex";
    croppedCanvas.style.display = "none";
    result.style.alignItems = "center";
    showPic.style.display = "none";
    btnDisable = true;
    commands.push("done");
  }
}

function undo(){
  var lastCommand = commands.pop();
  if(!lastCommand) return;
  switch(lastCommand){
    case "rotate_L":
      cropper.rotate(90);
      rotateCount++;
      break;
    case "rotate_R":
      cropper.rotate(-90);
      rotateCount--;
      break;
    case "done":
      showPic.style.display = "block";
      result.style.display = "none";
      while (result.firstChild) {
        result.removeChild(result.firstChild);
      }
      newCanvas = croppedCanvas = null;
      btnDisable = false;
      break;
  }
}

var padding_ptx = 5;
function rotateOriginal(){
  var originalCanvas = document.querySelector("#originalCanvas");
  var originalContext = originalCanvas.getContext('2d');
  var editedWidth = editedHeight = 0;
  var originalRatio = originalImage.width / originalImage.height;
  
  originalContext.clearRect(0, 0, originalCanvas.width, originalCanvas.height);
  originalContext.save();

  var rotate = rotateCount % 4;
  if (rotate < 0) rotate += 4;

  if(rotate==0 || rotate==2){
    if(originalRatio < 16/9){
      editedHeight = originalCanvas.height;
      editedWidth = editedHeight * originalRatio;
    }
    else{
      editedWidth = originalCanvas.width;
      editedHeight = editedWidth / originalRatio;
    }
  }
  else{
    if(originalRatio < 9/16){
      editedHeight = originalCanvas.width;
      editedWidth = editedHeight * originalRatio;
    }
    else{
      editedWidth = originalCanvas.height;
      editedHeight = editedWidth / originalRatio;
    }
  }
  
  originalContext.filter = 'blur(50px)';
  
  
  switch(rotate){
    case 0:
      originalContext.drawImage(originalImage, 0, 0, originalCanvas.width, originalCanvas.height);
      originalContext.filter = 'none';
      if(originalRatio < 16/9){
        originalContext.drawImage(originalImage, (originalCanvas.width-editedWidth)/2 + padding_ptx, 0 +padding_ptx, editedWidth-padding_ptx*2, editedHeight-padding_ptx*2);
      }
      else{
        originalContext.drawImage(originalImage, 0 + padding_ptx, (originalCanvas.height-editedHeight)/2 + padding_ptx, editedWidth-padding_ptx*2, editedHeight-padding_ptx*2);
      }
      break;
    case 1:
      originalContext.rotate((Math.PI / 180) * 90);
      originalContext.translate(0, -originalCanvas.width);
      originalContext.drawImage(originalImage, 0, 0, originalCanvas.height, originalCanvas.width);
      originalContext.filter = "none";
      if(originalRatio < 9/16){
        originalContext.drawImage(originalImage, (originalCanvas.height-editedWidth)/2 + padding_ptx, 0 + padding_ptx, editedWidth-padding_ptx*2, editedHeight-padding_ptx*2);
      }
      else{
        originalContext.drawImage(originalImage, 0 +padding_ptx, (originalCanvas.width-editedHeight)/2 + padding_ptx, editedWidth -padding_ptx*2, editedHeight-padding_ptx*2);
      }
      break;
    case 2:
      originalContext.rotate((Math.PI / 180) * 180);
      originalContext.translate(-originalCanvas.width, -originalCanvas.height);
      originalContext.drawImage(originalImage, 0, 0, originalCanvas.width, originalCanvas.height);
      originalContext.filter = 'none';
      if(originalRatio < 16/9){
        originalContext.drawImage(originalImage, (originalCanvas.width-editedWidth)/2 + padding_ptx, 0 + padding_ptx, editedWidth-padding_ptx*2, editedHeight-padding_ptx*2);
      }
      else{
        originalContext.drawImage(originalImage, 0+ padding_ptx, (originalCanvas.height-editedHeight)/2 + padding_ptx, editedWidth-padding_ptx*2, editedHeight-padding_ptx*2);
      }
      break;
    case 3:
      originalContext.rotate((Math.PI / 180) * 270);
      originalContext.translate(-originalCanvas.height, 0);
      originalContext.drawImage(originalImage, 0, 0, originalCanvas.height, originalCanvas.width);
      originalContext.filter = 'none';
      if(originalRatio < 9/16){
        originalContext.drawImage(originalImage, (originalCanvas.height-editedWidth)/2 + padding_ptx, 0 + padding_ptx, editedWidth-padding_ptx*2, editedHeight-padding_ptx*2);
      }
      else{
        originalContext.drawImage(originalImage, 0 + padding_ptx, (originalCanvas.width-editedHeight)/2 + padding_ptx, editedWidth-padding_ptx*2, editedHeight-padding_ptx*2);
        }
      break;  
  }
  originalContext.restore();
  return originalCanvas;
}

function reset_image_box(){
  //편집 버튼, 이미지창, 메시지칸, 확인버튼 안보이도록
  editBtn.style.display = "none";
  showPic.style.display = "none";
  result.style.display = "none";
  var opt = document.getElementsByClassName('option');
  for(var i = 0; i < opt.length; i++){
    opt[i].style.display = "none";
  }
  //업로드 박스 다시 보이도록
  upPicBox.style.display = "block";
  picture.style.marginBottom = "30px";
  //이전 이미지 지우고 메시지, 명령배열 등 초기화
  while (showPic.firstChild) {
    showPic.removeChild(showPic.firstChild);
  }
  while (result.firstChild) {
    result.removeChild(result.firstChild);
  }  
  newCanvas = croppedCanvas = null;
  msgBox.value='';
  btnDisable = false;
  commands = [];
  rotateCount = 0;
  toggle_reset();
}

function cancelUpload(){
  cropper.destroy();
  reset_image_box();
}

function chatbox(canvas){
  var context = canvas.getContext('2d');

  var user = parent.gapi.auth2.getAuthInstance().currentUser.get();
  var profile = user.getBasicProfile();
  var profile_name = profile.getName();
  var msg = msgBox.value.trim();
  
  context.font = "bold 22px Roboto";
  context.fillStyle = "#ffffff";
  context.textBaseline = "top";

  /* profile background */
  var x = 17;
  var y = 17;
  var radius = 10;
  var width = context.measureText(profile_name).width + 82;
  var height = 56;
  context.save();
  context.beginPath();
  context.fillStyle = 'rgba(0, 0, 0, 0.5)';
  context.moveTo(x, y + radius);
  context.lineTo(x, y + height - radius);
  context.arcTo(x, y + height, x + radius, y + height, radius);
  context.lineTo(x + width - radius, y + height);
  context.arcTo(x + width, y + height, x + width, y + height-radius, radius);
  context.lineTo(x + width, y + radius);
  context.arcTo(x + width, y, x + width - radius, y, radius);
  context.lineTo(x + radius, y);
  context.arcTo(x, y, x, y + radius, radius);
  context.closePath();
  context.fill();
  context.restore();
  /* profile image */
  context.save();
  context.beginPath();
  context.arc(50, 45, 17, 0, Math.PI * 2, true);
  context.closePath();
  context.clip();
  context.drawImage(profile_image, 33, 28, 34, 34);
  context.restore();
  /* profile name */
  context.fillText(profile_name, 75, 33);
  /* chatbox backgound */
  context.drawImage(chatbox_background, 413, 17, 637, 60);
  /* message */
  var msg_width = context.measureText(msg).width;
  if(msg_width > 575){
    var ellipsis = '...';
    var ellipsis_width = context.measureText(ellipsis).width;
    var msg_len = msg.length;
    while(msg_width >= 575 - ellipsis_width && msg_len-- > 0){
      msg = msg.substring(0, msg_len);
      msg_width = context.measureText(msg).width;
    } 
    msg += ellipsis;
  }
  context.fillText(msg, 731.5 - (msg_width/2), 35);
}

function upload_image(){
  

  
  var msg = msgBox.value.trim();
  console.log(msg);
  if(msg == null || msg == ""){
    parent.sunny_modal.show_alert_only("메시지를 입력하세요",false);
    return;
  }

  //try{
    if(toggleBtn.getAttribute('value') == 'on')
    {
      //영역을 선택하지 않았을 때
      if(newCanvas == null){
        parent.sunny_modal.show_alert_only("영역을 선택하세요",false);
        return;

      }
      
      var thumbnailCanvas = document.getElementById("thumbnail");
      var tbumbnailContext = thumbnailCanvas.getContext("2d");

      thumbnailCanvas.width = "343";
      thumbnailCanvas.height = "191";
      tbumbnailContext.clearRect(0, 0, thumbnailCanvas.width, thumbnailCanvas.height);

      
      tbumbnailContext.drawImage(croppedCanvas, 0, 0, 343, 191);
      var thumbnailData = thumbnailCanvas.toDataURL("image/jpeg",0.7);

      var canvas = document.getElementById("Canvas2");
      var canvasContext = canvas.getContext("2d");
      canvasContext.clearRect(0, 0, canvas.width, canvas.height);
      canvasContext.drawImage(croppedCanvas, 0, 0, canvas.width, canvas.height);


      chatbox(canvas);

      parent.sunny.uploadToGD_base64(thumbnailData,msg,canvas.toDataURL("image/PNG",1),"image",function(rst){
        canvasContext.clearRect(0, 0, canvas.width, canvas.height);
        console.log(rst);
      });

     
  

    }

    else
    {
      //위 if문 안의 코드 참고해서 작성했습니다
      //크롭이미지 캔버스 자리에 회전시킨 원본을 그린 캔버스를 작성했습니다
      var thumbnailCanvas = document.getElementById("thumbnail");
      var tbumbnailContext = thumbnailCanvas.getContext("2d");

      thumbnailCanvas.width = "343";
      thumbnailCanvas.height = "191";
      tbumbnailContext.clearRect(0, 0, thumbnailCanvas.width, thumbnailCanvas.height);

      
      tbumbnailContext.drawImage(rotateOriginal(), 0 +padding_ptx, 0+padding_ptx, 343-padding_ptx*2, 191-padding_ptx*2);
      var thumbnailData = thumbnailCanvas.toDataURL("image/jpeg",0.7);

      var canvas = document.getElementById('originalCanvas');
      chatbox(canvas);

      parent.sunny.uploadToGD_base64(thumbnailData,msg,canvas.toDataURL("image/PNG",1),"image",function(rst){
        canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
      });

      

      /*
      parent.sunny.uploadToGD_base64(thumbnailData,msg,rotateOriginal().toDataURL("image/PNG",1),"image",function(rst){
        parent.sunny.uploadToGD_base64(thumbnailData,msg,rotateOriginal().toDataURL("image/PNG",1),"image",function(rst){
          parent.sunny.uploadToGD_base64(thumbnailData,msg,rotateOriginal().toDataURL("image/PNG",1),"image",function(rst){
            parent.sunny.uploadToGD_base64(thumbnailData,msg,rotateOriginal().toDataURL("image/PNG",1),"image",function(rst){
              parent.sunny.uploadToGD_base64(thumbnailData,msg,rotateOriginal().toDataURL("image/PNG",1),"image",function(rst){
                parent.sunny.uploadToGD_base64(thumbnailData,msg,rotateOriginal().toDataURL("image/PNG",1),"image",function(rst){
                  parent.sunny.uploadToGD_base64(thumbnailData,msg,rotateOriginal().toDataURL("image/PNG",1),"image",function(rst){
                    parent.sunny.uploadToGD_base64(thumbnailData,msg,rotateOriginal().toDataURL("image/PNG",1),"image",function(rst){
                      parent.sunny.uploadToGD_base64(thumbnailData,msg,rotateOriginal().toDataURL("image/PNG",1),"image",function(rst){
                        parent.sunny.uploadToGD_base64(thumbnailData,msg,rotateOriginal().toDataURL("image/PNG",1),"image",function(rst){
                          parent.sunny.uploadToGD_base64(thumbnailData,msg,rotateOriginal().toDataURL("image/PNG",1),"image",function(rst){
                            parent.sunny.uploadToGD_base64(thumbnailData,msg,rotateOriginal().toDataURL("image/PNG",1),"image",function(rst){
                              parent.sunny.uploadToGD_base64(thumbnailData,msg,rotateOriginal().toDataURL("image/PNG",1),"image",function(rst){
                                parent.sunny.uploadToGD_base64(thumbnailData,msg,rotateOriginal().toDataURL("image/PNG",1),"image",function(rst){
                                  parent.sunny.uploadToGD_base64(thumbnailData,msg,rotateOriginal().toDataURL("image/PNG",1),"image",function(rst){
                                    parent.sunny.uploadToGD_base64(thumbnailData,msg,rotateOriginal().toDataURL("image/PNG",1),"image",function(rst){
                                      parent.sunny.uploadToGD_base64(thumbnailData,msg,rotateOriginal().toDataURL("image/PNG",1),"image",function(rst){
                                        parent.sunny.uploadToGD_base64(thumbnailData,msg,rotateOriginal().toDataURL("image/PNG",1),"image",function(rst){
                                          parent.sunny.uploadToGD_base64(thumbnailData,msg,rotateOriginal().toDataURL("image/PNG",1),"image",function(rst){
                                            parent.sunny.uploadToGD_base64(thumbnailData,msg,rotateOriginal().toDataURL("image/PNG",1),"image",function(rst){
                                              parent.sunny.uploadToGD_base64(thumbnailData,msg,rotateOriginal().toDataURL("image/PNG",1),"image",function(rst){
                                                parent.sunny.uploadToGD_base64(thumbnailData,msg,rotateOriginal().toDataURL("image/PNG",1),"image",function(rst){
                                                  parent.sunny.uploadToGD_base64(thumbnailData,msg,rotateOriginal().toDataURL("image/PNG",1),"image",function(rst){
                                                    parent.sunny.uploadToGD_base64(thumbnailData,msg,rotateOriginal().toDataURL("image/PNG",1),"image",function(rst){
                                                      parent.sunny.uploadToGD_base64(thumbnailData,msg,rotateOriginal().toDataURL("image/PNG",1),"image",function(rst){
                                                        parent.sunny.uploadToGD_base64(thumbnailData,msg,rotateOriginal().toDataURL("image/PNG",1),"image",function(rst){
                                                          parent.sunny.uploadToGD_base64(thumbnailData,msg,rotateOriginal().toDataURL("image/PNG",1),"image",function(rst){
                                                            parent.sunny.uploadToGD_base64(thumbnailData,msg,rotateOriginal().toDataURL("image/PNG",1),"image",function(rst){
                                                              parent.sunny.uploadToGD_base64(thumbnailData,msg,rotateOriginal().toDataURL("image/PNG",1),"image",function(rst){
        
                                                              });
                                                            });
                                                          });
                                                        });
                                                      });
                                                    });
                                                  });
                                                });
                                              });
                                            });
                                          });
                                        });
                                      });
                                    });
                                  });
                                });
                              });
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
      */
      
      
    
    }
  //}
  //catch(err)
  {
    //console.log(err.message);
  }

  reset_image_box();
}
function create_blur_image_using_fastblur(f,callback)
{
  var canvas= document.getElementById("fastblur");
  canvas.setAttribute("id", 'canvas_for_blur');
  canvas.width = 343;
  canvas.height = 194;
  var ctx=canvas.getContext("2d");
  var cw=canvas.width;
  var ch=canvas.height;

  
  // get the dataURL of your div's background
  

  // build an image from the dataURL
  var img=new Image();
  //img.crossOrigin='anonymous';
  img.onload=function(){
  
    
    
    //fit size 사이즈 맞게
    var hRatio = canvas.width  / img.width    ;
    var vRatio =  canvas.height / img.height  ;
    var ratio  = Math.max ( hRatio, vRatio );
    var centerShift_x = ( canvas.width - img.width*ratio ) / 2;
    var centerShift_y = ( canvas.height - img.height*ratio ) / 2;  
    ctx.clearRect(0,0,canvas.width, canvas.height);
    ctx.filter = 'blur(4px)';
    ctx.drawImage(img, 0,0, img.width, img.height,
                      centerShift_x,centerShift_y,img.width*ratio, img.height*ratio);  

                      
    var canvasBlur = new CanvasFastBlur({blur: 6 });  
    canvasBlur.initCanvas(canvas);
    canvasBlur.gBlur(6);

    canvasBlur.initCanvas(canvas);
    ctx.drawImage(img,0,0,100,100);

    var dataURI = canvas.toDataURL("image/JPEG",0.5);
    callback(dataURI);
                      
    //StackBlur.image(img, canvas, 5,false);
    
    /*
    var dataURI = canvas.toDataURL("image/JPEG",0.5);
    //console.log(dataURI);
    sunny.uploadToGD_base64_only(dataURI,function(blurFileId){
      console.log(blurFileId);
      yestoslideAuto.prototype.add_email_to_sharedLink(blurFileId,"yestoslide@gmail.com",function(rst){
        console.log("add yestoslide@gmail.com to blured file");
        callback(blurFileId);
      });
      
    })
    */
  }

  img.src=URL.createObjectURL(f);
}

// 투표 탭 열 전환 버튼
function toggle_column(btn){
  var voteListBox = document.querySelector('.voteListBox');
  if(btn.getAttribute('value') === '2'){
    btn.setAttribute('value', '1');
    btn.setAttribute('src', 'img/2row2.svg');
    if(is_mobile()){
      voteListBox.classList.toggle('mVote2');
      voteListBox.classList.toggle('mVote1');
    }
    else{
      voteListBox.classList.toggle('pcVote2');
      voteListBox.classList.toggle('pcVote1');
    }
  }
  else{
    btn.setAttribute('value', '2');
    btn.setAttribute('src', 'img/1row.svg');
    if(is_mobile()){
      voteListBox.classList.toggle('mVote2');
      voteListBox.classList.toggle('mVote1');
    }
    else{
      voteListBox.classList.toggle('pcVote2');
      voteListBox.classList.toggle('pcVote1');
    }
  }
}

// 투표, 슬라이드 탭 모바일 높이
function adjust_size(height) {
  if(is_mobile()){
    if(window.orientation == 0){
      var orangebox = document.getElementsByClassName("orangebox");
      var voteListBox = document.querySelector(".voteListBox");

      for(var i = 1; i < orangebox.length; i++){
        orangebox[i].style.height = `${height - 230}px`;
      }
      voteListBox.style.height = `${height - 236}px`;
    }
  }
}

// 슬라이드 탭 모바일 회전
window.addEventListener('resize', function () {
	if(is_mobile() && document.getElementById('pills-slide').classList.contains('active')) {
    var slideBox = document.querySelector('.slide');
    var slideContainer = document.querySelector('#slideContainer');
    if(window.matchMedia('(orientation: landscape)').matches){
      document.querySelector('.header').style.display = "none";
      document.querySelector('.info').style.display = "none";
      document.querySelector('.typeTab').style.display = "none";
      document.querySelector('body').style.backgroundColor = "#c9c9c9";
      slideBox.style.marginBottom = "0px";
      if(window.matchMedia('(min-width: 768px)').matches || is_tablet()){
        slideBox.style.position = "absolute";
        slideBox.style.setProperty('top', 'calc((100vh - ((9 / 16) * 100vw))/2)');
        slideBox.style.setProperty('left', '0');
        slideBox.style.setProperty('width', '100vw');
        slideBox.style.setProperty('maxWidth', '100vw');
        slideBox.style.setProperty('height', 'calc((9 / 16) * 100vw)');
        slideBox.style.setProperty('maxHeight', 'calc((9 / 16) * 100vw)');
        slideContainer.style.setProperty('width', 'calc(100vw - 6px)');
        slideContainer.style.setProperty('height', 'calc(((9 / 16) * 100vw) - 6px)');
      }
      else{
        slideBox.style.setProperty('width', 'calc((16 / 9) * 100vh)');
        slideBox.style.setProperty('maxWidth', 'calc((16 / 9) * 100vh)');
        slideBox.style.height = "100vh";
        slideBox.style.maxHeight = "100vh";
        slideContainer.style.setProperty('width', 'calc(((16 / 9) * 100vh) - 6px)');
        slideContainer.style.setProperty('height', 'calc(100vh - 6px)');
      }   
    }
    else{
      document.querySelector('.header').style.display = "flex";
      document.querySelector('.info').style.display = "flex";
      document.querySelector('.typeTab').style.display = "block";
      document.querySelector('body').style.backgroundColor = "#FAFBFC";
      slideBox.style.position = "relative";
      slideBox.style.top = "0";
      slideBox.style.width = "339px"
      adjust_size(Math.max(windowWidth, windowHeight));
      slideBox.style.marginBottom = "30px";
      slideContainer.style.width = " 333px";
      slideContainer.style.height = "187.31px";
    }
  }
});

function is_tablet(){
  if(!is_mobile()){
    return false;
  }
  if(/iPad|Tablet/i.test(navigator.userAgent) ) {
    return true;
  }
  return false;
}

function vote() {
  var iframes = document.querySelectorAll(".voteElement iframe");
  for( var i = 0; i < iframes.length; i++) {
      iframes[i].setAttribute('scrolling', 'no');
  }
}