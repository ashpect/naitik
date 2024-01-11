var protector = document.createElement('div');
protector.id = 'protector';
protector.style.height = '100%';
protector.style.width = '100%';
protector.style.position = 'absolute';
protector.style.left = '0';
protector.style.top = '0';
protector.style.zIndex = '99999999';

// Add a link to the protector
var link = document.createElement('a');
link.href = '/';
link.target = '_blank';
link.textContent = 'Go to the site';
protector.appendChild(link);

// Add the protector to the body
document.body.appendChild(protector);

// Remove the protector if the top-level document and the current document are from the same origin
if (top.document.domain == document.domain) {
    console.log("Removing protector")
    protector.remove();
}
else {
    alert("Protector attached, go to extensions to remove it manually")
}