// var iframes = document.getElementsByTagName("iframe");
 // var possibleClickjack = false;
 // for(var i = 0; i < iframes.length; i++) {
 //     if (iframes[i].style.visibility != 'hidden' || iframes[i].style.display != 'none' || iframes[i].style.opacity != '0' || iframes[i].style.zIndex != '-999999') {
 //         if (iframes[i].src != location.hostname) {
 //             possibleClickjack = true;
 //         }
 //     }
 // }
 // if (possibleClickjack) {
 //     var protector = document.createElement('div');
 //     protector.id = 'protector';
 //     protector.style.height = '100%';
 //     protector.style.width = '100%';
 //     protector.style.position = 'absolute';
 //     protector.style.left = '0';
 //     protector.style.top = '0';
 //     protector.style.zIndex = '99999999';

 //     // Add a link to the protector
 //     var link = document.createElement('a');
 //     link.href = '/';
 //     link.target = '_blank';
 //     link.textContent = 'Go to the site';
 //     protector.appendChild(link);

 //     // Add the protector to the body
 //     document.body.appendChild(protector);
 //     alert("Protector attached, go to extensions to remove it manually")
 // }
 // else {
 //     console.log("Removing protector")
 //     protector.remove();
 // }
 console.log("HI") 