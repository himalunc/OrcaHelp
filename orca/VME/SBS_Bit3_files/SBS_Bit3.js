// Created by iWeb 3.0.2 local-build-20150109

setTransparentGifURL('Media/transparent.gif');function applyEffects()
{var registry=IWCreateEffectRegistry();registry.registerEffects({shadow_1:new IWShadow({blurRadius:10,offset:new IWPoint(4.2426,4.2426),color:'#000000',opacity:0.750000}),stroke_0:new IWEmptyStroke(),stroke_1:new IWStrokeParts([{rect:new IWRect(-1,1,2,58),url:'SBS_Bit3_files/stroke.png'},{rect:new IWRect(-1,-1,2,2),url:'SBS_Bit3_files/stroke_1.png'},{rect:new IWRect(1,-1,251,2),url:'SBS_Bit3_files/stroke_2.png'},{rect:new IWRect(252,-1,2,2),url:'SBS_Bit3_files/stroke_3.png'},{rect:new IWRect(252,1,2,58),url:'SBS_Bit3_files/stroke_4.png'},{rect:new IWRect(252,59,2,2),url:'SBS_Bit3_files/stroke_5.png'},{rect:new IWRect(1,59,251,2),url:'SBS_Bit3_files/stroke_6.png'},{rect:new IWRect(-1,59,2,2),url:'SBS_Bit3_files/stroke_7.png'}],new IWSize(253,60)),shadow_0:new IWShadow({blurRadius:10,offset:new IWPoint(4.2426,4.2426),color:'#000000',opacity:0.750000})});registry.applyEffects();}
function hostedOnDM()
{return false;}
function onPageLoad()
{loadMozillaCSS('SBS_Bit3_files/SBS_Bit3Moz.css')
adjustLineHeightIfTooBig('id1');adjustFontSizeIfTooBig('id1');adjustLineHeightIfTooBig('id2');adjustFontSizeIfTooBig('id2');adjustLineHeightIfTooBig('id3');adjustFontSizeIfTooBig('id3');adjustLineHeightIfTooBig('id4');adjustFontSizeIfTooBig('id4');Widget.onload();fixAllIEPNGs('Media/transparent.gif');applyEffects()}
function onPageUnload()
{Widget.onunload();}
