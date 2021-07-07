window.onload = function (){
  if(is_mobile() === false){
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
    }

    var btn = document.getElementsByClassName('tabBtn');
    for(var i = 0; i < btn.length; i++){
      btn[i].style.width = "300px";
    }

    document.querySelector('.typeTab').style.width = "600px";

    var picture = document.querySelector('.picture');
    picture.style.width = "600px";
    picture.style.height = "547px";
    picture.style.marginBottom = "177px";

    document.querySelector('.upTxt').style.marginTop = "12px";

  }
}

function is_mobile()
{
  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    return true;
  }
  
  if (typeof window.orientation !== 'undefined') 
  {
    return true;
  }
  
  var iOSios = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
  if(iOSios)
    return true;

  return false;    

}

function loadPic(input){
  // use another div & img tag
  document.querySelector('.upPicBox').style.display = "none";

  var file = input.files[0];

  var newImage = document.createElement("img");
  newImage.setAttribute("class", 'newPic');

  newImage.src = URL.createObjectURL(file);

  newImage.style.width = "100%";
  newImage.style.height = "100%";
  newImage.style.objectFit = "contain";
  newImage.style.filter = "none";

  var container = document.querySelector('.showPic');
  container.appendChild(newImage);

  document.querySelector('.showPic').style.display = "block";

  /*
  // change url of img
  var file = input.files[0];

  var newImage = document.querySelector('.upPicImg');
  
  newImage.src = URL.createObjectURL(file);

  newImage.style.width = "100%";
  newImage.style.height = "100%";
  newImage.style.objectFit = "contain";
  newImage.style.filter = "none";

  document.querySelector('.upTxt').style.display = "none";
  */
}
