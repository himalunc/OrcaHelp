// Created by iWeb 3.0.4 local-build-20180724

setTransparentGifURL('Media/transparent.gif');function applyEffects()
{var registry=IWCreateEffectRegistry();registry.registerEffects({shadow_0:new IWShadow({blurRadius:10,offset:new IWPoint(4.2426,4.2426),color:'#000000',opacity:0.750000}),stroke_0:new IWPhotoFrame([IWCreateImage('Contacts_files/Pushpin_01.jpg'),IWCreateImage('Contacts_files/Pushpin_02.jpg'),IWCreateImage('Contacts_files/Pushpin_03.jpg'),IWCreateImage('Contacts_files/Pushpin_06.jpg'),IWCreateImage('Contacts_files/Pushpin_09.jpg'),IWCreateImage('Contacts_files/Pushpin_02_1.jpg'),IWCreateImage('Contacts_files/Pushpin_03_1.jpg'),IWCreateImage('Contacts_files/Pushpin_04.jpg')],null,1,0.786842,0.000000,0.000000,0.000000,0.000000,18.000000,18.000000,18.000000,18.000000,298.000000,472.000000,298.000000,472.000000,'Contacts_files/bullet_pp_3.png',new IWPoint(0.500000,-10),new IWSize(45,65),0.100000)});registry.applyEffects();}
function hostedOnDM()
{return false;}
function onPageLoad()
{loadMozillaCSS('Contacts_files/ContactsMoz.css')
adjustLineHeightIfTooBig('id1');adjustFontSizeIfTooBig('id1');adjustLineHeightIfTooBig('id2');adjustFontSizeIfTooBig('id2');Widget.onload();fixAllIEPNGs('Media/transparent.gif');applyEffects()}
function onPageUnload()
{Widget.onunload();}
